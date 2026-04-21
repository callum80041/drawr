-- Add currency column to sweepstakes table
ALTER TABLE sweepstakes ADD COLUMN currency TEXT DEFAULT 'GBP' CHECK (currency IN ('GBP', 'USD', 'EUR', 'JPY'));

-- Add currency column to organisers table (for default preference)
ALTER TABLE organisers ADD COLUMN currency TEXT DEFAULT 'GBP' CHECK (currency IN ('GBP', 'USD', 'EUR', 'JPY'));
