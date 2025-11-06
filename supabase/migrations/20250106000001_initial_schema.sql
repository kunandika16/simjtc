-- ================================================
-- SIM P2TK Jawa Barat - Database Schema
-- Initial Migration
-- ================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- ENUMS
-- ================================================

-- User Role Enum
CREATE TYPE user_role AS ENUM ('candidate', 'institution', 'employer', 'admin');

-- Approval Status Enum
CREATE TYPE approval_status AS ENUM ('pending_approval', 'approved', 'rejected');

-- Job Status Enum
CREATE TYPE job_status AS ENUM ('draft', 'pending', 'published', 'closed', 'archived');

-- Application Status Enum
CREATE TYPE application_status AS ENUM ('submitted', 'screening', 'interview', 'offer', 'hired', 'rejected');

-- Enrollment Status Enum
CREATE TYPE enrollment_status AS ENUM ('applied', 'confirmed', 'in_progress', 'completed', 'failed', 'cancelled');

-- Training Mode Enum
CREATE TYPE training_mode AS ENUM ('online', 'offline', 'hybrid');

-- Employment Type Enum
CREATE TYPE employment_type AS ENUM ('fulltime', 'parttime', 'internship', 'contract');

-- Institution Type Enum
CREATE TYPE institution_type AS ENUM ('blk_pemerintah', 'blk_pesantren', 'lpk');

-- Education Level Enum
CREATE TYPE education_level AS ENUM ('SMA', 'SMK', 'D3', 'D4', 'S1', 'S2', 'S3');

-- Skill Level Enum
CREATE TYPE skill_level AS ENUM ('Beginner', 'Intermediate', 'Advanced', 'Expert');

-- Document Type Enum
CREATE TYPE document_type AS ENUM ('KTP', 'IJAZAH', 'SERTIFIKAT', 'CV', 'FOTO');

-- Class Status Enum
CREATE TYPE class_status AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');

-- Enrollment Class Status Enum
CREATE TYPE enrollment_class_status AS ENUM ('open', 'closed', 'waitlist');

-- ================================================
-- AUTH MODULE - User Profiles & Roles
-- ================================================

