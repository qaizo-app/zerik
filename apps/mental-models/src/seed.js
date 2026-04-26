// Локальный seed для разработки. В продакшене карточки приходят из Firestore
// через ContentService. Этот массив — то, что движок рендерит до подключения
// бэкенда.

import confirmation     from '@content/seed/confirmation_bias.json';
import firstPrinc       from '@content/seed/first_principles.json';
import inversion        from '@content/seed/inversion.json';
import trolley          from '@content/seed/trolley_problem.json';
import montyHall        from '@content/seed/monty_hall.json';
import sunkCost         from '@content/seed/sunk_cost.json';
import sunkCostDeep     from '@content/seed/sunk_cost_deep.json';
import occamRazor       from '@content/seed/occam_razor.json';
import occamRazorDeep   from '@content/seed/occam_razor_deep.json';
import dunningKruger    from '@content/seed/dunning_kruger.json';
import anchoring        from '@content/seed/anchoring.json';
import pareto           from '@content/seed/pareto_principle.json';
import theseus          from '@content/seed/theseus_ship.json';
import simpsons         from '@content/seed/simpsons_paradox.json';
import survivorship     from '@content/seed/survivorship_bias.json';
import lossAversion     from '@content/seed/loss_aversion.json';
import hindsight        from '@content/seed/hindsight_bias.json';
import hanlon           from '@content/seed/hanlon_razor.json';
import secondOrder      from '@content/seed/second_order.json';
import birthday         from '@content/seed/birthday_paradox.json';
import brainInVat       from '@content/seed/brain_in_vat.json';

// Карта уровней — приложение прокидывает её в CardStackScreen.resolveLevels.
// Корневая карточка имеет level: 1, deep — level: 2 (и т.д.).
const deepCards = {
  sunk_cost:   sunkCostDeep,
  occam_razor: occamRazorDeep
};

export function resolveLevels(card) {
  if (!card) return [];
  const out = [{ level: 1, card }];
  const deep = deepCards[card.id];
  if (deep) out.push({ level: 2, card: deep });
  return out;
}

// Сортировка по release_date — новейшие первыми. ContentService отдаёт
// только release_date <= today, остальные показываются когда дата наступит.
export const seedCards = [
  brainInVat,      // 2026-05-04
  birthday,        // 2026-05-03
  secondOrder,     // 2026-05-02
  hanlon,          // 2026-05-01
  simpsons,        // 2026-04-30
  theseus,         // 2026-04-29
  pareto,          // 2026-04-28
  anchoring,       // 2026-04-27
  survivorship,    // 2026-04-26
  dunningKruger,   // 2026-04-26
  occamRazor,      // 2026-04-25
  sunkCost,        // 2026-04-24
  montyHall,       // 2026-04-23
  hindsight,       // 2026-04-22
  trolley,         // 2026-04-22
  inversion,       // 2026-04-21
  lossAversion,    // 2026-04-21
  firstPrinc,      // 2026-04-20
  confirmation     // 2026-04-19
];
