'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { jobPostingSchema, type JobPostingInput } from '@/lib/validations/job'
import { createJobPosting } from '@/actions/job.actions'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { Loader2, Plus, X } from 'lucide-react'

export function JobPostingForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [requirements, setRequirements] = useState<string[]>([])
  const [requirementInput, setRequirementInput] = useState('')

  const form = useForm<JobPostingInput>({
    resolver: zodResolver(jobPostingSchema),
    defaultValues: {
      title: '',
      description: '',
      responsibilities: '',
      requirements: [],
      benefits: '',
      location_city: '',
      location_country: 'Indonesia',
      is_remote: false,
      employment_type: undefined,
      category: '',
      salary_min: undefined,
      salary_max: undefined,
      salary_negotiable: true,
      quota: undefined,
      deadline: undefined,
      status: 'draft',
    },
  })

  const addRequirement = () => {
    if (requirementInput.trim()) {
      const newReqs = [...requirements, requirementInput.trim()]
      setRequirements(newReqs)
      form.setValue('requirements', newReqs)
      setRequirementInput('')
    }
  }

  const removeRequirement = (index: number) => {
    const newReqs = requirements.filter((_, i) => i !== index)
    setRequirements(newReqs)
    form.setValue('requirements', newReqs)
  }

  const onSubmit = async (data: JobPostingInput) => {
    if (isSubmitting) return // Prevent double submission

    setIsSubmitting(true)
    try {
      const result = await createJobPosting({
        ...data,
        requirements: requirements.length > 0 ? requirements : undefined,
      })

      if (result.success) {
        toast.success(result.message || 'Lowongan berhasil dibuat')
        // Reset form and state
        form.reset()
        setRequirements([])
        setRequirementInput('')
        setIsSubmitting(false) // Reset submitting state
        // Navigate after a short delay to ensure state is cleared
        setTimeout(() => {
          router.push('/dashboard/employer')
          router.refresh()
        }, 100)
      } else {
        toast.error(result.error || 'Gagal membuat lowongan')
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error('Error creating job:', error)
      toast.error('Terjadi kesalahan')
      setIsSubmitting(false)
    }
  }

  const handleSaveAsDraft = async () => {
    const values = form.getValues()
    console.log('Saving as draft with values:', { ...values, status: 'draft' })
    await onSubmit({ ...values, status: 'draft' })
  }

  const handlePublish = async () => {
    // Validate the form first
    const isValid = await form.trigger()

    if (!isValid) {
      const errors = form.formState.errors
      console.log('Form validation errors:', errors)

      // Find first error and show it
      const firstError = Object.values(errors)[0]
      if (firstError && 'message' in firstError) {
        toast.error(firstError.message as string)
      } else {
        toast.error('Mohon lengkapi semua field yang wajib diisi')
      }
      return
    }

    const values = form.getValues()
    console.log('Publishing with values:', { ...values, status: 'published' })
    await onSubmit({ ...values, status: 'published' })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Informasi Dasar</h2>

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Judul Lowongan *</FormLabel>
                <FormControl>
                  <Input placeholder="Contoh: Staff Administrasi" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kategori</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Contoh: Administrasi, IT, Marketing"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="employment_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipe Pekerjaan</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tipe pekerjaan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="fulltime">Full Time</SelectItem>
                    <SelectItem value="parttime">Part Time</SelectItem>
                    <SelectItem value="contract">Kontrak</SelectItem>
                    <SelectItem value="internship">Magang</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deskripsi Pekerjaan *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Jelaskan tentang posisi ini..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Minimal 50 karakter
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="responsibilities"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tanggung Jawab</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Sebutkan tanggung jawab utama..."
                    className="min-h-[100px]"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Requirements */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Persyaratan</h2>

          <FormItem>
            <FormLabel>Requirement</FormLabel>
            <div className="flex gap-2">
              <Input
                placeholder="Contoh: Minimal S1 Akuntansi"
                value={requirementInput}
                onChange={(e) => setRequirementInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addRequirement()
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={addRequirement}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <FormDescription>
              Tekan Enter atau klik tombol + untuk menambah
            </FormDescription>
          </FormItem>

          {requirements.length > 0 && (
            <div className="space-y-2">
              {requirements.map((req, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <span className="text-sm">{req}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRequirement(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <FormField
            control={form.control}
            name="benefits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Benefit</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Contoh: BPJS, Tunjangan transportasi, dll"
                    className="min-h-[100px]"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Location */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Lokasi</h2>

          <FormField
            control={form.control}
            name="location_city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kota</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Contoh: Bandung"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_remote"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Pekerjaan remote/WFH</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* Salary */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Gaji</h2>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="salary_min"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gaji Minimal (IDR)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="4000000"
                      {...field}
                      value={field.value || ''}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseInt(e.target.value) : undefined
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="salary_max"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gaji Maksimal (IDR)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="6000000"
                      {...field}
                      value={field.value || ''}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseInt(e.target.value) : undefined
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="salary_negotiable"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Gaji bisa dinegosiasi</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* Additional Info */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Informasi Tambahan</h2>

          <FormField
            control={form.control}
            name="quota"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kuota Posisi</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="1"
                    {...field}
                    value={field.value || ''}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseInt(e.target.value) : undefined
                      )
                    }
                  />
                </FormControl>
                <FormDescription>
                  Jumlah posisi yang tersedia
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Batas Akhir Lamaran</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveAsDraft}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan sebagai Draft
          </Button>
          <Button
            type="button"
            onClick={handlePublish}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Publish Lowongan
          </Button>
        </div>
      </form>
    </Form>
  )
}
