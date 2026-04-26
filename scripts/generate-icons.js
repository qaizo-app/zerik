#!/usr/bin/env node
// generate-icons.js — генерирует PNG-иконки разных размеров из icon.svg
// для использования в app.json (icon, adaptiveIcon) и Play Store assets.
//
//   npm install --save-dev @resvg/resvg-js
//   node scripts/generate-icons.js
//
// Output:
//   apps/mental-models/assets/icon.png            1024×1024  (app.json `icon`)
//   apps/mental-models/assets/adaptive-icon.png   1024×1024  (Android adaptive)
//   apps/mental-models/assets/icon-512.png         512× 512  (Play Store hi-res)
//   apps/mental-models/assets/splash.png          1242×2436  (splash, dark bg)
//   apps/mental-models/assets/feature-graphic.png 1024× 500  (Play Store feature, simple)

const fs = require('fs');
const path = require('path');

let Resvg;
try {
  ({ Resvg } = require('@resvg/resvg-js'));
} catch (e) {
  console.error('Run: npm install --save-dev @resvg/resvg-js');
  process.exit(1);
}

const ASSETS = path.join(__dirname, '..', 'apps', 'mental-models', 'assets');
const SVG_FILE = path.join(ASSETS, 'icon.svg');
if (!fs.existsSync(SVG_FILE)) {
  console.error(`Missing ${SVG_FILE}`);
  process.exit(1);
}
const svg = fs.readFileSync(SVG_FILE, 'utf8');

function renderSquare(size) {
  const r = new Resvg(svg, { fitTo: { mode: 'width', value: size } });
  return r.render().asPng();
}

// Splash: тёмный фон 1242×2436, иконка 600×600 по центру.
function renderSplash() {
  const W = 1242, H = 2436, ICON = 600;
  // Простой подход — встроить иконку в больший SVG-фон.
  const bg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#0E1014"/>
  <g transform="translate(${(W - ICON) / 2}, ${(H - ICON) / 2}) scale(${ICON / 1024})">
    ${svg.replace(/<svg[^>]*>/, '').replace('</svg>', '')}
  </g>
</svg>`;
  const r = new Resvg(bg, { fitTo: { mode: 'width', value: W } });
  return r.render().asPng();
}

// Feature graphic: Play Store 1024×500. Тёмный фон, иконка слева, лого справа.
function renderFeatureGraphic() {
  const W = 1024, H = 500, ICON = 320;
  const bg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="fg_bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0E1014"/>
      <stop offset="100%" stop-color="#1D2129"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#fg_bg)"/>
  <g transform="translate(80, ${(H - ICON) / 2}) scale(${ICON / 1024})">
    ${svg.replace(/<svg[^>]*>/, '').replace('</svg>', '')}
  </g>
  <text x="460" y="240" font-family="Georgia, serif" font-size="68" fill="#E4E7EC" font-weight="bold">Mental Models</text>
  <text x="460" y="300" font-family="Georgia, serif" font-size="28" fill="#8B93A1" font-style="italic">Одна модель в день</text>
  <text x="460" y="340" font-family="Georgia, serif" font-size="28" fill="#8B93A1" font-style="italic">для ясного мышления</text>
</svg>`;
  const r = new Resvg(bg, { fitTo: { mode: 'width', value: W } });
  return r.render().asPng();
}

function write(filename, data) {
  const p = path.join(ASSETS, filename);
  fs.writeFileSync(p, data);
  const kb = (data.length / 1024).toFixed(1);
  console.log(`  ${filename.padEnd(28)} ${kb} KB`);
}

console.log('Generating icons:');
write('icon.png',            renderSquare(1024));
write('adaptive-icon.png',   renderSquare(1024));
write('icon-512.png',        renderSquare(512));
write('splash.png',          renderSplash());
write('feature-graphic.png', renderFeatureGraphic());
console.log('Done.');
