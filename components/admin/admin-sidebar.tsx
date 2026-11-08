'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Users, ArrowLeftRight, MessageSquare,
  UserCog, BookOpen, Settings2, LogOut, ShieldAlert,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { ZPFLogo } from '@/components/zpf-logo'
import { readSession, clearSession } from '@/lib/session-store'
import { mockOverviewStats } from '@/lib/admin-mock-data'
import type { SessionRole } from '@/lib/mock-data'

interface NavItem {
  icon: LucideIcon
  label: string
  href: string
  badge?: number
  superAdminOnly?: boolean
}

const NAV: { section: string; items: NavItem[] }[] = [
  {
    section: '',
    items: [
      { icon: LayoutDashboard, label: 'Overview',        href: '/admin/overview' },
      { icon: Users,           label: 'Clients',         href: '/admin/clients' },
      { icon: ArrowLeftRight,  label: 'Transfers',       href: '/admin/transfers',
        badge: mockOverviewStats.pendingTransfers + mockOverviewStats.awaitingCounterTransfers },
      { icon: MessageSquare,   label: 'Messages',        href: '/admin/messages',
        badge: mockOverviewStats.unreadMessages },
    ],
  },
  {
    section: 'Management',
    items: [
      { icon: UserCog,   label: 'Staff',     href: '/admin/staff' },
      { icon: BookOpen,  label: 'Audit Log', href: '/admin/audit' },
    ],
  },
  {
    section: 'System',
    items: [
      { icon: Settings2, label: 'System Config', href: '/admin/config', superAdminOnly: true },
    ],
  },
]

const ROLE_LABELS: Partial<Record<SessionRole, string>> = {
  super_admin: 'SUPER ADMIN',
  major_admin: 'MAJOR ADMIN',
  admin: 'ADMIN',
}

const ROLE_COLORS: Partial<Record<SessionRole, { bg: string; border: string; text: string }>> = {
  super_admin: { bg: 'rgba(196,164,74,0.15)', border: 'rgba(196,164,74,0.4)', text: '#c4a44a' },
  major_admin: { bg: 'rgba(196,164,74,0.1)',  border: 'rgba(196,164,74,0.25)', text: '#a08c3a' },
  admin:       { bg: 'rgba(138,154,176,0.1)', border: 'rgba(138,154,176,0.25)', text: '#8a9ab0' },
}

export function AdminSidebar() {
  const pathname = usePathname()
  const router   = useRouter()
  const session  = readSession()
  const role     = (session?.role ?? 'admin') as SessionRole

  function signOut() {
    clearSession()
    router.replace('/login')
  }

  const roleLabel  = ROLE_LABELS[role] ?? 'STAFF'
  const roleColors = ROLE_COLORS[role] ?? ROLE_COLORS.admin!

  return (
    <aside style={{
      width: 240, flexShrink: 0,
      background: '#06101e',
      borderRight: '1px solid rgba(196,164,74,0.1)',
      display: 'flex', flexDirection: 'column', padding: '28px 0',
      position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
    }}>
      {/* Logo + wordmark */}
      <div style={{ padding: '0 24px 24px', borderBottom: '1px solid rgba(196,164,74,0.1)', marginBottom: 16 }}>
        <ZPFLogo />
        <div style={{
          marginTop: 10, fontSize: 8, letterSpacing: '.3em', textTransform: 'uppercase',
          color: 'rgba(138,154,176,0.5)',
        }}>
          Administration Panel
        </div>
      </div>

      {/* Nav */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {NAV.map(({ section, items }) => {
          const visibleItems = items.filter(item => {
            if (item.superAdminOnly && role !== 'super_admin') return false
            return true
          })
          if (visibleItems.length === 0) return null
          return (
            <div key={section || '_main'} style={{ padding: '0 12px', marginBottom: 8 }}>
              {section && (
                <div style={{
                  fontSize: 8, letterSpacing: '.35em', textTransform: 'uppercase',
                  color: 'rgba(138,154,176,0.35)', padding: '8px 12px 6px',
                }}>
                  {section}
                </div>
              )}
              {visibleItems.map(({ icon: Icon, label, href, badge }) => {
                const active = pathname === href || (href !== '/admin/overview' && pathname.startsWith(href))
                return (
                  <Link key={href} href={href} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '9px 12px', borderRadius: 6,
                    fontSize: 12, marginBottom: 2, cursor: 'pointer',
                    textDecoration: 'none',
                    color: active ? '#c4a44a' : '#8a9ab0',
                    background: active ? 'rgba(196,164,74,0.09)' : 'transparent',
                  }}>
                    <Icon size={15} style={{ flexShrink: 0, color: active ? '#c4a44a' : '#8a9ab0' }} />
                    {label}
                    {badge != null && badge > 0 && (
                      <span style={{
                        marginLeft: 'auto', fontSize: 9,
                        background: '#c4a44a', color: '#06101e',
                        padding: '1px 6px', borderRadius: 10, fontWeight: 600,
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
      </div>

      {/* Bottom: identity + logout */}
      <div style={{ padding: '16px 12px 0', borderTop: '1px solid rgba(196,164,74,0.08)' }}>
        {/* Anomaly indicator for super_admin */}
        {role === 'super_admin' && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
            padding: '8px 12px', borderRadius: 6,
            background: 'rgba(196,164,74,0.04)', border: '1px solid rgba(196,164,74,0.1)',
            fontSize: 10, color: 'rgba(138,154,176,0.7)',
          }}>
            <ShieldAlert size={13} style={{ color: '#c4a44a', flexShrink: 0 }} />
            <span>Full system access</span>
          </div>
        )}

        {/* Identity card */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 12px', borderRadius: 6,
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: roleColors.bg, border: `1px solid ${roleColors.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontSize: 13, color: roleColors.text, flexShrink: 0,
          }}>
            {session?.initials ?? '??'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: '#e8dcc8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {session?.name ?? 'Administrator'}
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 0, marginTop: 3,
              fontSize: 7, letterSpacing: '.1em', textTransform: 'uppercase',
              padding: '1px 6px', borderRadius: 3,
              background: roleColors.bg, color: roleColors.text,
              border: `1px solid ${roleColors.border}`,
            }}>
              {roleLabel}
            </div>
          </div>
        </div>

        {/* Sign out */}
        <button onClick={signOut} style={{
          display: 'flex', alignItems: 'center', gap: 10, width: '100%',
          padding: '9px 12px', borderRadius: 6, marginTop: 4,
          fontSize: 12, cursor: 'pointer',
          color: 'rgba(192,57,43,0.8)', background: 'transparent', border: 'none',
        }}>
          <LogOut size={15} style={{ flexShrink: 0 }} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
