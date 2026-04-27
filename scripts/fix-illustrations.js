#!/usr/bin/env node
// fix-illustrations.js — добавляет illustration block в карточки, у которых
// есть card.illustration_ref на верхнем уровне, но нет соответствующего block
// в blocks массиве. Block вставляется ПОСЛЕ subtitle (или после hook если нет
// subtitle), как принято в существующих карточках.
//
// Также генерирует осмысленный alt-текст из card.title.
//
//   node scripts/fix-illustrations.js
// или с --dry-run чтобы только показать что будет изменено.

const fs = require('fs');
const path = require('path');

const DRY = process.argv.includes('--dry-run');
const SEED_DIR = path.join(__dirname, '..', 'content', 'seed');

// Алиасы slug'ов — должны соответствовать
// apps/mental-models/illustrations/index.js
const FALLBACK_BY_CARD_ID = {
  availability_heuristic: 'availability_heuristic',
  banach_tarski:          'banach_tarski',
  dunbar_number:          'dunbar_number',
  goodharts_law:          'goodharts_law',
  platos_cave:            'platos_cave',
  pyrrhonism:             'pyrrhonism',
  recency_bias:           'recency_bias',
  schelling_point:        'schelling_point',
  veil_of_ignorance:      'veil_of_ignorance',
  zenos_paradox:          'zenos_paradox'
};

const ALT_BY_CARD_ID = {
  ru: {
    availability_heuristic: 'Свежие громкие события заслоняют статистику — мозг тянется к тому, что легче вспомнить',
    banach_tarski:          'Один шар разбирается на конечное число частей и собирается в два шара того же размера',
    dunbar_number:          '150 — мягкий потолок круга устойчивых социальных связей',
    goodharts_law:          'Когда метрика становится целью, она перестаёт быть хорошей метрикой',
    platos_cave:            'Тени на стене пещеры — единственная реальность, известная узникам',
    pyrrhonism:             'Воздержание от суждения как путь к спокойствию ума',
    recency_bias:           'Последнее событие весит больше всех предыдущих вместе взятых',
    schelling_point:        'Точка фокуса — то, что выбирают без предварительной коммуникации',
    veil_of_ignorance:      'Принципы общества выбираются за вуалью, скрывающей твоё место в нём',
    zenos_paradox:          'Бесконечное деление расстояния — Ахиллес никогда не догонит черепаху'
  },
  en: {
    availability_heuristic: 'Recent vivid events overshadow statistics — the mind reaches for what comes to mind first',
    banach_tarski:          'One ball decomposed into a finite number of pieces, reassembled into two identical balls',
    dunbar_number:          '150 — the soft ceiling of stable social ties',
    goodharts_law:          'When a measure becomes a target, it ceases to be a good measure',
    platos_cave:            'Shadows on the cave wall — the only reality the prisoners have ever known',
    pyrrhonism:             'Suspending judgment as a path to peace of mind',
    recency_bias:           'The latest event weighs more than all previous ones combined',
    schelling_point:        'A focal point — what people converge to without prior communication',
    veil_of_ignorance:      'Society principles chosen behind a veil that hides your place in it',
    zenos_paradox:          'Infinite division of distance — Achilles never catches the tortoise'
  }
};

let updated = 0;
let skipped = 0;

function findInsertIndex(blocks) {
  // Хотим: после subtitle (типичная позиция). Если нет — после hook.
  const subIdx = blocks.findIndex(b => b.type === 'subtitle');
  if (subIdx >= 0) return subIdx + 1;
  const hookIdx = blocks.findIndex(b => b.type === 'hook');
  if (hookIdx >= 0) return hookIdx + 1;
  return 0;
}

for (const file of fs.readdirSync(SEED_DIR).filter(f => f.endsWith('.json'))) {
  const filepath = path.join(SEED_DIR, file);
  const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));

  // Skip deep cards и карточки без illustration_ref
  if (file.endsWith('_deep.json')) { skipped++; continue; }
  if (!data.illustration_ref) { skipped++; continue; }

  const ruBlocks = data.i18n?.ru?.blocks;
  const enBlocks = data.i18n?.en?.blocks;
  if (!ruBlocks || !enBlocks) { skipped++; continue; }

  // Уже есть illustration block — пропускаем
  if (ruBlocks.some(b => b.type === 'illustration') &&
      enBlocks.some(b => b.type === 'illustration')) {
    skipped++;
    continue;
  }

  const slug = FALLBACK_BY_CARD_ID[data.id] || data.id;
  const ref = `bundle://illustrations/${slug}.svg`;
  const altRu = ALT_BY_CARD_ID.ru[data.id] || data.id;
  const altEn = ALT_BY_CARD_ID.en[data.id] || data.id;

  const ruIdx = findInsertIndex(ruBlocks);
  const enIdx = findInsertIndex(enBlocks);

  ruBlocks.splice(ruIdx, 0, { type: 'illustration', props: { ref, alt: altRu } });
  enBlocks.splice(enIdx, 0, { type: 'illustration', props: { ref, alt: altEn } });
  data.illustration_ref = ref;

  console.log(`+ ${data.id} → illustration block at index ${ruIdx} with slug "${slug}"`);
  updated++;

  if (!DRY) {
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  }
}

console.log(`\nUpdated: ${updated}, skipped: ${skipped}${DRY ? ' (DRY RUN — no files written)' : ''}`);
