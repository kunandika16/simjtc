'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  publishJob,
  closeJob,
  archiveJob,
  deleteJobPosting,
} from '@/actions/job.actions'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import {
  MoreVertical,
  Eye,
  EyeOff,
  Archive,
  Trash2,
  Loader2,
} from 'lucide-react'

interface JobActionsProps {
  jobId: string
  currentStatus: string
}

export function JobActions({ jobId, currentStatus }: JobActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handlePublish = async () => {
    setIsLoading(true)
    try {
      const result = await publishJob(jobId)
      if (result.success) {
        toast.success('Lowongan berhasil dipublikasi')
        router.refresh()
      } else {
        toast.error(result.error || 'Gagal mempublikasi lowongan')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = async () => {
    setIsLoading(true)
    try {
      const result = await closeJob(jobId)
      if (result.success) {
        toast.success('Lowongan berhasil ditutup')
        router.refresh()
      } else {
        toast.error(result.error || 'Gagal menutup lowongan')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }

  const handleArchive = async () => {
    setIsLoading(true)
    try {
      const result = await archiveJob(jobId)
      if (result.success) {
        toast.success('Lowongan berhasil diarsipkan')
        router.refresh()
      } else {
        toast.error(result.error || 'Gagal mengarsipkan lowongan')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      const result = await deleteJobPosting(jobId)
      if (result.success) {
        toast.success('Lowongan berhasil dihapus')
        router.push('/dashboard/employer')
        router.refresh()
      } else {
        toast.error(result.error || 'Gagal menghapus lowongan')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    } finally {
      setIsLoading(false)
      setShowDeleteDialog(false)
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
          {currentStatus === 'draft' && (
            <DropdownMenuItem onClick={handlePublish}>
              <Eye className="mr-2 h-4 w-4" />
              Publikasi
            </DropdownMenuItem>
          )}

          {currentStatus === 'published' && (
            <DropdownMenuItem onClick={handleClose}>
              <EyeOff className="mr-2 h-4 w-4" />
              Tutup Lowongan
            </DropdownMenuItem>
          )}

          {(currentStatus === 'closed' || currentStatus === 'published') && (
            <DropdownMenuItem onClick={handleArchive}>
              <Archive className="mr-2 h-4 w-4" />
              Arsipkan
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus lowongan?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Lowongan akan dihapus
              permanen dari sistem termasuk semua data aplikasi yang terkait.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                'Hapus'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
