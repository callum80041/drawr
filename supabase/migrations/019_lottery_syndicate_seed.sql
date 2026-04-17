DO $$
DECLARE
  syn_id UUID;
BEGIN

  -- ── Syndicate ───────────────────────────────────────────────────────────────
  INSERT INTO syndicates (organiser_user_id, name, entry_fee_pence, start_date, status, current_pot_cycle)
  VALUES ('bf2a9eb3-adfd-4698-b9d5-f2bdafd742cd', 'Wednesday Lottery 2026', 100, '2026-01-07', 'active', 1)
  RETURNING id INTO syn_id;

  -- ── Members ─────────────────────────────────────────────────────────────────
  INSERT INTO syndicate_members (syndicate_id, name, number1, number2, number3, number4, number5, number6) VALUES
    (syn_id, 'Callum McDonald',    3,  4, 12, 25, 34, 48),
    (syn_id, 'Camilla Watkinson',  4,  9, 10, 26, 29, 31),
    (syn_id, 'Charlotte Hughes',   3, 17, 22, 34, 36, 47),
    (syn_id, 'Charlie Yates',      5, 11, 15, 20, 30, 59),
    (syn_id, 'Christine Clews',    3, 15, 24, 27, 30, 47),
    (syn_id, 'Dean Daniels',      12, 14, 21, 28, 34, 47),
    (syn_id, 'Emma Clarke',        8, 24, 35, 38, 44, 48),
    (syn_id, 'Fiona Mann',         3,  7,  9, 18, 29, 31),
    (syn_id, 'James Woodley',      8, 27, 46, 49, 54, 55),
    (syn_id, 'Jody Costello',      1, 12, 23, 24, 30, 54),
    (syn_id, 'John Pickering',     3,  5,  7, 14, 23, 27),
    (syn_id, 'Laura Dance',        1,  8, 20, 24, 47, 52),
    (syn_id, 'Lee Chamberlain',    6, 19, 25, 27, 31, 38),
    (syn_id, 'Lisa Croft',         8, 35, 36, 46, 51, 59),
    (syn_id, 'Liz Wood',           4,  6, 18, 19, 25, 47),
    (syn_id, 'Mark McFarland',     7, 14, 18, 25, 27, 41),
    (syn_id, 'Michael Mann',       1,  4, 22, 32, 38, 57),
    (syn_id, 'Mike Davis',         4, 11, 23, 27, 28, 46),
    (syn_id, 'Nicola Campbell',    5, 18, 20, 35, 40, 50),
    (syn_id, 'Nick Williams',      5, 11, 14, 20, 44, 47),
    (syn_id, 'Rachel Caines',      1,  4,  5, 13, 28, 29),
    (syn_id, 'Rebecca Rooke',      1,  4, 11, 15, 16, 21),
    (syn_id, 'Richard Freeman',    7, 12, 23, 28, 47, 58),
    (syn_id, 'Robbie Williams',    1,  4, 19, 25, 36, 42),
    (syn_id, 'Sean Murphy',       14, 26, 36, 50, 51, 53),
    (syn_id, 'Shaun Ridgway',     11, 15, 18, 27, 34, 35),
    (syn_id, 'Steve Timms',        4,  8, 10, 19, 20, 48),
    (syn_id, 'Suzanne Griffith',   4, 11, 13, 21, 45, 57);

  -- ── Payments ────────────────────────────────────────────────────────────────
  -- Base: all 28 members paid every week from 07 Jan through 29 Apr (17 weeks)
  INSERT INTO syndicate_payments (syndicate_id, member_id, week_date, paid)
  SELECT
    syn_id,
    m.id,
    w.week_date::DATE,
    true
  FROM syndicate_members m
  CROSS JOIN (VALUES
    ('2026-01-07'), ('2026-01-14'), ('2026-01-21'), ('2026-01-28'),
    ('2026-02-04'), ('2026-02-11'), ('2026-02-18'), ('2026-02-25'),
    ('2026-03-04'), ('2026-03-11'), ('2026-03-18'), ('2026-03-25'),
    ('2026-04-01'), ('2026-04-08'), ('2026-04-15'), ('2026-04-22'), ('2026-04-29')
  ) AS w(week_date)
  WHERE m.syndicate_id = syn_id;

  -- Camilla Watkinson: also paid May 06, 13, 20
  INSERT INTO syndicate_payments (syndicate_id, member_id, week_date, paid)
  SELECT syn_id, m.id, w.week_date::DATE, true
  FROM syndicate_members m
  CROSS JOIN (VALUES ('2026-05-06'), ('2026-05-13'), ('2026-05-20')) AS w(week_date)
  WHERE m.syndicate_id = syn_id AND m.name = 'Camilla Watkinson';

  -- James Woodley: also paid May 06, 13, 20, 27, Jun 03
  INSERT INTO syndicate_payments (syndicate_id, member_id, week_date, paid)
  SELECT syn_id, m.id, w.week_date::DATE, true
  FROM syndicate_members m
  CROSS JOIN (VALUES ('2026-05-06'), ('2026-05-13'), ('2026-05-20'), ('2026-05-27'), ('2026-06-03')) AS w(week_date)
  WHERE m.syndicate_id = syn_id AND m.name = 'James Woodley';

  -- Rachel Caines: also paid May 06, 13, 20, 27, Jun 03, 10
  INSERT INTO syndicate_payments (syndicate_id, member_id, week_date, paid)
  SELECT syn_id, m.id, w.week_date::DATE, true
  FROM syndicate_members m
  CROSS JOIN (VALUES ('2026-05-06'), ('2026-05-13'), ('2026-05-20'), ('2026-05-27'), ('2026-06-03'), ('2026-06-10')) AS w(week_date)
  WHERE m.syndicate_id = syn_id AND m.name = 'Rachel Caines';

  -- Sean Murphy: also paid May 06, 13, 20, 27, Jun 03
  INSERT INTO syndicate_payments (syndicate_id, member_id, week_date, paid)
  SELECT syn_id, m.id, w.week_date::DATE, true
  FROM syndicate_members m
  CROSS JOIN (VALUES ('2026-05-06'), ('2026-05-13'), ('2026-05-20'), ('2026-05-27'), ('2026-06-03')) AS w(week_date)
  WHERE m.syndicate_id = syn_id AND m.name = 'Sean Murphy';

  -- Shaun Ridgway: also paid May 06, 13, 20, 27
  INSERT INTO syndicate_payments (syndicate_id, member_id, week_date, paid)
  SELECT syn_id, m.id, w.week_date::DATE, true
  FROM syndicate_members m
  CROSS JOIN (VALUES ('2026-05-06'), ('2026-05-13'), ('2026-05-20'), ('2026-05-27')) AS w(week_date)
  WHERE m.syndicate_id = syn_id AND m.name = 'Shaun Ridgway';

  -- Dean Daniels: paid all 25 weeks through Jun 24
  INSERT INTO syndicate_payments (syndicate_id, member_id, week_date, paid)
  SELECT syn_id, m.id, w.week_date::DATE, true
  FROM syndicate_members m
  CROSS JOIN (VALUES
    ('2026-05-06'), ('2026-05-13'), ('2026-05-20'), ('2026-05-27'),
    ('2026-06-03'), ('2026-06-10'), ('2026-06-17'), ('2026-06-24')
  ) AS w(week_date)
  WHERE m.syndicate_id = syn_id AND m.name = 'Dean Daniels';

  -- John Pickering: paid all 25 weeks through Jun 24
  INSERT INTO syndicate_payments (syndicate_id, member_id, week_date, paid)
  SELECT syn_id, m.id, w.week_date::DATE, true
  FROM syndicate_members m
  CROSS JOIN (VALUES
    ('2026-05-06'), ('2026-05-13'), ('2026-05-20'), ('2026-05-27'),
    ('2026-06-03'), ('2026-06-10'), ('2026-06-17'), ('2026-06-24')
  ) AS w(week_date)
  WHERE m.syndicate_id = syn_id AND m.name = 'John Pickering';

END $$;
