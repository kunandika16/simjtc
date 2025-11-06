'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { getCandidateProfile, completeCandidateOnboarding } from '@/actions/candidate.actions'

// Step components
import { PersonalDataStep } from './steps/personal-data-step'
import { EducationStep } from './steps/education-step'
import { ExperienceSkillsStep } from './steps/experience-skills-step'
import { DocumentsStep } from './steps/documents-step'
import { CVGenerationStep } from './steps/cv-generation-step'

const STEPS = [
  { id: 1, title: 'Data Pribadi', component: PersonalDataStep },
  { id: 2, title: 'Pendidikan', component: EducationStep },
  { id: 3, title: 'Pengalaman & Skill', component: ExperienceSkillsStep },
  { id: 4, title: 'Dokumen', component: DocumentsStep },
  { id: 5, title: 'Generate CV', component: CVGenerationStep },
]

export function CandidateOnboardingWizard() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState<any>(null)

  useEffect(() => {
    loadProfileData()
  }, [])

  const loadProfileData = async () => {
    const result = await getCandidateProfile()
    if (result.success && result.data) {
      setProfileData(result.data)
    }
  }

  const handleNext = async () => {
    if (currentStep < STEPS.length) {
      setCurrentStep((prev) => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      // Last step - complete onboarding
      await handleComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    try {
      const result = await completeCandidateOnboarding()
      if (result.success) {
        toast.success('Onboarding berhasil diselesaikan!')
        router.push('/dashboard')
      } else {
        toast.error(result.error || 'Gagal menyelesaikan onboarding')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStepComplete = async () => {
    // Reload profile data after each step
    await loadProfileData()
    handleNext()
  }

  const progress = (currentStep / STEPS.length) * 100
  const CurrentStepComponent = STEPS[currentStep - 1].component

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">
            Langkah {currentStep} dari {STEPS.length}
          </span>
          <span className="text-muted-foreground">
            {Math.round(progress)}% selesai
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Steps Indicator */}
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => (
          <div
            key={step.id}
            className="flex flex-1 flex-col items-center gap-2"
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors ${
                currentStep > step.id
                  ? 'border-primary bg-primary text-primary-foreground'
                  : currentStep === step.id
                    ? 'border-primary bg-background text-primary'
                    : 'border-muted bg-background text-muted-foreground'
              }`}
            >
              {step.id}
            </div>
            <span
              className={`hidden text-xs md:block ${
                currentStep >= step.id
                  ? 'font-medium text-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              {step.title}
            </span>
            {index < STEPS.length - 1 && (
              <div
                className={`absolute left-[calc(${(index + 1) * 20}%-1rem)] top-5 h-0.5 w-[calc(20%-2rem)] ${
                  currentStep > step.id ? 'bg-primary' : 'bg-muted'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CurrentStepComponent
                onComplete={handleStepComplete}
                profileData={profileData}
              />
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1 || isLoading}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>

        <div className="text-sm text-muted-foreground">
          {currentStep === STEPS.length
            ? 'Klik Selesai untuk menyelesaikan onboarding'
            : 'Isi data dan klik Lanjut'}
        </div>

        {currentStep === STEPS.length ? (
          <Button onClick={handleComplete} disabled={isLoading}>
            {isLoading ? 'Memproses...' : 'Selesai'}
          </Button>
        ) : null}
      </div>
    </div>
  )
}
