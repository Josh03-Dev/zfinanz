'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserPlus, CheckCircle, XCircle, ShieldAlert, ChevronRight } from 'lucide-react'
import { mockStaff, type StaffProfile } from '@/lib/admin-mock-data'
import { readSession } from '@/lib/session-store'

// ── Helpers ────────────────────────────────────────────────────────────────────

function fmtChf(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`
  return n.toLocaleString()
}

function relTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3_600_000)
  if (h < 1)  return 'Just now'
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 30) return `${d}d ago`
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

const ROLE_META = {
  SUPER_ADMIN: { label: 'Super Admin', bg: 'rgba(196,164,74,0.15)', border: 'rgba(196,164,74,0.4)', color: '#c4a44a' },
  MAJOR_ADMIN: { label: 'Major Admin', bg: 'rgba(55,138,221,0.12)', border: 'rgba(55,138,221,0.3)',  color: '#6aaee8' },
  ADMIN:       { label: 'Admin',       bg: 'rgba(29,158,117,0.1)',  border: 'rgba(29,158,117,0.25)', color: '#4ecda4' },
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function AdminStaffPage() {
  const router   = useRouter()
  const session  = readSession()
  const isSA     = session?.role === 'super_admin'

  const majorAdmins = mockStaff.filter(s => s.role === 'MAJOR_ADMIN')
  const admins      = mockStaff.filter(s => s.role === 'ADMIN')

  return (
    <div style={{ maxWidth: 1000 }}>

      {/* Summary strip */}
      <div className="staff-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Total Staff',    value: mockStaff.length,                             color: '#e8dcc8' },
          { label: 'Major Admins',   value: majorAdmins.length,                           color: '#6aaee8' },
          { label: 'Admins',         value: admins.length,                                color: '#4ecda4' },
          { label: 'Inactive',       value: mockStaff.filter(s => !s.isActive).length,    color: '#f0997b' },
        ].map(s => (
          <div key={s.label} style={{ padding: '14px 16px', borderRadius: 8, border: '1px solid rgba(196,164,74,0.08)', background: 'rgba(255,255,255,0.015)' }}>
            <div style={{ fontSize: 10, color: '#8a9ab0', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 20, color: s.color, fontFamily: 'var(--font-display)' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Major Admins section */}
      <StaffSection
        title="Major Admins"
        subtitle="Branch-level managers. Each oversees a team of Admins and their client books."
        staff={majorAdmins}
        allStaff={mockStaff}
        isSA={isSA}
        onNewStaff={() => router.push('/admin/staff/new')}
        showNewBtn
      />

      {/* Admins section */}
      <div style={{ marginTop: 28 }}>
        <StaffSection
          title="Admins (Relationship Managers)"
          subtitle="Front-line RMs with direct client responsibility."
          staff={admins}
          allStaff={mockStaff}
          isSA={isSA}
          onNewStaff={() => router.push('/admin/staff/new')}
        />
      </div>

      <style>{`
        @media (max-width: 768px) {
          .staff-stats { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  )
}

// ── Staff Section ──────────────────────────────────────────────────────────────

function StaffSection({ title, subtitle, staff, allStaff, isSA, onNewStaff, showNewBtn }: {
  title: string
  subtitle: string
  staff: StaffProfile[]
  allStaff: StaffProfile[]
  isSA: boolean
  onNewStaff: () => void
  showNewBtn?: boolean
}) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14, gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: '#e8dcc8', margin: 0, marginBottom: 3 }}>{title}</h2>
          <p style={{ fontSize: 11, color: '#8a9ab0', margin: 0 }}>{subtitle}</p>
        </div>
        {isSA && showNewBtn && (
          <button
            onClick={onNewStaff}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 6, flexShrink: 0,
              background: 'rgba(196,164,74,0.1)', border: '1px solid rgba(196,164,74,0.25)',
              color: '#c4a44a', fontSize: 11, fontWeight: 500, cursor: 'pointer',
            }}
          >
            <UserPlus size={13} />
            New Staff
          </button>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {staff.map(s => <StaffCard key={s.id} staff={s} allStaff={allStaff} isSA={isSA} />)}
      </div>
    </div>
  )
}

// ── Staff Card ─────────────────────────────────────────────────────────────────

