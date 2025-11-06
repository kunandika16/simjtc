-- ================================================
-- SIM P2TK Jawa Barat - Row Level Security Policies
-- ================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE employers ENABLE ROW LEVEL SECURITY;
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- ================================================
-- HELPER FUNCTIONS
-- ================================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is employer
CREATE OR REPLACE FUNCTION is_employer()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'employer'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is institution
CREATE OR REPLACE FUNCTION is_institution()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'institution'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is candidate
CREATE OR REPLACE FUNCTION is_candidate()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'candidate'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's employer_id
CREATE OR REPLACE FUNCTION get_user_employer_id()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT id FROM employers
        WHERE user_id = auth.uid()
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's institution_id
CREATE OR REPLACE FUNCTION get_user_institution_id()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT id FROM institutions
        WHERE user_id = auth.uid()
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- PROFILES POLICIES
-- ================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT
USING (is_admin());

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Admins can update any profile
CREATE POLICY "Admins can update any profile"
ON profiles FOR UPDATE
USING (is_admin());

-- Users can insert their own profile (during signup)
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- ================================================
-- CANDIDATE PROFILES POLICIES
-- ================================================

-- Candidates can view their own profile
CREATE POLICY "Candidates can view own profile"
ON candidate_profiles FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all candidate profiles
CREATE POLICY "Admins can view all candidate profiles"
ON candidate_profiles FOR SELECT
USING (is_admin());

-- Employers can view candidate profiles (when they applied to their jobs)
CREATE POLICY "Employers can view applicant profiles"
ON candidate_profiles FOR SELECT
USING (
    is_employer() AND EXISTS (
        SELECT 1 FROM applications a
        JOIN jobs j ON a.job_id = j.id
        WHERE a.user_id = candidate_profiles.user_id
        AND j.employer_id = get_user_employer_id()
    )
);

-- Candidates can insert/update their own profile
CREATE POLICY "Candidates can manage own profile"
ON candidate_profiles FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ================================================
-- CANDIDATE EXPERIENCES POLICIES
-- ================================================

CREATE POLICY "Candidates can manage own experiences"
ON candidate_experiences FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all experiences"
ON candidate_experiences FOR SELECT
USING (is_admin());

-- ================================================
-- DOCUMENTS POLICIES
-- ================================================

-- Users can manage their own documents
CREATE POLICY "Users can manage own documents"
ON documents FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Admins can view all documents
CREATE POLICY "Admins can view all documents"
ON documents FOR SELECT
USING (is_admin());

-- Employers can view documents of applicants
CREATE POLICY "Employers can view applicant documents"
ON documents FOR SELECT
USING (
    is_employer() AND EXISTS (
        SELECT 1 FROM applications a
        JOIN jobs j ON a.job_id = j.id
        WHERE a.user_id = documents.user_id
        AND j.employer_id = get_user_employer_id()
    )
);

-- ================================================
-- EMPLOYERS POLICIES
-- ================================================

-- Employers can view their own profile
CREATE POLICY "Employers can view own profile"
ON employers FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all employers
CREATE POLICY "Admins can view all employers"
ON employers FOR SELECT
USING (is_admin());

-- Public can view approved employer basic info (name, industry, city only)
CREATE POLICY "Public can view approved employers basic info"
ON employers FOR SELECT
USING (status = 'approved');

-- Employers can insert their own profile
CREATE POLICY "Employers can insert own profile"
ON employers FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Employers can update their own profile (except status)
CREATE POLICY "Employers can update own profile"
ON employers FOR UPDATE
USING (auth.uid() = user_id);

-- Admins can update any employer (including status)
CREATE POLICY "Admins can update any employer"
ON employers FOR UPDATE
USING (is_admin());

-- ================================================
-- INSTITUTIONS POLICIES
-- ================================================

-- Institutions can view their own profile
CREATE POLICY "Institutions can view own profile"
ON institutions FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all institutions
CREATE POLICY "Admins can view all institutions"
ON institutions FOR SELECT
USING (is_admin());

-- Public can view approved institution basic info
CREATE POLICY "Public can view approved institutions"
ON institutions FOR SELECT
USING (status = 'approved');

-- Institutions can insert their own profile
CREATE POLICY "Institutions can insert own profile"
ON institutions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Institutions can update their own profile (except status)
CREATE POLICY "Institutions can update own profile"
ON institutions FOR UPDATE
USING (auth.uid() = user_id);

