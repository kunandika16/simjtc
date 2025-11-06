// Application Constants

export const APP_NAME = 'SIM P2TK Jawa Barat'
export const APP_DESCRIPTION =
  'Sistem Informasi Program Penyaluran & Pelatihan Tenaga Kerja Jawa Barat'

// Brand Colors
export const BRAND_COLORS = {
  orange: '#F47B20',
  white: '#FFFFFF',
  black: '#1E1E1E',
} as const

// User Roles
export const USER_ROLES = {
  CANDIDATE: 'candidate',
  INSTITUTION: 'institution',
  EMPLOYER: 'employer',
  ADMIN: 'admin',
} as const

export const ROLE_LABELS = {
  [USER_ROLES.CANDIDATE]: 'Lulusan / Mahasiswa',
  [USER_ROLES.INSTITUTION]: 'Mitra BLK/LPK',
  [USER_ROLES.EMPLOYER]: 'Perusahaan / Employer',
  [USER_ROLES.ADMIN]: 'Administrator',
} as const

// Education Levels
export const EDUCATION_LEVELS = [
  { value: 'SMA', label: 'SMA' },
  { value: 'SMK', label: 'SMK' },
  { value: 'D3', label: 'D3' },
  { value: 'D4', label: 'D4' },
  { value: 'S1', label: 'S1' },
  { value: 'S2', label: 'S2' },
  { value: 'S3', label: 'S3' },
] as const

// Skill Levels
export const SKILL_LEVELS = [
  { value: 'Beginner', label: 'Pemula' },
  { value: 'Intermediate', label: 'Menengah' },
  { value: 'Advanced', label: 'Lanjutan' },
  { value: 'Expert', label: 'Ahli' },
] as const

// Institution Types
export const INSTITUTION_TYPES = [
  { value: 'blk_pemerintah', label: 'BLK Pemerintah' },
  { value: 'blk_pesantren', label: 'BLK Pesantren' },
  { value: 'lpk', label: 'LPK' },
] as const

// Employment Types
export const EMPLOYMENT_TYPES = [
  { value: 'fulltime', label: 'Full Time' },
  { value: 'parttime', label: 'Part Time' },
  { value: 'internship', label: 'Magang' },
  { value: 'contract', label: 'Kontrak' },
] as const

// Training Modes
export const TRAINING_MODES = [
  { value: 'online', label: 'Online' },
  { value: 'offline', label: 'Offline' },
  { value: 'hybrid', label: 'Hybrid' },
] as const

// Application Statuses
export const APPLICATION_STATUSES = {
  SUBMITTED: 'submitted',
  SCREENING: 'screening',
  INTERVIEW: 'interview',
  OFFER: 'offer',
  HIRED: 'hired',
  REJECTED: 'rejected',
} as const

export const APPLICATION_STATUS_LABELS = {
  [APPLICATION_STATUSES.SUBMITTED]: 'Diajukan',
  [APPLICATION_STATUSES.SCREENING]: 'Screening',
  [APPLICATION_STATUSES.INTERVIEW]: 'Interview',
  [APPLICATION_STATUSES.OFFER]: 'Penawaran',
  [APPLICATION_STATUSES.HIRED]: 'Diterima',
  [APPLICATION_STATUSES.REJECTED]: 'Ditolak',
} as const

// Enrollment Statuses
export const ENROLLMENT_STATUSES = {
  APPLIED: 'applied',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
} as const

export const ENROLLMENT_STATUS_LABELS = {
  [ENROLLMENT_STATUSES.APPLIED]: 'Diajukan',
  [ENROLLMENT_STATUSES.CONFIRMED]: 'Dikonfirmasi',
  [ENROLLMENT_STATUSES.IN_PROGRESS]: 'Berlangsung',
  [ENROLLMENT_STATUSES.COMPLETED]: 'Selesai',
  [ENROLLMENT_STATUSES.FAILED]: 'Gagal',
  [ENROLLMENT_STATUSES.CANCELLED]: 'Dibatalkan',
} as const

