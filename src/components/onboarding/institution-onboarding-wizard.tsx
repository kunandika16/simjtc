'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ChevronLeft } from 'lucide-react'
import { toast } from 'sonner'
import {
  getInstitutionProfile,
  completeInstitutionOnboarding,
} from '@/actions/institution.actions'

// Step components
import { InstitutionBasicInfoStep } from './steps/institution-basic-info-step'
import { InstitutionContactStep } from './steps/institution-contact-step'
import { InstitutionCapacityStep } from './steps/institution-capacity-step'
import { InstitutionProgramsStep } from './steps/institution-programs-step'

const STEPS = [
  { id: 1, title: 'Informasi Dasar', component: InstitutionBasicInfoStep },
  { id: 2, title: 'Kontak & PIC', component: InstitutionContactStep },
  {
    id: 3,
    title: 'Kapasitas & Fasilitas',
    component: InstitutionCapacityStep,
  },
  { id: 4, title: 'Program & Sertifikasi', component: InstitutionProgramsStep },
]

export function InstitutionOnboardingWizard() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [institutionData, setInstitutionData] = useState<any>(null)

  useEffect(() => {
    loadInstitutionData()
  }, [])

  const loadInstitutionData = async () => {
    const result = await getInstitutionProfile()
    if (result.success && result.data) {
      setInstitutionData(result.data)
    }
  }

  const handleNext = async () => {
    if (currentStep < STEPS.length) {
      setCurrentStep((prev) => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
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
      const result = await completeInstitutionOnboarding()
      if (result.success) {
        toast.success('Onboarding berhasil diselesaikan!')
        router.push('/dashboard')
        router.refresh()
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
    await loadInstitutionData()
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
                className={`absolute left-[calc(${(index + 1) * 25}%-1rem)] top-5 h-0.5 w-[calc(25%-2rem)] ${
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
                institutionData={institutionData}
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
