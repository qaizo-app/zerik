#!/usr/bin/env node
// Генерирует PNG-иконки для apps/cavil/ из icon.svg.
//   node scripts/generate-icons-cavil.js

const fs = require('fs');
const path = require('path');

let Resvg;
try {
  ({ Resvg } = require('@resvg/resvg-js'));
} catch (e) {
  console.error('Run: npm install --save-dev @resvg/resvg-js');
  process.exit(1);
}

const ASSETS  = path.join(__dirname, '..', 'apps', 'cavil', 'assets');
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

function renderSplash() {
  const W = 1242, H = 2436, ICON = 480;
  const inner = svg
    .replace(/<\?xml[^?]*\?>/, '')
    .replace(/<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '');
  const bg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#15110A"/>
  <g transform="translate(${(W - ICON) / 2}, ${(H - ICON) / 2}) scale(${ICON / 1024})">
    ${inner}
  </g>
</svg>`;
  const r = new Resvg(bg, { fitTo: { mode: 'width', value: W } });
  return r.render().asPng();
}

function renderFeatureGraphic() {
  const W = 1024, H = 500, ICON = 320;
  const inner = svg
    .replace(/<\?xml[^?]*\?>/, '')
    .replace(/<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '');
  const bg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="fg_bg" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#15110A"/>
      <stop offset="100%" stop-color="#26200F"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#fg_bg)"/>
  <g transform="translate(80, ${(H - ICON) / 2}) scale(${ICON / 1024})">
    ${inner}
  </g>
  <text x="460" y="220" font-family="Georgia, serif" font-size="78" fill="#EBE2C8" font-weight="bold">Cavil</text>
  <text x="460" y="285" font-family="Georgia, serif" font-size="28" fill="#A89A78" font-style="italic">Every bad argument, named.</text>
  <rect x="460" y="320" width="180" height="5" rx="2" fill="#FBBF24" opacity="0.9"/>
</svg>`;
  const r = new Resvg(bg, { fitTo: { mode: 'width', value: W } });
  return r.render().asPng();
}

function write(filename, data) {
  const p = path.join(ASSETS, filename);
  fs.writeFileSync(p, data);
  console.log(`  ${filename.padEnd(28)} ${(data.length / 1024).toFixed(1)} KB`);
}

console.log('Generating Cavil icons:');
write('icon.png',            renderSquare(1024));
write('adaptive-icon.png',   renderSquare(1024));
write('icon-512.png',        renderSquare(512));
write('splash.png',          renderSplash());
write('feature-graphic.png', renderFeatureGraphic());
console.log('Done.');
