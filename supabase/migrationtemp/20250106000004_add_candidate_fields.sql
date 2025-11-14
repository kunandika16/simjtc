-- ================================================
-- Add missing fields to candidate_profiles
-- ================================================

-- Add NIK, full_name, birth_place, birth_date, phone to candidate_profiles
ALTER TABLE candidate_profiles
ADD COLUMN IF NOT EXISTS nik TEXT,
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS birth_place TEXT,
ADD COLUMN IF NOT EXISTS birth_date DATE,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS institution TEXT,
ADD COLUMN IF NOT EXISTS diploma_url TEXT,
ADD COLUMN IF NOT EXISTS ktp_url TEXT,
ADD COLUMN IF NOT EXISTS certificate_urls TEXT[];

-- Create index for NIK for faster queries
CREATE INDEX IF NOT EXISTS idx_candidate_profiles_nik ON candidate_profiles(nik);

-- Update candidate_experiences table - rename user_id to candidate_id for consistency
-- First check if column exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'candidate_experiences'
        AND column_name = 'user_id'
    ) THEN
        -- Step 1: Drop RLS policies that depend on user_id
        DROP POLICY IF EXISTS "Candidates can manage own experiences" ON candidate_experiences;
        DROP POLICY IF EXISTS "Admins can view all experiences" ON candidate_experiences;

        -- Step 2: Add new column
        ALTER TABLE candidate_experiences
        ADD COLUMN IF NOT EXISTS candidate_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

        -- Step 3: Copy data
        UPDATE candidate_experiences SET candidate_id = user_id WHERE candidate_id IS NULL;

        -- Step 4: Drop old foreign key constraint
        ALTER TABLE candidate_experiences DROP CONSTRAINT IF EXISTS candidate_experiences_user_id_fkey;

        -- Step 5: Drop old column
        ALTER TABLE candidate_experiences DROP COLUMN IF EXISTS user_id;

        -- Step 6: Drop old index
        DROP INDEX IF EXISTS idx_experiences_user;

        -- Step 7: Create new index
        CREATE INDEX IF NOT EXISTS idx_experiences_candidate ON candidate_experiences(candidate_id);

        -- Step 8: Recreate RLS policies with new column name
        CREATE POLICY "Candidates can manage own experiences"
        ON candidate_experiences FOR ALL
        USING (auth.uid() = candidate_id)
        WITH CHECK (auth.uid() = candidate_id);

        CREATE POLICY "Admins can view all experiences"
        ON candidate_experiences FOR SELECT
        USING (is_admin());
    END IF;
END $$;

-- Also rename company to company_name for consistency
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'candidate_experiences'
        AND column_name = 'company'
    ) THEN
        ALTER TABLE candidate_experiences RENAME COLUMN company TO company_name;
    END IF;
END $$;
