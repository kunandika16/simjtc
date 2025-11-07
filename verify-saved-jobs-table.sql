-- Query untuk verify apakah table saved_jobs sudah ada dan configured dengan benar
-- Jalankan di Supabase SQL Editor

-- 1. Check apakah table saved_jobs ada
SELECT EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'saved_jobs'
) as table_exists;

-- 2. Check struktur table
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'saved_jobs'
ORDER BY ordinal_position;

-- 3. Check indexes
SELECT
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'saved_jobs';

-- 4. Check RLS policies
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'saved_jobs';

-- 5. Check apakah RLS enabled
SELECT
    tablename,
    rowsecurity
FROM pg_tables
WHERE tablename = 'saved_jobs';

-- 6. Test insert & select (optional - akan error jika belum login)
-- INSERT INTO saved_jobs (user_id, job_id)
-- VALUES (auth.uid(), (SELECT id FROM jobs LIMIT 1));

-- SELECT * FROM saved_jobs;
