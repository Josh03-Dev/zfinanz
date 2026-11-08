'use client'

import Link from 'next/link'
import {
  TrendingUp, Users, ArrowLeftRight, MessageSquare,
  UserCog, Activity, Database, HardDrive, Server,
  CheckCircle2, AlertCircle, ChevronRight,
} from 'lucide-react'
import {
  mockOverviewStats, mockAumTrend, mockStaff, mockAuditLog,
} from '@/lib/admin-mock-data'

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtChf(v: number): string {
  if (v >= 1_000_000_000) return `CHF ${(v / 1_000_000_000).toFixed(2)}B`
  if (v >= 1_000_000)     return `CHF ${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000)         return `CHF ${(v / 1_000).toFixed(0)}K`
  return `CHF ${v.toLocaleString()}`
}

function relTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 2)  return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

const AUDIT_ACTION_LABELS: Record<string, string> = {
  TRANSFER_APPROVED:        'Approved transfer',
  TRANSFER_COUNTER_APPROVED:'Counter-approved transfer',
  TRANSFER_REJECTED:        'Rejected transfer',
  TRANSFER_EXECUTED:        'Marked transfer executed',
  TRANSACTION_ADDED:        'Added transaction',
  CLIENT_CREATED:           'Created client account',
  CLIENT_LOCKED:            'Locked client account',
  CLIENT_UNLOCKED:          'Unlocked client account',
  CLIENT_REASSIGNED:        'Reassigned client',
  KYC_STATUS_CHANGED:       'Changed KYC status',
  DOCUMENT_UPLOADED:        'Uploaded document',
  DOCUMENT_SEALED:          'Sealed document',
  STAFF_CREATED:            'Created staff account',
  STAFF_EDITED:             'Edited staff profile',
  STAFF_DEACTIVATED:        'Deactivated staff account',
  STAFF_ROLE_CHANGED:       'Changed staff role',
  SYSTEM_CONFIG_CHANGED:    'Changed system config',
  LOGIN_SUCCESS:            'Logged in',
  LOGIN_FAILED:             'Failed login attempt',
  LOGOUT:                   'Logged out',
  THREAD_RESOLVED:          'Resolved message thread',
  THREAD_REASSIGNED:        'Reassigned message thread',
  TOTP_ENROLLMENT_GENERATED:'Generated TOTP enrollment link',
}

// ── AUM Spark Chart (SVG) ─────────────────────────────────────────────────────

function AumChart() {
  const W = 900, H = 200, PAD = { top: 20, right: 20, bottom: 36, left: 64 }
  const chartW = W - PAD.left - PAD.right
  const chartH = H - PAD.top  - PAD.bottom

  const values = mockAumTrend.map(d => d.value)
  const minV = Math.min(...values) * 0.97
  const maxV = Math.max(...values) * 1.01

  function x(i: number) { return PAD.left + (i / (values.length - 1)) * chartW }
  function y(v: number) { return PAD.top + chartH - ((v - minV) / (maxV - minV)) * chartH }

  const pts = values.map((v, i) => `${x(i)},${y(v)}`).join(' ')
  const areaPath = `M${x(0)},${y(values[0])} ` +
    values.map((v, i) => `L${x(i)},${y(v)}`).join(' ') +
    ` L${x(values.length - 1)},${PAD.top + chartH} L${x(0)},${PAD.top + chartH} Z`

  const gridLines = 4
  const gridVals  = Array.from({ length: gridLines }, (_, i) =>
    minV + ((maxV - minV) / (gridLines - 1)) * i
  ).reverse()

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      <defs>
        <linearGradient id="aumGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#c4a44a" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#c4a44a" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {gridVals.map((v, i) => (
        <g key={i}>
          <line
            x1={PAD.left} y1={y(v)} x2={PAD.left + chartW} y2={y(v)}
            stroke="rgba(196,164,74,0.1)" strokeWidth={1}
          />
          <text
            x={PAD.left - 8} y={y(v) + 4}
            textAnchor="end" fontSize={10} fill="rgba(138,154,176,0.5)"
          >
            {v >= 1_000_000 ? `${(v / 1_000_000).toFixed(0)}M` : `${(v / 1_000).toFixed(0)}K`}
          </text>
        </g>
      ))}

      {/* Area fill */}
      <path d={areaPath} fill="url(#aumGrad)" />

      {/* Line */}
      <polyline points={pts} fill="none" stroke="#c4a44a" strokeWidth={2} strokeLinejoin="round" />

      {/* Dots + tooltips */}
      {values.map((v, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(v)} r={3.5} fill="#c4a44a" />
          {/* Month labels */}
          <text
            x={x(i)} y={PAD.top + chartH + 20}
            textAnchor="middle" fontSize={9} fill="rgba(138,154,176,0.55)"
          >
            {mockAumTrend[i].month}
          </text>
        </g>
      ))}

      {/* Last point highlight */}
      <circle
        cx={x(values.length - 1)} cy={y(values[values.length - 1])} r={5}
        fill="none" stroke="#c4a44a" strokeWidth={2}
      />
    </svg>
  )
}

// ── Stat card ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string
  value: string
  sub: string | React.ReactNode
  icon: React.ReactNode
  accent?: string
  href?: string
  alert?: boolean
}

function StatCard({ label, value, sub, icon, accent = '#c4a44a', href, alert }: StatCardProps) {
  const inner = (
    <div style={{
      padding: '20px 22px', borderRadius: 10,
      background: 'rgba(255,255,255,0.02)',
      border: `1px solid ${alert ? 'rgba(196,164,74,0.35)' : 'rgba(196,164,74,0.1)'}`,
      display: 'flex', flexDirection: 'column', gap: 12,
      transition: 'border-color .2s',
      cursor: href ? 'pointer' : 'default',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{
          width: 38, height: 38, borderRadius: 8,
          background: `${accent}14`, border: `1px solid ${accent}33`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: accent, flexShrink: 0,
        }}>
          {icon}
        </div>
        {href && <ChevronRight size={14} style={{ color: 'rgba(138,154,176,0.4)', marginTop: 2 }} />}
      </div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 600, color: '#e8dcc8', letterSpacing: '-.01em' }}>
          {value}
        </div>
        <div style={{ fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(138,154,176,0.6)', marginBottom: 4, marginTop: 2 }}>
          {label}
        </div>
        <div style={{ fontSize: 10, color: 'rgba(138,154,176,0.55)', lineHeight: 1.5 }}>
          {sub}
        </div>
      </div>
    </div>
  )
  if (href) return <Link href={href} style={{ textDecoration: 'none' }}>{inner}</Link>
  return <div>{inner}</div>
}

// ── Page ──────────────────────────────────────────────────────────────────────

const { totalAum, aumChangePercent, totalClients, activeClients, lockedClients, pendingTotpClients,
  pendingTransfers, awaitingCounterTransfers, unreadMessages, openThreads,
  activeStaff, majorAdmins, admins, systemHealth } = mockOverviewStats

const majorAdminStaff = mockStaff.filter(s => s.role === 'MAJOR_ADMIN')
const recentActivity  = mockAuditLog.slice(0, 8)

export default function AdminOverviewPage() {
  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 9, letterSpacing: '.4em', textTransform: 'uppercase', color: '#c4a44a', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ display: 'inline-block', width: 24, height: 1, background: '#c4a44a' }} />
          Super Admin — Full System View
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, color: '#e8dcc8', margin: 0 }}>
          System Overview
        </h1>
      </div>

      {/* ── Stats Strip ── */}
      <div className="admin-stats-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: 16, marginBottom: 32,
      }}>
        <StatCard
          label="Total AUM"
          value={fmtChf(totalAum)}
          sub={`Across ${totalClients} client accounts · +${aumChangePercent}% vs. last quarter`}
          icon={<TrendingUp size={18} />}
          href="/admin/clients"
        />
        <StatCard
          label="Total Clients"
          value={String(totalClients)}
          sub={`${activeClients} active · ${lockedClients} locked · ${pendingTotpClients} pending TOTP`}
          icon={<Users size={18} />}
          href="/admin/clients"
        />
        <StatCard
          label="Pending Transfers"
          value={String(pendingTransfers + awaitingCounterTransfers)}
          sub={`${awaitingCounterTransfers} awaiting counter-approval`}
          icon={<ArrowLeftRight size={18} />}
          accent={pendingTransfers > 0 ? '#e0a03c' : '#c4a44a'}
          alert={pendingTransfers > 0}
          href="/admin/transfers?tab=pending"
        />
        <StatCard
          label="Unread Messages"
          value={String(unreadMessages)}
          sub={`Across ${openThreads} open threads`}
          icon={<MessageSquare size={18} />}
          accent={unreadMessages > 0 ? '#e0a03c' : '#c4a44a'}
          alert={unreadMessages > 0}
          href="/admin/messages?filter=unread"
        />
        <StatCard
          label="Active Staff"
          value={String(activeStaff)}
          sub={`${majorAdmins} Major Admins · ${admins} Admins`}
          icon={<UserCog size={18} />}
          href="/admin/staff"
        />
        <StatCard
          label="System Health"
          value={Object.values(systemHealth).every(Boolean) ? 'Operational' : 'Degraded'}
          sub={
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {Object.entries(systemHealth).map(([key, ok]) => (
                <span key={key} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10 }}>
                  {ok
                    ? <CheckCircle2 size={11} style={{ color: '#4ecda4' }} />
                    : <AlertCircle  size={11} style={{ color: '#e05c5c' }} />}
                  <span style={{ color: ok ? '#4ecda4' : '#e05c5c', textTransform: 'uppercase', letterSpacing: '.08em' }}>
                    {key.toUpperCase()}
                  </span>
                </span>
              ))}
            </div>
          }
          icon={<Activity size={18} />}
          accent={Object.values(systemHealth).every(Boolean) ? '#4ecda4' : '#e05c5c'}
        />
      </div>

      {/* ── AUM Trend Chart ── */}
      <div style={{
        padding: '24px 28px', borderRadius: 12,
        background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(196,164,74,0.1)',
        marginBottom: 28,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#e8dcc8' }}>AUM Trend</div>
            <div style={{ fontSize: 10, color: 'rgba(138,154,176,0.5)', marginTop: 2 }}>
              System-wide total assets under management · Last 12 months
            </div>
          </div>
          <div style={{
            fontSize: 20, fontWeight: 600, color: '#c4a44a', fontFamily: 'var(--font-mono)',
          }}>
            {fmtChf(totalAum)}
            <span style={{ fontSize: 11, color: '#4ecda4', marginLeft: 10 }}>+{aumChangePercent}%</span>
          </div>
        </div>
        <AumChart />
      </div>

      {/* ── Two-column lower section ── */}
      <div className="admin-lower-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        {/* Major Admin Performance Table */}
        <div style={{
          padding: '22px 24px', borderRadius: 12,
          background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(196,164,74,0.1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: '#e8dcc8' }}>Admin Performance</div>
              <div style={{ fontSize: 10, color: 'rgba(138,154,176,0.5)', marginTop: 2 }}>Major Admins — system summary</div>
            </div>
            <Link href="/admin/staff" style={{
              fontSize: 10, color: '#c4a44a', textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              View All <ChevronRight size={12} />
            </Link>
          </div>

          {/* Headers */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 60px 70px 80px 80px',
            gap: 8, padding: '6px 10px',
            fontSize: 8, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(138,154,176,0.4)',
            borderBottom: '1px solid rgba(196,164,74,0.08)', marginBottom: 6,
          }}>
            <span>Name</span>
            <span style={{ textAlign: 'center' }}>Admins</span>
            <span style={{ textAlign: 'center' }}>Clients</span>
            <span style={{ textAlign: 'right' }}>AUM</span>
            <span style={{ textAlign: 'right' }}>Pending</span>
          </div>

          {majorAdminStaff.map(s => (
            <Link key={s.id} href={`/admin/staff/${s.id}`} style={{
              display: 'grid', gridTemplateColumns: '1fr 60px 70px 80px 80px',
              gap: 8, padding: '10px 10px', borderRadius: 6, textDecoration: 'none',
              alignItems: 'center', marginBottom: 2,
              transition: 'background .15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(196,164,74,0.05)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#e8dcc8' }}>{s.displayName}</div>
                <div style={{ fontSize: 10, color: 'rgba(138,154,176,0.55)', marginTop: 1 }}>{s.title}</div>
                <div style={{ fontSize: 9, color: 'rgba(138,154,176,0.4)', marginTop: 1 }}>{relTime(s.lastLoginAt)}</div>
              </div>
              <span style={{ textAlign: 'center', fontSize: 12, color: '#e8dcc8' }}>{s.adminCount ?? 0}</span>
              <span style={{ textAlign: 'center', fontSize: 12, color: '#e8dcc8' }}>{s.clientCount}</span>
              <span style={{ textAlign: 'right', fontSize: 11, color: '#c4a44a', fontFamily: 'var(--font-mono)' }}>
                {s.aum >= 1_000_000 ? `${(s.aum / 1_000_000).toFixed(1)}M` : `${(s.aum / 1_000).toFixed(0)}K`}
              </span>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {s.pendingTransfers > 0 ? (
                  <span style={{
                    fontSize: 10, background: 'rgba(224,160,60,0.15)', color: '#e0a03c',
                    border: '1px solid rgba(224,160,60,0.3)', padding: '1px 7px', borderRadius: 10,
                  }}>
                    {s.pendingTransfers}
                  </span>
                ) : (
                  <span style={{ fontSize: 10, color: 'rgba(138,154,176,0.35)' }}>—</span>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Activity Feed */}
        <div style={{
          padding: '22px 24px', borderRadius: 12,
          background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(196,164,74,0.1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: '#e8dcc8' }}>Recent Activity</div>
              <div style={{ fontSize: 10, color: 'rgba(138,154,176,0.5)', marginTop: 2 }}>Last system-wide actions</div>
            </div>
            <Link href="/admin/audit" style={{
              fontSize: 10, color: '#c4a44a', textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              Full log <ChevronRight size={12} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {recentActivity.map(entry => (
              <div key={entry.id} style={{
                display: 'flex', gap: 12, padding: '9px 10px', borderRadius: 6,
                borderLeft: entry.isAnomaly ? '2px solid rgba(196,164,74,0.5)' : '2px solid transparent',
                background: entry.isAnomaly ? 'rgba(196,164,74,0.04)' : 'transparent',
              }}>
                {/* Role dot */}
                <div style={{ paddingTop: 3, flexShrink: 0 }}>
                  <div style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: entry.adminRole === 'SUPER_ADMIN' ? '#c4a44a'
                      : entry.adminRole === 'MAJOR_ADMIN' ? '#a08c3a'
                      : 'rgba(138,154,176,0.4)',
                  }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, color: '#e8dcc8', lineHeight: 1.45 }}>
                    <span style={{ fontWeight: 500 }}>{entry.adminName}</span>
                    {' '}
                    <span style={{ color: 'rgba(138,154,176,0.8)' }}>
                      {AUDIT_ACTION_LABELS[entry.action] ?? entry.action}
                    </span>
                    {entry.clientName && (
                      <span style={{ color: 'rgba(138,154,176,0.6)' }}> · {entry.clientName}</span>
                    )}
                  </div>
                  <div style={{ fontSize: 9, color: 'rgba(138,154,176,0.4)', marginTop: 2 }}>
                    {relTime(entry.timestamp)}
                    {entry.notes && <> · {entry.notes}</>}
                  </div>
                </div>
                {entry.isAnomaly && (
                  <div style={{
                    flexShrink: 0, fontSize: 7, letterSpacing: '.1em', textTransform: 'uppercase',
                    padding: '2px 6px', borderRadius: 4,
                    background: 'rgba(196,164,74,0.12)', color: '#c4a44a',
                    border: '1px solid rgba(196,164,74,0.25)', alignSelf: 'flex-start',
                  }}>
                    Flagged
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Responsive styles ── */}
      <style>{`
        @media (max-width: 1200px) {
          .admin-stats-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .admin-stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
          .admin-lower-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .admin-stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
