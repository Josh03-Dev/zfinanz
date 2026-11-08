'use client'

import { useState } from 'react'
import {
  Shield, Smartphone, Key, LogOut, Clock,
  CheckCircle2, AlertTriangle, Monitor, Globe,
  Lock, RefreshCw, EyeOff,
} from 'lucide-react'

/* ── Static mock data (no lib/mock-data export needed) ──── */

const mockSecurityScore = {
  score: 82,
  label: 'Strong',
  color: '#1D9E75',
  items: [
    { label: '2FA enabled on login',            done: true  },
    { label: 'SMS confirmation on transfers',    done: true  },
    { label: 'Biometric app login',              done: false },
    { label: 'Recovery codes downloaded',        done: true  },
    { label: 'Password changed within 12 months', done: true },
    { label: 'Trusted devices reviewed',         done: false },
  ],
}

const mock2FA = [
  { id: '2fa-sms',  method: 'SMS Authentication',       detail: '+234 •••• •••• 47 · Primary',    active: true,  primary: true  },
  { id: '2fa-totp', method: 'Authenticator App (TOTP)', detail: 'Google Authenticator · Enabled',  active: true,  primary: false },
  { id: '2fa-bio',  method: 'Biometric (Face ID)',       detail: 'Not configured',                 active: false, primary: false },
]

const mockSessions = [
  { id: 'sess-001', device: 'MacBook Pro 14"',  os: 'macOS 15.3',      browser: 'Safari 18',       location: 'Lagos, Nigeria',    ip: '105.112.••.••', lastActive: 'Now',              current: true  },
  { id: 'sess-002', device: 'iPhone 16 Pro',    os: 'iOS 18.2',        browser: 'ZPF Mobile App',  location: 'Lagos, Nigeria',    ip: '105.112.••.••', lastActive: '2 hours ago',      current: false },
  { id: 'sess-003', device: 'Windows PC',       os: 'Windows 11',      browser: 'Chrome 123',      location: 'Zürich, Switzerland', ip: '195.141.••.••', lastActive: '14 Mar 2026',   current: false },
]

const mockLoginHistory = [
  { id: 'log-001', date: '01 Apr 2026, 09:14', device: 'MacBook Pro 14"', location: 'Lagos, Nigeria',     status: 'success' as const },
  { id: 'log-002', date: '28 Mar 2026, 16:52', device: 'iPhone 16 Pro',   location: 'Lagos, Nigeria',     status: 'success' as const },
  { id: 'log-003', date: '14 Mar 2026, 14:03', device: 'Windows PC',      location: 'Zürich, Switzerland', status: 'success' as const },
  { id: 'log-004', date: '12 Mar 2026, 08:47', device: 'Unknown device',  location: 'Amsterdam, NL',      status: 'blocked' as const },
  { id: 'log-005', date: '04 Mar 2026, 11:30', device: 'MacBook Pro 14"', location: 'Lagos, Nigeria',     status: 'success' as const },
  { id: 'log-006', date: '28 Feb 2026, 19:22', device: 'iPhone 16 Pro',   location: 'Lagos, Nigeria',     status: 'success' as const },
]

/* ── Page ─────────────────────────────────────────────────── */

