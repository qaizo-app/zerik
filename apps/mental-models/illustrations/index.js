// Регистрация иллюстраций приложения. Вызывается один раз при старте App.js.
// Каждая иллюстрация — React-компонент, рендеримый через react-native-svg,
// получает palette из категорийной темы карточки.

import { registerIllustration } from '@engine';
import SunkCost   from './SunkCost';
import OccamRazor from './OccamRazor';

export function registerAppIllustrations() {
  registerIllustration('sunk_cost',   SunkCost);
  registerIllustration('occam_razor', OccamRazor);
}
