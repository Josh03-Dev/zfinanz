'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Receipt, MessageSquare, ArrowLeftRight, Settings } from 'lucide-react'

const ITEMS = [
  { icon: LayoutDashboard, label: 'Overview',     href: '/dashboard/portfolio' },
  { icon: Receipt,         label: 'Transactions', href: '/dashboard/transactions' },
  { icon: MessageSquare,   label: 'Messages',     href: '/dashboard/messages', badge: 2 },
  { icon: ArrowLeftRight,  label: 'Transfer',     href: '/dashboard/transfers' },
  { icon: Settings,        label: 'Account',      href: '/dashboard/settings' },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav style={{
      display: 'none',
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'var(--navy)', borderTop: '1px solid var(--border)', zIndex: 100,
    }} className="mobile-bottom-nav">
      <div style={{
        display: 'flex', alignItems: 'stretch',
        padding: '0 4px', paddingBottom: 'var(--safe-bottom)',
        minHeight: 52,
      }}>
        {ITEMS.map(({ icon: Icon, label, href, badge }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href} style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 5,
              padding: '12px 4px 10px', color: active ? 'var(--gold)' : 'var(--mist)',
              position: 'relative',
            }}>
              {active && (
                <div style={{
                  position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                  width: 28, height: 2, background: 'var(--gold)', borderRadius: '0 0 3px 3px',
                }} />
              )}
              <Icon size={22} />
              <span style={{ fontSize: 10, letterSpacing: '.01em', whiteSpace: 'nowrap' }}>{label}</span>
              {badge != null && (
                <div style={{
                  position: 'absolute', top: 8, left: 'calc(50% + 6px)',
                  background: 'var(--gold)', color: 'var(--navy)',
                  fontSize: 8, fontWeight: 700, borderRadius: 10, padding: '1px 5px',
                  lineHeight: 1.5, minWidth: 16, textAlign: 'center',
                }}>
                  {badge}
                </div>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
