-- 014_eurovision_grand_final_points.sql
-- Add grand_final_points column to eurovision_results.
-- This stores the country's actual combined jury + public televote score
-- from the Grand Final (e.g. 591 for Eurovision 2024 winner Switzerland).
-- The sweepstake leaderboard uses these real points directly.

ALTER TABLE eurovision_results
  ADD COLUMN IF NOT EXISTS grand_final_points INTEGER;

-- Update the demo data with realistic fictional Grand Final points
-- (based roughly on 2024 scale: winner ~590, last place ~10)
UPDATE eurovision_results er
SET grand_final_points = CASE
  WHEN er.team_id = 111 THEN 547   -- Croatia 🏆 winner
  WHEN er.team_id = 106 THEN 412   -- Italy 2nd
  WHEN er.team_id = 103 THEN 368   -- France 3rd
  WHEN er.team_id = 120 THEN 312   -- Ukraine 4th
  WHEN er.team_id = 108 THEN 280   -- Armenia 5th
  WHEN er.team_id = 124 THEN 251   -- Finland 6th
  WHEN er.team_id = 114 THEN 220   -- Greece 7th
  WHEN er.team_id = 101 THEN 198   -- Austria 8th (host)
  WHEN er.team_id = 107 THEN 175   -- Albania 9th
  WHEN er.team_id = 129 THEN 156   -- Lithuania 10th
  WHEN er.team_id = 117 THEN 132   -- Norway 11th (was 13th by position)
  WHEN er.team_id = 123 THEN 118   -- Denmark 12th
  WHEN er.team_id = 132 THEN 105   -- Netherlands 13th (was 15th by position)
  WHEN er.team_id = 102 THEN  92   -- United Kingdom 14th
  WHEN er.team_id = 113 THEN  78   -- Estonia 15th (was 16th by position)
  WHEN er.team_id = 121 THEN  65   -- Belgium 16th (was 17th by position)
  WHEN er.team_id = 110 THEN  54   -- Azerbaijan 17th (was 20th by position)
  WHEN er.team_id = 105 THEN  43   -- Spain 18th (was 11th by position)
  WHEN er.team_id = 126 THEN  35   -- Ireland 19th (was 19th by position)
  WHEN er.team_id = 104 THEN  28   -- Germany 20th (was 18th by position)
  WHEN er.team_id = 134 THEN  22   -- Portugal 21st (was 21st by position)
  WHEN er.team_id = 118 THEN  17   -- Serbia 22nd (was 22nd by position)
  WHEN er.team_id = 128 THEN  14   -- Latvia 23rd (was 23rd by position)
  WHEN er.team_id = 131 THEN  11   -- Malta 24th (was 24th by position)
  WHEN er.team_id = 119 THEN   8   -- Slovenia 25th (was 25th by position)
  WHEN er.team_id = 135 THEN   5   -- Sweden 26th (last)
  ELSE NULL
END
WHERE er.sweepstake_id = (SELECT id FROM sweepstakes WHERE share_token = 'demoeurovision')
  AND er.qualified = true;
