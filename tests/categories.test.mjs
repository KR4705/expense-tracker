// Positive and negative tests for scripts/validate-categories.mjs.
// Run: npm test   (uses the built-in node:test runner; no dependencies)
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { validateCategories, validateIconRegistry } from '../scripts/validate-categories.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SCRIPT = resolve(root, 'scripts/validate-categories.mjs');
const load = (p) => JSON.parse(readFileSync(resolve(root, p), 'utf8'));
const realData = load('src/data/categories.json');
const realRegistry = load('src/data/category-icons.json');

/** Fresh deep copies so each test can mutate freely. */
const data = () => structuredClone(realData);
const registry = () => structuredClone(realRegistry);
const byId = (d, id) => d.categories.find((c) => c.id === id);

/** Asserts validation fails with at least one error matching `pattern`. */
function assertInvalid(d, pattern, reg = registry()) {
  const errors = validateCategories(d, reg);
  assert.ok(errors.length > 0, 'expected validation errors, got none');
  assert.ok(
    errors.some((e) => pattern.test(e)),
    `no error matched ${pattern}\nerrors:\n  ${errors.join('\n  ')}`,
  );
}

/** Runs the CLI against a temporary copy of `json` (string or object). */
function runCliOn(json) {
  const dir = mkdtempSync(join(tmpdir(), 'categories-test-'));
  try {
    const path = join(dir, 'categories.json');
    writeFileSync(path, typeof json === 'string' ? json : JSON.stringify(json));
    return spawnSync(process.execPath, [SCRIPT, '--data', path], { encoding: 'utf8' });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

describe('valid data', () => {
  test('the committed dataset passes', () => {
    assert.deepEqual(validateCategories(realData, realRegistry), []);
  });

  test('the committed icon registry passes', () => {
    assert.deepEqual(validateIconRegistry(realRegistry), []);
  });

  test('uses the approved MVP display order, Other last', () => {
    assert.deepEqual(
      realData.categories.map((c) => c.label),
      ['Food', 'Home', 'Shop', 'Transit', 'Health', 'Fun', 'Travel', 'Charity', 'Other'],
    );
    assert.deepEqual(
      realData.categories.map((c) => c.displayOrder),
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
    );
  });

  test('keeps the approved stable IDs and has no Bills or Unknown category', () => {
    assert.deepEqual(
      realData.categories.map((c) => c.id),
      ['food', 'housing', 'shopping', 'transport', 'healthcare', 'entertainment', 'travel', 'charity', 'other'],
    );
  });

  test('every category is active (inactive would mean shown but disabled)', () => {
    assert.ok(realData.categories.every((c) => c.active === true));
  });

  test('Other has no exclusive flag — it combines with other categories', () => {
    const other = realData.categories.find((c) => c.id === 'other');
    assert.equal('exclusive' in other, false);
    assert.ok(realData.categories.every((c) => !('exclusive' in c)));
  });

  test('Uncategorized is a save state, not a category', () => {
    assert.ok(realData.categories.every((c) => c.id !== 'uncategorized' && c.label !== 'Uncategorized'));
  });

  test('Other is active, last and uses the reserved icon', () => {
    const other = realData.categories.at(-1);
    assert.equal(other.id, 'other');
    assert.equal(other.active, true);
    assert.equal(other.icon, realRegistry.otherIcon);
  });

  test('the file, every category and the icon set are approved for the MVP', () => {
    assert.equal(realData.status, 'approved');
    assert.ok(realData.categories.every((c) => c.status === 'approved'));
    assert.equal(realRegistry.status, 'approved');
  });

  test('a minimal dataset (one category + Other) passes', () => {
    const d = {
      version: '1.0.0',
      status: 'approved',
      categories: [
        { id: 'food', label: 'Food', icon: 'utensils', displayOrder: 1, active: true, status: 'approved' },
        { id: 'other', label: 'Other', icon: 'circle-ellipsis', displayOrder: 2, active: true, status: 'approved' },
      ],
    };
    assert.deepEqual(validateCategories(d, registry()), []);
  });

  test('two-word sentence-case labels and gaps in displayOrder are allowed', () => {
    const d = data();
    byId(d, 'food').label = 'Food delivery';
    d.categories.forEach((c, i) => (c.displayOrder = (i + 1) * 10));
    assert.deepEqual(validateCategories(d, registry()), []);
  });

  test('an inactive standard category is allowed (shown but not selectable)', () => {
    const d = data();
    byId(d, 'charity').active = false;
    assert.deepEqual(validateCategories(d, registry()), []);
  });

  test('CLI exits 0 on the committed data', () => {
    const r = spawnSync(process.execPath, [SCRIPT], { encoding: 'utf8' });
    assert.equal(r.status, 0, r.stderr);
    assert.match(r.stdout, /categories: OK/);
  });
});

describe('required fields and types', () => {
  for (const field of ['id', 'label', 'icon', 'displayOrder', 'active', 'status']) {
    test(`missing "${field}" is rejected`, () => {
      const d = data();
      delete byId(d, 'food')[field];
      assertInvalid(d, new RegExp(`missing required field "${field}"`));
    });
  }

  test('wrong types are rejected', () => {
    const d = data();
    byId(d, 'food').active = 'yes';
    byId(d, 'shopping').displayOrder = 2.5;
    byId(d, 'travel').label = 7;
    const errors = validateCategories(d, registry());
    assert.ok(errors.some((e) => /active: expected boolean, got string/.test(e)));
    assert.ok(errors.some((e) => /displayOrder: expected integer, got number/.test(e)));
    assert.ok(errors.some((e) => /label: expected string, got integer/.test(e)));
  });

  test('unknown fields are rejected (including the removed "exclusive" flag)', () => {
    const d = data();
    byId(d, 'food').colour = '#FF0000';
    byId(d, 'other').exclusive = true;
    const errors = validateCategories(d, registry());
    assert.ok(errors.some((e) => /unknown field "colour"/.test(e)));
    assert.ok(errors.some((e) => /unknown field "exclusive"/.test(e)));
  });

  test('an invalid status is rejected', () => {
    const d = data();
    byId(d, 'food').status = 'final';
    assertInvalid(d, /status \("food"\): must be one of provisional, approved/);
  });

  test('a missing or empty categories list is rejected', () => {
    const d = data();
    d.categories = [];
    assertInvalid(d, /must not be empty/);
    const d2 = data();
    delete d2.categories;
    assertInvalid(d2, /missing required field "categories"/);
  });

  test('a non-semver file version is rejected', () => {
    const d = data();
    d.version = 'v1';
    assertInvalid(d, /version: must be MAJOR\.MINOR\.PATCH/);
  });
});

describe('IDs and labels', () => {
  test('duplicate IDs are rejected', () => {
    const d = data();
    byId(d, 'shopping').id = 'food';
    assertInvalid(d, /duplicate id "food"/);
  });

  test('non-kebab-case IDs are rejected', () => {
    const d = data();
    byId(d, 'food').id = 'Food Items';
    assertInvalid(d, /must be lower-case kebab-case/);
  });

  test('the reserved "uncategorized" ID is rejected', () => {
    const d = data();
    byId(d, 'charity').id = 'uncategorized';
    assertInvalid(d, /reserved — zero selections is saved as Uncategorized/);
  });

  test('re-adding an "unknown" category is rejected', () => {
    const d = data();
    byId(d, 'charity').id = 'unknown';
    assertInvalid(d, /reserved — Unknown was removed by product decision/);
  });

  test('duplicate labels (case-insensitive) are rejected', () => {
    const d = data();
    byId(d, 'shopping').label = 'food';
    assertInvalid(d, /duplicate label "food"/);
  });

  test('labels longer than two words are rejected (SG-27)', () => {
    const d = data();
    byId(d, 'housing').label = 'Home and bills';
    assertInvalid(d, /has 3 words \(max 2, SG-27\)/);
  });

  test('labels not in sentence case are rejected (SG-27)', () => {
    const d = data();
    byId(d, 'food').label = 'food';
    byId(d, 'housing').label = 'Home Bills';
    const errors = validateCategories(d, registry());
    assert.ok(errors.some((e) => /"food" must start with a capital letter/.test(e)));
    assert.ok(errors.some((e) => /"Home Bills" must be sentence case/.test(e)));
  });

  test('empty or padded labels are rejected', () => {
    const d = data();
    byId(d, 'food').label = '   ';
    byId(d, 'travel').label = ' Travel';
    const errors = validateCategories(d, registry());
    assert.ok(errors.some((e) => /"   " is empty/.test(e)));
    assert.ok(errors.some((e) => /" Travel" has leading, trailing or repeated spaces/.test(e)));
  });
});

describe('ordering', () => {
  test('duplicate displayOrder values are rejected', () => {
    const d = data();
    byId(d, 'shopping').displayOrder = 1;
    assertInvalid(d, /duplicate displayOrder 1/);
  });

  test('zero or negative displayOrder is rejected', () => {
    const d = data();
    byId(d, 'food').displayOrder = 0;
    assertInvalid(d, /displayOrder \("food"\): must be a positive integer/);
  });

  test('a list not sorted by displayOrder is rejected', () => {
    const d = data();
    [d.categories[0], d.categories[1]] = [d.categories[1], d.categories[0]];
    assertInvalid(d, /must be sorted by ascending displayOrder/);
  });
});

describe('icons', () => {
  test('an icon not in the registry is rejected', () => {
    const d = data();
    byId(d, 'food').icon = 'pizza';
    assertInvalid(d, /"pizza" is not in src\/data\/category-icons\.json/);
  });

  test('two categories sharing an icon are rejected (SG-21, SG-22)', () => {
    const d = data();
    byId(d, 'travel').icon = 'car';
    assertInvalid(d, /"car" is already used by/);
  });

  test('the Other icon cannot be used by another category', () => {
    const d = data();
    byId(d, 'charity').icon = 'circle-ellipsis';
    assertInvalid(d, /icon "circle-ellipsis" is reserved for "other"/);
  });

  test('a registry whose otherIcon is not listed is rejected', () => {
    const reg = registry();
    reg.otherIcon = 'dots';
    assert.ok(validateIconRegistry(reg).some((e) => /"otherIcon" must name an icon listed/.test(e)));
    assertInvalid(data(), /"otherIcon" must name an icon listed/, reg);
  });

  test('a registry with duplicate icon IDs is rejected', () => {
    const reg = registry();
    reg.icons.push({ id: 'car', description: 'Duplicate' });
    assert.ok(validateIconRegistry(reg).some((e) => /duplicate icon id "car"/.test(e)));
  });
});

describe('Other rules', () => {
  test('a dataset without Other is rejected', () => {
    const d = data();
    d.categories = d.categories.filter((c) => c.id !== 'other');
    assertInvalid(d, /an "other" category is required/);
  });

  test('Other not in last position is rejected', () => {
    // Move Other to the middle and renumber, so the list stays sorted and unique.
    const d = data();
    const other = d.categories.pop();
    d.categories.splice(4, 0, other);
    d.categories.forEach((c, i) => (c.displayOrder = i + 1));
    assertInvalid(d, /"other" must have the highest displayOrder/);
  });

  test('inactive Other is rejected (it must always be selectable)', () => {
    const d = data();
    byId(d, 'other').active = false;
    assertInvalid(d, /"other" must always be active/);
  });

  test('Other with a different label is rejected', () => {
    const d = data();
    byId(d, 'other').label = 'Misc';
    assertInvalid(d, /"other" must be labelled "Other"/);
  });

  test('Other with a different icon is rejected', () => {
    const d = data();
    byId(d, 'other').icon = 'plane';
    byId(d, 'travel').icon = 'circle-ellipsis';
    assertInvalid(d, /"other" must use the icon "circle-ellipsis"/);
  });

  test('a dataset with only Other active is rejected', () => {
    const d = data();
    for (const c of d.categories) if (c.id !== 'other') c.active = false;
    assertInvalid(d, /at least one active category besides "other" is required/);
  });
});

describe('CLI', () => {
  test('exits 1 and lists errors for an invalid file', () => {
    const broken = data();
    broken.categories = broken.categories.filter((c) => c.id !== 'other');
    const r = runCliOn(broken);
    assert.equal(r.status, 1);
    assert.match(r.stderr, /categories: \d+ error\(s\)/);
    assert.match(r.stderr, /an "other" category is required/);
  });

  test('exits 1 for malformed JSON', () => {
    const r = runCliOn('{ "categories": [ ');
    assert.equal(r.status, 1);
    assert.match(r.stderr, /could not read data/);
  });
});
