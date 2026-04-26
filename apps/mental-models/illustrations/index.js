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

  // Aliases: каждая карточка без собственной SVG получает SVG близкой темы.
  // Стараемся не давать одну и ту же SVG соседним карточкам в линейке.
  registerIllustration('hindsight',              DunningKruger);
  registerIllustration('survivorship',           Simpson);
  registerIllustration('survivorship_bias',      Simpson);
  registerIllustration('availability_heuristic', Pareto);
  registerIllustration('recency_bias',           Anchoring);
  registerIllustration('loss_aversion',          SunkCost);
  registerIllustration('hanlon',                 OccamRazor);
  registerIllustration('hanlon_razor',           OccamRazor);
  registerIllustration('second_order',           Pareto);
  registerIllustration('schelling_point',        Theseus);
  registerIllustration('pyrrhonism',             ConfirmationBias);
  registerIllustration('goodharts_law',          Anchoring);
  registerIllustration('dunbar_number',          Simpson);
  registerIllustration('birthday',               DunningKruger);
  registerIllustration('birthday_paradox',       DunningKruger);
  registerIllustration('zenos_paradox',          Theseus);
  registerIllustration('banach_tarski',          Inversion);
  registerIllustration('brain_vat',              Inversion);
  registerIllustration('brain_in_vat',           Inversion);
  registerIllustration('platos_cave',            ConfirmationBias);
  registerIllustration('veil_of_ignorance',      Trolley);
  registerIllustration('placeholder',            FirstPrinciples);
}