-- Profiles Table (extends auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    phone_verified BOOLEAN DEFAULT FALSE,
    city TEXT,
    province TEXT DEFAULT 'Jawa Barat',
    avatar_url TEXT,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on role for faster queries
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_onboarding ON profiles(onboarding_completed);

-- ================================================
-- CANDIDATE MODULE
-- ================================================

-- Candidate Profiles
CREATE TABLE candidate_profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    -- Personal Info
    date_of_birth DATE,
    gender TEXT,
    address TEXT,

    -- Education
    education_level education_level,
    major TEXT,
    graduation_year INTEGER,
    gpa NUMERIC(3,2),
    is_student BOOLEAN DEFAULT FALSE,

    -- Skills & Languages
    skills TEXT[], -- Array of skill names
    languages JSONB DEFAULT '[]'::jsonb, -- [{code: 'en', level: 'intermediate'}]
    jlpt_level TEXT, -- N5, N4, N3, N2, N1

    -- Portfolio & Links
    portfolio_url TEXT,
    linkedin_url TEXT,

    -- CV
    cv_url TEXT,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Candidate Experiences
CREATE TABLE candidate_experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    company TEXT NOT NULL,
    position TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_experiences_user ON candidate_experiences(user_id);

-- Documents
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type document_type NOT NULL,
    file_url TEXT NOT NULL,
    file_name TEXT,
    file_size INTEGER,
    verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_documents_user ON documents(user_id);
CREATE INDEX idx_documents_type ON documents(type);

-- ================================================
-- EMPLOYER MODULE
-- ================================================

-- Employers Table
CREATE TABLE employers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Company Info
    company_name TEXT NOT NULL,
    industry TEXT,
    website TEXT,

    -- Address
    address TEXT,
    city TEXT,
    province TEXT DEFAULT 'Jawa Barat',

    -- Legal
    nib TEXT, -- Nomor Induk Berusaha
    npwp TEXT,

    -- PIC (Person In Charge)
    pic_name TEXT NOT NULL,
    pic_email TEXT NOT NULL,
    pic_phone TEXT NOT NULL,
    pic_position TEXT,

    -- Preferences
    recruitment_location TEXT[], -- ['Indonesia', 'Japan', etc]
    recruitment_positions JSONB DEFAULT '[]'::jsonb, -- Common positions they recruit
    notes TEXT,

    -- Status
    status approval_status DEFAULT 'pending_approval',
    approved_at TIMESTAMPTZ,
    approved_by UUID REFERENCES auth.users(id),
    rejection_reason TEXT,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_employers_user ON employers(user_id);
CREATE INDEX idx_employers_status ON employers(status);
CREATE INDEX idx_employers_city ON employers(city);

-- ================================================
-- INSTITUTION MODULE
-- ================================================

-- Institutions Table
CREATE TABLE institutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Institution Info
    name TEXT NOT NULL,
    type institution_type NOT NULL,
    nib TEXT, -- License number

    -- Address
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    province TEXT DEFAULT 'Jawa Barat',
    latitude NUMERIC(10, 8),
    longitude NUMERIC(11, 8),

    -- Contact
    email TEXT NOT NULL,
    phone TEXT NOT NULL,

    -- PIC
    pic_name TEXT NOT NULL,
    pic_position TEXT,
    pic_phone TEXT NOT NULL,
    pic_email TEXT NOT NULL,

    -- Capacity & Facilities
    capacity_per_month INTEGER,
    facilities TEXT[], -- ['Ruang Kelas', 'Lab', 'Asrama']
    specialties TEXT[], -- ['Bahasa Jepang', 'Digital Marketing']

    -- Programs
    programs JSONB DEFAULT '[]'::jsonb,
    certifications TEXT[], -- ['BNSP', etc]

    -- Status
    status approval_status DEFAULT 'pending_approval',
    approved_at TIMESTAMPTZ,
    approved_by UUID REFERENCES auth.users(id),
    rejection_reason TEXT,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_institutions_user ON institutions(user_id);
CREATE INDEX idx_institutions_status ON institutions(status);
CREATE INDEX idx_institutions_type ON institutions(type);
CREATE INDEX idx_institutions_city ON institutions(city);

-- ================================================
-- JOBS MODULE
-- ================================================

-- Jobs Table
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Basic Info
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,

    -- Ownership
    employer_id UUID NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES auth.users(id),

    -- Job Type
    is_internal BOOLEAN DEFAULT TRUE, -- TRUE = apply di sistem, FALSE = redirect ke external_url
    external_url TEXT,

    -- Location
    location_city TEXT,
    location_country TEXT,
    is_remote BOOLEAN DEFAULT FALSE,

    -- Employment Details
    employment_type employment_type,
    category TEXT, -- 'IT', 'Manufacturing', 'Creative', etc

    -- Requirements (stored as JSONB for flexibility)
    requirements JSONB DEFAULT '{}'::jsonb,
    -- Example: {
    --   "education": ["S1", "D3"],
    --   "jlpt": "N3",
    --   "age_min": 21,
    --   "age_max": 35,
    --   "skills": ["React", "Node.js"],
    --   "experience_years": 2
    -- }

    -- Description
    description TEXT NOT NULL,
    responsibilities TEXT,
    benefits TEXT,

    -- Salary
    salary_min INTEGER,
    salary_max INTEGER,
    currency TEXT DEFAULT 'IDR',
    salary_negotiable BOOLEAN DEFAULT FALSE,

    -- Quota & Deadline
    quota INTEGER,
    deadline DATE,

    -- Status
    status job_status DEFAULT 'draft',
    published_at TIMESTAMPTZ,

    -- Screening Questions (optional)
    screening_questions JSONB DEFAULT '[]'::jsonb,
    -- Example: [
    --   {"question": "Why do you want to join?", "required": true},
    --   {"question": "Your JLPT level?", "required": false}
    -- ]

    -- Metadata
    views_count INTEGER DEFAULT 0,
    applications_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_jobs_employer ON jobs(employer_id);
CREATE INDEX idx_jobs_created_by ON jobs(created_by);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_deadline ON jobs(deadline);
CREATE INDEX idx_jobs_category ON jobs(category);
CREATE INDEX idx_jobs_location ON jobs(location_city, location_country);
CREATE INDEX idx_jobs_published ON jobs(published_at) WHERE status = 'published';

-- Full-text search index
CREATE INDEX idx_jobs_search ON jobs USING gin(to_tsvector('indonesian', title || ' ' || COALESCE(description, '')));

-- Applications Table
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Relations
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Application Data
    resume_url TEXT, -- Could be from profile or uploaded during application
    cover_letter TEXT,
    answers JSONB DEFAULT '{}'::jsonb, -- Answers to screening questions

    -- Status & Tracking
    status application_status DEFAULT 'submitted',

    -- Interview
    interview_at TIMESTAMPTZ,
    interview_location TEXT,
    interview_notes TEXT,

    -- HR Notes
    notes TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),

    -- Offer
    offer_sent_at TIMESTAMPTZ,
    offer_accepted_at TIMESTAMPTZ,
    offer_rejected_at TIMESTAMPTZ,
    offer_rejection_reason TEXT,

    -- Metadata
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Constraint: One application per user per job
    UNIQUE(job_id, user_id)
);

