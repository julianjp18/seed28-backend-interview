/**
 * Bull Score weights (formula: growth*W1 + calvingEase*W2 + ...).
 * Used in BullsService.calculateBullScore and in the SQL query of BullsRepository.
 */
export const BULL_SCORE_WEIGHTS = {
  GROWTH: 0.3,
  CALVING_EASE: 0.25,
  REPRODUCTION: 0.2,
  MODERATION: 0.15,
  CARCASS: 0.1,
} as const;
