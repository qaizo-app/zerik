#!/usr/bin/env node
// Валидатор карточки против content/card_schema.json
// Запуск: node scripts/validate-card.js [path-to-card.json | folder]
// Без аргументов — валидирует все JSON в content/seed/

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');

const SCHEMA_PATH = path.join(__dirname, '..', 'content', 'card_schema.json');
const DEFAULT_DIR = path.join(__dirname, '..', 'content', 'seed');

function loadSchema() {
  const raw = fs.readFileSync(SCHEMA_PATH, 'utf8');
  return JSON.parse(raw);
}

function loadCard(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function listJsonFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => path.join(dir, f));
}

function inlineMarkerCheck(text) {
  if (typeof text !== 'string') return [];
  const out = [];
  const tokens = text.match(/\{\{([^}]+)\}\}/g) || [];
  for (const t of tokens) {
    const inner = t.slice(2, -2).trim();
    const valid = /^accent:.+$/.test(inner) || /^em:.+$/.test(inner) || inner === 'votes_count' || inner === 'user_name';
    if (!valid) out.push(`Unknown inline marker: ${t}`);
  }
  return out;
}

function semanticChecks(card, file) {
  const issues = [];
  const locales = Object.keys(card.i18n || {});

  if (locales.length < 1) issues.push('No locales in i18n');

  for (const locale of locales) {
    const blocks = card.i18n[locale].blocks || [];

    let hasTitle = false, hasHook = false;
    let scenarioBlocks = 0;

    for (const block of blocks) {
      if (block.type === 'title') hasTitle = true;
      if (block.type === 'hook')  hasHook = true;
      if (block.type === 'scenario') scenarioBlocks++;

      const props = block.props || {};
      const allText = JSON.stringify(props);
      const markerErrs = inlineMarkerCheck(allText);
      markerErrs.forEach(m => issues.push(`[${locale}/${block.type}] ${m}`));

      if (block.type === 'title' && typeof props.text === 'string') {
        const accentMatches = (props.text.match(/\{\{accent:[^}]+\}\}/g) || []).length;
        if (accentMatches !== 1) {
          issues.push(`[${locale}/title] Expected exactly 1 {{accent:...}} marker, found ${accentMatches}`);
        }
      }

      if (block.type === 'scenario') {
        const opts = props.options || [];
        const wiserCount = opts.filter(o => o.is_wiser === true).length;
        if (wiserCount > 1) issues.push(`[${locale}/scenario] More than one option marked is_wiser`);
      }
    }

    if (!hasHook)  issues.push(`[${locale}] missing hook block`);
    if (!hasTitle) issues.push(`[${locale}] missing title block`);
    if (scenarioBlocks > 1) issues.push(`[${locale}] more than one scenario block`);
  }

  if (locales.includes('ru') && locales.includes('en')) {
    const ruTypes = (card.i18n.ru.blocks || []).map(b => b.type).join(',');
    const enTypes = (card.i18n.en.blocks || []).map(b => b.type).join(',');
    if (ruTypes !== enTypes) {
      issues.push(`Block type sequence differs between RU and EN locales:\n    RU: ${ruTypes}\n    EN: ${enTypes}`);
    }
  }

  return issues;
}

function validate(filePath, ajv, validator) {
  const card = loadCard(filePath);
  const ok = validator(card);
  const schemaErrors = ok ? [] : (validator.errors || []).map(e => `  ${e.instancePath} ${e.message}`);
  const semantic = semanticChecks(card, filePath);

  const allIssues = [...schemaErrors, ...semantic];
  const status = allIssues.length === 0 ? 'OK ' : 'FAIL';
  console.log(`[${status}] ${path.relative(process.cwd(), filePath)}`);
  for (const issue of allIssues) console.log(`  - ${issue}`);
  return allIssues.length === 0;
}

function main() {
  const arg = process.argv[2];
  let files;
  if (!arg) {
    files = listJsonFiles(DEFAULT_DIR);
  } else if (fs.existsSync(arg) && fs.statSync(arg).isDirectory()) {
    files = listJsonFiles(arg);
  } else {
    files = [arg];
  }

  if (files.length === 0) {
    console.log('No JSON files found.');
    process.exit(0);
  }

  const schema = loadSchema();
  const ajv = new Ajv({ allErrors: true, strict: false });
  const validator = ajv.compile(schema);

  let allOk = true;
  for (const f of files) {
    const ok = validate(f, ajv, validator);
    if (!ok) allOk = false;
  }

  console.log(`\n${allOk ? 'All cards valid.' : 'Some cards failed validation.'}`);
  process.exit(allOk ? 0 : 1);
}

main();
