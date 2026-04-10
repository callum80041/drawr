-- 015_fix_eurovision_countries.sql
-- Correct the Eurovision 2026 country list to match the official entries:
-- https://www.eurovision.com/stories/eurovision-vienna-2026-all-35-songs/
--
-- Removing (not participating in ESC 2026):
--   105 Spain, 115 Iceland, 119 Slovenia, 126 Ireland, 132 Netherlands
--
-- Adding:
--   136 Bulgaria (SF1), 137 Montenegro (SF2), 138 Romania (SF1)
--   139 San Marino (SF2), 140 Switzerland (SF2)

-- ── 1. Add the 5 new countries ─────────────────────────────────────────────
INSERT INTO teams (id, tournament_id, name, flag, semi_final) VALUES
  (136, 2, 'Bulgaria',    '🇧🇬', 1),
  (137, 2, 'Montenegro',  '🇲🇪', 2),
  (138, 2, 'Romania',     '🇷🇴', 1),
  (139, 2, 'San Marino',  '🇸🇲', 2),
  (140, 2, 'Switzerland', '🇨🇭', 2)
ON CONFLICT (id) DO NOTHING;

-- ── 2. Fix the demo sweepstake assignments ─────────────────────────────────
-- Remap the 5 removed countries to the 5 new ones in the demo sweepstake
DO $$
DECLARE sw_id UUID;
BEGIN
  SELECT id INTO sw_id FROM sweepstakes WHERE share_token = 'demoeurovision' LIMIT 1;
  IF sw_id IS NULL THEN RETURN; END IF;

  -- Spain → Bulgaria
  UPDATE assignments
    SET team_id = 136, team_name = 'Bulgaria', team_flag = '🇧🇬'
    WHERE sweepstake_id = sw_id AND team_id = 105;

  -- Iceland → Montenegro
  UPDATE assignments
    SET team_id = 137, team_name = 'Montenegro', team_flag = '🇲🇪'
    WHERE sweepstake_id = sw_id AND team_id = 115;

  -- Slovenia → Romania
  UPDATE assignments
    SET team_id = 138, team_name = 'Romania', team_flag = '🇷🇴'
    WHERE sweepstake_id = sw_id AND team_id = 119;

  -- Ireland → San Marino
  UPDATE assignments
    SET team_id = 139, team_name = 'San Marino', team_flag = '🇸🇲'
    WHERE sweepstake_id = sw_id AND team_id = 126;

  -- Netherlands → Switzerland
  UPDATE assignments
    SET team_id = 140, team_name = 'Switzerland', team_flag = '🇨🇭'
    WHERE sweepstake_id = sw_id AND team_id = 132;

  -- Fix existing demo results: remap old team_ids in eurovision_results
  UPDATE eurovision_results SET team_id = 136 WHERE sweepstake_id = sw_id AND team_id = 105;
  UPDATE eurovision_results SET team_id = 137 WHERE sweepstake_id = sw_id AND team_id = 115;
  UPDATE eurovision_results SET team_id = 138 WHERE sweepstake_id = sw_id AND team_id = 119;
  UPDATE eurovision_results SET team_id = 139 WHERE sweepstake_id = sw_id AND team_id = 126;
  UPDATE eurovision_results SET team_id = 140 WHERE sweepstake_id = sw_id AND team_id = 132;

  -- Add demo results for the new countries (replacing the removed ones' results)
  -- Bulgaria (136) — qualified SF1
  INSERT INTO eurovision_results (sweepstake_id, team_id, qualified, final_position, grand_final_points)
    VALUES (sw_id, 136, true, 16, 72)
    ON CONFLICT (sweepstake_id, team_id) DO NOTHING;

  -- Montenegro (137) — eliminated SF2
  INSERT INTO eurovision_results (sweepstake_id, team_id, qualified, final_position, grand_final_points)
    VALUES (sw_id, 137, false, null, null)
    ON CONFLICT (sweepstake_id, team_id) DO NOTHING;

  -- Romania (138) — eliminated SF1
  INSERT INTO eurovision_results (sweepstake_id, team_id, qualified, final_position, grand_final_points)
    VALUES (sw_id, 138, false, null, null)
    ON CONFLICT (sweepstake_id, team_id) DO NOTHING;

  -- San Marino (139) — eliminated SF2
  INSERT INTO eurovision_results (sweepstake_id, team_id, qualified, final_position, grand_final_points)
    VALUES (sw_id, 139, false, null, null)
    ON CONFLICT (sweepstake_id, team_id) DO NOTHING;

  -- Switzerland (140) — qualified SF2, 18th in final
  INSERT INTO eurovision_results (sweepstake_id, team_id, qualified, final_position, grand_final_points)
    VALUES (sw_id, 140, true, 18, 48)
    ON CONFLICT (sweepstake_id, team_id) DO NOTHING;
END $$;

-- ── 3. Remove the 5 withdrawn countries ────────────────────────────────────
-- Delete from teams AFTER remapping (safe — no FK refs left in demo)
-- NOTE: only safe if no real sweepstakes reference these team_ids.
-- Assignments + results were remapped above; remove demo orphan results first.
DO $$
DECLARE sw_id UUID;
BEGIN
  SELECT id INTO sw_id FROM sweepstakes WHERE share_token = 'demoeurovision' LIMIT 1;
  IF sw_id IS NOT NULL THEN
    DELETE FROM eurovision_results WHERE sweepstake_id = sw_id AND team_id IN (105, 115, 119, 126, 132);
  END IF;
END $$;

DELETE FROM teams WHERE tournament_id = 2 AND id IN (105, 115, 119, 126, 132);
