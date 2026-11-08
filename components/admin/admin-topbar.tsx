'use client'

import { usePathname } from 'next/navigation'
import { Menu, Bell } from 'lucide-react'
import { readSession } from '@/lib/session-store'

const PAGE_TITLES: Record<string, string> = {
  '/admin/overview':  'Overview',
  '/admin/clients':   'Clients',
  '/admin/transfers': 'Transfers',
  '/admin/messages':  'Messages',
  '/admin/staff':     'Staff',
  '/admin/audit':     'Audit Log',
  '/admin/config':    'System Configuration',
}

function getTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname]
  if (pathname.startsWith('/admin/clients/')) return 'Client Profile'
  if (pathname.startsWith('/admin/staff/')) return 'Staff Profile'
  return 'Administration'
}

interface Props {
  onMenuClick: () => void
}

export function AdminTopBar({ onMenuClick }: Props) {
  const pathname = usePathname()
  const session  = readSession()
  const title    = getTitle(pathname)

  return (
    <header style={{
      position: 'fixed', top: 0, right: 0, zIndex: 100,
      left: 0,
      height: 64,
      background: 'rgba(6,16,30,0.92)', backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(196,164,74,0.1)',
      display: 'flex', alignItems: 'center', padding: '0 28px',
      gap: 16,
    }}
    className="admin-topbar"
    >
      {/* Hamburger (mobile only) */}
      <button
        onClick={onMenuClick}
        className="admin-topbar-menu-btn"
        style={{
          display: 'none', width: 36, height: 36, borderRadius: 6,
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(196,164,74,0.12)',
          alignItems: 'center', justifyContent: 'center',
          color: '#8a9ab0', cursor: 'pointer', flexShrink: 0,
        }}
      >
        <Menu size={18} />
      </button>

      {/* Page title */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 400,
          color: '#e8dcc8', letterSpacing: '.01em',
        }}>
          {title}
        </span>
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Notifications bell */}
        <div style={{ position: 'relative' }}>
          <button style={{
            width: 36, height: 36, borderRadius: 6,
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(196,164,74,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#8a9ab0', cursor: 'pointer',
          }}>
            <Bell size={16} />
          </button>
          <span style={{
            position: 'absolute', top: 6, right: 7,
            width: 7, height: 7, borderRadius: '50%',
            background: '#c4a44a', border: '1.5px solid #06101e',
          }} />
        </div>

        {/* Staff identity chip */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 12px', borderRadius: 6,
          background: 'rgba(196,164,74,0.06)', border: '1px solid rgba(196,164,74,0.12)',
        }}>
          <div style={{
            width: 26, height: 26, borderRadius: '50%',
            background: 'rgba(196,164,74,0.15)', border: '1px solid rgba(196,164,74,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontSize: 10, color: '#c4a44a', flexShrink: 0,
          }}>
            {session?.initials ?? '?'}
          </div>
          <div className="admin-topbar-name">
            <div style={{ fontSize: 11, fontWeight: 500, color: '#e8dcc8' }}>
              {session?.name ?? 'Administrator'}
            </div>
            <div style={{ fontSize: 8, color: 'rgba(138,154,176,0.6)', letterSpacing: '.1em', textTransform: 'uppercase', marginTop: 1 }}>
              {session?.role === 'super_admin' ? 'Super Admin' : session?.role === 'major_admin' ? 'Major Admin' : 'Admin'}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-topbar { left: 0 !important; padding: 0 16px !important; padding-top: var(--safe-top) !important; height: calc(56px + var(--safe-top)) !important; }
          .admin-topbar-menu-btn { display: flex !important; }
          .admin-topbar-name { display: none; }
        }
        @media (min-width: 769px) {
          .admin-topbar { left: 240px !important; }
        }
      `}</style>
    </header>
  )
}
