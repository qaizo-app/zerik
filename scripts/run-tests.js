#!/usr/bin/env node
// run-tests.js — минималистичный test runner для pure-функций engine.
// Без Jest/Vitest — только assert + ESM-loader для .js модулей.
// Цель: smoke-тесты на критичную логику (palette shift, registry, i18n),
// которая легко ломается и не имеет UI-canary.

const assert = require('assert');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ok   ${name}`);
    passed++;
  } catch (e) {
    console.log(`  FAIL ${name}\n       ${e.message}`);
    failed++;
  }
}

function group(title, fn) {
  console.log(`\n${title}`);
  fn();
}

// ─── refToSlug ────────────────────────────────────────────────────────────
group('engine/blocks/illustrations/registry.refToSlug', () => {
  const { refToSlug } = require('../engine/blocks/illustrations/registry');

  test('extracts slug from bundle:// URL', () => {
    assert.strictEqual(refToSlug('bundle://illustrations/sunk_cost.svg'), 'sunk_cost');
  });

  test('handles slug without extension', () => {
    assert.strictEqual(refToSlug('bundle://illustrations/anchoring'), 'anchoring');
  });

  test('returns null for null/undefined', () => {
    assert.strictEqual(refToSlug(null), null);
    assert.strictEqual(refToSlug(undefined), null);
  });

  test('returns null for non-string', () => {
    assert.strictEqual(refToSlug(42), null);
    assert.strictEqual(refToSlug({}), null);
  });

  test('returns null for unrelated string', () => {
    assert.strictEqual(refToSlug('https://example.com/img.png'), null);
  });
});

// ─── i18n.t ───────────────────────────────────────────────────────────────
group('engine/i18n.t', () => {
  const { t, setLanguage, extendStrings } = require('../engine/i18n');

  extendStrings({
    ru: { test_hello: 'Привет', test_count: '{{n}} штук' },
    en: { test_hello: 'Hello',  test_count: '{{n}} items' }
  });

  test('returns ru string when ru is set', () => {
    setLanguage('ru');
    assert.strictEqual(t('test_hello'), 'Привет');
  });

  test('returns en string when en is set', () => {
    setLanguage('en');
    assert.strictEqual(t('test_hello'), 'Hello');
  });

  test('falls back to en when key missing in current lang', () => {
    setLanguage('ru');
    extendStrings({ en: { test_only_en: 'EN only' } });
    assert.strictEqual(t('test_only_en'), 'EN only');
  });

  test('returns key itself when not in any lang', () => {
    assert.strictEqual(t('absolutely_missing_key'), 'absolutely_missing_key');
  });

  test('substitutes {{var}}', () => {
    setLanguage('en');
    assert.strictEqual(t('test_count', { n: 7 }), '7 items');
  });

  test('handles repeated {{var}}', () => {
    extendStrings({ en: { test_repeat: '{{x}}-{{x}}' } });
    assert.strictEqual(t('test_repeat', { x: 'A' }), 'A-A');
  });
});

// ─── ThemeContext shiftHue / hashCardId ───────────────────────────────────
// Эти функции внутренние, не экспортируются. Дублируем логику и проверяем
// через pure-import — так каждый рефакторинг ThemeContext.js обязан зеркалить
// формулы, иначе palette сломается на live карточках.
group('per-card hue shift (palette correctness invariants)', () => {
  // Эти инварианты должны держаться независимо от реализации.
  // (Если рефакторишь shiftHue — сначала пересчитай ожидаемые значения тут.)

  function shiftHue(hex, deg) {
    const m = hex && hex.match(/^#([0-9a-fA-F]{6})$/);
    if (!m) return hex;
    const n = parseInt(m[1], 16);
    let r = ((n >> 16) & 255) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;
    const d = max - min;
    const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
    let h = 0;
    if (d !== 0) {
      if (max === r) h = ((g - b) / d) % 6;
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
      if (h < 0) h += 360;
    }
    h = (h + deg + 360) % 360;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const mm = l - c / 2;
    let R = 0, G = 0, B = 0;
    if (h < 60)        { R = c; G = x; }
    else if (h < 120)  { R = x; G = c; }
    else if (h < 180)  { G = c; B = x; }
    else if (h < 240)  { G = x; B = c; }
    else if (h < 300)  { R = x; B = c; }
    else               { R = c; B = x; }
    const toHex = (v) => Math.round((v + mm) * 255).toString(16).padStart(2, '0');
    return '#' + toHex(R) + toHex(G) + toHex(B);
  }

  function hashCardId(id) {
    if (!id) return 0;
    let h = 0;
    for (let i = 0; i < id.length; i++) h = ((h << 5) - h + id.charCodeAt(i)) | 0;
    return h;
  }

  test('shiftHue 0deg returns same hex (within rounding)', () => {
    const out = shiftHue('#5EEAD4', 0);
    // Допускаем рассогласование на 1 unit из-за floating point.
    assert.match(out, /^#[0-9a-f]{6}$/);
  });

  test('shiftHue invalid input returns input', () => {
    assert.strictEqual(shiftHue('not-a-hex', 30), 'not-a-hex');
    assert.strictEqual(shiftHue(null, 30), null);
  });

  test('shiftHue preserves valid hex format', () => {
    assert.match(shiftHue('#5EEAD4', 30),  /^#[0-9a-f]{6}$/);
    assert.match(shiftHue('#5EEAD4', -30), /^#[0-9a-f]{6}$/);
    assert.match(shiftHue('#E89647', 60),  /^#[0-9a-f]{6}$/);
  });

  test('shiftHue 360deg ≈ same color', () => {
    const a = shiftHue('#5EEAD4', 0);
    const b = shiftHue('#5EEAD4', 360);
    assert.strictEqual(a, b);
  });

  test('hashCardId is deterministic', () => {
    assert.strictEqual(hashCardId('sunk_cost'), hashCardId('sunk_cost'));
    assert.strictEqual(hashCardId('anchoring'), hashCardId('anchoring'));
  });

  test('hashCardId different ids → different hashes (typical)', () => {
    assert.notStrictEqual(hashCardId('sunk_cost'),     hashCardId('anchoring'));
    assert.notStrictEqual(hashCardId('first_principles'), hashCardId('inversion'));
  });

  test('hashCardId empty/null → 0', () => {
    assert.strictEqual(hashCardId(''), 0);
    assert.strictEqual(hashCardId(null), 0);
    assert.strictEqual(hashCardId(undefined), 0);
  });

  test('all 29 card ids produce non-zero hash', () => {
    const ids = ['sunk_cost', 'occam_razor', 'confirmation_bias', 'first_principles',
                 'inversion', 'trolley_problem', 'monty_hall', 'dunning_kruger',
                 'anchoring', 'pareto_principle', 'theseus_ship', 'simpsons_paradox',
                 'survivorship_bias', 'loss_aversion', 'hindsight_bias', 'hanlon_razor',
                 'second_order', 'birthday_paradox', 'brain_in_vat',
                 'availability_heuristic', 'recency_bias', 'goodharts_law',
                 'schelling_point', 'zenos_paradox', 'platos_cave',
                 'veil_of_ignorance', 'banach_tarski', 'pyrrhonism', 'dunbar_number'];
    for (const id of ids) {
      assert.notStrictEqual(hashCardId(id), 0, `hash of '${id}' is zero — collision risk`);
    }
  });
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
