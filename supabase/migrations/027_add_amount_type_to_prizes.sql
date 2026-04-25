-- Add amount_type column to track if prizes are fixed (£) or percentage (%)
ALTER TABLE sweepstake_prizes
ADD COLUMN amount_type TEXT DEFAULT 'fixed' CHECK (amount_type IN ('fixed', 'percent'));

-- Create index for common queries
CREATE INDEX idx_sweepstake_prizes_type ON sweepstake_prizes(sweepstake_id, amount_type);
