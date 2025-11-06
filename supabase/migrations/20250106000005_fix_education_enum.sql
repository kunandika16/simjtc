-- ================================================
-- Fix education_level ENUM mismatch
-- ================================================

-- The original ENUM has uppercase values ('SMA', 'SMK', etc.)
-- But the application uses lowercase ('sma', 'smk', etc.)
-- Also missing 'smp', 'd1', 'd2' from the ENUM

-- Step 1: Add new values to the existing enum
ALTER TYPE education_level ADD VALUE IF NOT EXISTS 'smp';
ALTER TYPE education_level ADD VALUE IF NOT EXISTS 'sma';
ALTER TYPE education_level ADD VALUE IF NOT EXISTS 'smk';
ALTER TYPE education_level ADD VALUE IF NOT EXISTS 'd1';
ALTER TYPE education_level ADD VALUE IF NOT EXISTS 'd2';
ALTER TYPE education_level ADD VALUE IF NOT EXISTS 'd3';
ALTER TYPE education_level ADD VALUE IF NOT EXISTS 'd4';
ALTER TYPE education_level ADD VALUE IF NOT EXISTS 's1';
ALTER TYPE education_level ADD VALUE IF NOT EXISTS 's2';
ALTER TYPE education_level ADD VALUE IF NOT EXISTS 's3';

-- Note: PostgreSQL doesn't support removing enum values easily
-- The old uppercase values ('SMA', 'SMK', etc.) will remain but won't be used
-- New records will use lowercase values
