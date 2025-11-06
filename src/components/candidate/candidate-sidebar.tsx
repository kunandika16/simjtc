'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  User,
  Bookmark,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'

interface CandidateSidebarProps {
  userName: string
}

const menuItems = [
  {
    title: 'Dashboard',
    href: '/dashboard/candidate',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    title: 'Cari Lowongan',
    href: '/dashboard/candidate/jobs',
    icon: Briefcase,
    badge: null,
  },
  {
    title: 'Lamaran Saya',
    href: '/dashboard/candidate/applications',
    icon: FileText,
    badge: null, // Bisa diisi dengan count later
  },
  {
    title: 'Lowongan Tersimpan',
    href: '/dashboard/candidate/saved',
    icon: Bookmark,
    badge: 'Soon',
    disabled: true,
  },
  {
    title: 'Profil Saya',
    href: '/dashboard/candidate/profile',
    icon: User,
    badge: null,
  },
]

const bottomMenuItems = [
  {
    title: 'Notifikasi',
    href: '/dashboard/candidate/notifications',
    icon: Bell,
    badge: 'Soon',
    disabled: true,
  },
  {
    title: 'Pengaturan',
    href: '/dashboard/candidate/settings',
    icon: Settings,
    badge: 'Soon',
    disabled: true,
  },
]

export function CandidateSidebar({ userName }: CandidateSidebarProps) {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === '/dashboard/candidate') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">{userName}</p>
            <p className="text-xs text-muted-foreground">Kandidat</p>
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
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <span className="font-semibold">{userName}</span>
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
