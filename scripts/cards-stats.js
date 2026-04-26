#!/usr/bin/env node
// cards-stats.js — метрики контента: распределение по категориям, длины,
// типы блоков, hardcoded_stats покрытие. Помогает планировать линейку.

const fs = require('fs');
const path = require('path');

const SEED_DIR = path.join(__dirname, '..', 'content', 'seed');
const files = fs.readdirSync(SEED_DIR).filter(f => f.endsWith('.json')).sort();

const byCategory = {};
const byBlockType = {};
const byDifficulty = {};
const cards = [];

for (const f of files) {
  const data = JSON.parse(fs.readFileSync(path.join(SEED_DIR, f), 'utf8'));
  cards.push(data);

  byCategory[data.category] = (byCategory[data.category] || 0) + 1;
  if (data.difficulty) byDifficulty[data.difficulty] = (byDifficulty[data.difficulty] || 0) + 1;

  const blocks = data.i18n?.ru?.blocks || data.i18n?.en?.blocks || [];
  for (const b of blocks) {
    byBlockType[b.type] = (byBlockType[b.type] || 0) + 1;
  }
}

function bar(count, max, width = 28) {
  const w = Math.round((count / max) * width);
  return '█'.repeat(w) + '·'.repeat(width - w);
}

function tableRow(label, count, total, max) {
  const pct = ((count / total) * 100).toFixed(1).padStart(5);
  return `  ${label.padEnd(24)} ${bar(count, max)} ${String(count).padStart(3)} (${pct}%)`;
}

console.log(`Total cards: ${cards.length}`);
console.log('');

console.log('By category:');
const catMax = Math.max(...Object.values(byCategory));
for (const [cat, n] of Object.entries(byCategory).sort((a, b) => b[1] - a[1])) {
  console.log(tableRow(cat, n, cards.length, catMax));
}

console.log('\nBy difficulty:');
for (const [diff, n] of Object.entries(byDifficulty).sort((a, b) => Number(a[0]) - Number(b[0]))) {
  console.log(`  level ${diff}: ${n}`);
}

console.log('\nBlock types (counted across all RU blocks):');
const blockMax = Math.max(...Object.values(byBlockType));
for (const [type, n] of Object.entries(byBlockType).sort((a, b) => b[1] - a[1])) {
  console.log(tableRow(type, n, Object.values(byBlockType).reduce((a, b) => a + b, 0), blockMax));
}

console.log('\nLength stats (RU blocks per card):');
const lengths = cards.map(c => (c.i18n?.ru?.blocks || []).length).sort((a, b) => a - b);
const sum = lengths.reduce((a, b) => a + b, 0);
console.log(`  min:    ${lengths[0]}`);
console.log(`  median: ${lengths[Math.floor(lengths.length / 2)]}`);
console.log(`  avg:    ${(sum / lengths.length).toFixed(1)}`);
console.log(`  max:    ${lengths[lengths.length - 1]}`);

console.log('\nUses hardcoded_stats (academic data):');
const acad = cards.filter(c =>
  JSON.stringify(c).includes('hardcoded_stats') ||
  JSON.stringify(c).includes('historical_data')
);
console.log(`  ${acad.length} cards: ${acad.map(c => c.id).join(', ')}`);

console.log('\nCards with deep level (level 2) ref:');
const deep = files.filter(f => f.endsWith('_deep.json')).map(f => f.replace('_deep.json', ''));
console.log(`  ${deep.length} parent cards have deep: ${deep.join(', ')}`);

console.log('\nReleases per week (cohort schedule):');
const dates = cards.map(c => c.release_date).filter(Boolean).sort();
if (dates.length) {
  const first = new Date(dates[0]);
  const last = new Date(dates[dates.length - 1]);
  const days = Math.round((last - first) / (1000 * 60 * 60 * 24)) + 1;
  console.log(`  ${dates.length} cards spanning ${days} days (${dates[0]} → ${dates[dates.length - 1]})`);
  console.log(`  ≈ ${(dates.length * 7 / days).toFixed(1)} cards/week`);
}
