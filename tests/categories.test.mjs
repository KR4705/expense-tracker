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

describe('valid data', () => {
  test('the committed dataset passes', () => {
    assert.deepEqual(validateCategories(realData, realRegistry), []);
  });

  test('the committed icon registry passes', () => {
    assert.deepEqual(validateIconRegistry(realRegistry), []);
  });

  test('contains the requested categories in the requested order, Unknown last', () => {
    assert.deepEqual(
      realData.categories.map((c) => c.label),
      ['Food', 'Shopping', 'Transport', 'Housing', 'Entertainment', 'Healthcare', 'Travel', 'Charity', 'Bills', 'Unknown'],
    );
  });

  test('Unknown is the only exclusive category and is active', () => {
    const exclusive = realData.categories.filter((c) => c.exclusive);
    assert.deepEqual(exclusive.map((c) => c.id), ['unknown']);
    assert.equal(exclusive[0].active, true);
  });

  test('nothing is marked approved yet', () => {
    assert.equal(realData.status, 'provisional');
    assert.ok(realData.categories.every((c) => c.status === 'provisional'));
    assert.equal(realRegistry.status, 'provisional');
  });

  test('a minimal dataset (one category + Unknown) passes', () => {
    const d = {
      version: '1.0.0',
      status: 'approved',
      categories: [
        { id: 'food', label: 'Food', icon: 'utensils', displayOrder: 1, active: true, exclusive: false, status: 'approved' },
        { id: 'unknown', label: 'Unknown', icon: 'circle-question-mark', displayOrder: 2, active: true, exclusive: true, status: 'approved' },
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

  test('an inactive standard category is allowed (kept for history)', () => {
    const d = data();
    byId(d, 'charity').active = false;
    assert.deepEqual(validateCategories(d, registry()), []);
  });

  test('CLI exits 0 on the committed data', () => {
    const r = spawnSync(process.execPath, [resolve(root, 'scripts/validate-categories.mjs')], { encoding: 'utf8' });
    assert.equal(r.status, 0, r.stderr);
    assert.match(r.stdout, /categories: OK/);
  });
});

describe('required fields and types', () => {
  for (const field of ['id', 'label', 'icon', 'displayOrder', 'active', 'exclusive', 'status']) {
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
    byId(d, 'transport').exclusive = 0;
    const errors = validateCategories(d, registry());
    assert.ok(errors.some((e) => /active: expected boolean, got string/.test(e)));
    assert.ok(errors.some((e) => /displayOrder: expected integer, got number/.test(e)));
    assert.ok(errors.some((e) => /exclusive: expected boolean, got integer/.test(e)));
  });

  test('unknown fields are rejected', () => {
    const d = data();
    byId(d, 'food').colour = '#FF0000';
    assertInvalid(d, /unknown field "colour"/);
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
    assertInvalid(d, /reserved — zero selections are saved as Uncategorized/);
  });

  test('duplicate labels (case-insensitive) are rejected', () => {
    const d = data();
    byId(d, 'shopping').label = 'food';
    assertInvalid(d, /duplicate label "food"/);
  });

  test('labels longer than two words are rejected (SG-27)', () => {
    const d = data();
    byId(d, 'bills').label = 'Bills and utilities';
    assertInvalid(d, /has 3 words \(max 2, SG-27\)/);
  });

  test('labels not in sentence case are rejected (SG-27)', () => {
    const d = data();
    byId(d, 'food').label = 'food';
    byId(d, 'bills').label = 'Phone Bills';
    const errors = validateCategories(d, registry());
    assert.ok(errors.some((e) => /"food" must start with a capital letter/.test(e)));
    assert.ok(errors.some((e) => /"Phone Bills" must be sentence case/.test(e)));
  });

  test('empty or padded labels are rejected', () => {
    const d = data();
    byId(d, 'food').label = '   ';
    byId(d, 'bills').label = ' Bills';
    const errors = validateCategories(d, registry());
    assert.ok(errors.some((e) => /"   " is empty/.test(e)));
    assert.ok(errors.some((e) => /" Bills" has leading, trailing or repeated spaces/.test(e)));
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

  test('the Unknown question-mark icon cannot be used by another category', () => {
    const d = data();
    byId(d, 'bills').icon = 'circle-question-mark';
    assertInvalid(d, /icon "circle-question-mark" is reserved for "unknown"/);
  });

  test('a registry whose unknownIcon is not listed is rejected', () => {
    const reg = registry();
    reg.unknownIcon = 'help';
    assert.ok(validateIconRegistry(reg).some((e) => /"unknownIcon" must name an icon listed/.test(e)));
    assertInvalid(data(), /"unknownIcon" must name an icon listed/, reg);
  });

  test('a registry with duplicate icon IDs is rejected', () => {
    const reg = registry();
    reg.icons.push({ id: 'car', description: 'Duplicate' });
    assert.ok(validateIconRegistry(reg).some((e) => /duplicate icon id "car"/.test(e)));
  });
});

describe('Unknown rules (SG-26)', () => {
  test('a dataset without Unknown is rejected', () => {
    const d = data();
    d.categories = d.categories.filter((c) => c.id !== 'unknown');
    const errors = validateCategories(d, registry());
    assert.ok(errors.some((e) => /an "unknown" category is required/.test(e)));
    assert.ok(errors.some((e) => /exactly one category must be exclusive \(found 0\)/.test(e)));
  });

  test('Unknown not in last position is rejected', () => {
    // Move Unknown to the middle and renumber, so the list stays sorted and unique.
    const d = data();
    const unknown = d.categories.pop();
    d.categories.splice(4, 0, unknown);
    d.categories.forEach((c, i) => (c.displayOrder = i + 1));
    assertInvalid(d, /"unknown" must have the highest displayOrder/);
  });

  test('Unknown that is not exclusive is rejected', () => {
    const d = data();
    byId(d, 'unknown').exclusive = false;
    const errors = validateCategories(d, registry());
    assert.ok(errors.some((e) => /"unknown" must have exclusive: true/.test(e)));
  });

  test('a second exclusive category is rejected', () => {
    const d = data();
    byId(d, 'charity').exclusive = true;
    const errors = validateCategories(d, registry());
    assert.ok(errors.some((e) => /exactly one category must be exclusive \(found 2\)/.test(e)));
    assert.ok(errors.some((e) => /only "unknown" may be exclusive \("charity"/.test(e)));
  });

  test('inactive Unknown is rejected (it must always be present)', () => {
    const d = data();
    byId(d, 'unknown').active = false;
    assertInvalid(d, /"unknown" must always be active/);
  });

  test('Unknown with a different label is rejected', () => {
    const d = data();
    byId(d, 'unknown').label = 'Not sure';
    assertInvalid(d, /"unknown" must be labelled "Unknown"/);
  });

  test('Unknown with a non-question-mark icon is rejected', () => {
    const d = data();
    byId(d, 'unknown').icon = 'receipt';
    byId(d, 'bills').icon = 'circle-question-mark';
    assertInvalid(d, /"unknown" must use the neutral question-mark icon/);
  });

  test('a dataset with only Unknown active is rejected', () => {
    const d = data();
    for (const c of d.categories) if (c.id !== 'unknown') c.active = false;
    assertInvalid(d, /at least one active, non-exclusive category is required/);
  });
});

describe('CLI', () => {
  test('exits 1 and lists errors for an invalid file', () => {
    // Write a broken copy to a temp dir; the real data file is never touched.
    const dir = mkdtempSync(join(tmpdir(), 'categories-test-'));
    try {
      const broken = data();
      broken.categories = broken.categories.filter((c) => c.id !== 'unknown');
      const path = join(dir, 'categories.json');
      writeFileSync(path, JSON.stringify(broken));
      const r = spawnSync(process.execPath, [resolve(root, 'scripts/validate-categories.mjs'), '--data', path], {
        encoding: 'utf8',
      });
      assert.equal(r.status, 1);
      assert.match(r.stderr, /categories: \d+ error\(s\)/);
      assert.match(r.stderr, /an "unknown" category is required/);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test('exits 1 for malformed JSON', () => {
    const dir = mkdtempSync(join(tmpdir(), 'categories-test-'));
    try {
      const path = join(dir, 'categories.json');
      writeFileSync(path, '{ "categories": [ ');
      const r = spawnSync(process.execPath, [resolve(root, 'scripts/validate-categories.mjs'), '--data', path], {
        encoding: 'utf8',
      });
      assert.equal(r.status, 1);
      assert.match(r.stderr, /could not read data/);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