CREATE INDEX idx_applications_job ON applications(job_id);
CREATE INDEX idx_applications_user ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_date ON applications(applied_at);

-- ================================================
-- TRAINING MODULE
-- ================================================

-- Training Programs
CREATE TABLE training_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Basic Info
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,

    -- Provider
    provider_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES auth.users(id),

    -- Category & Mode
    category TEXT NOT NULL, -- 'Bahasa Jepang', 'Digital Marketing', etc
    mode training_mode NOT NULL,

    -- Description
    description TEXT NOT NULL,
    objectives TEXT,
    curriculum JSONB DEFAULT '[]'::jsonb,

    -- Prerequisites
    prerequisites JSONB DEFAULT '{}'::jsonb,
    -- Example: {
    --   "education": ["SMA", "SMK"],
    --   "jlpt": "N5",
    --   "skills": [],
    --   "age_min": 18,
    --   "age_max": 35
    -- }

    -- Duration (in hours/days - for info only)
    duration_hours INTEGER,
    duration_days INTEGER,

    -- Type
    is_external BOOLEAN DEFAULT FALSE,
    external_url TEXT,

    -- Status
    status job_status DEFAULT 'draft', -- Reuse job_status enum
    published_at TIMESTAMPTZ,

    -- Metadata
    views_count INTEGER DEFAULT 0,
    enrollments_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_programs_provider ON training_programs(provider_id);
CREATE INDEX idx_programs_status ON training_programs(status);
CREATE INDEX idx_programs_category ON training_programs(category);
CREATE INDEX idx_programs_mode ON training_programs(mode);

-- Training Classes (Batches)
CREATE TABLE training_classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Program
    program_id UUID NOT NULL REFERENCES training_programs(id) ON DELETE CASCADE,

    -- Schedule
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    schedule_json JSONB DEFAULT '{}'::jsonb, -- Detailed schedule per session

    -- Venue
    venue TEXT NOT NULL, -- Address or Zoom link

    -- Capacity
    capacity INTEGER NOT NULL,
    enrolled_count INTEGER DEFAULT 0,

    -- Enrollment Status
    enrollment_status enrollment_class_status DEFAULT 'open',

    -- Fee
    fee_amount INTEGER DEFAULT 0,
    currency TEXT DEFAULT 'IDR',
    is_free BOOLEAN DEFAULT TRUE,

    -- Class Status
    status class_status DEFAULT 'upcoming',

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_classes_program ON training_classes(program_id);
CREATE INDEX idx_classes_status ON training_classes(status);
CREATE INDEX idx_classes_enrollment_status ON training_classes(enrollment_status);
CREATE INDEX idx_classes_dates ON training_classes(start_date, end_date);

