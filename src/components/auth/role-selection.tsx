'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ROLE_LABELS, USER_ROLES } from '@/lib/constants'
import { UserCircle, Building2, GraduationCap } from 'lucide-react'
import { setUserRole } from '@/actions/auth.actions'
import { toast } from 'sonner'
import type { UserRole } from '@/types/database.types'

interface RoleSelectionProps {
  isOAuth?: boolean
}

const roleConfig = [
  {
    role: USER_ROLES.CANDIDATE,
    label: ROLE_LABELS[USER_ROLES.CANDIDATE],
    description: 'Saya mencari pekerjaan atau ingin mengikuti pelatihan kerja',
    icon: UserCircle,
    features: [
      'Akses lowongan pekerjaan',
      'Daftar program pelatihan',
      'Buat CV digital',
      'Tracking lamaran',
    ],
  },
  {
    role: USER_ROLES.EMPLOYER,
    label: ROLE_LABELS[USER_ROLES.EMPLOYER],
    description: 'Saya dari perusahaan yang ingin merekrut tenaga kerja',
    icon: Building2,
    features: [
      'Posting lowongan kerja',
      'Kelola pelamar',
      'Filter kandidat',
      'Jadwalkan interview',
    ],
  },
  {
    role: USER_ROLES.INSTITUTION,
    label: ROLE_LABELS[USER_ROLES.INSTITUTION],
    description: 'Saya dari BLK/LPK yang menyelenggarakan pelatihan kerja',
    icon: GraduationCap,
    features: [
      'Kelola program pelatihan',
      'Manajemen peserta',
      'Terbitkan sertifikat',
      'Laporan batch',
    ],
  },
]

export function RoleSelection({ isOAuth = false }: RoleSelectionProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<UserRole | null>(null)

  const handleOAuthRoleSelect = async (role: UserRole) => {
    setIsLoading(role)

    try {
      const result = await setUserRole(role)

      if (result.success) {
        toast.success('Role berhasil ditentukan')
        router.push(`/onboarding/${role}`)
      } else {
        toast.error(result.error || 'Terjadi kesalahan')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {roleConfig.map((config) => {
        const Icon = config.icon
        const isCurrentLoading = isLoading === config.role

        return (
          <Card
            key={config.role}
            className="relative overflow-hidden border-2 transition-all hover:border-primary hover:shadow-lg"
          >
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">{config.label}</CardTitle>
              <CardDescription className="text-sm">
                {config.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                {config.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {isOAuth ? (
                <Button
                  className="w-full"
                  onClick={() => handleOAuthRoleSelect(config.role)}
                  disabled={isLoading !== null}
                >
                  {isCurrentLoading ? 'Memproses...' : `Pilih sebagai ${config.label}`}
                </Button>
              ) : (
                <Button asChild className="w-full">
                  <Link href={`/auth/register?role=${config.role}`}>
                    Pilih sebagai {config.label}
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
