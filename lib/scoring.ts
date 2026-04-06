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