-- Admins can update any institution (including status)
CREATE POLICY "Admins can update any institution"
ON institutions FOR UPDATE
USING (is_admin());

-- ================================================
-- JOBS POLICIES
-- ================================================

-- Public can view published jobs that are not expired
CREATE POLICY "Public can view published jobs"
ON jobs FOR SELECT
USING (
    status = 'published'
    AND (deadline IS NULL OR deadline >= CURRENT_DATE)
);

-- Employers can view their own jobs (all statuses)
CREATE POLICY "Employers can view own jobs"
ON jobs FOR SELECT
USING (employer_id = get_user_employer_id());

-- Admins can view all jobs
CREATE POLICY "Admins can view all jobs"
ON jobs FOR SELECT
USING (is_admin());

-- Employers can create jobs (with pending/draft status)
CREATE POLICY "Employers can create jobs"
ON jobs FOR INSERT
WITH CHECK (
    employer_id = get_user_employer_id()
    AND created_by = auth.uid()
);

-- Employers can update their own jobs
CREATE POLICY "Employers can update own jobs"
ON jobs FOR UPDATE
USING (employer_id = get_user_employer_id());

-- Admins can update any job
CREATE POLICY "Admins can update any job"
ON jobs FOR UPDATE
USING (is_admin());

-- Employers can delete their own draft jobs
CREATE POLICY "Employers can delete own draft jobs"
ON jobs FOR DELETE
USING (
    employer_id = get_user_employer_id()
    AND status = 'draft'
);

-- Admins can delete any job
CREATE POLICY "Admins can delete any job"
ON jobs FOR DELETE
USING (is_admin());

-- ================================================
-- APPLICATIONS POLICIES
-- ================================================

-- Candidates can view their own applications
CREATE POLICY "Candidates can view own applications"
ON applications FOR SELECT
USING (auth.uid() = user_id);

-- Employers can view applications to their jobs
CREATE POLICY "Employers can view applications to own jobs"
ON applications FOR SELECT
USING (
    is_employer() AND EXISTS (
        SELECT 1 FROM jobs
        WHERE jobs.id = applications.job_id
        AND jobs.employer_id = get_user_employer_id()
    )
);

-- Admins can view all applications
CREATE POLICY "Admins can view all applications"
ON applications FOR SELECT
USING (is_admin());

-- Candidates can apply to published jobs
CREATE POLICY "Candidates can apply to jobs"
ON applications FOR INSERT
WITH CHECK (
    auth.uid() = user_id
    AND is_candidate()
    AND EXISTS (
        SELECT 1 FROM jobs
        WHERE jobs.id = applications.job_id
        AND jobs.status = 'published'
        AND (jobs.deadline IS NULL OR jobs.deadline >= CURRENT_DATE)
    )
);

-- Candidates can update their own applications (only before screening)
CREATE POLICY "Candidates can update own applications"
ON applications FOR UPDATE
USING (
    auth.uid() = user_id
    AND status = 'submitted'
);

-- Employers can update applications to their jobs (status, notes, interview)
CREATE POLICY "Employers can update applications to own jobs"
ON applications FOR UPDATE
USING (
    is_employer() AND EXISTS (
        SELECT 1 FROM jobs
        WHERE jobs.id = applications.job_id
        AND jobs.employer_id = get_user_employer_id()
    )
);

-- Admins can update any application
CREATE POLICY "Admins can update any application"
ON applications FOR UPDATE
USING (is_admin());

-- Candidates can delete their own submitted applications
CREATE POLICY "Candidates can delete own submitted applications"
ON applications FOR DELETE
USING (
    auth.uid() = user_id
    AND status = 'submitted'
);

-- ================================================
-- TRAINING PROGRAMS POLICIES
-- ================================================

-- Public can view published programs from approved institutions
CREATE POLICY "Public can view published programs"
ON training_programs FOR SELECT
USING (
    status = 'published'
    AND EXISTS (
        SELECT 1 FROM institutions
        WHERE institutions.id = training_programs.provider_id
        AND institutions.status = 'approved'
    )
);

-- Institutions can view their own programs
CREATE POLICY "Institutions can view own programs"
ON training_programs FOR SELECT
USING (provider_id = get_user_institution_id());

-- Admins can view all programs
CREATE POLICY "Admins can view all programs"
ON training_programs FOR SELECT
USING (is_admin());

