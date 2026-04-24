-- Seed sweepstake_prizes from existing payout_structure values.
-- All sweepstakes with payout_structure = 'winner' get first_place.
-- All sweepstakes with payout_structure = 'top_3' get first, second, and third.
-- Amounts are left null — organisers can set them in settings.
-- ON CONFLICT DO NOTHING is safe to re-run.

INSERT INTO sweepstake_prizes (sweepstake_id, prize_type)
SELECT id, 'first_place'
FROM sweepstakes
WHERE payout_structure IN ('winner', 'top_3')
ON CONFLICT (sweepstake_id, prize_type) DO NOTHING;

INSERT INTO sweepstake_prizes (sweepstake_id, prize_type)
SELECT id, 'second_place'
FROM sweepstakes
WHERE payout_structure = 'top_3'
ON CONFLICT (sweepstake_id, prize_type) DO NOTHING;

INSERT INTO sweepstake_prizes (sweepstake_id, prize_type)
SELECT id, 'third_place'
FROM sweepstakes
WHERE payout_structure = 'top_3'
ON CONFLICT (sweepstake_id, prize_type) DO NOTHING;