-- Enrollments
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Relations
    class_id UUID NOT NULL REFERENCES training_classes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Status
    status enrollment_status DEFAULT 'applied',

    -- Attendance & Score
    attendance_json JSONB DEFAULT '{}'::jsonb, -- {"2025-01-01": true, "2025-01-02": false}
    attendance_percentage NUMERIC(5,2),

    score NUMERIC(5,2),
    passed BOOLEAN,
    remarks TEXT,

    -- Certificate
    certificate_url TEXT,
    certificate_number TEXT UNIQUE,
    certificate_issued_at TIMESTAMPTZ,

    -- Metadata
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    confirmed_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Constraint: One enrollment per user per class
    UNIQUE(class_id, user_id)
);

CREATE INDEX idx_enrollments_class ON enrollments(class_id);
CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);
CREATE INDEX idx_enrollments_certificate ON enrollments(certificate_number) WHERE certificate_number IS NOT NULL;

-- Certificates (Optional separate table for verification)
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enrollment_id UUID UNIQUE NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,

    -- Certificate Details
    number TEXT UNIQUE NOT NULL,
    verify_token TEXT UNIQUE NOT NULL,

    -- PDF
    pdf_url TEXT NOT NULL,

    -- Issued By
    issued_by UUID NOT NULL REFERENCES auth.users(id),
    issued_at TIMESTAMPTZ DEFAULT NOW(),

    -- QR Code Data
    qr_data TEXT NOT NULL,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_certificates_number ON certificates(number);
CREATE INDEX idx_certificates_token ON certificates(verify_token);

-- ================================================
-- TRIGGERS FOR UPDATED_AT
-- ================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_candidate_profiles_updated_at BEFORE UPDATE ON candidate_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employers_updated_at BEFORE UPDATE ON employers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_institutions_updated_at BEFORE UPDATE ON institutions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON training_programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON training_classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON enrollments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- TRIGGERS FOR COUNTERS
-- ================================================

-- Update jobs applications_count
CREATE OR REPLACE FUNCTION update_job_applications_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE jobs SET applications_count = applications_count + 1 WHERE id = NEW.job_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE jobs SET applications_count = applications_count - 1 WHERE id = OLD.job_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_job_applications_count
AFTER INSERT OR DELETE ON applications
FOR EACH ROW EXECUTE FUNCTION update_job_applications_count();

-- Update training_classes enrolled_count
CREATE OR REPLACE FUNCTION update_class_enrolled_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status IN ('confirmed', 'in_progress') THEN
        UPDATE training_classes SET enrolled_count = enrolled_count + 1 WHERE id = NEW.class_id;
    ELSIF TG_OP = 'DELETE' AND OLD.status IN ('confirmed', 'in_progress') THEN
        UPDATE training_classes SET enrolled_count = enrolled_count - 1 WHERE id = OLD.class_id;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.status NOT IN ('confirmed', 'in_progress') AND NEW.status IN ('confirmed', 'in_progress') THEN
            UPDATE training_classes SET enrolled_count = enrolled_count + 1 WHERE id = NEW.class_id;
        ELSIF OLD.status IN ('confirmed', 'in_progress') AND NEW.status NOT IN ('confirmed', 'in_progress') THEN
            UPDATE training_classes SET enrolled_count = enrolled_count - 1 WHERE id = NEW.class_id;
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_class_enrolled_count
AFTER INSERT OR UPDATE OR DELETE ON enrollments
FOR EACH ROW EXECUTE FUNCTION update_class_enrolled_count();
