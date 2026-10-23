#!/usr/bin/env node
/**
 * Token pipeline: design-system/tokens.json (DTCG) -> src/styles/tokens.css
 *
 * design-system/tokens.json is the single source of truth. This script never
 * writes to it. Every token becomes one CSS custom property on :root, named
 * from its path in kebab-case (color.text.onPrimary -> --color-text-on-primary).
 *
 * - Aliases ({color.palette.neutral.50}) are emitted as var(--…) references,
 *   so the foundation -> semantic -> component chain stays visible in CSS.
 * - Composite typography tokens expand into one property per field
 *   (-font-family, -font-size, -font-weight, -line-height, -letter-spacing),
 *   plus -font-variant-numeric / -text-transform from the
 *   com.expense-tracker.typography extension.
 * - font.size and font.lineHeight dimensions in px are emitted as rem
 *   (value / 16) so text follows the user's browser text-size setting
 *   (SG-43). The numeric values are unchanged: 16px === 1rem at default size.
 *   All other px dimensions are emitted as px.
 *
 * Usage:
 *   node scripts/build-tokens.mjs          validate, then write the CSS file
 *   node scripts/build-tokens.mjs --check  validate only (no file written)
 *
 * Validation fails (exit 1) on: unresolvable or circular aliases, tokens
 * without $type, alias type mismatches, and value shapes this script cannot
 * convert.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = resolve(root, 'design-system/tokens.json');
const OUTPUT = resolve(root, 'src/styles/tokens.css');
const CHECK_ONLY = process.argv.includes('--check');

const REM_PATHS = ['font.size.', 'font.lineHeight.'];
const ROOT_FONT_PX = 16;
const ALIAS = /^\{([^{}]+)\}$/;

const errors = [];
const source = JSON.parse(readFileSync(SOURCE, 'utf8'));

/** Collect tokens: objects with $value. Groups may set $type for children. */
const tokens = new Map();
function collect(node, path, inheritedType) {
  if (node === null || typeof node !== 'object' || Array.isArray(node)) return;
  const groupType = node.$type ?? inheritedType;
  if ('$value' in node) {
    const id = path.join('.');
    if (!groupType) errors.push(`${id}: missing $type`);
    tokens.set(id, {
      id,
      type: groupType,
      value: node.$value,
      ext: node.$extensions ?? {},
    });
    return;
  }
  for (const [key, child] of Object.entries(node)) {
    if (!key.startsWith('$')) collect(child, [...path, key], groupType);
  }
}
collect(source, [], undefined);

/** color.text.onPrimary -> --color-text-on-primary (camelCase segments become kebab-case). */
const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const cssName = (id) => `--${id.split('.').map(kebab).join('-')}`;
const aliasTarget = (v) => (typeof v === 'string' ? v.match(ALIAS)?.[1] : undefined);

/** Follow aliases to the final token, detecting missing and circular refs. */
function resolveToken(id, trail = []) {
  if (trail.includes(id)) {
    errors.push(`circular alias: ${[...trail, id].join(' -> ')}`);
    return undefined;
  }
  const token = tokens.get(id);
  if (!token) {
    errors.push(`${trail.at(-1) ?? '(root)'}: alias to unknown token {${id}}`);
    return undefined;
  }
  const target = aliasTarget(token.value);
  return target ? resolveToken(target, [...trail, id]) : token;
}

function dimension(value, id) {
  if (value && typeof value === 'object' && typeof value.value === 'number') {
    const { value: n, unit } = value;
    if (unit === 'px' && REM_PATHS.some((p) => id.startsWith(p))) {
      return n === 0 ? '0' : `${+(n / ROOT_FONT_PX).toFixed(4)}rem`;
    }
    if (unit === 'px' || unit === 'rem' || unit === 'em') return n === 0 ? '0' : `${n}${unit}`;
  }
  errors.push(`${id}: unsupported dimension value ${JSON.stringify(value)}`);
  return undefined;
}

function duration(value, id) {
  if (value && typeof value === 'object' && typeof value.value === 'number' && ['ms', 's'].includes(value.unit)) {
    return `${value.value}${value.unit}`;
  }
  errors.push(`${id}: unsupported duration value ${JSON.stringify(value)}`);
  return undefined;
}

function fontFamily(value, id) {
  const list = Array.isArray(value) ? value : [value];
  if (!list.every((f) => typeof f === 'string')) {
    errors.push(`${id}: unsupported fontFamily value`);
    return undefined;
  }
  const generic = new Set(['serif', 'sans-serif', 'monospace', 'system-ui', 'cursive', 'fantasy', 'ui-sans-serif']);
  return list.map((f) => (generic.has(f) || /^-?[a-zA-Z-]+$/.test(f) ? f : `"${f}"`)).join(', ');
}

