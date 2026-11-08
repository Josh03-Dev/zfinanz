'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Bell, ShieldCheck, Menu, ChevronDown, LogOut, Settings, User } from 'lucide-react'
import { mockUser, mockSession as defaultSession } from '@/lib/mock-data'
import { readSession, clearSession } from '@/lib/session-store'
import { useRouter } from 'next/navigation'

interface TopBarProps {
  onMenuClick?: () => void
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const router = useRouter()
  const mockSession = readSession() ?? defaultSession
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 36px',
      borderBottom: '1px solid var(--border)',
      background: 'rgba(8,22,42,0.92)',
      backdropFilter: 'blur(8px)',
      position: 'fixed', top: 0, right: 0, zIndex: 50,
    }} className="topbar-root">

      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          className="topbar-hamburger"
          onClick={onMenuClick}
          style={{
            width: 36, height: 36, borderRadius: 'var(--radius)',
            background: 'var(--surf)', border: '1px solid var(--border)',
            alignItems: 'center', justifyContent: 'center', color: 'var(--mist)',
            cursor: 'pointer', flexShrink: 0,
          }}
        >
          <Menu size={18} />
        </button>

        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 400, color: 'var(--cream)', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'nowrap' }}>
            {greeting}, {mockSession.name.split(' ')[0]}.
            {mockSession.role === 'trustee' && (
              <span className="topbar-trustee-badge" style={{
                fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase', fontFamily: 'var(--font-sans)',
                padding: '2px 8px', borderRadius: 4, whiteSpace: 'nowrap',
                background: 'rgba(196,164,74,0.12)', color: 'var(--gold)',
                border: '1px solid rgba(196,164,74,0.35)', fontWeight: 500,
              }}>
                Trustee · {mockSession.linkedClientName}
              </span>
            )}
          </div>
          {mockSession.role === 'trustee' ? (
            <>
              <div className="topbar-meta" style={{ fontSize: 10, color: 'var(--mist)', display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
                Session active · Last login: Today, 07:42 CET
              </div>
              <div className="topbar-trustee-sub" style={{ display: 'none', alignItems: 'center', gap: 5, marginTop: 2 }}>
                <span style={{
                  fontSize: 8, letterSpacing: '.08em', textTransform: 'uppercase',
                  padding: '1px 6px', borderRadius: 3,
                  background: 'rgba(196,164,74,0.12)', color: 'var(--gold)',
                  border: '1px solid rgba(196,164,74,0.3)',
                }}>Trustee</span>
                <span style={{ fontSize: 9, color: 'var(--mist)' }}>{mockSession.linkedClientName}</span>
              </div>
            </>
          ) : (
            <div className="topbar-meta" style={{ fontSize: 10, color: 'var(--mist)', display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
              Session active · Last login: Today, 07:42 CET
            </div>
          )}
        </div>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className="topbar-security" style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '5px 10px',
          background: 'rgba(29,158,117,0.08)',
          border: '1px solid rgba(29,158,117,0.2)',
          borderRadius: 20, fontSize: 10, color: '#4ecda4',
        }}>
          <ShieldCheck size={11} />
          Secure · 256-bit
        </div>

        <button
          onClick={() => router.push('/dashboard/notifications')}
          style={{
            width: 36, height: 36, borderRadius: 'var(--radius)',
            background: 'var(--surf)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--mist)', position: 'relative', cursor: 'pointer',
          }}>
          <Bell size={15} />
          <div style={{
            position: 'absolute', top: 7, right: 7, width: 6, height: 6,
            borderRadius: '50%', background: 'var(--gold)', border: '1.5px solid var(--navy)',
          }} />
        </button>

        {/* Profile — initials avatar + dropdown */}
        <div ref={profileRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setProfileOpen(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(196,164,74,0.15)', border: '1px solid rgba(196,164,74,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--gold2)',
              flexShrink: 0, overflow: 'hidden',
            }}>
              {mockUser.initials}
            </div>
            <ChevronDown size={13} color="var(--mist)" style={{ transition: 'transform 0.2s', transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
          </button>

          {profileOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 10px)', right: 0,
              width: 260, background: '#0d1f38',
              border: '1px solid var(--border)', borderRadius: 'var(--radius)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
              zIndex: 200, overflow: 'hidden',
            }}>
              {/* Header */}
              <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(196,164,74,0.15)', border: '1px solid rgba(196,164,74,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--gold2)',
                  overflow: 'hidden',
                }}>
                  {mockUser.initials}
                </div>
                <div>
                  <div style={{ fontSize: 13, color: 'var(--cream)', fontWeight: 500 }}>{mockUser.fullName}</div>
                  <div style={{ fontSize: 10, color: 'var(--mist)', marginTop: 2 }}>{mockUser.id}</div>
                  {mockSession.role === 'trustee' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                      <span style={{
                        fontSize: 7, letterSpacing: '.08em', textTransform: 'uppercase',
                        padding: '1px 5px', borderRadius: 3,
                        background: 'rgba(196,164,74,0.15)', color: 'var(--gold)',
                        border: '1px solid rgba(196,164,74,0.3)',
                      }}>Trustee access</span>
                      <span style={{ fontSize: 9, color: 'var(--mist)' }}>{mockSession.name}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Details */}
              <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)' }}>
                {(mockSession.role === 'trustee' ? [
                  { label: 'Account Status', value: mockUser.accountStatus, accent: true },
                  { label: 'KYC', value: mockUser.kycStatus },
                  { label: 'Risk Profile', value: mockUser.riskProfile },
                  { label: 'Mandate', value: mockUser.mandateType },
                  { label: 'Member Since', value: mockUser.onboardedAt },
                ] : [
                  { label: 'Account Status', value: mockUser.accountStatus, accent: true },
                  { label: 'KYC', value: mockUser.kycStatus },
                  { label: 'Risk Profile', value: mockUser.riskProfile },
                  { label: 'Mandate', value: mockUser.mandateType },
                  { label: 'Member Since', value: mockUser.onboardedAt },
                ]).map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0' }}>
                    <span style={{ fontSize: 10, color: 'var(--mist)' }}>{row.label}</span>
                    <span style={{ fontSize: 10, color: row.accent ? '#4ecda4' : 'var(--cream)', fontWeight: 500 }}>{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div style={{ padding: '6px 8px' }}>
                {([
                  { icon: <User size={13} />, label: 'Profile', href: '/dashboard/profile' },
                  { icon: <Settings size={13} />, label: 'Settings', href: '/dashboard/settings' },
                  { icon: <LogOut size={13} />, label: 'Sign Out', href: '/login', danger: true },
                ] as { icon: React.ReactNode; label: string; href: string; danger?: boolean }[]).map(item => (
                  <button key={item.label}
                    onClick={() => {
                      setProfileOpen(false)
                      if (item.danger) {
                        clearSession()
                        router.replace('/login')
                        return
                      }
                      router.push(item.href)
                    }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                      padding: '8px 10px', borderRadius: 6, background: 'none', border: 'none',
                      cursor: 'pointer', color: item.danger ? '#e05c5c' : 'var(--mist)', fontSize: 12,
                      textAlign: 'left',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .topbar-root { left: 240px; }
        .topbar-hamburger { display: none; }
        @media (max-width: 768px) {
          .topbar-root { left: 0 !important; padding: 12px 16px !important; padding-top: calc(12px + var(--safe-top)) !important; }
          .topbar-hamburger    { display: flex !important; }
          .topbar-meta         { display: none !important; }
          .topbar-security     { display: none !important; }
          .topbar-trustee-badge { display: none !important; }
          .topbar-trustee-sub  { display: flex !important; }
        }
      `}</style>
    </div>
  )
}
