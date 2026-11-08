'use client'

import { useState, useMemo } from 'react'
import { Search, Filter, AlertTriangle } from 'lucide-react'
import { mockAuditLog, type AuditEntry, type AuditAction } from '@/lib/admin-mock-data'

// ── Helpers ────────────────────────────────────────────────────────────────────

function fmtTs(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

const ACTION_LABELS: Record<string, string> = {
  CLIENT_CREATED:           'Client created',
  CLIENT_LOCKED:            'Account locked',
  CLIENT_UNLOCKED:          'Account unlocked',
  CLIENT_REASSIGNED:        'Client reassigned',
  KYC_STATUS_CHANGED:       'KYC status changed',
  RISK_PROFILE_CHANGED:     'Risk profile changed',
  TRANSACTION_ADDED:        'Transaction added',
  TRANSACTION_EDITED:       'Transaction edited',
  TRANSFER_APPROVED:        'Transfer approved',
  TRANSFER_COUNTER_APPROVED:'Counter-approval',
  TRANSFER_REJECTED:        'Transfer rejected',
  TRANSFER_EXECUTED:        'Transfer executed',
  DOCUMENT_UPLOADED:        'Document uploaded',
  DOCUMENT_SEALED:          'Document sealed',
  MESSAGE_SENT:             'Message sent',
  THREAD_RESOLVED:          'Thread resolved',
  THREAD_REASSIGNED:        'Thread reassigned',
  STAFF_CREATED:            'Staff created',
  STAFF_EDITED:             'Staff edited',
  STAFF_DEACTIVATED:        'Staff deactivated',
  STAFF_ROLE_CHANGED:       'Role changed',
  SYSTEM_CONFIG_CHANGED:    'Config changed',
  LOGIN_SUCCESS:            'Login',
  LOGIN_FAILED:             'Login failed',
  LOGOUT:                   'Logout',
  TOTP_ENROLLMENT_GENERATED:'TOTP reset',
}

const ACTION_CATEGORY: Record<string, string> = {
  CLIENT_CREATED: 'client', CLIENT_LOCKED: 'client', CLIENT_UNLOCKED: 'client', CLIENT_REASSIGNED: 'client',
  KYC_STATUS_CHANGED: 'client', RISK_PROFILE_CHANGED: 'client',
  TRANSACTION_ADDED: 'financial', TRANSACTION_EDITED: 'financial',
  TRANSFER_APPROVED: 'financial', TRANSFER_COUNTER_APPROVED: 'financial',
  TRANSFER_REJECTED: 'financial', TRANSFER_EXECUTED: 'financial',
  DOCUMENT_UPLOADED: 'document', DOCUMENT_SEALED: 'document',
  MESSAGE_SENT: 'message', THREAD_RESOLVED: 'message', THREAD_REASSIGNED: 'message',
  STAFF_CREATED: 'staff', STAFF_EDITED: 'staff', STAFF_DEACTIVATED: 'staff', STAFF_ROLE_CHANGED: 'staff',
  SYSTEM_CONFIG_CHANGED: 'system',
  LOGIN_SUCCESS: 'auth', LOGIN_FAILED: 'auth', LOGOUT: 'auth', TOTP_ENROLLMENT_GENERATED: 'auth',
}

const ROLE_DOT: Record<string, string> = {
  SUPER_ADMIN: '#c4a44a',
  MAJOR_ADMIN: '#6aaee8',
  ADMIN:       '#4ecda4',
}

type CategoryFilter = 'all' | 'client' | 'financial' | 'document' | 'staff' | 'system' | 'auth'
type RoleFilter     = 'all' | 'SUPER_ADMIN' | 'MAJOR_ADMIN' | 'ADMIN'

const CATEGORY_OPTS: { id: CategoryFilter; label: string }[] = [
  { id: 'all',       label: 'All' },
  { id: 'financial', label: 'Financial' },
  { id: 'client',    label: 'Clients' },
  { id: 'staff',     label: 'Staff' },
  { id: 'system',    label: 'System' },
  { id: 'auth',      label: 'Auth' },
  { id: 'document',  label: 'Documents' },
]

// ── Page ───────────────────────────────────────────────────────────────────────

export default function AdminAuditPage() {
  const [search,   setSearch]   = useState('')
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [role,     setRole]     = useState<RoleFilter>('all')
  const [anomalyOnly, setAnomalyOnly] = useState(false)

  const filtered = useMemo(() => {
    return mockAuditLog.filter(e => {
      const q = search.toLowerCase()
      const matchQ = !q || e.adminName.toLowerCase().includes(q) || e.notes.toLowerCase().includes(q) || (e.clientName?.toLowerCase().includes(q) ?? false) || e.action.toLowerCase().includes(q)
      const matchCat = category === 'all' || ACTION_CATEGORY[e.action] === category
      const matchRole = role === 'all' || e.adminRole === role
      const matchAnomaly = !anomalyOnly || e.isAnomaly
      return matchQ && matchCat && matchRole && matchAnomaly
    })
  }, [search, category, role, anomalyOnly])

  const anomalyCount = mockAuditLog.filter(e => e.isAnomaly).length

  return (
    <div style={{ maxWidth: 960 }}>

      {/* Summary strip */}
      <div className="audit-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total Entries', value: mockAuditLog.length,          color: '#e8dcc8' },
          { label: 'Anomalies',     value: anomalyCount,                  color: anomalyCount > 0 ? '#c4a44a' : '#8a9ab0' },
          { label: 'Super Admin',   value: mockAuditLog.filter(e => e.adminRole === 'SUPER_ADMIN').length, color: '#c4a44a' },
          { label: 'Today',         value: mockAuditLog.filter(e => {
            const d = new Date(e.timestamp); const n = new Date()
            return d.getDate() === n.getDate() && d.getMonth() === n.getMonth()
          }).length,                                                       color: '#8a9ab0' },
        ].map(s => (
          <div key={s.label} style={{ padding: '14px 16px', borderRadius: 8, border: '1px solid rgba(196,164,74,0.08)', background: 'rgba(255,255,255,0.015)' }}>
            <div style={{ fontSize: 10, color: '#8a9ab0', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 20, color: s.color, fontFamily: 'var(--font-display)' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 0 }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#8a9ab0' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search entries…"
            style={{
              width: '100%', padding: '7px 12px 7px 28px', boxSizing: 'border-box',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(196,164,74,0.1)',
              borderRadius: 6, color: '#e8dcc8', fontSize: 12, outline: 'none',
            }}
          />
        </div>

        {/* Category filter */}
        <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {CATEGORY_OPTS.map(c => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              style={{
                padding: '5px 9px', borderRadius: 5, fontSize: 10, cursor: 'pointer',
                background: category === c.id ? 'rgba(196,164,74,0.12)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${category === c.id ? 'rgba(196,164,74,0.3)' : 'rgba(196,164,74,0.08)'}`,
                color: category === c.id ? '#c4a44a' : '#8a9ab0',
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Role filter */}
        <div style={{ display: 'flex', gap: 3 }}>
          {(['all', 'SUPER_ADMIN', 'MAJOR_ADMIN', 'ADMIN'] as RoleFilter[]).map(r => (
            <button
              key={r}
              onClick={() => setRole(r)}
              style={{
                padding: '5px 9px', borderRadius: 5, fontSize: 10, cursor: 'pointer',
                background: role === r ? 'rgba(196,164,74,0.12)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${role === r ? 'rgba(196,164,74,0.3)' : 'rgba(196,164,74,0.08)'}`,
                color: role === r ? '#c4a44a' : '#8a9ab0',
              }}
            >
              {r === 'all' ? 'All Roles' : r.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        {/* Anomaly toggle */}
        <button
          onClick={() => setAnomalyOnly(o => !o)}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '5px 10px', borderRadius: 5, fontSize: 10, cursor: 'pointer',
            background: anomalyOnly ? 'rgba(196,164,74,0.12)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${anomalyOnly ? 'rgba(196,164,74,0.3)' : 'rgba(196,164,74,0.08)'}`,
            color: anomalyOnly ? '#c4a44a' : '#8a9ab0',
          }}
        >
          <AlertTriangle size={11} />
          Anomalies only {anomalyCount > 0 && `(${anomalyCount})`}
        </button>
      </div>

      {/* Results count */}
      <div style={{ fontSize: 11, color: '#8a9ab0', marginBottom: 10 }}>
        {filtered.length} of {mockAuditLog.length} entries
      </div>

      {/* Log table */}
      <div style={{ border: '1px solid rgba(196,164,74,0.1)', borderRadius: 8, overflow: 'hidden' }}>
        {/* Header */}
        <div className="audit-header" style={{
          display: 'grid', gridTemplateColumns: '160px 1fr 2fr 100px',
          padding: '9px 18px', background: 'rgba(255,255,255,0.02)',
          borderBottom: '1px solid rgba(196,164,74,0.08)',
        }}>
          {['Time', 'Actor', 'Details', 'IP'].map(h => (
            <div key={h} style={{ fontSize: 10, fontWeight: 600, color: '#8a9ab0', letterSpacing: '.08em', textTransform: 'uppercase' }}>{h}</div>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#8a9ab0', fontSize: 13 }}>
            No entries match the current filters.
          </div>
        ) : (
          filtered.map((entry, i) => (
            <AuditRow key={entry.id} entry={entry} isLast={i === filtered.length - 1} />
          ))
        )}
      </div>

      <style>{`
        input::placeholder { color: rgba(138,154,176,0.5); }
        @media (max-width: 768px) {
          .audit-stats { grid-template-columns: repeat(2, 1fr) !important; }
          .audit-header { display: none !important; }
        }
      `}</style>
    </div>
  )
}

// ── Audit Row ──────────────────────────────────────────────────────────────────

function AuditRow({ entry: e, isLast }: { entry: AuditEntry; isLast: boolean }) {
  return (
    <div
      style={{
        display: 'grid', gridTemplateColumns: '160px 1fr 2fr 100px',
        padding: '11px 18px',
        borderBottom: isLast ? 'none' : '1px solid rgba(196,164,74,0.05)',
        background: e.isAnomaly ? 'rgba(196,164,74,0.025)' : undefined,
        borderLeft: e.isAnomaly ? '3px solid rgba(196,164,74,0.4)' : '3px solid transparent',
        alignItems: 'center',
      }}
      className="audit-row"
    >
      {/* Timestamp */}
      <div style={{ fontSize: 11, color: '#8a9ab0', fontFamily: 'var(--font-mono)' }}>
        {fmtTs(e.timestamp)}
      </div>

      {/* Actor */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: ROLE_DOT[e.adminRole] ?? '#8a9ab0', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 12, color: '#e8dcc8' }}>{e.adminName}</div>
          <div style={{ fontSize: 10, color: '#8a9ab0', marginTop: 1 }}>{e.adminRole.replace(/_/g, ' ')}</div>
        </div>
      </div>

      {/* Details */}
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: '#e8dcc8', fontWeight: 500 }}>
            {ACTION_LABELS[e.action] ?? e.action.replace(/_/g, ' ')}
          </span>
          {e.clientName && <span style={{ fontSize: 11, color: '#8a9ab0' }}>— {e.clientName}</span>}
          {e.entityId   && <span style={{ fontSize: 11, color: '#8a9ab0', fontFamily: 'var(--font-mono)' }}>{e.entityId}</span>}
          {e.isAnomaly  && (
            <span style={{ padding: '1px 6px', borderRadius: 4, fontSize: 9, fontWeight: 700, background: 'rgba(196,164,74,0.15)', color: '#c4a44a', letterSpacing: '.05em' }}>
              FLAGGED
            </span>
          )}
        </div>
        <div style={{ fontSize: 11, color: '#8a9ab0', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {e.notes}
        </div>
      </div>

      {/* IP */}
      <div style={{ fontSize: 11, color: '#8a9ab0', fontFamily: 'var(--font-mono)' }}>
        {e.ipAddress}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .audit-row {
            grid-template-columns: 1fr !important;
            gap: 4px;
          }
        }
      `}</style>
    </div>
  )
}
