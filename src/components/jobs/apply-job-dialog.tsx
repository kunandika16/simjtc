'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Loader2, Send, Building2, MapPin, Briefcase, Clock } from 'lucide-react'
import { applyToJob } from '@/actions/application.actions'
import { formatDistanceToNow } from 'date-fns'
import { id as localeId } from 'date-fns/locale'

interface ApplyJobDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  job: {
    id: string
    title: string
    slug: string
    location_city?: string
    employment_type?: string
    deadline?: string
    screening_questions?: any[]
    employers?: {
      company_name: string
      industry?: string
    }
  }
  candidateProfile?: {
    full_name?: string
    cv_url?: string
  }
}

export function ApplyJobDialog({
  open,
  onOpenChange,
  job,
  candidateProfile,
}: ApplyJobDialogProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [screeningAnswers, setScreeningAnswers] = useState<Record<string, string>>({})
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const screeningQuestions = (job.screening_questions as any[]) || []
  const hasScreeningQuestions = screeningQuestions.length > 0

  // Format employment type
  const employmentTypeLabel = {
    fulltime: 'Full Time',
    parttime: 'Part Time',
    internship: 'Internship',
    contract: 'Contract',
  }[job.employment_type || 'fulltime']

  // Deadline text
  const deadlineText = job.deadline
    ? formatDistanceToNow(new Date(job.deadline), {
        addSuffix: true,
        locale: localeId,
      })
    : null

  const handleScreeningAnswerChange = (questionId: string, answer: string) => {
    setScreeningAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const handleSubmit = async () => {
    // Validate required fields
    if (!candidateProfile?.full_name) {
      toast.error('Lengkapi profil Anda terlebih dahulu')
      return
    }

    // Check screening questions
    if (hasScreeningQuestions) {
      const requiredQuestions = screeningQuestions.filter((q) => q.required)
      const unanswered = requiredQuestions.filter(
        (q) => !screeningAnswers[q.id] || screeningAnswers[q.id].trim() === ''
      )

      if (unanswered.length > 0) {
        toast.error('Harap jawab semua pertanyaan yang wajib diisi')
        return
      }
    }

    // Check terms
    if (!agreedToTerms) {
      toast.error('Harap setujui syarat dan ketentuan')
      return
    }

    setIsLoading(true)

    try {
      const result = await applyToJob({
        jobId: job.id,
        coverLetter: coverLetter.trim() || undefined,
        screeningAnswers: hasScreeningQuestions ? screeningAnswers : undefined,
      })

      if (result.success) {
        toast.success(result.message || 'Lamaran berhasil dikirim!')
        onOpenChange(false)
        router.refresh()
        // Redirect to applications page after 1 second
        setTimeout(() => {
          router.push('/dashboard/candidate/applications')
        }, 1000)
      } else {
        toast.error(result.error || 'Gagal mengirim lamaran')
      }
    } catch (error) {
      console.error('Error applying to job:', error)
      toast.error('Terjadi kesalahan saat mengirim lamaran')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Lamar Pekerjaan</DialogTitle>
          <DialogDescription>
            Pastikan semua informasi sudah benar sebelum mengirim lamaran
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Job Summary */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg">{job.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {job.employers?.company_name}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              {job.location_city && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {job.location_city}
                </span>
              )}
              {job.employment_type && (
                <span className="flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5" />
                  {employmentTypeLabel}
                </span>
              )}
              {deadlineText && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Deadline {deadlineText}
                </span>
              )}
            </div>
          </div>

          <Separator />

          {/* Profile Check */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              Profil Anda
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Nama Lengkap:</span>
                <span className="font-medium">
                  {candidateProfile?.full_name || (
                    <Badge variant="destructive">Belum diisi</Badge>
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">CV:</span>
                {candidateProfile?.cv_url ? (
                  <Badge variant="secondary">Sudah upload</Badge>
                ) : (
                  <Badge variant="outline">Belum upload (opsional)</Badge>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Cover Letter */}
          <div className="space-y-3">
            <Label htmlFor="coverLetter">
              Cover Letter <span className="text-muted-foreground">(Opsional)</span>
            </Label>
            <Textarea
              id="coverLetter"
              placeholder="Ceritakan tentang diri Anda dan mengapa Anda tertarik dengan posisi ini..."
              rows={6}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              {coverLetter.length} karakter
            </p>
          </div>

          {/* Screening Questions */}
          {hasScreeningQuestions && (
            <>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-semibold">Pertanyaan Screening</h4>
                {screeningQuestions.map((question, index) => (
                  <div key={question.id || index} className="space-y-2">
                    <Label htmlFor={`question-${index}`}>
                      {question.question}
                      {question.required && (
                        <span className="text-destructive ml-1">*</span>
                      )}
                    </Label>
                    <Textarea
                      id={`question-${index}`}
                      placeholder="Tulis jawaban Anda..."
                      rows={3}
                      value={screeningAnswers[question.id] || ''}
                      onChange={(e) =>
                        handleScreeningAnswerChange(question.id, e.target.value)
                      }
                      disabled={isLoading}
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          <Separator />

          {/* Terms and Conditions */}
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                disabled={isLoading}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Saya setuju dengan syarat dan ketentuan
                </label>
                <p className="text-sm text-muted-foreground">
                  Saya menyatakan bahwa semua informasi yang saya berikan adalah
                  benar dan dapat dipertanggungjawabkan.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading || !agreedToTerms}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mengirim...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Kirim Lamaran
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
