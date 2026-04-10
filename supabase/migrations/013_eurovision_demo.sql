-- 013_eurovision_demo.sql
-- Seeds a Eurovision 2026 demo sweepstake with 35 participants (one per country)
-- and fake scores via eurovision_results.

DO $$
DECLARE
  org_id UUID;
  sw_id  UUID;
BEGIN
  -- Find the organiser who owns the existing demo2026 sweepstake
  SELECT organiser_id INTO org_id FROM sweepstakes WHERE share_token = 'demo2026' LIMIT 1;

  IF org_id IS NULL THEN
    RAISE NOTICE 'No demo organiser found — skipping Eurovision demo seed.';
    RETURN;
  END IF;

  -- Create the Eurovision demo sweepstake
  INSERT INTO sweepstakes (
    organiser_id, name, tournament_id, tournament_name,
    sweepstake_type, entry_fee, assignment_mode,
    prize_type, payout_structure, status, plan, share_token,
    draw_completed_at
  ) VALUES (
    org_id,
    'Eurovision 2026 Office Sweepstake',
    2,
    'Eurovision Song Contest 2026',
    'eurovision',
    5.00,
    'random',
    'money',
    'winner',
    'active',
    'free',
    'demoeurovision',
    NOW()
  )
  ON CONFLICT DO NOTHING
  RETURNING id INTO sw_id;

  IF sw_id IS NULL THEN
    SELECT id INTO sw_id FROM sweepstakes WHERE share_token = 'demoeurovision' LIMIT 1;
  END IF;

  IF sw_id IS NULL THEN
    RAISE NOTICE 'Could not create or find Eurovision demo sweepstake.';
    RETURN;
  END IF;

  -- Insert 35 participants (one per country, named after the country for clarity)
  INSERT INTO participants (sweepstake_id, name, email, paid) VALUES
    (sw_id, 'Aaron',     'aaron@demo.test',     true),
    (sw_id, 'Beatrice',  'beatrice@demo.test',  true),
    (sw_id, 'Carlos',    'carlos@demo.test',    true),
    (sw_id, 'Diana',     'diana@demo.test',     true),
    (sw_id, 'Euan',      'euan@demo.test',      true),
    (sw_id, 'Fatima',    'fatima@demo.test',    true),
    (sw_id, 'George',    'george@demo.test',    true),
    (sw_id, 'Helena',    'helena@demo.test',    true),
    (sw_id, 'Ivan',      'ivan@demo.test',      true),
    (sw_id, 'Jasmine',   'jasmine@demo.test',   false),
    (sw_id, 'Kai',       'kai@demo.test',       true),
    (sw_id, 'Laura',     'laura@demo.test',     true),
    (sw_id, 'Marco',     'marco@demo.test',     true),
    (sw_id, 'Niamh',     'niamh@demo.test',     true),
    (sw_id, 'Oscar',     'oscar@demo.test',     false),
    (sw_id, 'Priya',     'priya@demo.test',     true),
    (sw_id, 'Quinn',     'quinn@demo.test',     true),
    (sw_id, 'Rosie',     'rosie@demo.test',     true),
    (sw_id, 'Stefan',    'stefan@demo.test',    true),
    (sw_id, 'Tanya',     'tanya@demo.test',     true),
    (sw_id, 'Uma',       'uma@demo.test',       true),
    (sw_id, 'Victor',    'victor@demo.test',    false),
    (sw_id, 'Wendy',     'wendy@demo.test',     true),
    (sw_id, 'Xander',    'xander@demo.test',    true),
    (sw_id, 'Yolanda',   'yolanda@demo.test',   true),
    (sw_id, 'Zara',      'zara@demo.test',      true),
    (sw_id, 'Aleksei',   'aleksei@demo.test',   true),
    (sw_id, 'Brigitte',  'brigitte@demo.test',  true),
    (sw_id, 'Connor',    'connor@demo.test',    true),
    (sw_id, 'Daria',     'daria@demo.test',     true),
    (sw_id, 'Emeka',     'emeka@demo.test',     false),
    (sw_id, 'Florian',   'florian@demo.test',   true),
    (sw_id, 'Greta',     'greta@demo.test',     true),
    (sw_id, 'Hamish',    'hamish@demo.test',    true),
    (sw_id, 'Ingrid',    'ingrid@demo.test',    true)
  ON CONFLICT DO NOTHING;

  -- Assign one country per participant (in insertion order)
  WITH
    p_ordered AS (
      SELECT id AS pid, ROW_NUMBER() OVER (ORDER BY created_at, id) AS rn
      FROM participants WHERE sweepstake_id = sw_id
    ),
    c_ordered AS (
      SELECT id AS tid, name, flag, ROW_NUMBER() OVER (ORDER BY id) AS rn
      FROM teams WHERE tournament_id = 2
    )
  INSERT INTO assignments (sweepstake_id, participant_id, team_id, team_name, team_flag)
  SELECT sw_id, p.pid, c.tid, c.name, c.flag
  FROM p_ordered p JOIN c_ordered c ON p.rn = c.rn
  ON CONFLICT DO NOTHING;

  -- Seed Eurovision results: semi-final qualification + Grand Final positions
  -- All Big 5 + host auto-qualified; 10 from each semi qualified.
  -- Positions 1-26 assigned to qualifiers.
  INSERT INTO eurovision_results (sweepstake_id, team_id, qualified, final_position) VALUES
    -- Auto-qualified (IDs 101-106), all reach the final
    (sw_id, 101, true,  8),   -- Austria (host)
    (sw_id, 102, true, 14),   -- United Kingdom
    (sw_id, 103, true,  3),   -- France
    (sw_id, 104, true, 18),   -- Germany
    (sw_id, 105, true, 11),   -- Spain
    (sw_id, 106, true,  2),   -- Italy
    -- Semi-Final 1 qualifiers (10 of 14 go through)
    (sw_id, 107, true,  9),   -- Albania
    (sw_id, 108, true,  5),   -- Armenia
    (sw_id, 109, false, null),-- Australia — eliminated
    (sw_id, 110, true, 20),   -- Azerbaijan
    (sw_id, 111, true,  1),   -- Croatia 🏆 WINNER
    (sw_id, 112, false, null),-- Cyprus — eliminated
    (sw_id, 113, true, 16),   -- Estonia
    (sw_id, 114, true,  7),   -- Greece
    (sw_id, 115, false, null),-- Iceland — eliminated
    (sw_id, 116, false, null),-- Moldova — eliminated
    (sw_id, 117, true, 13),   -- Norway
    (sw_id, 118, true, 22),   -- Serbia
    (sw_id, 119, true, 25),   -- Slovenia
    (sw_id, 120, true,  4),   -- Ukraine
    -- Semi-Final 2 qualifiers (10 of 15 go through)
    (sw_id, 121, true, 17),   -- Belgium
    (sw_id, 122, false, null),-- Czech Republic — eliminated
    (sw_id, 123, true, 12),   -- Denmark
    (sw_id, 124, true,  6),   -- Finland
    (sw_id, 125, false, null),-- Georgia — eliminated
    (sw_id, 126, true, 19),   -- Ireland
    (sw_id, 127, false, null),-- Israel — eliminated
    (sw_id, 128, true, 23),   -- Latvia
    (sw_id, 129, true, 10),   -- Lithuania
    (sw_id, 130, false, null),-- Luxembourg — eliminated
    (sw_id, 131, true, 24),   -- Malta
    (sw_id, 132, true, 15),   -- Netherlands
    (sw_id, 133, false, null),-- Poland — eliminated
    (sw_id, 134, true, 21),   -- Portugal
    (sw_id, 135, true, 26)    -- Sweden (last place, unlucky)
  ON CONFLICT (sweepstake_id, team_id) DO NOTHING;

END $$;
