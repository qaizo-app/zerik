#!/usr/bin/env node
// Скачивает Inter-шрифты для apps/biased/assets/fonts/.
// Запуск: node scripts/download-fonts-biased.js

const fs = require('fs');
const https = require('https');
const path = require('path');

const TARGET_DIR = path.join(__dirname, '..', 'apps', 'biased', 'assets', 'fonts');

const FONTS = [
  {
    name: 'Inter-Regular.ttf',
    url:  'https://github.com/google/fonts/raw/main/ofl/inter/Inter%5Bopsz%2Cwght%5D.ttf'
  },
  {
    name: 'Inter-Bold.ttf',
    url:  'https://github.com/google/fonts/raw/main/ofl/inter/Inter%5Bopsz%2Cwght%5D.ttf'
  },
  {
    name: 'Inter-Medium.ttf',
    url:  'https://github.com/google/fonts/raw/main/ofl/inter/Inter%5Bopsz%2Cwght%5D.ttf'
  }
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    function fetch(u, redirects) {
      if (redirects > 8) return reject(new Error('too many redirects'));
      https.get(u, { headers: { 'User-Agent': 'node' } }, res => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          fetch(res.headers.location, redirects + 1);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${u}`));
          return;
        }
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => file.close(() => resolve(dest)));
      }).on('error', reject);
    }
    fetch(url, 0);
  });
}

async function main() {
  if (!fs.existsSync(TARGET_DIR)) fs.mkdirSync(TARGET_DIR, { recursive: true });

  for (const f of FONTS) {
    const dest = path.join(TARGET_DIR, f.name);
    const exists = fs.existsSync(dest) && fs.statSync(dest).size > 5000;
    if (exists) {
      console.log(`[skip] ${f.name} (${fs.statSync(dest).size} bytes)`);
      continue;
    }
    process.stdout.write(`[get ] ${f.name} ... `);
    try {
      await download(f.url, dest);
      console.log(`${fs.statSync(dest).size} bytes`);
    } catch (e) {
      console.log(`FAILED: ${e.message}`);
    }
  }
  console.log('\nDone. Note: Inter is a variable font — all weights come from one file.');
}

main();
