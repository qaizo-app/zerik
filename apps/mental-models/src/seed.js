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
import availability     from '@content/seed/availability_heuristic.json';
import recency          from '@content/seed/recency_bias.json';
import goodhart         from '@content/seed/goodharts_law.json';
import schelling        from '@content/seed/schelling_point.json';
import zeno             from '@content/seed/zenos_paradox.json';
import platosCave       from '@content/seed/platos_cave.json';
import veil             from '@content/seed/veil_of_ignorance.json';
import banachTarski     from '@content/seed/banach_tarski.json';
import pyrrhonism       from '@content/seed/pyrrhonism.json';
import dunbar           from '@content/seed/dunbar_number.json';
import milgram          from '@content/seed/milgram_experiment.json';
import framingEffect    from '@content/seed/framing_effect.json';
import strawMan         from '@content/seed/straw_man.json';
import circleCompetence from '@content/seed/circle_of_competence.json';
import sorites          from '@content/seed/sorites_paradox.json';
import antifragile      from '@content/seed/antifragile.json';
import cogDissonance    from '@content/seed/cognitive_dissonance.json';
import bandwagon        from '@content/seed/bandwagon_effect.json';
import chineseRoom      from '@content/seed/chinese_room.json';
import falseDichotomy   from '@content/seed/false_dichotomy.json';
import mapTerritory     from '@content/seed/map_and_territory.json';
import russellParadox   from '@content/seed/russell_paradox.json';
import mementoMori      from '@content/seed/stoic_memento_mori.json';
import hawthorneEffect  from '@content/seed/hawthorne_effect.json';
import statusQuoBias    from '@content/seed/status_quo_bias.json';

// Все известные deep-карточки. Соглашение: id оканчивается на `_deep`,
// привязка к parent — по prefix (вырезаем '_deep' из id).
// Чтобы добавить новую: создать <id>_deep.json в content/seed/, импортировать
// сверху и пушнуть в этот массив.
const deepCardList = [
  sunkCostDeep,
  occamRazorDeep
];
const deepCardsByParentId = Object.fromEntries(
  deepCardList
    .filter(c => c?.id?.endsWith('_deep'))
    .map(c => [c.id.replace(/_deep$/, ''), c])
);

export function resolveLevels(card) {
  if (!card) return [];
  const out = [{ level: 1, card }];
  const deep = deepCardsByParentId[card.id];
  if (deep) out.push({ level: 2, card: deep });
  return out;
}

// Сортировка по release_date — новейшие первыми. ContentService отдаёт
// только release_date <= today, остальные показываются когда дата наступит.
export const seedCards = [
  statusQuoBias,     // 2026-05-27
  hawthorneEffect,   // 2026-05-26
  mementoMori,       // 2026-05-25
  russellParadox,    // 2026-05-24
  mapTerritory,      // 2026-05-23
  falseDichotomy,    // 2026-05-22
  chineseRoom,       // 2026-05-21
  bandwagon,         // 2026-05-20
  cogDissonance,     // 2026-05-19
  antifragile,       // 2026-05-18
  sorites,           // 2026-05-17
  circleCompetence,  // 2026-05-16
  strawMan,          // 2026-05-15
  framingEffect,     // 2026-05-14
  milgram,           // 2026-05-13
  dunbar,            // 2026-05-12
  pyrrhonism,        // 2026-05-11
  banachTarski,      // 2026-05-10
  veil,              // 2026-05-09
  platosCave,        // 2026-05-08
  zeno,              // 2026-05-07
  schelling,         // 2026-05-06
  goodhart,          // 2026-05-05
  brainInVat,        // 2026-05-04
  birthday,          // 2026-05-03
  secondOrder,       // 2026-05-02
  hanlon,            // 2026-05-01
  simpsons,          // 2026-04-30
  theseus,           // 2026-04-29
  pareto,            // 2026-04-28
  anchoring,         // 2026-04-27
  survivorship,      // 2026-04-26
  dunningKruger,     // 2026-04-26
  occamRazor,        // 2026-04-25
  sunkCost,          // 2026-04-24
  montyHall,         // 2026-04-23
  hindsight,         // 2026-04-22
  trolley,           // 2026-04-22
  inversion,         // 2026-04-21
  lossAversion,      // 2026-04-21
  firstPrinc,        // 2026-04-20
  confirmation,      // 2026-04-19
  availability,      // 2026-04-18
  recency            // 2026-04-17
];
