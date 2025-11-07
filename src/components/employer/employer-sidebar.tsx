'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Building2,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'

interface EmployerSidebarProps {
  companyName: string
  logoUrl?: string | null
}

const menuItems = [
  {
    title: 'Dashboard',
    href: '/dashboard/employer',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    title: 'Lowongan Kerja',
    href: '/dashboard/employer/jobs',
    icon: Briefcase,
    badge: null,
  },
  {
    title: 'Lamaran Masuk',
    href: '/dashboard/employer/applications',
    icon: Users,
    badge: null, // Could be filled with new applications count
  },
  {
    title: 'Profil Perusahaan',
    href: '/dashboard/employer/profile',
    icon: Building2,
    badge: null,
  },
]

const bottomMenuItems = [
  {
    title: 'Notifikasi',
    href: '/dashboard/employer/notifications',
    icon: Bell,
    badge: 'Soon',
    disabled: true,
  },
  {
    title: 'Pengaturan',
    href: '/dashboard/employer/settings',
    icon: Settings,
    badge: 'Soon',
    disabled: true,
  },
]

export function EmployerSidebar({ companyName, logoUrl }: EmployerSidebarProps) {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === '/dashboard/employer') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={companyName}
                width={40}
                height={40}
                className="object-cover"
              />
            ) : (
              <Building2 className="h-5 w-5 text-primary" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">{companyName}</p>
            <p className="text-xs text-muted-foreground">Perusahaan</p>
          </div>
        </div>
      </div>

      {/* Main Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="flex-1">{item.title}</span>
              {item.badge && (
                <Badge variant="secondary" className="text-xs">
                  {item.badge}
                </Badge>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Menu */}
      <div className="p-4 border-t space-y-1">
        {bottomMenuItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.href}
              href={item.disabled ? '#' : item.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                item.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="flex-1">{item.title}</span>
              {item.badge && (
                <Badge variant="secondary" className="text-xs">
                  {item.badge}
                </Badge>
              )}
            </Link>
          )
        })}

        {/* Logout */}
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-muted-foreground hover:text-foreground hover:bg-accent w-full"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span className="flex-1 text-left">Keluar</span>
          </button>
        </form>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={companyName}
                  width={32}
                  height={32}
                  className="object-cover"
                />
              ) : (
                <Building2 className="h-4 w-4 text-primary" />
              )}
            </div>
            <span className="font-semibold">{companyName}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            {isMobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          'lg:hidden fixed top-16 left-0 bottom-0 z-40 w-64 bg-background border-r flex flex-col transition-transform duration-200',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col border-r bg-background">
        <SidebarContent />
      </aside>

      {/* Spacer for mobile header */}
      <div className="lg:hidden h-16" />
    </>
  )
}
