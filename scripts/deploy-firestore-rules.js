#!/usr/bin/env node
// deploy-firestore-rules.js — деплой firestore.rules в Firebase через Admin SDK.
// Использует тот же serviceAccount.json что и upload-seed.js.
//
//   node scripts/deploy-firestore-rules.js

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
const RULES_FILE = path.join(__dirname, '..', 'firestore.rules');

if (!fs.existsSync(SERVICE_ACCOUNT)) {
  console.error('Missing serviceAccount.json in workspace root.');
  process.exit(1);
}
if (!fs.existsSync(RULES_FILE)) {
  console.error('Missing firestore.rules');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(require(SERVICE_ACCOUNT))
});

(async () => {
  const source = fs.readFileSync(RULES_FILE, 'utf8');
  console.log(`Deploying ${source.length} chars of rules…`);
  const ruleset = await admin.securityRules().releaseFirestoreRulesetFromSource(source);
  console.log('Released ruleset:', ruleset.name);
  console.log('Created at:', ruleset.createTime);
  process.exit(0);
})().catch(err => {
  console.error('Deploy failed:', err.message || err);
  process.exit(1);
});
