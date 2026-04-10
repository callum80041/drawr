/**
 * Canonical points values used by both the scoring engine and the UI.
 * Change here and it updates everywhere.
 */
export const POINTS = {
  GROUP_WIN:  3,
  GROUP_DRAW: 1,
  GROUP_LOSS: 0,
  R32_WIN:    5,
  R16_WIN:    8,
  QF_WIN:     12,
  SF_WIN:     15,
  FINAL_WIN:  25,
} as const

export const ROUND_LABELS: Record<string, string> = {
  'Round of 32':   'Round of 32',
  'Round of 16':   'Round of 16',
  'Quarter-final': 'Quarter-final',
  'Semi-final':    'Semi-final',
  'Final':         'Final',
}

// ── Eurovision scoring ───────────────────────────────────────────────────────
// Scoring follows the actual Eurovision Grand Final points system:
//   • Qualifying from a semi-final earns a flat bonus
//   • In the Grand Final, your sweepstake score = your country's real combined
//     jury + public televote points (same drama as watching the scoreboard)
//
// Auto-qualified countries (Big 5 + host) earn the qualification bonus
// automatically since they skip the semi-finals.

export const EUROVISION_SEMI_BONUS = 10  // pts for reaching the Grand Final

export function computeEurovisionPoints(result: {
  qualified: boolean
  final_position: number | null   // kept for display, not used for scoring
  grand_final_points?: number | null
}): number {
  if (!result.qualified) return 0
  // Flat bonus for qualifying (or being auto-qualified)
  let pts = EUROVISION_SEMI_BONUS
  // Add real Grand Final points if available
  if (result.grand_final_points != null) {
    pts += result.grand_final_points
  }
  return pts
}

/** @deprecated Use EUROVISION_SEMI_BONUS + grand_final_points directly */
export const EUROVISION_POINTS = {
  REACH_FINAL: EUROVISION_SEMI_BONUS,
} as const
