'use client'

import { useRouter } from 'next/navigation'
import { Users, LogOut, ShieldCheck } from 'lucide-react'

export default function VisitorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--navy)' }}>

      {/* ── Top bar ─────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 36px',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(8,22,42,0.92)', backdropFilter: 'blur(8px)',
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      }} className="visitor-topbar">
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, border: '1.5px solid var(--gold)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 500,
            color: 'var(--gold)', letterSpacing: 2, position: 'relative', flexShrink: 0,
          }}>
            ZPF
            <div style={{ position: 'absolute', inset: 3, border: '0.5px solid rgba(196,164,74,0.35)' }} />
          </div>
          <div>
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 400, color: 'var(--cream)', letterSpacing: '.04em' }}>
              Zürichberg Privat Finanz
            </span>
            <span style={{ display: 'block', fontSize: 9, color: 'var(--mist)', letterSpacing: '.25em', textTransform: 'uppercase', marginTop: 1 }}>
              Visitor Portfolio View
            </span>
          </div>
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="visitor-topbar-badges" style={{
            display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: '#4ecda4',
          }}>
            <ShieldCheck size={12} /> Secured
          </div>
          <div className="visitor-topbar-badges" style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '5px 12px', borderRadius: 20,
            background: 'rgba(196,164,74,0.08)', border: '1px solid rgba(196,164,74,0.18)',
          }}>
            <Users size={12} style={{ color: 'var(--gold)' }} />
            <span style={{ fontSize: 10, color: 'var(--gold)', letterSpacing: '.12em', textTransform: 'uppercase' }}>Visitor</span>
          </div>
          <button
            onClick={() => router.push('/login')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--mist)',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(138,154,176,0.2)',
              borderRadius: 'var(--radius)', padding: '6px 14px', cursor: 'pointer',
            }}
          >
            <LogOut size={11} /> Exit
          </button>
        </div>
      </div>

      {/* ── Page content ────────────────────────── */}
      <div className="visitor-content" style={{ padding: 'calc(65px + 36px) 36px 56px' }}>
        {children}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .visitor-topbar { padding: 12px 20px !important; }
          .visitor-topbar-badges { display: none !important; }
          .visitor-content { padding: calc(57px + 24px) 20px 48px !important; }
        }
      `}</style>
    </div>
  )
}
