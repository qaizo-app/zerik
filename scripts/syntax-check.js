#!/usr/bin/env node
// Быстрая проверка синтаксиса всех .js файлов в engine/ и apps/.
// Парсит каждый файл через @babel/parser с пресетами для JSX и Flow/TS.
// Не запускает код, только parse — выловит обычные опечатки/несбалансированные скобки.

const fs = require('fs');
const path = require('path');

let parser;
try {
  parser = require('@babel/parser');
} catch (e) {
  console.log('Module @babel/parser not installed yet. Run: npm install --no-save @babel/parser');
  process.exit(0);
}

const ROOTS = [
  path.join(__dirname, '..', 'engine'),
  path.join(__dirname, '..', 'apps', 'mental-models')
];
const EXCLUDE = ['node_modules', '.expo', 'dist', 'build', 'assets'];

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir)) {
    if (EXCLUDE.includes(entry)) continue;
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, out);
    else if (entry.endsWith('.js') || entry.endsWith('.jsx')) out.push(full);
  }
  return out;
}

const files = ROOTS.flatMap(r => walk(r));
let okCount = 0, failCount = 0;

for (const file of files) {
  const code = fs.readFileSync(file, 'utf8');
  try {
    parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'flow', 'classProperties', 'dynamicImport']
    });
    okCount++;
  } catch (e) {
    failCount++;
    const rel = path.relative(path.join(__dirname, '..'), file);
    console.log(`[FAIL] ${rel}`);
    console.log(`  ${e.message}`);
  }
}

console.log(`\n${okCount} OK, ${failCount} FAIL out of ${files.length} files`);
process.exit(failCount === 0 ? 0 : 1);
