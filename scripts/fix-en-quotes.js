#!/usr/bin/env node
// fix-en-quotes.js — заменяет французские кавычки «» на английские curly "" в
// content/seed/*.json блоках i18n.en (и только там — RU кавычки не трогаем).
// Также fix' для tire/em-dash и других мелких признаков перевода.
//
//   node scripts/fix-en-quotes.js [--dry-run]

const fs = require('fs');
const path = require('path');

const DRY = process.argv.includes('--dry-run');
const SEED_DIR = path.join(__dirname, '..', 'content', 'seed');

function fixEnText(s) {
  if (typeof s !== 'string') return s;
  let out = s;
  // 1) Французские «...» → curly английские "..."
  out = out.replace(/«([^»]*)»/g, '“$1”');
  // 2) Russian style ».» / ".» → ."  (US English: period inside quotes)
  out = out.replace(/”([.,;:])/g, '$1”');
  // 3) Russian тире с пробелами " — " → " — " (em dash сохраняем, EN convention)
  // Уже em-dash, оставляем
  return out;
}

function walk(node, fix) {
  if (typeof node === 'string') return fix(node);
  if (Array.isArray(node)) return node.map(x => walk(x, fix));
  if (node && typeof node === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(node)) out[k] = walk(v, fix);
    return out;
  }
  return node;
}

let changed = 0;
let total = 0;

for (const f of fs.readdirSync(SEED_DIR).filter(x => x.endsWith('.json')).sort()) {
  const p = path.join(SEED_DIR, f);
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  total++;

  if (!data.i18n?.en) continue;
  const before = JSON.stringify(data.i18n.en);
  data.i18n.en = walk(data.i18n.en, fixEnText);
  const after = JSON.stringify(data.i18n.en);

  if (before !== after) {
    changed++;
    const beforeQuotes = (before.match(/«|»/g) || []).length;
    const afterQuotes  = (after.match(/«|»/g) || []).length;
    console.log(`  ${f.padEnd(34)} «»: ${beforeQuotes} → ${afterQuotes}`);
    if (!DRY) fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf8');
  }
}

console.log(`\n${changed}/${total} files changed${DRY ? ' (DRY RUN)' : ''}.`);