/** Convert a literal (non-alias) value of a given type to CSS. */
function literal(type, value, id) {
  switch (type) {
    case 'color':
      if (typeof value === 'string' && /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value)) return value;
      break;
    case 'dimension':
      return dimension(value, id);
    case 'duration':
      return duration(value, id);
    case 'fontFamily':
      return fontFamily(value, id);
    case 'fontWeight':
    case 'number':
      if (typeof value === 'number') return String(value);
      break;
    case 'strokeStyle':
      if (typeof value === 'string') return value;
      break;
  }
  errors.push(`${id}: cannot convert ${type} value ${JSON.stringify(value)}`);
  return undefined;
}

/** CSS for a single (non-typography) value that may be an alias. */
function valueCss(type, value, id) {
  const target = aliasTarget(value);
  if (target) {
    const resolved = resolveToken(target, [id]);
    if (resolved && resolved.type !== type) {
      errors.push(`${id}: ${type} token aliases ${resolved.type} token {${target}}`);
    }
    return `var(${cssName(target)})`;
  }
  return literal(type, value, id);
}

const TYPO_FIELDS = {
  fontFamily: ['font-family', 'fontFamily'],
  fontSize: ['font-size', 'dimension'],
  fontWeight: ['font-weight', 'fontWeight'],
  lineHeight: ['line-height', 'dimension'],
  letterSpacing: ['letter-spacing', 'dimension'],
};
const TYPO_EXT = {
  fontVariantNumeric: 'font-variant-numeric',
  textTransform: 'text-transform',
};

/** Emit declarations for one token. Returns [name, value][] pairs. */
function declarations(token) {
  const { id, type, value } = token;
  if (type !== 'typography') {
    const css = valueCss(type, value, id);
    return css === undefined ? [] : [[cssName(id), css]];
  }

  // Typography alias: point each sub-property at the target's sub-property.
  const target = aliasTarget(value);
  const base = cssName(id);
  if (target) {
    const resolved = resolveToken(target, [id]);
    if (!resolved) return [];
    if (resolved.type !== 'typography') errors.push(`${id}: typography token aliases ${resolved.type} token`);
    const fields = [
      ...Object.keys(resolved.value).map((k) => TYPO_FIELDS[k]?.[0]),
      ...Object.keys(resolved.ext['com.expense-tracker.typography'] ?? {}).map((k) => TYPO_EXT[k]),
    ].filter(Boolean);
    return fields.map((f) => [`${base}-${f}`, `var(${cssName(target)}-${f})`]);
  }

  if (!value || typeof value !== 'object') {
    errors.push(`${id}: typography value must be an object or alias`);
    return [];
  }
  const out = [];
  for (const [field, raw] of Object.entries(value)) {
    const spec = TYPO_FIELDS[field];
    if (!spec) {
      errors.push(`${id}: unsupported typography field "${field}"`);
      continue;
    }
    const [prop, fieldType] = spec;
    const css = valueCss(fieldType, raw, `${id}.${field}`);
    if (css !== undefined) out.push([`${base}-${prop}`, css]);
  }
  for (const [field, raw] of Object.entries(token.ext['com.expense-tracker.typography'] ?? {})) {
    const prop = TYPO_EXT[field];
    if (!prop || typeof raw !== 'string') {
      errors.push(`${id}: unsupported typography extension "${field}"`);
      continue;
    }
    out.push([`${base}-${prop}`, raw]);
  }
  return out;
}

const sections = new Map();
const emitted = new Map();
let count = 0;
for (const token of tokens.values()) {
  const decls = declarations(token);
  for (const [name] of decls) {
    if (emitted.has(name)) errors.push(`${token.id}: CSS name ${name} collides with ${emitted.get(name)}`);
    emitted.set(name, token.id);
  }
  const section = token.id.split('.')[0];
  if (!sections.has(section)) sections.set(section, []);
  sections.get(section).push(...decls);
  count += decls.length;
}

if (errors.length) {
  console.error(`tokens: ${errors.length} error(s) in design-system/tokens.json`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

const version = source.$extensions?.['com.expense-tracker.meta']?.version ?? 'unknown';
if (CHECK_ONLY) {
  console.log(`tokens: OK — ${tokens.size} tokens (v${version}) validated, ${count} CSS properties would be generated`);
  process.exit(0);
}

let css = `/*
 * GENERATED FILE — do not edit.
 * Source: design-system/tokens.json (v${version})
 * Regenerate with: npm run tokens
 */
:root {
`;
for (const [section, decls] of sections) {
  css += `\n  /* ${section} */\n`;
  for (const [name, value] of decls) css += `  ${name}: ${value};\n`;
}
css += '}\n';

mkdirSync(dirname(OUTPUT), { recursive: true });
writeFileSync(OUTPUT, css);
console.log(`tokens: wrote src/styles/tokens.css — ${count} CSS properties from ${tokens.size} tokens (v${version})`);
