// Локальный seed для разработки. В продакшене карточки приходят из Firestore
// через ContentService. Этот массив — то, что движок рендерит до подключения
// бэкенда.

import sunkCost   from '@content/seed/sunk_cost.json';
import occamRazor from '@content/seed/occam_razor.json';

export const seedCards = [sunkCost, occamRazor];
