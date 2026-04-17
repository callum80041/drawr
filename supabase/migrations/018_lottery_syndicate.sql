-- Lottery syndicate feature

CREATE TABLE syndicates (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  organiser_user_id  UUID        NOT NULL,
  name               TEXT        NOT NULL,
  entry_fee_pence    INT         NOT NULL DEFAULT 100,
  status             TEXT        NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  current_pot_cycle  INT         NOT NULL DEFAULT 1,
  start_date         DATE        NOT NULL DEFAULT CURRENT_DATE,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE syndicate_members (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  syndicate_id UUID        NOT NULL REFERENCES syndicates(id) ON DELETE CASCADE,
  name         TEXT        NOT NULL,
  email        TEXT,
  number1      INT         NOT NULL CHECK (number1 BETWEEN 1 AND 59),
  number2      INT         NOT NULL CHECK (number2 BETWEEN 1 AND 59),
  number3      INT         NOT NULL CHECK (number3 BETWEEN 1 AND 59),
  number4      INT         NOT NULL CHECK (number4 BETWEEN 1 AND 59),
  number5      INT         NOT NULL CHECK (number5 BETWEEN 1 AND 59),
  number6      INT         NOT NULL CHECK (number6 BETWEEN 1 AND 59),
  view_token   TEXT        NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(12), 'hex'),
  joined_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  left_at      TIMESTAMPTZ
);

CREATE TABLE syndicate_payments (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  syndicate_id UUID        NOT NULL REFERENCES syndicates(id) ON DELETE CASCADE,
  member_id    UUID        NOT NULL REFERENCES syndicate_members(id) ON DELETE CASCADE,
  week_date    DATE        NOT NULL,
  paid         BOOLEAN     NOT NULL DEFAULT false,
  collected_by TEXT,
  notes        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(member_id, week_date)
);

CREATE TABLE lottery_draws (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  syndicate_id UUID        NOT NULL REFERENCES syndicates(id) ON DELETE CASCADE,
  draw_date    DATE        NOT NULL,
  ball1        INT         NOT NULL CHECK (ball1 BETWEEN 1 AND 59),
  ball2        INT         NOT NULL CHECK (ball2 BETWEEN 1 AND 59),
  ball3        INT         NOT NULL CHECK (ball3 BETWEEN 1 AND 59),
  ball4        INT         NOT NULL CHECK (ball4 BETWEEN 1 AND 59),
  ball5        INT         NOT NULL CHECK (ball5 BETWEEN 1 AND 59),
  ball6        INT         NOT NULL CHECK (ball6 BETWEEN 1 AND 59),
  bonus_ball   INT         CHECK (bonus_ball BETWEEN 1 AND 59),
  pot_cycle    INT         NOT NULL DEFAULT 1,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(syndicate_id, draw_date)
);

CREATE TABLE syndicate_winners (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  syndicate_id UUID        NOT NULL REFERENCES syndicates(id) ON DELETE CASCADE,
  member_id    UUID        NOT NULL REFERENCES syndicate_members(id),
  draw_date    DATE        NOT NULL,
  pot_cycle    INT         NOT NULL,
  amount_pence INT         NOT NULL,
  notes        TEXT,
  paid_out     BOOLEAN     NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Service role bypasses RLS; no public access needed
ALTER TABLE syndicates        ENABLE ROW LEVEL SECURITY;
ALTER TABLE syndicate_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE syndicate_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lottery_draws     ENABLE ROW LEVEL SECURITY;
ALTER TABLE syndicate_winners ENABLE ROW LEVEL SECURITY;
