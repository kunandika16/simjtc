'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Download, ExternalLink, FileText, Loader2 } from 'lucide-react'

interface DocumentPreviewDialogProps {
  url: string
  label: string
  children?: React.ReactNode
}

export function DocumentPreviewDialog({
  url,
  label,
  children,
}: DocumentPreviewDialogProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  // Determine if the document is a PDF or image
  const isPDF = url.toLowerCase().endsWith('.pdf') || url.includes('/documents/cv') || url.includes('/documents/ktp') || url.includes('/documents/diploma')
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url)

  const handleDownload = () => {
    window.open(url, '_blank')
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Lihat {label}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{label}</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                title="Buka di tab baru"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Buka
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                title="Download"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto bg-muted/20 rounded-lg p-4 min-h-[60vh]">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                Tidak dapat menampilkan preview
              </p>
              <Button variant="outline" onClick={handleDownload}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Buka di tab baru
              </Button>
            </div>
          )}

          {isPDF && !error && (
            <iframe
              src={`${url}#toolbar=0`}
              className="w-full h-full min-h-[60vh] border-0 rounded"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false)
                setError(true)
              }}
              title={label}
            />
          )}

          {isImage && !error && (
            <div className="flex items-center justify-center h-full">
              <img
                src={url}
                alt={label}
                className="max-w-full max-h-full object-contain rounded"
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false)
                  setError(true)
                }}
              />
            </div>
          )}

          {!isPDF && !isImage && !error && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">
                Preview tidak tersedia untuk format file ini
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Klik tombol "Buka" untuk melihat dokumen
              </p>
              <Button variant="outline" onClick={handleDownload}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Buka di tab baru
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
