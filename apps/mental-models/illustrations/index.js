// Регистрация иллюстраций приложения. Вызывается один раз при старте App.js.
// Каждая иллюстрация — React-компонент, рендеримый через react-native-svg,
// получает palette из категорийной темы карточки.

import { registerIllustration } from '@engine';
import SunkCost          from './SunkCost';
import OccamRazor        from './OccamRazor';
import ConfirmationBias  from './ConfirmationBias';
import FirstPrinciples   from './FirstPrinciples';
import Inversion         from './Inversion';
import Trolley           from './Trolley';
import MontyHall         from './MontyHall';
import DunningKruger     from './DunningKruger';
import Anchoring         from './Anchoring';
import Pareto            from './Pareto';
import Theseus           from './Theseus';
import Simpson           from './Simpson';
import Hindsight         from './Hindsight';
import Survivorship      from './Survivorship';
import LossAversion      from './LossAversion';
import Hanlon            from './Hanlon';
import SecondOrder       from './SecondOrder';
import BrainVat          from './BrainVat';

export function registerAppIllustrations() {
  // Карточки со своей собственной SVG (18 шт)
  registerIllustration('sunk_cost',         SunkCost);
  registerIllustration('occam_razor',       OccamRazor);
  registerIllustration('confirmation_bias', ConfirmationBias);
  registerIllustration('first_principles',  FirstPrinciples);
  registerIllustration('inversion',         Inversion);
  registerIllustration('trolley',           Trolley);
  registerIllustration('monty_hall',        MontyHall);
  registerIllustration('dunning_kruger',    DunningKruger);
  registerIllustration('anchoring',         Anchoring);
  registerIllustration('pareto',            Pareto);
  registerIllustration('theseus',           Theseus);
  registerIllustration('simpson',           Simpson);
  registerIllustration('hindsight',         Hindsight);
  registerIllustration('survivorship',      Survivorship);
  registerIllustration('survivorship_bias', Survivorship);
  registerIllustration('loss_aversion',     LossAversion);
  registerIllustration('hanlon',            Hanlon);
  registerIllustration('hanlon_razor',      Hanlon);
  registerIllustration('second_order',      SecondOrder);
  registerIllustration('brain_vat',         BrainVat);
  registerIllustration('brain_in_vat',      BrainVat);

  // Aliases для оставшихся 11 карточек — каждая алиасит на УНИКАЛЬНУЮ SVG,
  // чтобы ни одна SVG не использовалась 3+ раз и соседние карточки не повторялись.
  registerIllustration('availability_heuristic', Pareto);          // pareto_principle
  registerIllustration('recency_bias',           Anchoring);       // anchoring
  registerIllustration('schelling_point',        Theseus);         // theseus_ship
  registerIllustration('pyrrhonism',             ConfirmationBias);// confirmation_bias
  registerIllustration('goodharts_law',          LossAversion);    // loss_aversion (метрика ≈ потеря смысла)
  registerIllustration('dunbar_number',          Simpson);         // simpsons_paradox
  registerIllustration('birthday',               DunningKruger);   // dunning_kruger
  registerIllustration('birthday_paradox',       DunningKruger);
  registerIllustration('zenos_paradox',          MontyHall);       // monty_hall (parodox)
  registerIllustration('banach_tarski',          Inversion);       // inversion (counterintuitive)
  registerIllustration('platos_cave',            Trolley);         // trolley_problem
  registerIllustration('veil_of_ignorance',      FirstPrinciples); // first_principles (этика с нуля)
  registerIllustration('placeholder',            Hanlon);
}
