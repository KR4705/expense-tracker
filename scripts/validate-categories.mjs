#!/usr/bin/env node
/**
 * Category data validation.
 *
 * Checks src/data/categories.json against src/data/category-icons.json and the
 * Style Guide rules that the data must uphold:
 *   SG-21/22  every category has a label and a distinct icon from one icon set
 *   SG-26     exactly one exclusive Unknown category: always present, active,
 *             last in display order, neutral question-mark icon
 *   SG-27     labels are 1–2 words in sentence case
 * plus data-integrity rules: required fields and types, no unknown fields,
 * unique IDs / labels / display orders, file order matches display order, and
 * the reserved "uncategorized" ID (an expense with zero tags) is never a category.
 *
 * Usage:  node scripts/validate-categories.mjs [--data <path>] [--icons <path>]
 *         (exit 0 = valid, 1 = invalid; paths default to the files in src/data/)
 * Import: validateCategories(data, registry) / validateIconRegistry(registry)
 *         each returns an array of error strings (empty = valid).
 */
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const STATUSES = ['provisional', 'approved'];
export const UNKNOWN_ID = 'unknown';
export const UNKNOWN_LABEL = 'Unknown';
/** Zero selected categories is saved as "Uncategorized" (SG-26); it is a state, not a category. */
export const RESERVED_IDS = ['uncategorized'];

const ID_PATTERN = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
const SEMVER = /^\d+\.\d+\.\d+$/;

const CATEGORY_FIELDS = {
  id: 'string',
  label: 'string',
  icon: 'string',
  displayOrder: 'integer',
  active: 'boolean',
  exclusive: 'boolean',
  status: 'string',
};
const OPTIONAL_CATEGORY_FIELDS = { description: 'string' };
const FILE_FIELDS = { version: 'string', status: 'string', categories: 'array' };
const OPTIONAL_FILE_FIELDS = { $schema: 'string', note: 'string' };

const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

function typeOf(value) {
  if (Array.isArray(value)) return 'array';
  if (value === null) return 'null';
  if (Number.isInteger(value)) return 'integer';
  return typeof value;
}

function matchesType(value, expected) {
  const actual = typeOf(value);
  return actual === expected || (expected === 'number' && actual === 'integer');
}

/** Required/optional fields with types; reports missing, wrong-typed and unknown keys. */
function checkFields(obj, where, required, optional, errors) {
  for (const [key, type] of Object.entries(required)) {
    if (!(key in obj)) errors.push(`${where}: missing required field "${key}"`);
    else if (!matchesType(obj[key], type)) {
      errors.push(`${where}.${key}: expected ${type}, got ${typeOf(obj[key])}`);
    }
  }
  for (const [key, type] of Object.entries(optional)) {
    if (key in obj && !matchesType(obj[key], type)) {
      errors.push(`${where}.${key}: expected ${type}, got ${typeOf(obj[key])}`);
    }
  }
  for (const key of Object.keys(obj)) {
    if (!(key in required) && !(key in optional)) errors.push(`${where}: unknown field "${key}"`);
  }
}

/** SG-27: 1–2 words, sentence case (first letter capital, later words lower-case). */
function labelProblems(label) {
  const problems = [];
  if (label !== label.trim() || /\s{2,}/.test(label)) problems.push('has leading, trailing or repeated spaces');
  const words = label.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return ['is empty'];
  if (words.length > 2) problems.push(`has ${words.length} words (max 2, SG-27)`);
  if (!/^\p{Lu}/u.test(words[0])) problems.push('must start with a capital letter (sentence case, SG-27)');
  if (words.slice(1).some((w) => /^\p{Lu}\p{Ll}/u.test(w))) {
    problems.push('must be sentence case — only the first word capitalised (SG-27)');
  }
  return problems;
}

