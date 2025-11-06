import { Badge } from '@/components/ui/badge'

interface ApplicationStatusBadgeProps {
  status: string
}

export function ApplicationStatusBadge({ status }: ApplicationStatusBadgeProps) {
  const variants: Record<
    string,
    { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }
  > = {
    submitted: { label: 'Menunggu', variant: 'secondary' },
    screening: { label: 'Screening', variant: 'outline' },
    interview: { label: 'Interview', variant: 'default' },
    offer: { label: 'Offer Sent', variant: 'default' },
    hired: { label: 'Diterima', variant: 'default' },
    rejected: { label: 'Ditolak', variant: 'destructive' },
  }

  const config = variants[status] || variants.submitted

  return <Badge variant={config.variant}>{config.label}</Badge>
}