-- Institutions can create programs
CREATE POLICY "Institutions can create programs"
ON training_programs FOR INSERT
WITH CHECK (
    provider_id = get_user_institution_id()
    AND created_by = auth.uid()
);

-- Institutions can update their own programs
CREATE POLICY "Institutions can update own programs"
ON training_programs FOR UPDATE
USING (provider_id = get_user_institution_id());

-- Admins can update any program
CREATE POLICY "Admins can update any program"
ON training_programs FOR UPDATE
USING (is_admin());

-- Institutions can delete their own draft programs
CREATE POLICY "Institutions can delete own draft programs"
ON training_programs FOR DELETE
USING (
    provider_id = get_user_institution_id()
    AND status = 'draft'
);

-- ================================================
-- TRAINING CLASSES POLICIES
-- ================================================

-- Public can view classes of published programs
CREATE POLICY "Public can view classes"
ON training_classes FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM training_programs
        WHERE training_programs.id = training_classes.program_id
        AND training_programs.status = 'published'
    )
);

-- Institutions can manage classes of their programs
CREATE POLICY "Institutions can manage own classes"
ON training_classes FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM training_programs
        WHERE training_programs.id = training_classes.program_id
        AND training_programs.provider_id = get_user_institution_id()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM training_programs
        WHERE training_programs.id = training_classes.program_id
        AND training_programs.provider_id = get_user_institution_id()
    )
);

-- Admins can manage all classes
CREATE POLICY "Admins can manage all classes"
ON training_classes FOR ALL
USING (is_admin());

-- ================================================
-- ENROLLMENTS POLICIES
-- ================================================

-- Candidates can view their own enrollments
CREATE POLICY "Candidates can view own enrollments"
ON enrollments FOR SELECT
USING (auth.uid() = user_id);

-- Institutions can view enrollments to their classes
CREATE POLICY "Institutions can view enrollments to own classes"
ON enrollments FOR SELECT
USING (
    is_institution() AND EXISTS (
        SELECT 1 FROM training_classes tc
        JOIN training_programs tp ON tc.program_id = tp.id
        WHERE tc.id = enrollments.class_id
        AND tp.provider_id = get_user_institution_id()
    )
);

-- Admins can view all enrollments
CREATE POLICY "Admins can view all enrollments"
ON enrollments FOR SELECT
USING (is_admin());

-- Candidates can enroll to open classes
CREATE POLICY "Candidates can enroll to classes"
ON enrollments FOR INSERT
WITH CHECK (
    auth.uid() = user_id
    AND is_candidate()
    AND EXISTS (
        SELECT 1 FROM training_classes
        WHERE training_classes.id = enrollments.class_id
        AND training_classes.enrollment_status = 'open'
        AND training_classes.enrolled_count < training_classes.capacity
    )
);

-- Candidates can update their own enrollments (cancel before confirmed)
CREATE POLICY "Candidates can cancel own enrollments"
ON enrollments FOR UPDATE
USING (
    auth.uid() = user_id
    AND status = 'applied'
);

-- Institutions can update enrollments to their classes
CREATE POLICY "Institutions can update enrollments to own classes"
ON enrollments FOR UPDATE
USING (
    is_institution() AND EXISTS (
        SELECT 1 FROM training_classes tc
        JOIN training_programs tp ON tc.program_id = tp.id
        WHERE tc.id = enrollments.class_id
        AND tp.provider_id = get_user_institution_id()
    )
);

-- Admins can update any enrollment
CREATE POLICY "Admins can update any enrollment"
ON enrollments FOR UPDATE
USING (is_admin());

-- ================================================
-- CERTIFICATES POLICIES
-- ================================================

-- Anyone can view certificates (for public verification)
CREATE POLICY "Public can view certificates"
ON certificates FOR SELECT
TO authenticated, anon
USING (true);

-- Institutions can create certificates for their classes
CREATE POLICY "Institutions can create certificates"
ON certificates FOR INSERT
WITH CHECK (
    is_institution() AND EXISTS (
        SELECT 1 FROM enrollments e
        JOIN training_classes tc ON e.class_id = tc.id
        JOIN training_programs tp ON tc.program_id = tp.id
        WHERE e.id = certificates.enrollment_id
        AND tp.provider_id = get_user_institution_id()
    )
);

-- Admins can manage all certificates
CREATE POLICY "Admins can manage all certificates"
ON certificates FOR ALL
USING (is_admin());
