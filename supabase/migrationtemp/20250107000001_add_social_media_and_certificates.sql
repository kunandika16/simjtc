-- ================================================
-- Add Social Media and Certificates Fields
-- ================================================

-- Add social media fields to candidate_profiles
ALTER TABLE candidate_profiles
ADD COLUMN IF NOT EXISTS instagram_url TEXT,
ADD COLUMN IF NOT EXISTS facebook_url TEXT,
ADD COLUMN IF NOT EXISTS twitter_url TEXT;

-- Create certificates table for candidate certificates
CREATE TABLE IF NOT EXISTS candidate_certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    file_url TEXT,
    issued_date DATE,
    expiry_date DATE,
    issuer TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_candidate_certificates_candidate ON candidate_certificates(candidate_id);

-- Enable RLS on candidate_certificates
ALTER TABLE candidate_certificates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for candidate_certificates

-- Candidates can view their own certificates
CREATE POLICY "Candidates can view own certificates"
ON candidate_certificates FOR SELECT
USING (auth.uid() = candidate_id);

-- Candidates can insert their own certificates
CREATE POLICY "Candidates can insert own certificates"
ON candidate_certificates FOR INSERT
WITH CHECK (auth.uid() = candidate_id);

-- Candidates can update their own certificates
CREATE POLICY "Candidates can update own certificates"
ON candidate_certificates FOR UPDATE
USING (auth.uid() = candidate_id)
WITH CHECK (auth.uid() = candidate_id);

-- Candidates can delete their own certificates
CREATE POLICY "Candidates can delete own certificates"
ON candidate_certificates FOR DELETE
USING (auth.uid() = candidate_id);

-- Admins can view all certificates
CREATE POLICY "Admins can view all certificates"
ON candidate_certificates FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- Employers can view certificates of applicants
CREATE POLICY "Employers can view applicant certificates"
ON candidate_certificates FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM profiles p
        JOIN employers e ON e.user_id = p.id
        JOIN jobs j ON j.employer_id = e.id
        JOIN applications a ON a.job_id = j.id
        WHERE p.id = auth.uid()
        AND p.role = 'employer'
        AND a.user_id = candidate_id
    )
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_candidate_certificates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_candidate_certificates_updated_at
BEFORE UPDATE ON candidate_certificates
FOR EACH ROW
EXECUTE FUNCTION update_candidate_certificates_updated_at();
