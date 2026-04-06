-- ============================================================
-- Fix match kickoff times: BST → UTC  (subtract 1 hour)
-- The 005 migration stored Sky Sports BST times verbatim;
-- WC2026 runs during BST (UTC+1), so every time needs -1h.
-- ============================================================

UPDATE matches
SET kickoff = kickoff - INTERVAL '1 hour'
WHERE tournament_id = 1;
