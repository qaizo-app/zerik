#!/usr/bin/env node
// process-source-icon.js — обрабатывает icon-source.png:
//   1. закрашивает Gemini watermark в правом нижнем углу
//   2. центрирует на чёрном квадрате (если исходник не квадратный)
//   3. рендерит все нужные размеры:
//        icon.png            1024×1024
//        adaptive-icon.png   1024×1024
//        icon-512.png         512× 512
//   4. компонует splash.png (1242×2436) и feature-graphic.png (1024×500)
//      используя resvg для текста.
//
//   node scripts/process-source-icon.js

const fs = require('fs');
const path = require('path');
const { Jimp } = require('jimp');
const { Resvg } = require('@resvg/resvg-js');

const ASSETS = path.join(__dirname, '..', 'apps', 'mental-models', 'assets');
const SRC = path.join(ASSETS, 'icon-source.png');

const BG_COLOR = 0x0E1014FF;       // app brand dark
const WATERMARK_FRACTION = 0.085;  // 8.5% of width — covers Gemini sparkle

(async () => {
  if (!fs.existsSync(SRC)) {
    console.error(`Missing ${SRC}`);
    process.exit(1);
  }

  // Load source
  const src = await Jimp.read(SRC);
  const { width, height } = src.bitmap;
  console.log(`Source: ${width}×${height}`);

  // Make square (pad to longer side, fill with brand bg)
  const size = Math.max(width, height);
  const square = new Jimp({ width: size, height: size, color: BG_COLOR });
  square.composite(src, Math.floor((size - width) / 2), Math.floor((size - height) / 2));

  // Paint over Gemini watermark in bottom-right corner.
  // Use a slightly larger area than the visible watermark to be safe.
  const wm = Math.floor(size * WATERMARK_FRACTION);
  const wmPatch = new Jimp({ width: wm, height: wm, color: BG_COLOR });
  square.composite(wmPatch, size - wm, size - wm);

  // Generate sizes
  const out1024 = square.clone().resize({ w: 1024, h: 1024 });
  await out1024.write(path.join(ASSETS, 'icon.png'));
  await out1024.write(path.join(ASSETS, 'adaptive-icon.png'));
  console.log('  icon.png            1024×1024');
  console.log('  adaptive-icon.png   1024×1024');

  const out512 = square.clone().resize({ w: 512, h: 512 });
  await out512.write(path.join(ASSETS, 'icon-512.png'));
  console.log('  icon-512.png         512× 512');

  // Splash 1242×2436: dark bg, icon centered at 600×600
  const splash = new Jimp({ width: 1242, height: 2436, color: BG_COLOR });
  const splashIcon = square.clone().resize({ w: 600, h: 600 });
  splash.composite(splashIcon, Math.floor((1242 - 600) / 2), Math.floor((2436 - 600) / 2));
  await splash.write(path.join(ASSETS, 'splash.png'));
  console.log('  splash.png          1242×2436');

  // Feature graphic 1024×500: dark gradient bg, icon left, text right
  // Use resvg with composed SVG (icon as embedded base64 PNG)
  const iconBuf = await out1024.getBuffer('image/png');
  const iconB64 = iconBuf.toString('base64');
  const W = 1024, H = 500, ICON = 320;
  const fgSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="fg_bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0E1014"/>
      <stop offset="100%" stop-color="#1D2129"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#fg_bg)"/>
  <image x="80" y="${(H - ICON) / 2}" width="${ICON}" height="${ICON}"
         href="data:image/png;base64,${iconB64}"/>
  <text x="460" y="240" font-family="Georgia, serif" font-size="68" fill="#E4E7EC" font-weight="bold">Senik</text>
  <text x="460" y="300" font-family="Georgia, serif" font-size="28" fill="#8B93A1" font-style="italic">Одна ментальная модель.</text>
  <text x="460" y="340" font-family="Georgia, serif" font-size="28" fill="#8B93A1" font-style="italic">Каждый день.</text>
</svg>`;
  const fg = new Resvg(fgSvg, { fitTo: { mode: 'width', value: W } }).render().asPng();
  fs.writeFileSync(path.join(ASSETS, 'feature-graphic.png'), fg);
  console.log('  feature-graphic.png 1024× 500');

  console.log('Done.');
})().catch(e => { console.error(e); process.exit(1); });
