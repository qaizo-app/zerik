#!/usr/bin/env node
// Генерирует PNG-иконки для apps/biased/ из icon.svg.
//   npm install --save-dev @resvg/resvg-js   (уже установлен в workspace)
//   node scripts/generate-icons-biased.js

const fs = require('fs');
const path = require('path');

let Resvg;
try {
  ({ Resvg } = require('@resvg/resvg-js'));
} catch (e) {
  console.error('Run: npm install --save-dev @resvg/resvg-js');
  process.exit(1);
}

const ASSETS  = path.join(__dirname, '..', 'apps', 'biased', 'assets');
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
  const inner = svg.replace(/<svg[^>]*>/, '').replace('</svg>', '');
  const bg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#0D1B2A"/>
  <g transform="translate(${(W - ICON) / 2}, ${(H - ICON) / 2}) scale(${ICON / 1024})">
    ${inner}
  </g>
</svg>`;
  const r = new Resvg(bg, { fitTo: { mode: 'width', value: W } });
  return r.render().asPng();
}

function renderFeatureGraphic() {
  const W = 1024, H = 500, ICON = 300;
  const inner = svg.replace(/<svg[^>]*>/, '').replace('</svg>', '');
  const bg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="fg_bg" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#0D1B2A"/>
      <stop offset="100%" stop-color="#132233"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#fg_bg)"/>
  <g transform="translate(80, ${(H - ICON) / 2}) scale(${ICON / 1024})">
    ${inner}
  </g>
  <text x="440" y="220" font-family="sans-serif" font-size="74" fill="#F0F4F8" font-weight="bold">Biased</text>
  <text x="440" y="285" font-family="sans-serif" font-size="30" fill="#8BA3BC">One cognitive bias. Every day.</text>
  <rect x="440" y="320" width="180" height="5" rx="2" fill="#E89647" opacity="0.8"/>
</svg>`;
  const r = new Resvg(bg, { fitTo: { mode: 'width', value: W } });
  return r.render().asPng();
}

function write(filename, data) {
  const p = path.join(ASSETS, filename);
  fs.writeFileSync(p, data);
  console.log(`  ${filename.padEnd(28)} ${(data.length / 1024).toFixed(1)} KB`);
}

console.log('Generating Biased icons:');
write('icon.png',            renderSquare(1024));
write('adaptive-icon.png',   renderSquare(1024));
write('icon-512.png',        renderSquare(512));
write('splash.png',          renderSplash());
write('feature-graphic.png', renderFeatureGraphic());
console.log('Done.');