export function validateIconRegistry(registry) {
  const errors = [];
  if (!isObject(registry)) return ['icon registry: must be a JSON object'];
  if (!Array.isArray(registry.icons) || registry.icons.length === 0) {
    errors.push('icon registry: "icons" must be a non-empty array');
    return errors;
  }
  const seen = new Set();
  registry.icons.forEach((icon, i) => {
    const where = `icon registry.icons[${i}]`;
    if (!isObject(icon)) return errors.push(`${where}: must be an object`);
    if (typeof icon.id !== 'string' || !ID_PATTERN.test(icon.id)) {
      errors.push(`${where}.id: must be a kebab-case string`);
    } else if (seen.has(icon.id)) {
      errors.push(`${where}.id: duplicate icon id "${icon.id}"`);
    } else seen.add(icon.id);
  });
  if (typeof registry.unknownIcon !== 'string' || !seen.has(registry.unknownIcon)) {
    errors.push('icon registry: "unknownIcon" must name an icon listed in "icons"');
  }
  return errors;
}

export function validateCategories(data, registry) {
  const registryErrors = validateIconRegistry(registry);
  if (registryErrors.length) return registryErrors;

  const errors = [];
  if (!isObject(data)) return ['categories file: must be a JSON object'];
  checkFields(data, 'categories file', FILE_FIELDS, OPTIONAL_FILE_FIELDS, errors);
  if (typeof data.version === 'string' && !SEMVER.test(data.version)) {
    errors.push('categories file.version: must be MAJOR.MINOR.PATCH');
  }
  if (typeof data.status === 'string' && !STATUSES.includes(data.status)) {
    errors.push(`categories file.status: must be one of ${STATUSES.join(', ')}`);
  }
  if (!Array.isArray(data.categories)) return errors;
  if (data.categories.length === 0) {
    errors.push('categories file.categories: must not be empty');
    return errors;
  }

  const iconIds = new Set(registry.icons.map((i) => i.id));
  const ids = new Map();
  const labels = new Map();
  const orders = new Map();
  const icons = new Map();

  data.categories.forEach((c, i) => {
    const where = `categories[${i}]`;
    if (!isObject(c)) return errors.push(`${where}: must be an object`);
    checkFields(c, where, CATEGORY_FIELDS, OPTIONAL_CATEGORY_FIELDS, errors);
    const name = typeof c.id === 'string' ? ` ("${c.id}")` : '';

    if (typeof c.id === 'string') {
      if (!ID_PATTERN.test(c.id)) errors.push(`${where}.id${name}: must be lower-case kebab-case`);
      if (RESERVED_IDS.includes(c.id)) {
        errors.push(`${where}.id${name}: reserved — zero selections are saved as Uncategorized, not as a category (SG-26)`);
      }
      if (ids.has(c.id)) errors.push(`${where}.id: duplicate id "${c.id}" (also categories[${ids.get(c.id)}])`);
      else ids.set(c.id, i);
    }
    if (typeof c.label === 'string') {
      for (const p of labelProblems(c.label)) errors.push(`${where}.label${name}: "${c.label}" ${p}`);
      const key = c.label.trim().toLowerCase();
      if (labels.has(key)) errors.push(`${where}.label: duplicate label "${c.label}" (also categories[${labels.get(key)}])`);
      else labels.set(key, i);
    }
    if (typeof c.icon === 'string') {
      if (!iconIds.has(c.icon)) errors.push(`${where}.icon${name}: "${c.icon}" is not in src/data/category-icons.json`);
      if (icons.has(c.icon)) {
        errors.push(`${where}.icon${name}: "${c.icon}" is already used by categories[${icons.get(c.icon)}] — each category needs a distinct icon (SG-21, SG-22)`);
      } else icons.set(c.icon, i);
    }
    if (Number.isInteger(c.displayOrder)) {
      if (c.displayOrder < 1) errors.push(`${where}.displayOrder${name}: must be a positive integer`);
      if (orders.has(c.displayOrder)) {
        errors.push(`${where}.displayOrder${name}: duplicate displayOrder ${c.displayOrder} (also categories[${orders.get(c.displayOrder)}])`);
      } else orders.set(c.displayOrder, i);
    }
    if (typeof c.status === 'string' && !STATUSES.includes(c.status)) {
      errors.push(`${where}.status${name}: must be one of ${STATUSES.join(', ')}`);
    }
  });

  // File order must match display order, so the file reads the way the grid renders.
  for (let i = 1; i < data.categories.length; i++) {
    const prev = data.categories[i - 1]?.displayOrder;
    const curr = data.categories[i]?.displayOrder;
    if (Number.isInteger(prev) && Number.isInteger(curr) && curr <= prev) {
      errors.push(`categories[${i}].displayOrder: list must be sorted by ascending displayOrder (${curr} follows ${prev})`);
    }
  }

  // SG-26: exactly one exclusive category, and it is Unknown.
  const all = data.categories.filter(isObject);
  const exclusive = all.filter((c) => c.exclusive === true);
  const unknown = all.find((c) => c.id === UNKNOWN_ID);
  if (!unknown) errors.push(`SG-26: an "${UNKNOWN_ID}" category is required`);
  if (exclusive.length !== 1) {
    errors.push(`SG-26: exactly one category must be exclusive (found ${exclusive.length})`);
  }
  for (const c of exclusive) {
    if (c.id !== UNKNOWN_ID) errors.push(`SG-26: only "${UNKNOWN_ID}" may be exclusive ("${c.id}" is marked exclusive)`);
  }
  if (unknown) {
    if (unknown.exclusive !== true) errors.push(`SG-26: "${UNKNOWN_ID}" must have exclusive: true`);
    if (unknown.active !== true) errors.push(`SG-26: "${UNKNOWN_ID}" must always be active`);
    if (unknown.label !== UNKNOWN_LABEL) errors.push(`SG-26: "${UNKNOWN_ID}" must be labelled "${UNKNOWN_LABEL}"`);
    if (unknown.icon !== registry.unknownIcon) {
      errors.push(`SG-26: "${UNKNOWN_ID}" must use the neutral question-mark icon "${registry.unknownIcon}"`);
    }
    const maxOrder = Math.max(...all.map((c) => (Number.isInteger(c.displayOrder) ? c.displayOrder : -Infinity)));
    if (Number.isInteger(unknown.displayOrder) && unknown.displayOrder !== maxOrder) {
      errors.push(`SG-26: "${UNKNOWN_ID}" must have the highest displayOrder so it is always the last tile`);
    }
  }
  for (const c of all) {
    if (c.id !== UNKNOWN_ID && c.icon === registry.unknownIcon) {
      errors.push(`SG-26: icon "${registry.unknownIcon}" is reserved for "${UNKNOWN_ID}" (used by "${c.id}")`);
    }
  }
  if (!all.some((c) => c.active === true && c.exclusive === false)) {
    errors.push('categories: at least one active, non-exclusive category is required');
  }

  return errors;
}

/** Summary used by the CLI. */
export function describe(data) {
  const active = data.categories.filter((c) => c.active);
  const provisional = data.categories.filter((c) => c.status === 'provisional').length;
  return `${data.categories.length} categories (${active.length} active, ${provisional} provisional), v${data.version}, status ${data.status}`;
}

/** Optional overrides (used by tests): --data <path> --icons <path>. */
function argValue(flag) {
  const i = process.argv.indexOf(flag);
  return i > -1 ? process.argv[i + 1] : undefined;
}

function main() {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const read = (p) => JSON.parse(readFileSync(resolve(root, p), 'utf8'));
  let data;
  let registry;
  try {
    data = read(argValue('--data') ?? 'src/data/categories.json');
    registry = read(argValue('--icons') ?? 'src/data/category-icons.json');
  } catch (err) {
    console.error(`categories: could not read data — ${err.message}`);
    process.exit(1);
  }
  const errors = validateCategories(data, registry);
  if (errors.length) {
    console.error(`categories: ${errors.length} error(s)`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
  console.log(`categories: OK — ${describe(data)}`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) main();
