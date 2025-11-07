-- ================================================
-- Fix Storage Buckets - Make documents and cvs public
-- But keep RLS policies for security
-- ================================================

-- Update documents bucket to be public
UPDATE storage.buckets
SET public = true
WHERE id = 'documents';

-- Update cvs bucket to be public
UPDATE storage.buckets
SET public = true
WHERE id = 'cvs';

-- The RLS policies will still protect these buckets
-- Only authorized users can upload/update/delete
-- But anyone with the URL can view (which is what we want for document preview)
