// Регистрация продуктовых блоков Senik. Вызывается на старте App.js.
// Эти типы блоков нужны не всем продуктам линейки — поэтому регистрируются
// приложением, не движком.

import { registerBlock } from '@engine';
import HistoricalDataBlock from './HistoricalDataBlock';
import RiddleRevealBlock   from './RiddleRevealBlock';

export function registerAppBlocks() {
  registerBlock('historical_data', HistoricalDataBlock);
  registerBlock('riddle_reveal',   RiddleRevealBlock);
}
