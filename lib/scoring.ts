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
export const EUROVISION_POINTS = {
  REACH_FINAL:     10,  // Country qualifies from semi (or is auto-qualified)
  POSITION_WINNER: 50,  // Grand Final 1st place
  POSITION_TOP3:   20,  // Grand Final 2nd or 3rd
  POSITION_TOP10:  10,  // Grand Final 4th–10th
  POSITION_REST:    5,  // Grand Final 11th–26th
} as const

export function computeEurovisionPoints(result: {
  qualified: boolean
  final_position: number | null
}): number {
  if (!result.qualified) return 0
  let pts = EUROVISION_POINTS.REACH_FINAL
  const pos = result.final_position
  if (pos === null) return pts
  if (pos === 1)       pts += EUROVISION_POINTS.POSITION_WINNER
  else if (pos <= 3)   pts += EUROVISION_POINTS.POSITION_TOP3
  else if (pos <= 10)  pts += EUROVISION_POINTS.POSITION_TOP10
  else                 pts += EUROVISION_POINTS.POSITION_REST
  return pts
}
