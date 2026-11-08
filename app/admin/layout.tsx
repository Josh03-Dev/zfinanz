'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminTopBar } from '@/components/admin/admin-topbar'
import { readSession } from '@/lib/session-store'

const ADMIN_ROLES = new Set(['super_admin', 'major_admin', 'admin'])

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [ready,      setReady]      = useState(false)
  const router = useRouter()

  useEffect(() => {
    const session = readSession()
    if (!session || !ADMIN_ROLES.has(session.role)) {
      router.replace('/login')
    } else {
      setReady(true)
    }
  }, [router])

  if (!ready) return null

  return (
    <div style={{ display: 'flex', background: '#06101e', minHeight: '100vh' }}>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* Sidebar */}
      <div
        className="admin-sidebar-wrapper"
        style={{
          display: 'flex',
          position: 'fixed', top: 0, left: 0, zIndex: 210,
          transform: drawerOpen ? 'translateX(0)' : undefined,
        }}
      >
        <AdminSidebar />
      </div>

      {/* Main content */}
      <div className="admin-main" style={{ flex: 1, minWidth: 0, marginLeft: 240 }}>
        <AdminTopBar onMenuClick={() => setDrawerOpen(true)} />
        <div
          className="admin-content"
          style={{ padding: '32px 36px', paddingTop: 'calc(64px + 32px)' }}
        >
          {children}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar-wrapper {
            transform: translateX(-100%);
            transition: transform .25s ease;
          }
          .admin-sidebar-wrapper.open {
            transform: translateX(0) !important;
          }
          .admin-main { margin-left: 0 !important; }
          .admin-content {
            padding: 16px !important;
            padding-top: calc(56px + var(--safe-top) + 16px) !important;
            padding-bottom: calc(24px + var(--safe-bottom)) !important;
          }
        }
        @media (max-width: 1024px) and (min-width: 769px) {
          .admin-content { padding: 24px 28px !important; padding-top: calc(64px + 24px) !important; }
        }
      `}</style>
    </div>
  )
}
