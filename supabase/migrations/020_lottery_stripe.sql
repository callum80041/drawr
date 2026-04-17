-- Stripe Connect fields for lottery syndicates
ALTER TABLE syndicates
  ADD COLUMN stripe_account_id       TEXT,
  ADD COLUMN stripe_onboarding_complete BOOLEAN NOT NULL DEFAULT false;

-- Track Stripe payment details on individual payment records
ALTER TABLE syndicate_payments
  ADD COLUMN payment_method          TEXT NOT NULL DEFAULT 'manual',
  ADD COLUMN stripe_checkout_session_id TEXT;
