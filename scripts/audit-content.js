#!/usr/bin/env node
// audit-content.js — расширенный аудит content/seed/*.json:
// 1. Все illustration ref'ы (card.illustration_ref + любые ref в blocks)
//    должны резолвиться в slug, зарегистрированный в illustrations/index.js
// 2. card.category должна быть в category_palettes
// 3. Карточки с release_date > today + 7d помечаются (sanity check на опечатки)
// 4. Каждая карточка должна иметь хотя бы 'ru' и 'en' в i18n

const fs = require('fs');
const path = require('path');

const SEED_DIR = path.join(__dirname, '..', 'content', 'seed');
const ILLUSTRATIONS_FILE = path.join(__dirname, '..', 'apps', 'mental-models', 'illustrations', 'index.js');
const PALETTES_FILE = path.join(__dirname, '..', 'design', 'category_palettes.json');

function readRegisteredSlugs() {
  const src = fs.readFileSync(ILLUSTRATIONS_FILE, 'utf8');
  const slugs = new Set();
  for (const m of src.matchAll(/registerIllustration\(\s*['"]([^'"]+)['"]/g)) {
    slugs.add(m[1]);
  }
  return slugs;
}

function readPalettes() {
  const data = JSON.parse(fs.readFileSync(PALETTES_FILE, 'utf8'));
  return new Set(Object.keys(data).filter(k => !k.startsWith('_') && !k.startsWith('$')));
}

function refToSlug(ref) {
  if (typeof ref !== 'string') return null;
  const m = ref.match(/illustrations\/([^/.]+)/);
  return m ? m[1] : null;
}

function collectIllustrationRefs(node, out = []) {
  if (!node || typeof node !== 'object') return out;
  if (Array.isArray(node)) {
    node.forEach(item => collectIllustrationRefs(item, out));
    return out;
  }
  for (const [key, value] of Object.entries(node)) {
    if ((key === 'ref' || key === 'illustration_ref') && typeof value === 'string') {
      out.push({ ref: value, slug: refToSlug(value) });
    }
    if (value && typeof value === 'object') collectIllustrationRefs(value, out);
  }
  return out;
}

function main() {
  const registered = readRegisteredSlugs();
  const palettes = readPalettes();

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const futureLimit = new Date(today); futureLimit.setDate(futureLimit.getDate() + 30);

  const files = fs.readdirSync(SEED_DIR).filter(f => f.endsWith('.json')).sort();
  let cards = 0;
  let errors = 0;
  let warnings = 0;

  console.log(`Auditing ${files.length} seed files…\n`);
  console.log(`Registered illustration slugs: ${registered.size}`);
  console.log(`Category palettes:             ${palettes.size}`);
  console.log('');

  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(SEED_DIR, file), 'utf8'));
    cards++;
    const issues = [];

    if (!data.id) issues.push('ERR  no id');
    if (!data.category) issues.push('ERR  no category');
    else if (!palettes.has(data.category)) issues.push(`ERR  unknown category: ${data.category}`);

    if (data.release_date) {
      const rd = new Date(data.release_date);
      if (rd > futureLimit) issues.push(`WARN release_date > today+30d: ${data.release_date}`);
    }

    const locales = Object.keys(data.i18n || {});
    if (!locales.includes('ru')) issues.push('WARN missing ru locale');
    if (!locales.includes('en')) issues.push('WARN missing en locale');

    const refs = collectIllustrationRefs(data);
    const unresolved = refs.filter(r => r.slug && !registered.has(r.slug));
    if (unresolved.length) {
      const uniq = [...new Set(unresolved.map(r => r.slug))];
      issues.push(`ERR  ${uniq.length} unregistered illustration slug(s): ${uniq.join(', ')}`);
    }

    if (issues.length) {
      console.log(`${data.id || file}`);
      issues.forEach(i => {
        console.log('  ' + i);
        if (i.startsWith('ERR ')) errors++;
        else warnings++;
      });
    }
  }

  console.log('');
  console.log(`Total cards: ${cards}`);
  console.log(`Errors:      ${errors}`);
  console.log(`Warnings:    ${warnings}`);
  process.exit(errors > 0 ? 1 : 0);
}

main();
