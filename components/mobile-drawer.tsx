'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  X, LayoutDashboard, Activity, Landmark, BarChart2, Hexagon, Cpu,
  Building2, Archive, ArrowLeftRight, FileText, MessageSquare,
  Users, Settings, Shield, LogOut, Bell, Receipt, UserCheck,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { ZPFLogo } from './zpf-logo'
import { mockUser, mockSession as defaultSession } from '@/lib/mock-data'
import { clearSession, readSession } from '@/lib/session-store'

interface NavItem { icon: LucideIcon; label: string; href: string; badge?: number }

const NAV: { section: string; items: NavItem[] }[] = [
  {
    section: 'Overview',
    items: [
      { icon: LayoutDashboard, label: 'Portfolio Overview', href: '/dashboard/portfolio' },
      { icon: Activity,        label: 'Performance',        href: '/dashboard/performance' },
    ],
  },
  {
    section: 'Asset Classes',
    items: [
      { icon: Landmark,  label: 'Monetary Holdings', href: '/dashboard/monetary' },
      { icon: BarChart2, label: 'Securities',         href: '/dashboard/securities' },
      { icon: Hexagon,   label: 'Precious Metals',    href: '/dashboard/metals' },
      { icon: Cpu,       label: 'Digital Assets',     href: '/dashboard/digital' },
      { icon: Building2, label: 'Real Estate',        href: '/dashboard/real-estate' },
      { icon: Archive,   label: 'Document Vault',     href: '/dashboard/vault' },
    ],
  },
  {
    section: 'Services',
    items: [
      { icon: Receipt,         label: 'Transactions',     href: '/dashboard/transactions' },
      { icon: ArrowLeftRight, label: 'Transfer Request', href: '/dashboard/transfers' },
      { icon: FileText,       label: 'Statements',       href: '/dashboard/statements' },
      { icon: MessageSquare,  label: 'Secure Messages',  href: '/dashboard/messages', badge: 2 },
      { icon: Bell,           label: 'Notifications',    href: '/dashboard/notifications', badge: 2 },
      { icon: Users,          label: 'Beneficiaries',    href: '/dashboard/beneficiaries' },
    ],
  },
  {
    section: 'Account',
    items: [
      { icon: Settings,   label: 'Preferences', href: '/dashboard/settings' },
      { icon: Shield,     label: 'Security',    href: '/dashboard/security' },
      { icon: UserCheck,  label: 'Trustees',    href: '/dashboard/trustees' },
    ],
  },
]

interface MobileDrawerProps {
  open: boolean
  onClose: () => void
}

function DrawerContent({ open, onClose }: MobileDrawerProps) {
  const pathname = usePathname()
  const router = useRouter()
  const mockSession = readSession() ?? defaultSession

  function signOut() {
    clearSession()
    onClose()
    router.replace('/login')
  }

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(2px)',
          zIndex: 200,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity .3s',
        }}
      />

      {/* Drawer panel */}
      <div style={{
        position: 'fixed', top: 0, left: 0,
        height: '100%', width: 280,
        background: 'var(--navy)',
        borderRight: '1px solid var(--border)',
        zIndex: 201,
        overflowY: 'auto',
        paddingBottom: 'calc(20px + var(--safe-bottom))',
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform .3s cubic-bezier(0.4,0,0.2,1)',
        willChange: 'transform',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 20px 16px',
          borderBottom: '1px solid var(--border)',
        }}>
          <ZPFLogo size="sm" subtitle="Private Portal" />
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: 'var(--radius)',
              background: 'var(--surf)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--mist)', cursor: 'pointer',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <div style={{ padding: '12px 0' }}>
          {NAV.map(({ section, items }) => {
            const visibleItems = mockSession.role === 'trustee'
              ? items.filter(item => item.href !== '/dashboard/trustees')
              : items
            if (visibleItems.length === 0) return null
            return (
            <div key={section} style={{ padding: '0 12px', marginBottom: 8 }}>
              <div style={{
                fontSize: 8, letterSpacing: '.35em', textTransform: 'uppercase',
                color: 'rgba(138,154,176,0.4)', padding: '8px 12px 6px',
              }}>
                {section}
              </div>
              {visibleItems.map(({ icon: Icon, label, href, badge }) => {
                const active = pathname === href
                return (
                  <Link key={href} href={href} onClick={onClose} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px', borderRadius: 'var(--radius)',
                    fontSize: 13, marginBottom: 2,
                    color: active ? 'var(--gold2)' : 'var(--mist)',
                    background: active ? 'rgba(196,164,74,0.1)' : 'transparent',
                  }}>
                    <Icon size={16} style={{ flexShrink: 0, color: active ? 'var(--gold)' : undefined }} />
                    {label}
                    {badge != null && (
                      <span style={{
                        marginLeft: 'auto', fontSize: 9, background: 'var(--gold)',
                        color: 'var(--navy)', padding: '1px 6px', borderRadius: 10, fontWeight: 500,
                      }}>
                        {badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
            )
          })}

          <div style={{ margin: '0 12px' }}>
            <button onClick={signOut} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 12px', borderRadius: 'var(--radius)',
              fontSize: 13, color: 'rgba(192,57,43,0.8)', width: '100%', cursor: 'pointer',
              background: 'transparent', border: 'none',
            }}>
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>

        {/* User */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '14px 20px', borderTop: '1px solid var(--border)', marginTop: 8,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(196,164,74,0.15)', border: '1px solid rgba(196,164,74,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--gold2)', flexShrink: 0,
            overflow: 'hidden',
          }}>
            {mockUser.initials}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--cream)' }}>{mockUser.name}</div>
            <div style={{ fontSize: 10, color: 'var(--mist)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>{mockUser.id}</div>
          </div>
        </div>
      </div>
    </>
  )
}

export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!mounted) return null

  return createPortal(<DrawerContent open={open} onClose={onClose} />, document.body)
}
