#!/usr/bin/env node
// upload-seed.js — заливает все content/seed/*.json в Firestore коллекцию
// `models`. Не пушит карточки с release_date в будущем (они появятся
// автоматически когда дата наступит).
//
// Setup:
//   1. Firebase Console → Project Settings → Service Accounts → Generate new private key
//   2. Скачать .json → переименовать в serviceAccount.json
//   3. Положить в КОРЕНЬ workspace (c:\Users\bestc_000\Desktop\Zerik\)
//   4. Убедиться что serviceAccount.json есть в .gitignore (он там)
//   5. Из корня: npm install firebase-admin
//   6. node scripts/upload-seed.js

const fs = require('fs');
const path = require('path');

let admin;
try {
  admin = require('firebase-admin');
} catch (e) {
  console.error('Run: npm install firebase-admin');
  process.exit(1);
}

const SERVICE_ACCOUNT = path.join(__dirname, '..', 'serviceAccount.json');
const SEED_DIR = path.join(__dirname, '..', 'content', 'seed');

if (!fs.existsSync(SERVICE_ACCOUNT)) {
  console.error('Missing serviceAccount.json in workspace root.');
  console.error('Get it from Firebase Console → Project Settings → Service Accounts.');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(require(SERVICE_ACCOUNT))
});

const db = admin.firestore();

async function main() {
  const files = fs.readdirSync(SEED_DIR).filter(f => f.endsWith('.json'));
  console.log(`Found ${files.length} seed files.`);

  let uploaded = 0;
  let skipped = 0;

  for (const f of files) {
    const card = JSON.parse(fs.readFileSync(path.join(SEED_DIR, f), 'utf8'));
    if (!card.id) {
      console.log(`[skip] ${f} — no id`);
      skipped++;
      continue;
    }

    try {
      await db.collection('models').doc(card.id).set(card);
      console.log(`[ok ] ${card.id}  (${card.category}, ${card.release_date})`);
      uploaded++;
    } catch (e) {
      console.error(`[fail] ${card.id}: ${e.message}`);
      skipped++;
    }
  }

  console.log(`\nUploaded ${uploaded}, skipped ${skipped}.`);
  console.log('Open Firebase Console → Firestore → models to verify.');
  process.exit(0);
}

main().catch(err => {
  console.error('Upload failed:', err);
  process.exit(1);
});
