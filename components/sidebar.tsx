'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Activity, Landmark, BarChart2, Hexagon, Cpu,
  Building2, Archive, ArrowLeftRight, FileText, MessageSquare,
  Users, Settings, Shield, ChevronRight, Receipt, LogOut, UserCheck, Bell,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { ZPFLogo } from './zpf-logo'
import { mockUser, mockSession as defaultSession } from '@/lib/mock-data'
import { readSession, clearSession } from '@/lib/session-store'

interface NavItem {
  icon: LucideIcon
  label: string
  href: string
  badge?: number
}

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
      { icon: Landmark,   label: 'Monetary Holdings', href: '/dashboard/monetary' },
      { icon: BarChart2,  label: 'Securities',         href: '/dashboard/securities' },
      { icon: Hexagon,    label: 'Precious Metals',    href: '/dashboard/metals' },
      { icon: Cpu,        label: 'Digital Assets',     href: '/dashboard/digital' },
      { icon: Building2,  label: 'Real Estate',        href: '/dashboard/real-estate' },
      { icon: Archive,    label: 'Document Vault',     href: '/dashboard/vault' },
    ],
  },
  {
    section: 'Services',
    items: [
      { icon: Receipt,         label: 'Transactions',     href: '/dashboard/transactions' },
      { icon: ArrowLeftRight,  label: 'Transfer Request', href: '/dashboard/transfers' },
      { icon: FileText,        label: 'Statements',       href: '/dashboard/statements' },
      { icon: MessageSquare,   label: 'Secure Messages',  href: '/dashboard/messages', badge: 2 },
      { icon: Bell,            label: 'Notifications',    href: '/dashboard/notifications', badge: 2 },
      { icon: Users,           label: 'Beneficiaries',    href: '/dashboard/beneficiaries' },
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

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const mockSession = readSession() ?? defaultSession

  function signOut() {
    clearSession()
    router.replace('/login')
  }

  return (
    <aside style={{
      width: 240, flexShrink: 0, background: 'var(--navy)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', padding: '28px 0',
      position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
    }}>
      <div style={{ padding: '0 24px 28px', borderBottom: '1px solid var(--border)', marginBottom: 16 }}>
        <ZPFLogo />
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {NAV.map(({ section, items }) => {
          // Trustees tab is hidden for trustee sessions — they must not see other trustees
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
                <Link key={href} href={href} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 12px', borderRadius: 'var(--radius)',
                  fontSize: 12, marginBottom: 2, cursor: 'pointer',
                  color: active ? 'var(--gold2)' : 'var(--mist)',
                  background: active ? 'rgba(196,164,74,0.1)' : 'transparent',
                }}>
                  <Icon size={15} style={{ flexShrink: 0, color: active ? 'var(--gold)' : undefined }} />
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
            {section === 'Account' && (
              <button onClick={signOut} style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                padding: '9px 12px', borderRadius: 'var(--radius)',
                fontSize: 12, marginBottom: 2, cursor: 'pointer',
                color: 'rgba(192,57,43,0.8)', background: 'transparent', border: 'none',
              }}>
                <LogOut size={15} style={{ flexShrink: 0 }} />
                Sign Out
              </button>
            )}
          </div>
        )
        })}
      </div>

      <div style={{ padding: '16px 12px 0', borderTop: '1px solid var(--border)' }}>
        <Link href="/dashboard/profile" style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 12px', borderRadius: 'var(--radius)', cursor: 'pointer',
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'rgba(196,164,74,0.15)', border: '1px solid rgba(196,164,74,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--gold2)', flexShrink: 0,
            overflow: 'hidden',
          }}>
            {mockUser.initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--cream)' }}>{mockUser.name}</div>
            <div style={{ fontSize: 9, color: 'var(--mist)', fontFamily: 'var(--font-mono)', marginTop: 1 }}>{mockUser.id}</div>
            {mockSession.role === 'trustee' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
                <span style={{
                  fontSize: 7, letterSpacing: '.08em', textTransform: 'uppercase',
                  padding: '1px 5px', borderRadius: 3,
                  background: 'rgba(196,164,74,0.15)', color: 'var(--gold)',
                  border: '1px solid rgba(196,164,74,0.3)',
                }}>Trustee</span>
                <span style={{ fontSize: 9, color: 'rgba(138,154,176,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{mockSession.name}</span>
              </div>
            )}
          </div>
          <ChevronRight size={13} style={{ color: 'var(--mist)', flexShrink: 0 }} />
        </Link>
      </div>
    </aside>
  )
}
