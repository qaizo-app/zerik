#!/usr/bin/env node
// deploy-firestore-rules-biased.mjs — деплой apps/biased/firestore.rules через Admin SDK.
// Использует serviceAccount-biased.json в корне workspace.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readFileSync } from 'fs';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

const SA_PATH    = join(__dirname, '..', 'serviceAccount-biased.json');
const RULES_FILE = join(__dirname, '..', 'apps', 'biased', 'firestore.rules');

if (!existsSync(SA_PATH)) {
  console.error('Missing serviceAccount-biased.json in workspace root.');
  process.exit(1);
}
if (!existsSync(RULES_FILE)) {
  console.error('Missing apps/biased/firestore.rules');
  process.exit(1);
}

const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require(SA_PATH)) });

(async () => {
  const source = readFileSync(RULES_FILE, 'utf8');
  console.log(`Deploying ${source.length} chars of rules to biased-94cc9…`);
  const ruleset = await admin.securityRules().releaseFirestoreRulesetFromSource(source);
  console.log('Released ruleset:', ruleset.name);
  console.log('Created at:', ruleset.createTime);
  process.exit(0);
})().catch(err => {
  console.error('Deploy failed:', err.message || err);
  process.exit(1);
});
