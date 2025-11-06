import { z } from 'zod'

// Step 1: Personal Data
export const candidatePersonalDataSchema = z.object({
  nik: z
    .string()
    .length(16, 'NIK harus 16 digit')
    .regex(/^\d+$/, 'NIK harus berupa angka'),
  full_name: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
  birth_place: z.string().min(2, 'Tempat lahir minimal 2 karakter'),
  birth_date: z.string().min(1, 'Tanggal lahir wajib diisi'),
  gender: z.enum(['male', 'female'], {
    message: 'Pilih jenis kelamin',
  }),
  address: z.string().min(10, 'Alamat minimal 10 karakter'),
  phone: z
    .string()
    .regex(/^(\+62|62|0)[0-9]{9,12}$/, 'Nomor telepon tidak valid'),
})

export type CandidatePersonalDataInput = z.infer<
  typeof candidatePersonalDataSchema
>

// Step 2: Education
export const candidateEducationSchema = z.object({
  education_level: z.enum(
    ['smp', 'sma', 'smk', 'd1', 'd2', 'd3', 'd4', 's1', 's2', 's3'],
    {
      message: 'Pilih jenjang pendidikan',
    }
  ),
  institution: z.string().min(3, 'Nama institusi minimal 3 karakter'),
  major: z.string().min(2, 'Jurusan minimal 2 karakter'),
  graduation_year: z
    .number()
    .min(1950, 'Tahun lulus tidak valid')
    .max(new Date().getFullYear() + 5, 'Tahun lulus tidak valid'),
  gpa: z
    .number()
    .min(0, 'IPK minimal 0')
    .max(4, 'IPK maksimal 4')
    .optional()
    .nullable(),
})

export type CandidateEducationInput = z.infer<typeof candidateEducationSchema>

// Step 3: Experience & Skills
export const candidateExperienceSchema = z.object({
  company_name: z.string().min(2, 'Nama perusahaan minimal 2 karakter'),
  position: z.string().min(2, 'Posisi minimal 2 karakter'),
  start_date: z.string().min(1, 'Tanggal mulai wajib diisi'),
  end_date: z.string().optional().nullable(),
  is_current: z.boolean().default(false),
  description: z.string().optional().nullable(),
})

export type CandidateExperienceInput = z.infer<typeof candidateExperienceSchema>

export const candidateSkillsSchema = z.object({
  skills: z
    .array(z.string().min(1, 'Skill tidak boleh kosong'))
    .min(1, 'Tambahkan minimal 1 skill'),
  experiences: z.array(candidateExperienceSchema).optional().default([]),
})

export type CandidateSkillsInput = z.infer<typeof candidateSkillsSchema>

// Step 4: Documents (handled via file upload, no schema needed)
export const candidateDocumentsSchema = z.object({
  ktp_url: z.string().optional().nullable(),
  diploma_url: z.string().optional().nullable(),
  certificate_urls: z.array(z.string()).optional().default([]),
})

export type CandidateDocumentsInput = z.infer<typeof candidateDocumentsSchema>

// Step 5: CV Generation (handled separately)
export const candidateCVSchema = z.object({
  template: z.enum(['template_a', 'template_b'], {
    message: 'Pilih template CV',
  }),
})

export type CandidateCVInput = z.infer<typeof candidateCVSchema>
