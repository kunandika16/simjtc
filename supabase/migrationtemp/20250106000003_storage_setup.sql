-- ================================================
-- SIM P2TK Jawa Barat - Storage Buckets Setup
-- ================================================

-- ================================================
-- CREATE STORAGE BUCKETS
-- ================================================

-- Avatars bucket (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Documents bucket (private - requires authentication)
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- CVs bucket (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('cvs', 'cvs', false)
ON CONFLICT (id) DO NOTHING;

-- Certificates bucket (public - for verification)
INSERT INTO storage.buckets (id, name, public)
VALUES ('certificates', 'certificates', true)
ON CONFLICT (id) DO NOTHING;

-- Company logos bucket (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('company-logos', 'company-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Institution photos bucket (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('institution-photos', 'institution-photos', true)
ON CONFLICT (id) DO NOTHING;

-- ================================================
-- STORAGE POLICIES - AVATARS
-- ================================================

-- Anyone can view avatars (public bucket)
CREATE POLICY "Avatars are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Users can upload their own avatar
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can update their own avatar
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can delete their own avatar
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ================================================
-- STORAGE POLICIES - DOCUMENTS
-- ================================================

-- Users can view their own documents
CREATE POLICY "Users can view own documents"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Admins can view all documents
CREATE POLICY "Admins can view all documents"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'documents'
    AND EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- Employers can view documents of applicants
CREATE POLICY "Employers can view applicant documents"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'documents'
    AND EXISTS (
        SELECT 1 FROM profiles p
        JOIN employers e ON e.user_id = p.id
        JOIN jobs j ON j.employer_id = e.id
        JOIN applications a ON a.job_id = j.id
        WHERE p.id = auth.uid()
        AND p.role = 'employer'
        AND a.user_id::text = (storage.foldername(name))[1]
    )
);

-- Users can upload their own documents
CREATE POLICY "Users can upload own documents"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can update their own documents
CREATE POLICY "Users can update own documents"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can delete their own documents
CREATE POLICY "Users can delete own documents"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ================================================
-- STORAGE POLICIES - CVS
-- ================================================

-- Users can view their own CVs
CREATE POLICY "Users can view own CVs"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'cvs'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Employers can view CVs of applicants
CREATE POLICY "Employers can view applicant CVs"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'cvs'
    AND EXISTS (
        SELECT 1 FROM profiles p
        JOIN employers e ON e.user_id = p.id
        JOIN jobs j ON j.employer_id = e.id
        JOIN applications a ON a.job_id = j.id
        WHERE p.id = auth.uid()
        AND p.role = 'employer'
        AND a.user_id::text = (storage.foldername(name))[1]
    )
);

-- Admins can view all CVs
CREATE POLICY "Admins can view all CVs"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'cvs'
    AND EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- Users can upload their own CVs
CREATE POLICY "Users can upload own CVs"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'cvs'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can update their own CVs
CREATE POLICY "Users can update own CVs"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'cvs'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can delete their own CVs
CREATE POLICY "Users can delete own CVs"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'cvs'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ================================================
-- STORAGE POLICIES - CERTIFICATES (Public)
-- ================================================

-- Anyone can view certificates (for public verification)
CREATE POLICY "Certificates are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'certificates');

-- Institutions can upload certificates for their programs
CREATE POLICY "Institutions can upload certificates"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'certificates'
    AND EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'institution'
    )
);

-- Admins can manage all certificates
CREATE POLICY "Admins can manage certificates"
ON storage.objects FOR ALL
USING (
    bucket_id = 'certificates'
    AND EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- ================================================
-- STORAGE POLICIES - COMPANY LOGOS (Public)
-- ================================================

-- Anyone can view company logos
CREATE POLICY "Company logos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'company-logos');

-- Employers can upload their company logo
CREATE POLICY "Employers can upload company logo"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'company-logos'
    AND EXISTS (
        SELECT 1 FROM profiles p
        JOIN employers e ON e.user_id = p.id
        WHERE p.id = auth.uid()
        AND p.role = 'employer'
        AND e.id::text = (storage.foldername(name))[1]
    )
);

-- Employers can update their company logo
CREATE POLICY "Employers can update company logo"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'company-logos'
    AND EXISTS (
        SELECT 1 FROM profiles p
        JOIN employers e ON e.user_id = p.id
        WHERE p.id = auth.uid()
        AND p.role = 'employer'
        AND e.id::text = (storage.foldername(name))[1]
    )
);

-- Employers can delete their company logo
CREATE POLICY "Employers can delete company logo"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'company-logos'
    AND EXISTS (
        SELECT 1 FROM profiles p
        JOIN employers e ON e.user_id = p.id
        WHERE p.id = auth.uid()
        AND p.role = 'employer'
        AND e.id::text = (storage.foldername(name))[1]
    )
);

-- ================================================
-- STORAGE POLICIES - INSTITUTION PHOTOS (Public)
-- ================================================

-- Anyone can view institution photos
CREATE POLICY "Institution photos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'institution-photos');

-- Institutions can upload their photos
CREATE POLICY "Institutions can upload photos"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'institution-photos'
    AND EXISTS (
        SELECT 1 FROM profiles p
        JOIN institutions i ON i.user_id = p.id
        WHERE p.id = auth.uid()
        AND p.role = 'institution'
        AND i.id::text = (storage.foldername(name))[1]
    )
);

-- Institutions can update their photos
CREATE POLICY "Institutions can update photos"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'institution-photos'
    AND EXISTS (
        SELECT 1 FROM profiles p
        JOIN institutions i ON i.user_id = p.id
        WHERE p.id = auth.uid()
        AND p.role = 'institution'
        AND i.id::text = (storage.foldername(name))[1]
    )
);

-- Institutions can delete their photos
CREATE POLICY "Institutions can delete photos"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'institution-photos'
    AND EXISTS (
        SELECT 1 FROM profiles p
        JOIN institutions i ON i.user_id = p.id
        WHERE p.id = auth.uid()
        AND p.role = 'institution'
        AND i.id::text = (storage.foldername(name))[1]
    )
);
