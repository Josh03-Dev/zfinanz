'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'
import { TopBar } from '@/components/topbar'
import { MobileDrawer } from '@/components/mobile-drawer'
import { MobileBottomNav } from '@/components/mobile-bottom-nav'
import { ScrollToTop } from '@/components/scroll-to-top'
import { readSession } from '@/lib/session-store'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [ready, setReady] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const session = readSession()
    if (!session) {
      router.replace('/login')
    } else {
      setReady(true)
    }
  }, [router])

  if (!ready) return null

  return (
    <div style={{ display: 'flex', background: '#0a1628', minHeight: '100vh' }}>
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Sidebar — hidden on mobile via CSS */}
      <div className="sidebar-wrapper" style={{ display: 'flex' }}>
        <Sidebar />
      </div>

      {/* Main content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <TopBar onMenuClick={() => setDrawerOpen(true)} />
        <div className="dashboard-content" style={{ padding: '32px 36px', paddingTop: 'calc(81px + 32px)' }}>
          {children}
        </div>
      </div>

      <ScrollToTop />
      <MobileBottomNav />

      <style>{`
        @media (max-width: 768px) {
          .sidebar-wrapper { display: none !important; }
          .mobile-bottom-nav { display: block !important; }
          .dashboard-content {
            padding: 16px !important;
            padding-top: calc(65px + var(--safe-top) + 16px) !important;
            padding-bottom: calc(72px + var(--safe-bottom)) !important;
          }
        }
        @media (max-width: 1024px) and (min-width: 769px) {
          .dashboard-content { padding: 24px 28px !important; padding-top: calc(81px + 24px) !important; }
        }
      `}</style>
    </div>
  )
}
