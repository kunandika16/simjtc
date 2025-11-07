'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import { ApplyJobDialog } from './apply-job-dialog'

interface ApplyButtonProps {
  job: any
  candidateProfile: any
  hasApplied: boolean
  isExpired: boolean
}

export function ApplyButton({
  job,
  candidateProfile,
  hasApplied,
  isExpired,
}: ApplyButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (hasApplied) {
    return (
      <Button disabled className="w-full" size="lg">
        <CheckCircle2 className="mr-2 h-5 w-5" />
        Sudah Melamar
      </Button>
    )
  }

  if (isExpired) {
    return (
      <Button disabled className="w-full" size="lg" variant="destructive">
        <AlertCircle className="mr-2 h-5 w-5" />
        Lowongan Ditutup
      </Button>
    )
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="w-full" size="lg">
        Lamar Sekarang
      </Button>
      <ApplyJobDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        job={job}
        candidateProfile={candidateProfile}
      />
    </>
  )
}
