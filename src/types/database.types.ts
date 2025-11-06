// Database types generated from Supabase
// Auto-generated based on schema in supabase/migrations/

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: UserRole
          full_name: string
          phone: string | null
          phone_verified: boolean
          city: string | null
          province: string | null
          avatar_url: string | null
          onboarding_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role: UserRole
          full_name: string
          phone?: string | null
          phone_verified?: boolean
          city?: string | null
          province?: string | null
          avatar_url?: string | null
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: UserRole
          full_name?: string
          phone?: string | null
          phone_verified?: boolean
          city?: string | null
          province?: string | null
          avatar_url?: string | null
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      candidate_profiles: {
        Row: {
          user_id: string
          date_of_birth: string | null
          gender: string | null
          address: string | null
          education_level: EducationLevel | null
          major: string | null
          graduation_year: number | null
          gpa: number | null
          is_student: boolean
          skills: string[] | null
          languages: Json | null
          jlpt_level: string | null
          portfolio_url: string | null
          linkedin_url: string | null
          cv_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          date_of_birth?: string | null
          gender?: string | null
          address?: string | null
          education_level?: EducationLevel | null
          major?: string | null
          graduation_year?: number | null
          gpa?: number | null
          is_student?: boolean
          skills?: string[] | null
          languages?: Json | null
          jlpt_level?: string | null
          portfolio_url?: string | null
          linkedin_url?: string | null
          cv_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          date_of_birth?: string | null
          gender?: string | null
          address?: string | null
          education_level?: EducationLevel | null
          major?: string | null
          graduation_year?: number | null
          gpa?: number | null
          is_student?: boolean
          skills?: string[] | null
          languages?: Json | null
          jlpt_level?: string | null
          portfolio_url?: string | null
          linkedin_url?: string | null
          cv_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      candidate_experiences: {
        Row: {
          id: string
          user_id: string
          company: string
          position: string
          start_date: string
          end_date: string | null
          is_current: boolean
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company: string
          position: string
          start_date: string
          end_date?: string | null
          is_current?: boolean
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company?: string
          position?: string
          start_date?: string
          end_date?: string | null
          is_current?: boolean
          description?: string | null
          created_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          user_id: string
          type: DocumentType
          file_url: string
          file_name: string | null
          file_size: number | null
          verified: boolean
          verified_at: string | null
          verified_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: DocumentType
          file_url: string
          file_name?: string | null
          file_size?: number | null
          verified?: boolean
          verified_at?: string | null
          verified_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: DocumentType
          file_url?: string
          file_name?: string | null
          file_size?: number | null
          verified?: boolean
          verified_at?: string | null
          verified_by?: string | null
          created_at?: string
        }
      }
      employers: {
        Row: {
          id: string
          user_id: string
          company_name: string
          industry: string | null
          website: string | null
          address: string | null
          city: string | null
          province: string | null
          nib: string | null
          npwp: string | null
          pic_name: string
          pic_email: string
          pic_phone: string
          pic_position: string | null
          recruitment_location: string[] | null
          recruitment_positions: Json | null
          notes: string | null
          status: ApprovalStatus
          approved_at: string | null
          approved_by: string | null
          rejection_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_name: string
          industry?: string | null
          website?: string | null
          address?: string | null
          city?: string | null
          province?: string | null
          nib?: string | null
          npwp?: string | null
          pic_name: string
          pic_email: string
          pic_phone: string
          pic_position?: string | null
          recruitment_location?: string[] | null
          recruitment_positions?: Json | null
          notes?: string | null
          status?: ApprovalStatus
          approved_at?: string | null
          approved_by?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_name?: string
          industry?: string | null
          website?: string | null
          address?: string | null
          city?: string | null
          province?: string | null
          nib?: string | null
          npwp?: string | null
          pic_name?: string
          pic_email?: string
          pic_phone?: string
          pic_position?: string | null
          recruitment_location?: string[] | null
          recruitment_positions?: Json | null
          notes?: string | null
          status?: ApprovalStatus
          approved_at?: string | null
          approved_by?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      institutions: {
        Row: {
          id: string
          user_id: string
          name: string
          type: InstitutionType
          nib: string | null
          address: string
          city: string
          province: string | null
          latitude: number | null
          longitude: number | null
          email: string
          phone: string
          pic_name: string
          pic_position: string | null
          pic_phone: string
          pic_email: string
          capacity_per_month: number | null
          facilities: string[] | null
          specialties: string[] | null
          programs: Json | null
          certifications: string[] | null
          status: ApprovalStatus
          approved_at: string | null
          approved_by: string | null
          rejection_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: InstitutionType
          nib?: string | null
          address: string
          city: string
          province?: string | null
          latitude?: number | null
          longitude?: number | null
          email: string
          phone: string
          pic_name: string
          pic_position?: string | null
          pic_phone: string
          pic_email: string
          capacity_per_month?: number | null
          facilities?: string[] | null
          specialties?: string[] | null
          programs?: Json | null
          certifications?: string[] | null
          status?: ApprovalStatus
          approved_at?: string | null
          approved_by?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: InstitutionType
          nib?: string | null
          address?: string
          city?: string
          province?: string | null
          latitude?: number | null
          longitude?: number | null
          email?: string
          phone?: string
          pic_name?: string
          pic_position?: string | null
          pic_phone?: string
          pic_email?: string
          capacity_per_month?: number | null
          facilities?: string[] | null
          specialties?: string[] | null
          programs?: Json | null
          certifications?: string[] | null
          status?: ApprovalStatus
          approved_at?: string | null
          approved_by?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      jobs: {
        Row: {
          id: string
          title: string
          slug: string
          employer_id: string
          created_by: string
          is_internal: boolean
          external_url: string | null
          location_city: string | null
          location_country: string | null
          is_remote: boolean
          employment_type: EmploymentType | null
          category: string | null
          requirements: Json | null
          description: string
          responsibilities: string | null
          benefits: string | null
          salary_min: number | null
          salary_max: number | null
          currency: string | null
          salary_negotiable: boolean
          quota: number | null
          deadline: string | null
          status: JobStatus
          published_at: string | null
          screening_questions: Json | null
          views_count: number
          applications_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          employer_id: string
          created_by: string
          is_internal?: boolean
          external_url?: string | null
          location_city?: string | null
          location_country?: string | null
          is_remote?: boolean
          employment_type?: EmploymentType | null
          category?: string | null
          requirements?: Json | null
          description: string
          responsibilities?: string | null
          benefits?: string | null
          salary_min?: number | null
          salary_max?: number | null
          currency?: string | null
          salary_negotiable?: boolean
          quota?: number | null
          deadline?: string | null
          status?: JobStatus
          published_at?: string | null
          screening_questions?: Json | null
          views_count?: number
          applications_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          employer_id?: string
          created_by?: string
          is_internal?: boolean
          external_url?: string | null
          location_city?: string | null
          location_country?: string | null
          is_remote?: boolean
          employment_type?: EmploymentType | null
          category?: string | null
          requirements?: Json | null
          description?: string
          responsibilities?: string | null
          benefits?: string | null
          salary_min?: number | null
          salary_max?: number | null
          currency?: string | null
          salary_negotiable?: boolean
          quota?: number | null
          deadline?: string | null
          status?: JobStatus
          published_at?: string | null
          screening_questions?: Json | null
          views_count?: number
          applications_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      applications: {
        Row: {
          id: string
          job_id: string
          user_id: string
          resume_url: string | null
          cover_letter: string | null
          answers: Json | null
          status: ApplicationStatus
          interview_at: string | null
          interview_location: string | null
          interview_notes: string | null
          notes: string | null
          rating: number | null
          offer_sent_at: string | null
          offer_accepted_at: string | null
          offer_rejected_at: string | null
          offer_rejection_reason: string | null
          applied_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          job_id: string
          user_id: string
          resume_url?: string | null
          cover_letter?: string | null
          answers?: Json | null
          status?: ApplicationStatus
          interview_at?: string | null
          interview_location?: string | null
          interview_notes?: string | null
          notes?: string | null
          rating?: number | null
          offer_sent_at?: string | null
          offer_accepted_at?: string | null
          offer_rejected_at?: string | null
          offer_rejection_reason?: string | null
          applied_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          job_id?: string
          user_id?: string
          resume_url?: string | null
          cover_letter?: string | null
          answers?: Json | null
          status?: ApplicationStatus
          interview_at?: string | null
          interview_location?: string | null
          interview_notes?: string | null
          notes?: string | null
          rating?: number | null
          offer_sent_at?: string | null
          offer_accepted_at?: string | null
          offer_rejected_at?: string | null
          offer_rejection_reason?: string | null
          applied_at?: string
          updated_at?: string
        }
      }
      training_programs: {
        Row: {
          id: string
          title: string
          slug: string
          provider_id: string
          created_by: string
          category: string
          mode: TrainingMode
          description: string
          objectives: string | null
          curriculum: Json | null
          prerequisites: Json | null
          duration_hours: number | null
          duration_days: number | null
          is_external: boolean
          external_url: string | null
          status: JobStatus
          published_at: string | null
          views_count: number
          enrollments_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          provider_id: string
          created_by: string
          category: string
          mode: TrainingMode
          description: string
          objectives?: string | null
          curriculum?: Json | null
          prerequisites?: Json | null
          duration_hours?: number | null
          duration_days?: number | null
          is_external?: boolean
          external_url?: string | null
          status?: JobStatus
          published_at?: string | null
          views_count?: number
          enrollments_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          provider_id?: string
          created_by?: string
          category?: string
          mode?: TrainingMode
          description?: string
          objectives?: string | null
          curriculum?: Json | null
          prerequisites?: Json | null
          duration_hours?: number | null
          duration_days?: number | null
          is_external?: boolean
          external_url?: string | null
          status?: JobStatus
          published_at?: string | null
          views_count?: number
          enrollments_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      training_classes: {
        Row: {
          id: string
          program_id: string
          start_date: string
          end_date: string
          schedule_json: Json | null
          venue: string
          capacity: number
          enrolled_count: number
          enrollment_status: EnrollmentClassStatus
          fee_amount: number
          currency: string | null
          is_free: boolean
          status: ClassStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          program_id: string
          start_date: string
          end_date: string
          schedule_json?: Json | null
          venue: string
          capacity: number
          enrolled_count?: number
          enrollment_status?: EnrollmentClassStatus
          fee_amount?: number
          currency?: string | null
          is_free?: boolean
          status?: ClassStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          program_id?: string
          start_date?: string
          end_date?: string
          schedule_json?: Json | null
          venue?: string
          capacity?: number
          enrolled_count?: number
          enrollment_status?: EnrollmentClassStatus
          fee_amount?: number
          currency?: string | null
          is_free?: boolean
          status?: ClassStatus
          created_at?: string
          updated_at?: string
        }
      }
      enrollments: {
        Row: {
          id: string
          class_id: string
          user_id: string
          status: EnrollmentStatus
          attendance_json: Json | null
          attendance_percentage: number | null
          score: number | null
          passed: boolean | null
          remarks: string | null
          certificate_url: string | null
          certificate_number: string | null
          certificate_issued_at: string | null
          enrolled_at: string
          confirmed_at: string | null
          completed_at: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          class_id: string
          user_id: string
          status?: EnrollmentStatus
          attendance_json?: Json | null
          attendance_percentage?: number | null
          score?: number | null
          passed?: boolean | null
          remarks?: string | null
          certificate_url?: string | null
          certificate_number?: string | null
          certificate_issued_at?: string | null
          enrolled_at?: string
          confirmed_at?: string | null
          completed_at?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          class_id?: string
          user_id?: string
          status?: EnrollmentStatus
          attendance_json?: Json | null
          attendance_percentage?: number | null
          score?: number | null
          passed?: boolean | null
          remarks?: string | null
          certificate_url?: string | null
          certificate_number?: string | null
          certificate_issued_at?: string | null
          enrolled_at?: string
          confirmed_at?: string | null
          completed_at?: string | null
          updated_at?: string
        }
      }
      certificates: {
        Row: {
          id: string
          enrollment_id: string
          number: string
          verify_token: string
          pdf_url: string
          issued_by: string
          issued_at: string
          qr_data: string
          created_at: string
        }
        Insert: {
          id?: string
          enrollment_id: string
          number: string
          verify_token: string
          pdf_url: string
          issued_by: string
          issued_at?: string
          qr_data: string
          created_at?: string
        }
        Update: {
          id?: string
          enrollment_id?: string
          number?: string
          verify_token?: string
          pdf_url?: string
          issued_by?: string
          issued_at?: string
          qr_data?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
      is_employer: {
        Args: Record<string, never>
        Returns: boolean
      }
      is_institution: {
        Args: Record<string, never>
        Returns: boolean
      }
      is_candidate: {
        Args: Record<string, never>
        Returns: boolean
      }
      get_user_employer_id: {
        Args: Record<string, never>
        Returns: string
      }
      get_user_institution_id: {
        Args: Record<string, never>
        Returns: string
      }
    }
    Enums: {
      user_role: UserRole
      approval_status: ApprovalStatus
      job_status: JobStatus
      application_status: ApplicationStatus
      enrollment_status: EnrollmentStatus
      training_mode: TrainingMode
      employment_type: EmploymentType
      institution_type: InstitutionType
      education_level: EducationLevel
      skill_level: SkillLevel
      document_type: DocumentType
      class_status: ClassStatus
      enrollment_class_status: EnrollmentClassStatus
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Common types for the application
export type UserRole = 'candidate' | 'institution' | 'employer' | 'admin'

export type ApprovalStatus = 'pending_approval' | 'approved' | 'rejected'

export type JobStatus = 'draft' | 'pending' | 'published' | 'closed' | 'archived'

export type ApplicationStatus =
  | 'submitted'
  | 'screening'
  | 'interview'
  | 'offer'
  | 'hired'
  | 'rejected'

export type EnrollmentStatus =
  | 'applied'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'failed'
  | 'cancelled'

export type TrainingMode = 'online' | 'offline' | 'hybrid'

export type EmploymentType = 'fulltime' | 'parttime' | 'internship' | 'contract'

export type InstitutionType = 'blk_pemerintah' | 'blk_pesantren' | 'lpk'

export type EducationLevel = 'SMA' | 'SMK' | 'D3' | 'D4' | 'S1' | 'S2' | 'S3'

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'

export type DocumentType = 'KTP' | 'IJAZAH' | 'SERTIFIKAT' | 'CV' | 'FOTO'

export type ClassStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled'

export type EnrollmentClassStatus = 'open' | 'closed' | 'waitlist'

// Action Response type for server actions
export type ActionResponse<T = void> = {
  success: boolean
  message?: string
  data?: T
  error?: string
}
