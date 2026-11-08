'use client'

import { useState } from 'react'
import { Search, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import { mockAdminTransfers, type AdminTransferRow, type TransferStatus } from '@/lib/admin-mock-data'

// ── Helpers ────────────────────────────────────────────────────────────────────

function fmtChf(n: number) {
  if (n >= 1_000_000) return `CHF ${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000)     return `CHF ${(n / 1_000).toFixed(0)}K`
  return `CHF ${n.toLocaleString()}`
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

const STATUS_META: Record<TransferStatus, { label: string; bg: string; color: string; tab: string }> = {
  PENDING_REVIEW:   { label: 'Pending Review',   bg: 'rgba(196,164,74,0.12)',  color: '#c4a44a',  tab: 'pending' },
  UNDER_REVIEW:     { label: 'Under Review',      bg: 'rgba(55,138,221,0.12)',  color: '#6aaee8',  tab: 'pending' },
  AWAITING_COUNTER: { label: 'Awaiting Counter',  bg: 'rgba(127,119,221,0.12)', color: '#afa9ec',  tab: 'pending' },
  APPROVED:         { label: 'Approved',           bg: 'rgba(29,158,117,0.12)',  color: '#4ecda4',  tab: 'approved' },
  EXECUTED:         { label: 'Executed',           bg: 'rgba(138,154,176,0.1)',  color: '#8a9ab0',  tab: 'executed' },
  REJECTED:         { label: 'Rejected',           bg: 'rgba(216,90,48,0.12)',   color: '#f0997b',  tab: 'rejected' },
}

type TabId = 'all' | 'pending' | 'approved' | 'executed' | 'rejected'

const TABS: { id: TabId; label: string }[] = [
  { id: 'all',      label: 'All' },
  { id: 'pending',  label: 'Pending Action' },
  { id: 'approved', label: 'Approved' },
  { id: 'executed', label: 'Executed' },
  { id: 'rejected', label: 'Rejected' },
]

export default function AdminTransfersPage() {
  const [tab,    setTab]    = useState<TabId>('all')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  const pendingCount = mockAdminTransfers.filter(t => STATUS_META[t.status].tab === 'pending').length

  const filtered = mockAdminTransfers.filter(t => {
    const matchTab = tab === 'all' || STATUS_META[t.status].tab === tab
    const q = search.toLowerCase()
    const matchQ = !q || t.clientName.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || t.beneficiaryName.toLowerCase().includes(q)
    return matchTab && matchQ
  })

  return (
    <div style={{ maxWidth: 960 }}>

      {/* Summary strip */}
      <div className="transfer-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total',            value: mockAdminTransfers.length,                                                               color: '#e8dcc8' },
          { label: 'Pending Action',   value: pendingCount,                                                                           color: pendingCount > 0 ? '#c4a44a' : '#8a9ab0' },
          { label: 'Executed (All)',   value: mockAdminTransfers.filter(t => t.status === 'EXECUTED').length,                         color: '#8a9ab0' },
          { label: 'Total Volume',     value: fmtChf(mockAdminTransfers.reduce((s, t) => s + t.amountChf, 0)),                        color: '#e8dcc8' },
        ].map(s => (
          <div key={s.label} style={{ padding: '14px 16px', borderRadius: 8, border: '1px solid rgba(196,164,74,0.08)', background: 'rgba(255,255,255,0.015)' }}>
            <div style={{ fontSize: 10, color: '#8a9ab0', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 18, color: s.color, fontFamily: 'var(--font-display)' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs + search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 2, borderBottom: '1px solid rgba(196,164,74,0.1)', flex: '1 1 auto', overflowX: 'auto' }}>
          {TABS.map(t => {
            const count = t.id === 'all' ? mockAdminTransfers.length : mockAdminTransfers.filter(tr => STATUS_META[tr.status].tab === t.id).length
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  padding: '7px 14px', fontSize: 12, fontWeight: 500, cursor: 'pointer',
                  background: 'none', border: 'none',
                  color: tab === t.id ? '#c4a44a' : '#8a9ab0',
                  borderBottom: tab === t.id ? '2px solid #c4a44a' : '2px solid transparent',
                  marginBottom: -1, whiteSpace: 'nowrap',
                }}
              >
                {t.label}
                {count > 0 && (
                  <span style={{ marginLeft: 5, padding: '1px 5px', borderRadius: 10, fontSize: 9, fontWeight: 700, background: tab === t.id ? 'rgba(196,164,74,0.15)' : 'rgba(138,154,176,0.1)', color: tab === t.id ? '#c4a44a' : '#8a9ab0' }}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#8a9ab0' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search…"
            style={{
              padding: '7px 12px 7px 28px',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(196,164,74,0.1)',
              borderRadius: 6, color: '#e8dcc8', fontSize: 12, outline: 'none', width: 180,
            }}
          />
        </div>
      </div>

      {/* Transfer cards */}
      {filtered.length === 0 ? (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: '#8a9ab0', fontSize: 13, border: '1px dashed rgba(196,164,74,0.1)', borderRadius: 8 }}>
          No transfers match the current filter.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(t => (
            <TransferCard
              key={t.id}
              transfer={t}
              isExpanded={expanded === t.id}
              onToggle={() => setExpanded(expanded === t.id ? null : t.id)}
            />
          ))}
        </div>
      )}

      <style>{`
        input::placeholder { color: rgba(138,154,176,0.5); }
        @media (max-width: 768px) {
          .transfer-stats { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  )
}

// ── Transfer Card ──────────────────────────────────────────────────────────────

function TransferCard({ transfer: t, isExpanded, onToggle }: {
  transfer: AdminTransferRow
  isExpanded: boolean
  onToggle: () => void
}) {
  const meta = STATUS_META[t.status]
  const isPending = meta.tab === 'pending'

  return (
    <div style={{
      borderRadius: 8, border: `1px solid ${isPending ? 'rgba(196,164,74,0.18)' : 'rgba(196,164,74,0.1)'}`,
      background: isPending ? 'rgba(196,164,74,0.02)' : 'rgba(255,255,255,0.015)',
      overflow: 'hidden',
    }}>
      {/* Card header */}
      <div
        onClick={onToggle}
        style={{ padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}
      >
        {/* Left: ID + status */}
        <div style={{ flexShrink: 0, width: 100 }}>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: '#8a9ab0', marginBottom: 4 }}>{t.id}</div>
          <span style={{ padding: '2px 7px', borderRadius: 4, fontSize: 10, fontWeight: 600, letterSpacing: '.04em', background: meta.bg, color: meta.color }}>
            {meta.label}
          </span>
        </div>

        {/* Center: client + amount */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, color: '#e8dcc8', fontWeight: 500 }}>
            {t.currency} {t.amount.toLocaleString()} → {t.beneficiaryName}
          </div>
          <div style={{ fontSize: 11, color: '#8a9ab0', marginTop: 2 }}>
            {t.clientName} · {t.ownerAdminName} · {t.beneficiaryCountry}
          </div>
        </div>

        {/* Right: CHF equiv + time + chevron */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, color: '#e8dcc8', fontFamily: 'var(--font-mono)' }}>{fmtChf(t.amountChf)}</div>
            <div style={{ fontSize: 11, color: '#8a9ab0', marginTop: 1 }}>{relTime(t.submittedAt)}</div>
          </div>
          {isExpanded ? <ChevronUp size={14} style={{ color: '#8a9ab0' }} /> : <ChevronDown size={14} style={{ color: '#8a9ab0' }} />}
        </div>
      </div>

      {/* Expanded detail */}
      {isExpanded && (
        <div style={{ padding: '0 18px 16px', borderTop: '1px solid rgba(196,164,74,0.08)' }}>
          <div className="transfer-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px', marginTop: 14 }}>
            {[
              { label: 'Client ID',      value: t.clientId },
              { label: 'Category',       value: t.category },
              { label: 'Bank',           value: t.bankName },
              { label: 'BIC',            value: t.bic },
              { label: 'Masked IBAN',    value: t.maskedIban },
              { label: 'Reference',      value: t.reference },
              ...(t.settlementRef ? [{ label: 'Settlement Ref', value: t.settlementRef }] : []),
              ...(t.clientNotes   ? [{ label: 'Client Notes',   value: t.clientNotes   }] : []),
            ].map(f => (
              <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '5px 0', borderBottom: '1px solid rgba(196,164,74,0.04)' }}>
                <span style={{ fontSize: 11, color: '#8a9ab0' }}>{f.label}</span>
                <span style={{ fontSize: 11, color: '#e8dcc8', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>{f.value}</span>
              </div>
            ))}
          </div>

          {/* Action buttons for pending transfers */}
          {isPending && (
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              {t.status === 'PENDING_REVIEW' && (
                <>
                  <button style={{ ...actionBtn, background: 'rgba(29,158,117,0.1)', border: '1px solid rgba(29,158,117,0.25)', color: '#4ecda4' }}>
                    <CheckCircle size={13} /> Approve
                  </button>
                  <button style={{ ...actionBtn, background: 'rgba(216,90,48,0.08)', border: '1px solid rgba(216,90,48,0.2)', color: '#f0997b' }}>
                    <XCircle size={13} /> Reject
                  </button>
                </>
              )}
              {t.status === 'UNDER_REVIEW' && (
                <button style={{ ...actionBtn, background: 'rgba(29,158,117,0.1)', border: '1px solid rgba(29,158,117,0.25)', color: '#4ecda4' }}>
                  <CheckCircle size={13} /> Mark Approved
                </button>
              )}
              {t.status === 'AWAITING_COUNTER' && (
                <button style={{ ...actionBtn, background: 'rgba(127,119,221,0.1)', border: '1px solid rgba(127,119,221,0.25)', color: '#afa9ec' }}>
                  <Clock size={13} /> Counter-Approve
                </button>
              )}
              {t.status === 'APPROVED' && (
                <button style={{ ...actionBtn, background: 'rgba(29,158,117,0.1)', border: '1px solid rgba(29,158,117,0.25)', color: '#4ecda4' }}>
                  <CheckCircle size={13} /> Mark Executed
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .transfer-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

const actionBtn: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 5,
  padding: '7px 14px', borderRadius: 6, fontSize: 11, fontWeight: 500, cursor: 'pointer',
}
