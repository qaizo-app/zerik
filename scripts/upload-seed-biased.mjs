#!/usr/bin/env node
// upload-seed-biased.mjs — заливает все карточки из apps/biased/src/seed.js
// в Firestore (проект biased-94cc9, коллекция biases).
//
// Setup:
//   1. Firebase Console → biased-94cc9 → Project Settings → Service Accounts → Generate key
//   2. Сохранить как serviceAccount-biased.json в корень workspace
//   3. npm run seed:upload:biased

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readFileSync } from 'fs';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

const SA_PATH = join(__dirname, '..', 'serviceAccount-biased.json');
if (!existsSync(SA_PATH)) {
  console.error('Missing serviceAccount-biased.json in workspace root.');
  console.error('Firebase Console (biased-94cc9) → Project Settings → Service Accounts → Generate new key.');
  process.exit(1);
}

const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require(SA_PATH)) });
const db = admin.firestore();

// seed.js uses ESM syntax — parse as text to avoid module type issues
const seedSrc = readFileSync(join(__dirname, '..', 'apps/biased/src/seed.js'), 'utf8');
const match = seedSrc.match(/export const seedCards\s*=\s*(\[[\s\S]*\])\s*;?\s*$/);
if (!match) { console.error('Could not parse seedCards from seed.js'); process.exit(1); }
const seedCards = new Function('return ' + match[1])();

async function main() {
  console.log(`Uploading ${seedCards.length} cards to biased-94cc9/biases...`);
  let ok = 0, fail = 0;

  for (const card of seedCards) {
    if (!card.id) { console.log(`[skip] card without id`); fail++; continue; }
    try {
      await db.collection('biases').doc(card.id).set(card);
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
