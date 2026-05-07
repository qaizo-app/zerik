// Маппинг card.id → SVG-компонент. Используется BiasCard для рендера
// иллюстрации на back-стороне. Карточки без иллюстрации просто рендерятся
// без неё (illustration is optional).

import ConfirmationBias    from './ConfirmationBias';
import AnchoringEffect     from './AnchoringEffect';
import DunningKruger       from './DunningKruger';
import SurvivorshipBias    from './SurvivorshipBias';
import SunkCostFallacy     from './SunkCostFallacy';
import HindsightBias       from './HindsightBias';
import HaloEffect          from './HaloEffect';
import BandwagonEffect     from './BandwagonEffect';
import FramingEffect       from './FramingEffect';
import LossAversion        from './LossAversion';
import IkeaEffect          from './IkeaEffect';
import SpotlightEffect     from './SpotlightEffect';
import NegativityBias      from './NegativityBias';
import AuthorityBias       from './AuthorityBias';
import ChoiceOverload      from './ChoiceOverload';
import PeakEndRule         from './PeakEndRule';
import IllusionOfControl   from './IllusionOfControl';
import BackfireEffect      from './BackfireEffect';
import ZeroSumBias         from './ZeroSumBias';
import MereExposureEffect  from './MereExposureEffect';

const ILLUSTRATIONS = {
  'confirmation-bias':     ConfirmationBias,
  'anchoring-effect':      AnchoringEffect,
  'dunning-kruger':        DunningKruger,
  'survivorship-bias':     SurvivorshipBias,
  'sunk-cost-fallacy':     SunkCostFallacy,
  'hindsight-bias':        HindsightBias,
  'halo-effect':           HaloEffect,
  'bandwagon-effect':      BandwagonEffect,
  'framing-effect':        FramingEffect,
  'loss-aversion':         LossAversion,
  'ikea-effect':           IkeaEffect,
  'spotlight-effect':      SpotlightEffect,
  'negativity-bias':       NegativityBias,
  'authority-bias':        AuthorityBias,
  'choice-overload':       ChoiceOverload,
  'peak-end-rule':         PeakEndRule,
  'illusion-of-control':   IllusionOfControl,
  'backfire-effect':       BackfireEffect,
  'zero-sum-bias':         ZeroSumBias,
  'mere-exposure-effect':  MereExposureEffect,
};

export function getIllustrationFor(cardId) {
  return ILLUSTRATIONS[cardId] || null;
}