export default function SecurityPage() {
  const [revokedSessions, setRevokedSessions] = useState<string[]>([])
  const [showRecovery, setShowRecovery] = useState(false)

  const activeSessions = mockSessions.filter(s => !revokedSessions.includes(s.id))

  /* score ring */
  const R = 42, C = 2 * Math.PI * R
  const dash = (mockSecurityScore.score / 100) * C

  return (
    <div>
      {/* ── Header ──────────────────────────────── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, color: 'var(--cream)' }}>
          Security
        </div>
        <div style={{ fontSize: 10, color: 'var(--mist)', marginTop: 4, letterSpacing: '.05em' }}>
          ZPF-7741-0038 · Two-factor authentication · Active sessions · Login history
        </div>
      </div>

      {/* ── Top grid ───────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 14, marginBottom: 14 }} className="sec-top-grid">

        {/* Score ring */}
        <div style={{
          background: 'var(--navy)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '24px 20px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
        }}>
          <div style={{ position: 'relative', width: 100, height: 100 }}>
            <svg width={100} height={100} style={{ transform: 'rotate(-90deg)' }}>
              <circle cx={50} cy={50} r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={8} />
              <circle cx={50} cy={50} r={R} fill="none"
                stroke={mockSecurityScore.color} strokeWidth={8}
                strokeDasharray={`${dash} ${C}`}
                strokeLinecap="round"
              />
            </svg>
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 400, color: mockSecurityScore.color, lineHeight: 1 }}>
                {mockSecurityScore.score}
              </div>
              <div style={{ fontSize: 8, color: 'var(--mist)', marginTop: 3 }}>/ 100</div>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: mockSecurityScore.color }}>{mockSecurityScore.label}</div>
            <div style={{ fontSize: 9, color: 'var(--mist)', marginTop: 3 }}>Security Score</div>
          </div>
        </div>

        {/* Checklist */}
        <div style={{ background: 'var(--navy)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px 22px' }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--cream)', marginBottom: 14 }}>Security Checklist</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {mockSecurityScore.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {item.done
                  ? <CheckCircle2 size={13} style={{ color: '#1D9E75', flexShrink: 0 }} />
                  : <div style={{ width: 13, height: 13, borderRadius: '50%', border: '1.5px solid rgba(196,164,74,0.3)', flexShrink: 0 }} />
                }
                <span style={{ fontSize: 11, color: item.done ? 'var(--cream)' : 'rgba(138,154,176,0.6)' }}>{item.label}</span>
                {!item.done && (
                  <span style={{
                    marginLeft: 'auto', fontSize: 8, letterSpacing: '.08em', textTransform: 'uppercase',
                    padding: '2px 7px', borderRadius: 3,
                    background: 'rgba(196,164,74,0.1)', color: 'var(--gold)',
                  }}>Set up</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Two-Factor Authentication ─────────────── */}
      <Section icon={<Smartphone size={14} />} title="Two-Factor Authentication" sub="Methods used to verify your identity at login and during transfers" style={{ marginBottom: 14 }}>
        {mock2FA.map((method, i) => (
          <div key={method.id} style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0',
            borderBottom: i < mock2FA.length - 1 ? '1px solid rgba(196,164,74,0.06)' : 'none',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 9, flexShrink: 0,
              background: method.active ? 'rgba(29,158,117,0.1)' : 'rgba(255,255,255,0.04)',
              color: method.active ? '#1D9E75' : 'rgba(138,154,176,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {method.id === '2fa-sms'  && <Smartphone size={15} />}
              {method.id === '2fa-totp' && <Key size={15} />}
              {method.id === '2fa-bio'  && <EyeOff size={15} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--cream)' }}>{method.method}</span>
                {method.primary && (
                  <span style={{
                    fontSize: 8, letterSpacing: '.08em', textTransform: 'uppercase',
                    padding: '2px 6px', borderRadius: 3,
                    background: 'rgba(196,164,74,0.1)', color: 'var(--gold)',
                  }}>Primary</span>
                )}
              </div>
              <div style={{ fontSize: 9, color: 'var(--mist)' }}>{method.detail}</div>
            </div>
            <div style={{
              fontSize: 9, fontWeight: 500, padding: '3px 10px', borderRadius: 20,
              background: method.active ? 'rgba(29,158,117,0.1)' : 'rgba(255,255,255,0.04)',
              color: method.active ? '#4ecda4' : 'rgba(138,154,176,0.5)',
            }}>
              {method.active ? 'Enabled' : 'Not configured'}
            </div>
            <button style={{
              fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase',
              padding: '6px 14px', borderRadius: 8, cursor: 'pointer',
              background: 'rgba(196,164,74,0.06)', border: '1px solid var(--border2)', color: 'var(--gold)',
            }}>
              {method.active ? 'Manage' : 'Set up'}
            </button>
          </div>
        ))}
      </Section>

      {/* ── Active Sessions ──────────────────────── */}
      <Section icon={<Monitor size={14} />} title="Active Sessions" sub="Devices currently signed in to your account" style={{ marginBottom: 14 }}>
        {activeSessions.length === 0 ? (
          <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--mist)', fontSize: 12 }}>
            All other sessions have been revoked.
          </div>
        ) : (
          activeSessions.map((sess, i) => (
            <div key={sess.id} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0',
              borderBottom: i < activeSessions.length - 1 ? '1px solid rgba(196,164,74,0.06)' : 'none',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                background: sess.current ? 'rgba(29,158,117,0.1)' : 'rgba(255,255,255,0.04)',
                color: sess.current ? '#1D9E75' : 'var(--mist)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Monitor size={15} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--cream)' }}>{sess.device}</span>
                  {sess.current && (
                    <span style={{
                      fontSize: 8, letterSpacing: '.08em', textTransform: 'uppercase',
                      padding: '2px 6px', borderRadius: 3,
                      background: 'rgba(29,158,117,0.12)', color: '#4ecda4',
                    }}>This session</span>
                  )}
                </div>
                <div style={{ fontSize: 9, color: 'var(--mist)' }}>
                  {sess.os} · {sess.browser} · {sess.location} · {sess.ip}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 9, color: sess.current ? '#4ecda4' : 'var(--mist)' }}>
                  <Clock size={9} /> {sess.lastActive}
                </div>
                {!sess.current && (
                  <button
                    onClick={() => setRevokedSessions(r => [...r, sess.id])}
                    style={{
                      fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase',
                      padding: '5px 12px', borderRadius: 8, cursor: 'pointer',
                      background: 'rgba(221,119,119,0.08)', border: '1px solid rgba(221,119,119,0.2)', color: '#DD7777',
                    }}>
                    Revoke
                  </button>
                )}
              </div>
            </div>
          ))
        )}
        {activeSessions.length > 1 && (
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(196,164,74,0.06)' }}>
            <button
              onClick={() => setRevokedSessions(mockSessions.filter(s => !s.current).map(s => s.id))}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, fontSize: 9,
                letterSpacing: '.12em', textTransform: 'uppercase',
                padding: '7px 14px', borderRadius: 8, cursor: 'pointer',
                background: 'rgba(221,119,119,0.08)', border: '1px solid rgba(221,119,119,0.2)', color: '#DD7777',
              }}>
              <LogOut size={11} /> Revoke All Other Sessions
            </button>
          </div>
        )}
      </Section>

      {/* ── Login History ────────────────────────── */}
      <Section icon={<Globe size={14} />} title="Login History" sub="Last 6 sign-in events — blocked logins are flagged automatically" style={{ marginBottom: 14 }}>
        {mockLoginHistory.map((log, i) => (
          <div key={log.id} style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0',
            borderBottom: i < mockLoginHistory.length - 1 ? '1px solid rgba(196,164,74,0.06)' : 'none',
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8, flexShrink: 0,
              background: log.status === 'success' ? 'rgba(29,158,117,0.08)' : 'rgba(221,119,119,0.1)',
              color: log.status === 'success' ? '#1D9E75' : '#DD7777',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {log.status === 'success' ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, color: 'var(--cream)', marginBottom: 2 }}>{log.device}</div>
              <div style={{ fontSize: 9, color: 'var(--mist)' }}>{log.location}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 9, color: log.status === 'blocked' ? '#DD7777' : 'var(--mist)', marginBottom: 3, fontWeight: log.status === 'blocked' ? 600 : 400 }}>
                {log.status === 'blocked' ? 'Blocked' : 'Success'}
              </div>
              <div style={{ fontSize: 8, color: 'rgba(138,154,176,0.5)', fontFamily: 'var(--font-mono)' }}>{log.date}</div>
            </div>
          </div>
        ))}
      </Section>

      {/* ── Credentials ──────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="sec-cred-grid">

        <div style={{ background: 'var(--navy)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Lock size={13} style={{ color: 'var(--gold)' }} />
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--cream)' }}>Change Password</span>
          </div>
          <div style={{ fontSize: 10, color: 'var(--mist)', lineHeight: 1.6, marginBottom: 14 }}>
            Your password was last changed <strong style={{ color: 'var(--cream)' }}>January 2026</strong>.
            ZPF recommends updating your password every 12 months.
          </div>
          <button style={{
            fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase',
            padding: '7px 16px', borderRadius: 8, cursor: 'pointer',
            background: 'rgba(196,164,74,0.08)', border: '1px solid var(--border2)', color: 'var(--gold)',
          }}>
            Change Password
          </button>
        </div>

        <div style={{ background: 'var(--navy)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <RefreshCw size={13} style={{ color: 'var(--gold)' }} />
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--cream)' }}>Recovery Codes</span>
          </div>
          <div style={{ fontSize: 10, color: 'var(--mist)', lineHeight: 1.6, marginBottom: 14 }}>
            Recovery codes allow you to access your account if you lose your 2FA device.
            Keep them in a safe place offline.
          </div>
          <button
            onClick={() => setShowRecovery(v => !v)}
            style={{
              fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase',
              padding: '7px 16px', borderRadius: 8, cursor: 'pointer',
              background: 'rgba(196,164,74,0.08)', border: '1px solid var(--border2)', color: 'var(--gold)',
            }}>
            {showRecovery ? 'Hide Codes' : 'View Recovery Codes'}
          </button>
          {showRecovery && (
            <div style={{
              marginTop: 12, padding: '12px 14px', borderRadius: 8,
              background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 20px',
            }}>
              {['XKPQ-7R2M', 'N48W-DLFT', 'CVBJ-9H5S', 'M3NZ-QW8A', 'TGRP-46LX', 'Y7KE-28VC'].map(code => (
                <span key={code} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--cream)', letterSpacing: '.1em' }}>{code}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .sec-top-grid  { grid-template-columns: 1fr !important; }
          .sec-cred-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

/* ── Section wrapper ──────────────────────────────────────── */

function Section({ icon, title, sub, children, style }: {
  icon: React.ReactNode; title: string; sub: string
  children: React.ReactNode; style?: React.CSSProperties
}) {
  return (
    <div style={{ background: 'var(--navy)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', ...style }}>
      <div style={{ padding: '16px 22px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 7, flexShrink: 0,
          background: 'rgba(196,164,74,0.1)', color: 'var(--gold)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {icon}
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--cream)' }}>{title}</div>
          <div style={{ fontSize: 9, color: 'var(--mist)', marginTop: 2 }}>{sub}</div>
        </div>
      </div>
      <div style={{ padding: '6px 22px 16px' }}>{children}</div>
    </div>
  )
}
