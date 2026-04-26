#!/usr/bin/env node
// check-secrets.js — fail-loud защита от коммита секретов.
// Запускать вручную или из pre-commit hook:
//   git diff --cached --name-only | node scripts/check-secrets.js
// или просто:
//   node scripts/check-secrets.js
// (без stdin — проверяет все tracked файлы git ls-files).

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Имена файлов, которые НЕ должны попадать в репо.
const FORBIDDEN_FILENAMES = [
  'serviceAccount.json',
  'service-account.json',
  '.env',
  '.env.local',
  '.env.production',
  'GoogleService-Info.plist'
];

// Содержимое-эвристики — если в файле найдено, это вероятно секрет.
const CONTENT_PATTERNS = [
  { name: 'Firebase Admin private_key',  re: /-----BEGIN (RSA )?PRIVATE KEY-----/ },
  { name: 'Firebase service account',    re: /"type"\s*:\s*"service_account"/ },
  { name: 'Google API key (likely)',     re: /AIza[0-9A-Za-z_-]{35}/ },
  { name: 'AWS access key',              re: /AKIA[0-9A-Z]{16}/ },
  { name: 'Bearer/JWT token (long)',     re: /eyJ[A-Za-z0-9_-]{30,}\.[A-Za-z0-9_-]{30,}\.[A-Za-z0-9_-]{30,}/ },
  { name: 'RevenueCat key',              re: /(appl|goog)_[A-Za-z0-9]{30,}/ }
];

// Файлы, которые можно (и нужно) коммитить даже если совпадают по имени —
// например google-services.json для Android (публичный по дизайну Firebase).
const ALLOWLIST_FILENAMES = ['google-services.json'];

let violations = 0;

function check(file) {
  const base = path.basename(file);
  if (ALLOWLIST_FILENAMES.includes(base)) return;

  // Имя файла
  if (FORBIDDEN_FILENAMES.includes(base)) {
    console.error(`✗ FORBIDDEN FILENAME: ${file}`);
    violations++;
    return;
  }

  // Содержимое (для текстовых файлов до 1MB)
  let content;
  try {
    const stat = fs.statSync(file);
    if (stat.size > 1024 * 1024) return;
    content = fs.readFileSync(file, 'utf8');
  } catch (e) {
    return;
  }

  for (const pat of CONTENT_PATTERNS) {
    if (pat.re.test(content)) {
      console.error(`✗ ${pat.name} in: ${file}`);
      violations++;
    }
  }
}

let files;
const stdinChunks = [];
process.stdin.on('data', chunk => stdinChunks.push(chunk));
process.stdin.on('end', () => {
  if (stdinChunks.length) {
    files = Buffer.concat(stdinChunks).toString().split('\n').filter(Boolean);
  } else {
    files = execSync('git ls-files', { cwd: path.join(__dirname, '..') })
      .toString().split('\n').filter(Boolean);
  }

  for (const f of files) {
    const abs = path.join(__dirname, '..', f);
    if (fs.existsSync(abs)) check(abs);
  }

  if (violations > 0) {
    console.error(`\n${violations} violation(s) — refusing.`);
    process.exit(1);
  }
  console.log(`Checked ${files.length} files. No secrets found.`);
  process.exit(0);
});

if (process.stdin.isTTY) process.stdin.emit('end');
