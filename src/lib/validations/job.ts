import { z } from 'zod'

// Job Posting Form Schema
export const jobPostingSchema = z.object({
  title: z
    .string()
    .min(5, 'Judul lowongan minimal 5 karakter')
    .max(200, 'Judul lowongan maksimal 200 karakter'),

  description: z
    .string()
    .min(50, 'Deskripsi minimal 50 karakter')
    .max(5000, 'Deskripsi maksimal 5000 karakter'),

  responsibilities: z
    .string()
    .max(3000, 'Tanggung jawab maksimal 3000 karakter')
    .optional()
    .nullable()
    .transform(val => val || undefined),

  requirements: z
    .array(z.string().min(1, 'Requirement tidak boleh kosong'))
    .optional()
    .nullable()
    .transform(val => val && val.length > 0 ? val : undefined),

  benefits: z
    .string()
    .max(2000, 'Benefit maksimal 2000 karakter')
    .optional()
    .nullable(),

  location_city: z
    .string()
    .min(2, 'Kota minimal 2 karakter')
    .optional()
    .nullable(),

  location_country: z
    .string()
    .default('Indonesia')
    .optional(),

  is_remote: z.boolean().default(false),

  employment_type: z
    .enum(['fulltime', 'parttime', 'internship', 'contract'], {
      message: 'Pilih tipe pekerjaan',
    })
    .optional()
    .nullable(),

  category: z
    .string()
    .min(2, 'Kategori minimal 2 karakter')
    .optional()
    .nullable(),

  salary_min: z
    .number()
    .min(0, 'Gaji minimal harus lebih dari 0')
    .optional()
    .nullable(),

  salary_max: z
    .number()
    .min(0, 'Gaji maksimal harus lebih dari 0')
    .optional()
    .nullable(),

  salary_negotiable: z.boolean().default(true),

  quota: z
    .number()
    .int('Quota harus bilangan bulat')
    .min(1, 'Quota minimal 1')
    .optional()
    .nullable(),

  deadline: z
    .string()
    .optional()
    .nullable(),

  status: z
    .enum(['draft', 'pending', 'published', 'closed', 'archived'], {
      message: 'Pilih status lowongan',
    })
    .default('draft'),
}).refine(
  (data) => {
    // If both salary_min and salary_max are provided, max should be >= min
    if (data.salary_min && data.salary_max) {
      return data.salary_max >= data.salary_min
    }
    return true
  },
  {
    message: 'Gaji maksimal harus lebih besar atau sama dengan gaji minimal',
    path: ['salary_max'],
  }
)

export type JobPostingInput = z.infer<typeof jobPostingSchema>

// Quick Job Post Schema (minimal fields for quick posting)
export const quickJobPostingSchema = z.object({
  title: z
    .string()
    .min(5, 'Judul lowongan minimal 5 karakter')
    .max(200, 'Judul lowongan maksimal 200 karakter'),

  description: z
    .string()
    .min(50, 'Deskripsi minimal 50 karakter'),

  location_city: z
    .string()
    .min(2, 'Kota minimal 2 karakter')
    .optional()
    .nullable(),

  is_remote: z.boolean().default(false),

  employment_type: z
    .enum(['fulltime', 'parttime', 'internship', 'contract'], {
      message: 'Pilih tipe pekerjaan',
    })
    .optional()
    .nullable(),
})

export type QuickJobPostingInput = z.infer<typeof quickJobPostingSchema>

// Job Update Schema (all fields optional except those that shouldn't change)
export const jobUpdateSchema = jobPostingSchema.partial()

export type JobUpdateInput = z.infer<typeof jobUpdateSchema>
