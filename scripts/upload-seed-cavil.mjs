#!/usr/bin/env node
// upload-seed-cavil.mjs — заливает карточки из apps/cavil/src/seed.js
// в Firestore (коллекция fallacies).
//
// Setup:
//   1. Firebase Console → <cavil project> → Project Settings → Service Accounts → Generate key
//   2. Сохранить как serviceAccount-cavil.json в корень workspace
//   3. npm run seed:upload:cavil

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readFileSync } from 'fs';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

const SA_PATH = join(__dirname, '..', 'serviceAccount-cavil.json');
if (!existsSync(SA_PATH)) {
  console.error('Missing serviceAccount-cavil.json in workspace root.');
  console.error('Firebase Console → Project Settings → Service Accounts → Generate new key.');
  process.exit(1);
}

const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require(SA_PATH)) });
const db = admin.firestore();

const seedSrc = readFileSync(join(__dirname, '..', 'apps/cavil/src/seed.js'), 'utf8');
const match = seedSrc.match(/export const seedCards\s*=\s*(\[[\s\S]*\])\s*;?\s*$/);
if (!match) { console.error('Could not parse seedCards from seed.js'); process.exit(1); }
const seedCards = new Function('return ' + match[1])();

async function main() {
  console.log(`Uploading ${seedCards.length} cards to fallacies collection...`);
  let ok = 0, fail = 0;

  for (const card of seedCards) {
    if (!card.id) { console.log(`[skip] card without id`); fail++; continue; }
    try {
      await db.collection('fallacies').doc(card.id).set(card);
      console.log(`[ok ] ${String(card.order).padStart(2)}  ${card.id}`);
      ok++;
    } catch (e) {
      console.error(`[fail] ${card.id}: ${e.message}`);
      fail++;
    }
  }

  console.log(`\nDone: ${ok} uploaded, ${fail} failed.`);
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
