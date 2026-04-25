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
}