function StaffCard({ staff: s, allStaff, isSA }: { staff: StaffProfile; allStaff: StaffProfile[]; isSA: boolean }) {
  const [open, setOpen] = useState(false)
  const role    = ROLE_META[s.role]
  const reports = allStaff.filter(a => a.parentMajorAdminId === s.id)

  return (
    <div style={{
      borderRadius: 8, border: `1px solid ${s.isActive ? 'rgba(196,164,74,0.1)' : 'rgba(216,90,48,0.12)'}`,
      background: s.isActive ? 'rgba(255,255,255,0.015)' : 'rgba(216,90,48,0.02)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{ padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}
      >
        {/* Avatar */}
        <div style={{
          width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
          background: role.bg, border: `1px solid ${role.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontSize: 12, color: role.color,
        }}>
          {s.initials}
        </div>

        {/* Name + role */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: s.isActive ? '#e8dcc8' : '#8a9ab0' }}>{s.fullName}</span>
            <span style={{ padding: '2px 7px', borderRadius: 4, fontSize: 10, fontWeight: 600, background: role.bg, color: role.color, border: `1px solid ${role.border}` }}>
              {role.label}
            </span>
            {!s.isActive && (
              <span style={{ padding: '2px 7px', borderRadius: 4, fontSize: 10, fontWeight: 600, background: 'rgba(216,90,48,0.1)', color: '#f0997b' }}>
                INACTIVE
              </span>
            )}
          </div>
          <div style={{ fontSize: 11, color: '#8a9ab0', marginTop: 2 }}>{s.title}{s.department ? ` · ${s.department}` : ''}</div>
        </div>

        {/* Stats */}
        <div className="staff-card-stats" style={{ display: 'flex', gap: 20, flexShrink: 0, alignItems: 'center' }}>
          <StatPill label="Clients" value={s.clientCount} />
          {s.role === 'MAJOR_ADMIN' && s.adminCount !== undefined && <StatPill label="Admins" value={s.adminCount} />}
          <StatPill label="AUM" value={`CHF ${fmtChf(s.aum)}`} />
          {s.pendingTransfers > 0 && <StatPill label="Pending" value={s.pendingTransfers} accent />}
        </div>

        <div style={{ marginLeft: 8, color: '#8a9ab0' }}>{open ? <ChevronRight size={14} style={{ transform: 'rotate(90deg)' }} /> : <ChevronRight size={14} />}</div>
      </div>

      {/* Expanded */}
      {open && (
        <div style={{ padding: '0 18px 16px', borderTop: '1px solid rgba(196,164,74,0.08)' }}>
          <div className="staff-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 28px', marginTop: 14 }}>
            {[
              { label: 'Staff ID',     value: s.id },
              { label: 'Email',        value: s.notificationEmail ?? '—' },
              { label: 'Last Login',   value: relTime(s.lastLoginAt) },
              { label: 'Last IP',      value: `${s.lastLoginIp} (${s.lastLoginCity})` },
              { label: 'TOTP',         value: s.totpEnrolled ? 'Enrolled' : 'Not enrolled' },
              { label: 'Failed TOTP',  value: `${s.failedTotpAttempts} attempt${s.failedTotpAttempts !== 1 ? 's' : ''}` },
            ].map(f => (
              <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '5px 0', borderBottom: '1px solid rgba(196,164,74,0.04)' }}>
                <span style={{ fontSize: 11, color: '#8a9ab0' }}>{f.label}</span>
                <span style={{ fontSize: 11, color: '#e8dcc8', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>{f.value}</span>
              </div>
            ))}
          </div>

          {/* Security alerts */}
          {!s.totpEnrolled && (
            <div style={{ marginTop: 12, padding: '8px 12px', borderRadius: 6, background: 'rgba(196,164,74,0.08)', border: '1px solid rgba(196,164,74,0.2)', display: 'flex', gap: 8, alignItems: 'center' }}>
              <ShieldAlert size={13} style={{ color: '#c4a44a', flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: '#c4a44a' }}>TOTP not enrolled — account cannot be activated until 2FA is set up.</span>
            </div>
          )}
          {s.failedTotpAttempts >= 3 && (
            <div style={{ marginTop: 8, padding: '8px 12px', borderRadius: 6, background: 'rgba(216,90,48,0.08)', border: '1px solid rgba(216,90,48,0.2)', display: 'flex', gap: 8, alignItems: 'center' }}>
              <ShieldAlert size={13} style={{ color: '#f0997b', flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: '#f0997b' }}>{s.failedTotpAttempts} failed TOTP attempts — consider reviewing for suspicious activity.</span>
            </div>
          )}

          {/* Reporting-line (for Major Admins) */}
          {reports.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 10, color: '#8a9ab0', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 8 }}>Reporting Admins</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {reports.map(r => (
                  <div key={r.id} style={{ padding: '5px 10px', borderRadius: 5, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(196,164,74,0.1)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(29,158,117,0.1)', border: '1px solid rgba(29,158,117,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: '#4ecda4' }}>{r.initials}</div>
                    <span style={{ fontSize: 11, color: '#e8dcc8' }}>{r.displayName}</span>
                    {r.isActive ? <CheckCircle size={11} style={{ color: '#4ecda4' }} /> : <XCircle size={11} style={{ color: '#f0997b' }} />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          {isSA && (
            <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
              <button style={actionBtn}>Edit Profile</button>
              {s.isActive
                ? <button style={{ ...actionBtn, color: '#f0997b', borderColor: 'rgba(216,90,48,0.2)' }}>Deactivate</button>
                : <button style={{ ...actionBtn, color: '#4ecda4', borderColor: 'rgba(29,158,117,0.2)' }}>Reactivate</button>
              }
              <button style={{ ...actionBtn, color: '#afa9ec', borderColor: 'rgba(127,119,221,0.2)' }}>Reset TOTP</button>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .staff-card-stats { display: none !important; }
          .staff-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

function StatPill({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 14, fontWeight: 500, color: accent ? '#c4a44a' : '#e8dcc8', fontFamily: 'var(--font-display)' }}>{value}</div>
      <div style={{ fontSize: 10, color: '#8a9ab0', marginTop: 1 }}>{label}</div>
    </div>
  )
}

const actionBtn: React.CSSProperties = {
  padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 500, cursor: 'pointer',
  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(196,164,74,0.12)', color: '#8a9ab0',
}
