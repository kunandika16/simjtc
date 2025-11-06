'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  updateApplicationStatus,
  scheduleInterview,
  acceptApplication,
  rejectApplication,
} from '@/actions/candidate.actions'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import {
  MoreVertical,
  Calendar,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react'

interface ApplicationActionsProps {
  applicationId: string
  currentStatus: string
}

export function ApplicationActions({
  applicationId,
  currentStatus,
}: ApplicationActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showInterviewDialog, setShowInterviewDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)

  // Interview form state
  const [interviewDate, setInterviewDate] = useState('')
  const [interviewTime, setInterviewTime] = useState('')
  const [interviewLocation, setInterviewLocation] = useState('')
  const [interviewNotes, setInterviewNotes] = useState('')

  // Reject form state
  const [rejectReason, setRejectReason] = useState('')

  const handleScheduleInterview = async () => {
    if (!interviewDate || !interviewTime || !interviewLocation) {
      toast.error('Mohon lengkapi semua field yang wajib diisi')
      return
    }

    setIsLoading(true)
    try {
      const dateTime = `${interviewDate}T${interviewTime}:00`
      const result = await scheduleInterview(
        applicationId,
        dateTime,
        interviewLocation,
        interviewNotes
      )

      if (result.success) {
        toast.success('Interview berhasil dijadwalkan')
        setShowInterviewDialog(false)
        router.refresh()
      } else {
        toast.error(result.error || 'Gagal menjadwalkan interview')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAccept = async () => {
    setIsLoading(true)
    try {
      const result = await acceptApplication(applicationId)

      if (result.success) {
        toast.success('Kandidat berhasil diterima')
        router.refresh()
      } else {
        toast.error(result.error || 'Gagal menerima kandidat')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReject = async () => {
    setIsLoading(true)
    try {
      const result = await rejectApplication(applicationId, rejectReason)

      if (result.success) {
        toast.success('Aplikasi berhasil ditolak')
        setShowRejectDialog(false)
        router.refresh()
      } else {
        toast.error(result.error || 'Gagal menolak aplikasi')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangeStatus = async (
    status: 'submitted' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected'
  ) => {
    setIsLoading(true)
    try {
      const result = await updateApplicationStatus(applicationId, status)

      if (result.success) {
        toast.success('Status berhasil diperbarui')
        router.refresh()
      } else {
        toast.error(result.error || 'Gagal memperbarui status')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MoreVertical className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {currentStatus !== 'interview' && currentStatus !== 'rejected' && (
            <DropdownMenuItem onClick={() => setShowInterviewDialog(true)}>
              <Calendar className="mr-2 h-4 w-4" />
              Jadwalkan Interview
            </DropdownMenuItem>
          )}

          {currentStatus !== 'offer' &&
            currentStatus !== 'hired' &&
            currentStatus !== 'rejected' && (
              <DropdownMenuItem onClick={handleAccept}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Terima Kandidat
              </DropdownMenuItem>
            )}

          {currentStatus !== 'rejected' && (
            <DropdownMenuItem
              onClick={() => setShowRejectDialog(true)}
              className="text-destructive focus:text-destructive"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Tolak Aplikasi
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          {currentStatus !== 'screening' && (
            <DropdownMenuItem onClick={() => handleChangeStatus('screening')}>
              Ubah ke Screening
            </DropdownMenuItem>
          )}

          {currentStatus !== 'hired' && currentStatus !== 'rejected' && (
            <DropdownMenuItem onClick={() => handleChangeStatus('hired')}>
              Ubah ke Hired
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Interview Dialog */}
      <Dialog open={showInterviewDialog} onOpenChange={setShowInterviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Jadwalkan Interview</DialogTitle>
            <DialogDescription>
              Tentukan jadwal dan lokasi interview untuk kandidat ini
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Tanggal *</Label>
                <Input
                  id="date"
                  type="date"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Waktu *</Label>
                <Input
                  id="time"
                  type="time"
                  value={interviewTime}
                  onChange={(e) => setInterviewTime(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Lokasi Interview *</Label>
              <Input
                id="location"
                placeholder="Contoh: Kantor Pusat, Ruang Meeting A"
                value={interviewLocation}
                onChange={(e) => setInterviewLocation(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Catatan</Label>
              <Textarea
                id="notes"
                placeholder="Tambahan informasi untuk kandidat..."
                value={interviewNotes}
                onChange={(e) => setInterviewNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowInterviewDialog(false)}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button onClick={handleScheduleInterview} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Jadwalkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tolak Aplikasi</DialogTitle>
            <DialogDescription>
              Berikan alasan penolakan untuk kandidat ini (opsional)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Alasan Penolakan</Label>
              <Textarea
                id="reason"
                placeholder="Contoh: Kualifikasi tidak sesuai dengan kebutuhan..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRejectDialog(false)}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Tolak Aplikasi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
