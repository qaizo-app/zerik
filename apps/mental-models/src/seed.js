// Локальный seed для разработки. В продакшене карточки приходят из Firestore
// через ContentService. Этот массив — то, что движок рендерит до подключения
// бэкенда.

import confirmation from '@content/seed/confirmation_bias.json';
import firstPrinc   from '@content/seed/first_principles.json';
import inversion    from '@content/seed/inversion.json';
import trolley      from '@content/seed/trolley_problem.json';
import montyHall    from '@content/seed/monty_hall.json';
import sunkCost     from '@content/seed/sunk_cost.json';
import occamRazor   from '@content/seed/occam_razor.json';
import dunningKruger from '@content/seed/dunning_kruger.json';
import anchoring    from '@content/seed/anchoring.json';
import pareto       from '@content/seed/pareto_principle.json';
import theseus      from '@content/seed/theseus_ship.json';
import simpsons     from '@content/seed/simpsons_paradox.json';

export const seedCards = [
  simpsons,        // 2026-04-30 — newest first
  theseus,         // 2026-04-29
  pareto,          // 2026-04-28
  anchoring,       // 2026-04-27
  dunningKruger,   // 2026-04-26
  occamRazor,      // 2026-04-25
  sunkCost,        // 2026-04-24
  montyHall,       // 2026-04-23
  trolley,         // 2026-04-22
  inversion,       // 2026-04-21
  firstPrinc,      // 2026-04-20
  confirmation     // 2026-04-19
];
