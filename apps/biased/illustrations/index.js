// Mapping card.id → SVG component. BiasCard renders it on the back side.
// Cards without an illustration render without one (optional).

import ConfirmationBias       from './ConfirmationBias';
import AnchoringEffect        from './AnchoringEffect';
import DunningKruger          from './DunningKruger';
import SurvivorshipBias       from './SurvivorshipBias';
import AvailabilityHeuristic  from './AvailabilityHeuristic';
import SunkCostFallacy        from './SunkCostFallacy';
import FramingEffect          from './FramingEffect';
import BandwagonEffect        from './BandwagonEffect';
import HindsightBias          from './HindsightBias';
import HaloEffect             from './HaloEffect';
import StatusQuoBias          from './StatusQuoBias';
import FundamentalAttributionError from './FundamentalAttributionError';
import PlanningFallacy        from './PlanningFallacy';
import CurseOfKnowledge       from './CurseOfKnowledge';
import GamblersFallacy        from './GamblersFallacy';
import LossAversion           from './LossAversion';
import IkeaEffect             from './IkeaEffect';
import SpotlightEffect        from './SpotlightEffect';
import FalseConsensusEffect   from './FalseConsensusEffect';
import RecencyBias            from './RecencyBias';
import OptimismBias           from './OptimismBias';
import SelfServingBias        from './SelfServingBias';
import InGroupBias            from './InGroupBias';
import NormalcyBias           from './NormalcyBias';
import ZeroRiskBias           from './ZeroRiskBias';
import HyperbolicDiscounting  from './HyperbolicDiscounting';
import BystanderEffect        from './BystanderEffect';
import FrequencyIllusion      from './FrequencyIllusion';
import NegativityBias         from './NegativityBias';
import ChoiceOverload         from './ChoiceOverload';
import AuthorityBias          from './AuthorityBias';
import ScarcityIllusion       from './ScarcityIllusion';
import HotHandFallacy         from './HotHandFallacy';
import PeakEndRule            from './PeakEndRule';
import MentalAccounting       from './MentalAccounting';
import DecoyEffect            from './DecoyEffect';
import ActionBias             from './ActionBias';
import ClusteringIllusion     from './ClusteringIllusion';
import BeliefPerseverance     from './BeliefPerseverance';
import OstrichEffect          from './OstrichEffect';
import IllusionOfControl      from './IllusionOfControl';
import BackfireEffect         from './BackfireEffect';
import ZeroSumBias            from './ZeroSumBias';
import MereExposureEffect     from './MereExposureEffect';

const ILLUSTRATIONS = {
  'confirmation-bias':              ConfirmationBias,
  'anchoring-effect':               AnchoringEffect,
  'dunning-kruger':                 DunningKruger,
  'survivorship-bias':              SurvivorshipBias,
  'availability-heuristic':         AvailabilityHeuristic,
  'sunk-cost-fallacy':              SunkCostFallacy,
  'framing-effect':                 FramingEffect,
  'bandwagon-effect':               BandwagonEffect,
  'hindsight-bias':                 HindsightBias,
  'halo-effect':                    HaloEffect,
  'status-quo-bias':                StatusQuoBias,
  'fundamental-attribution-error':  FundamentalAttributionError,
  'planning-fallacy':               PlanningFallacy,
  'curse-of-knowledge':             CurseOfKnowledge,
  'gamblers-fallacy':               GamblersFallacy,
  'loss-aversion':                  LossAversion,
  'ikea-effect':                    IkeaEffect,
  'spotlight-effect':               SpotlightEffect,
  'false-consensus-effect':         FalseConsensusEffect,
  'recency-bias':                   RecencyBias,
  'optimism-bias':                  OptimismBias,
  'self-serving-bias':              SelfServingBias,
  'in-group-bias':                  InGroupBias,
  'normalcy-bias':                  NormalcyBias,
  'zero-risk-bias':                 ZeroRiskBias,
  'hyperbolic-discounting':         HyperbolicDiscounting,
  'bystander-effect':               BystanderEffect,
  'frequency-illusion':             FrequencyIllusion,
  'negativity-bias':                NegativityBias,
  'choice-overload':                ChoiceOverload,
  'authority-bias':                 AuthorityBias,
  'scarcity-illusion':              ScarcityIllusion,
  'hot-hand-fallacy':               HotHandFallacy,
  'peak-end-rule':                  PeakEndRule,
  'mental-accounting':              MentalAccounting,
  'decoy-effect':                   DecoyEffect,
  'action-bias':                    ActionBias,
  'clustering-illusion':            ClusteringIllusion,
  'belief-perseverance':            BeliefPerseverance,
  'ostrich-effect':                 OstrichEffect,
  'illusion-of-control':            IllusionOfControl,
  'backfire-effect':                BackfireEffect,
  'zero-sum-bias':                  ZeroSumBias,
  'mere-exposure-effect':           MereExposureEffect,
};

export function getIllustrationFor(cardId) {
  return ILLUSTRATIONS[cardId] || null;
}
