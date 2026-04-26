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

export function registerAppIllustrations() {
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

  registerIllustration('hindsight',              ConfirmationBias);
  registerIllustration('loss_aversion',          SunkCost);
  registerIllustration('survivorship_bias',      ConfirmationBias);
  registerIllustration('availability_heuristic', Anchoring);
  registerIllustration('recency_bias',           Anchoring);
  registerIllustration('hanlon_razor',           OccamRazor);
  registerIllustration('second_order',           FirstPrinciples);
  registerIllustration('birthday_paradox',       MontyHall);
  registerIllustration('brain_in_vat',           Trolley);
  registerIllustration('goodharts_law',          Pareto);
  registerIllustration('schelling_point',        FirstPrinciples);
  registerIllustration('pyrrhonism',             FirstPrinciples);
  registerIllustration('dunbar_number',          Pareto);
  registerIllustration('zenos_paradox',          MontyHall);
  registerIllustration('platos_cave',            Trolley);
  registerIllustration('veil_of_ignorance',      Trolley);
  registerIllustration('banach_tarski',          MontyHall);
  registerIllustration('placeholder',            ConfirmationBias);
}
