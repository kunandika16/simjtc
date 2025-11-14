-- Create saved_jobs table for bookmarking jobs
CREATE TABLE IF NOT EXISTS saved_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    saved_at TIMESTAMPTZ DEFAULT NOW(),

    -- Prevent duplicate saves
    UNIQUE(user_id, job_id)
);

-- Create indexes for better query performance (idempotent)
CREATE INDEX IF NOT EXISTS idx_saved_jobs_user ON saved_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_job ON saved_jobs(job_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_saved_at ON saved_jobs(saved_at DESC);

-- RLS Policies (idempotent - drop first if exists, then create)
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;

-- Drop policies if they exist
DROP POLICY IF EXISTS "Users can view own saved jobs" ON saved_jobs;
DROP POLICY IF EXISTS "Users can save jobs" ON saved_jobs;
DROP POLICY IF EXISTS "Users can unsave own jobs" ON saved_jobs;

-- Create policies
CREATE POLICY "Users can view own saved jobs"
    ON saved_jobs
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can save jobs"
    ON saved_jobs
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave own jobs"
    ON saved_jobs
    FOR DELETE
    USING (auth.uid() = user_id);