// Job Statuses
export const JOB_STATUSES = {
  DRAFT: 'draft',
  PENDING: 'pending',
  PUBLISHED: 'published',
  CLOSED: 'closed',
  ARCHIVED: 'archived',
} as const

export const JOB_STATUS_LABELS = {
  [JOB_STATUSES.DRAFT]: 'Draft',
  [JOB_STATUSES.PENDING]: 'Menunggu Persetujuan',
  [JOB_STATUSES.PUBLISHED]: 'Dipublikasikan',
  [JOB_STATUSES.CLOSED]: 'Ditutup',
  [JOB_STATUSES.ARCHIVED]: 'Diarsipkan',
} as const

// Document Types
export const DOCUMENT_TYPES = {
  KTP: 'KTP',
  IJAZAH: 'IJAZAH',
  SERTIFIKAT: 'SERTIFIKAT',
  CV: 'CV',
  FOTO: 'FOTO',
} as const

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const

// File Upload
export const FILE_UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'image/jpeg', 'image/png'],
} as const

// JLPT Levels
export const JLPT_LEVELS = [
  { value: 'N5', label: 'N5' },
  { value: 'N4', label: 'N4' },
  { value: 'N3', label: 'N3' },
  { value: 'N2', label: 'N2' },
  { value: 'N1', label: 'N1' },
] as const

// Languages
export const LANGUAGES = [
  { value: 'id', label: 'Bahasa Indonesia' },
  { value: 'en', label: 'English' },
  { value: 'jp', label: '日本語 (Japanese)' },
] as const

// Provinces in West Java
export const PROVINCES = [
  { value: 'Jawa Barat', label: 'Jawa Barat' },
] as const

// Cities/Regencies in West Java
export const CITIES_JABAR = [
  { value: 'Bandung', label: 'Kota Bandung' },
  { value: 'Bandung Barat', label: 'Kab. Bandung Barat' },
  { value: 'Bekasi', label: 'Kota Bekasi' },
  { value: 'Bogor', label: 'Kota Bogor' },
  { value: 'Cimahi', label: 'Kota Cimahi' },
  { value: 'Cirebon', label: 'Kota Cirebon' },
  { value: 'Depok', label: 'Kota Depok' },
  { value: 'Sukabumi', label: 'Kota Sukabumi' },
  { value: 'Tasikmalaya', label: 'Kota Tasikmalaya' },
  { value: 'Banjar', label: 'Kota Banjar' },
  { value: 'Bandung', label: 'Kab. Bandung' },
  { value: 'Bekasi', label: 'Kab. Bekasi' },
  { value: 'Bogor', label: 'Kab. Bogor' },
  { value: 'Ciamis', label: 'Kab. Ciamis' },
  { value: 'Cianjur', label: 'Kab. Cianjur' },
  { value: 'Cirebon', label: 'Kab. Cirebon' },
  { value: 'Garut', label: 'Kab. Garut' },
  { value: 'Indramayu', label: 'Kab. Indramayu' },
  { value: 'Karawang', label: 'Kab. Karawang' },
  { value: 'Kuningan', label: 'Kab. Kuningan' },
  { value: 'Majalengka', label: 'Kab. Majalengka' },
  { value: 'Pangandaran', label: 'Kab. Pangandaran' },
  { value: 'Purwakarta', label: 'Kab. Purwakarta' },
  { value: 'Subang', label: 'Kab. Subang' },
  { value: 'Sukabumi', label: 'Kab. Sukabumi' },
  { value: 'Sumedang', label: 'Kab. Sumedang' },
  { value: 'Tasikmalaya', label: 'Kab. Tasikmalaya' },
] as const

// Countries
export const COUNTRIES = [
  { value: 'Indonesia', label: 'Indonesia' },
  { value: 'Japan', label: 'Jepang' },
  { value: 'Singapore', label: 'Singapura' },
  { value: 'Malaysia', label: 'Malaysia' },
  { value: 'Other', label: 'Lainnya' },
] as const
