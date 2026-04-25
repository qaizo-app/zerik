#!/usr/bin/env node
// Скачивает шрифты Google Fonts в apps/mental-models/assets/fonts/.
// Запуск: node scripts/download-fonts.js (или npm run fonts:download).
// Источник: github.com/google/fonts (raw файлы из master).
//
// Замечание: пустые .ttf плейсхолдеры в репозитории НЕ ломают Expo Font.loadAsync,
// потому что App.js делает .catch(() => setFontsReady(true)). Но без настоящих
// шрифтов карточка теряет визуальный язык. Запусти этот скрипт перед `expo start`.

const fs = require('fs');
const https = require('https');
const path = require('path');

const TARGET_DIR = path.join(__dirname, '..', 'apps', 'mental-models', 'assets', 'fonts');

const FONTS = [
  // family/dir, filename, url
  { name: 'Prata-Regular.ttf',
    url: 'https://github.com/google/fonts/raw/main/ofl/prata/Prata-Regular.ttf' },
  { name: 'Spectral-Light.ttf',
    url: 'https://github.com/google/fonts/raw/main/ofl/spectral/Spectral-Light.ttf' },
  { name: 'Spectral-Regular.ttf',
    url: 'https://github.com/google/fonts/raw/main/ofl/spectral/Spectral-Regular.ttf' },
  { name: 'Spectral-Italic.ttf',
    url: 'https://github.com/google/fonts/raw/main/ofl/spectral/Spectral-Italic.ttf' },
  { name: 'Spectral-Medium.ttf',
    url: 'https://github.com/google/fonts/raw/main/ofl/spectral/Spectral-Medium.ttf' },
  { name: 'JetBrainsMono-Regular.ttf',
    url: 'https://github.com/google/fonts/raw/main/ofl/jetbrainsmono/JetBrainsMono%5Bwght%5D.ttf' },
  { name: 'JetBrainsMono-Medium.ttf',
    url: 'https://github.com/google/fonts/raw/main/ofl/jetbrainsmono/JetBrainsMono%5Bwght%5D.ttf' },
  { name: 'JetBrainsMono-Bold.ttf',
    url: 'https://github.com/google/fonts/raw/main/ofl/jetbrainsmono/JetBrainsMono%5Bwght%5D.ttf' }
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    function fetch(u, redirects) {
      if (redirects > 5) return reject(new Error('too many redirects'));
      https.get(u, res => {
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
      console.log(`[skip] ${f.name} (already ${fs.statSync(dest).size} bytes)`);
      continue;
    }
    process.stdout.write(`[get ] ${f.name} ... `);
    try {
      await download(f.url, dest);
      const size = fs.statSync(dest).size;
      console.log(`${size} bytes`);
    } catch (e) {
      console.log(`FAILED: ${e.message}`);
    }
  }

  console.log('\nDone. If any download failed, fetch the .ttf manually from fonts.google.com');
  console.log('and place it under apps/mental-models/assets/fonts/.');
}

main();
