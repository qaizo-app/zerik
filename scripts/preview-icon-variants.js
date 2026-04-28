#!/usr/bin/env node
// preview-icon-variants.js — рендерит PNG-превью каждой SVG-иконки
// из apps/mental-models/assets/icon-variants/ в той же папке.
//
//   node scripts/preview-icon-variants.js

const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

const DIR = path.join(__dirname, '..', 'apps', 'mental-models', 'assets', 'icon-variants');
const files = fs.readdirSync(DIR).filter(f => f.endsWith('.svg'));

console.log('Rendering previews:');
for (const f of files) {
  const svg = fs.readFileSync(path.join(DIR, f), 'utf8');
  const r = new Resvg(svg, { fitTo: { mode: 'width', value: 512 } });
  const png = r.render().asPng();
  const out = path.join(DIR, f.replace('.svg', '-512.png'));
  fs.writeFileSync(out, png);
  console.log(`  ${f.padEnd(28)} → ${path.basename(out)}  ${(png.length / 1024).toFixed(1)} KB`);
}
console.log('Done.');
