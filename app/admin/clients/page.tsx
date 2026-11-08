'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ChevronRight, UserPlus, Filter } from 'lucide-react'
import { mockAdminClients, type AdminClientRow } from '@/lib/admin-mock-data'

type KycFilter    = 'ALL' | 'VERIFIED' | 'PENDING' | 'EXPIRED'
type StatusFilter = 'ALL' | 'ACTIVE' | 'LOCKED'

const KYC_STYLE: Record<string, { bg: string; color: string }> = {
  VERIFIED: { bg: 'rgba(29,158,117,0.12)',  color: '#4ecda4' },
  PENDING:  { bg: 'rgba(196,164,74,0.12)',  color: '#c4a44a' },
  EXPIRED:  { bg: 'rgba(216,90,48,0.12)',   color: '#f0997b' },
}
const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  ACTIVE: { bg: 'rgba(29,158,117,0.1)',  color: '#4ecda4' },
  LOCKED: { bg: 'rgba(216,90,48,0.1)',   color: '#f0997b' },
}

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
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })
}

export default function AdminClientsPage() {
  const router = useRouter()
  const [search,     setSearch]     = useState('')
  const [kycFilter,  setKycFilter]  = useState<KycFilter>('ALL')
  const [statFilter, setStatFilter] = useState<StatusFilter>('ALL')

  const filtered = mockAdminClients.filter(c => {
    const q = search.toLowerCase()
    const matchQ = !q || c.fullName.toLowerCase().includes(q) || c.clientId.toLowerCase().includes(q) || c.ownerAdminName.toLowerCase().includes(q)
    const matchKyc = kycFilter  === 'ALL' || c.kycStatus     === kycFilter
    const matchSt  = statFilter === 'ALL' || c.accountStatus === statFilter
    return matchQ && matchKyc && matchSt
  })

  return (
    <div style={{ maxWidth: 1100 }}>

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 13, color: '#8a9ab0', marginBottom: 4 }}>
            {mockAdminClients.length} total · {mockAdminClients.filter(c => c.accountStatus === 'ACTIVE').length} active · {mockAdminClients.filter(c => c.kycStatus === 'PENDING' || c.kycStatus === 'EXPIRED').length} KYC issues
          </div>
        </div>
        <button
          onClick={() => router.push('/admin/clients/new')}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', borderRadius: 6,
            background: 'rgba(196,164,74,0.12)', border: '1px solid rgba(196,164,74,0.3)',
            color: '#c4a44a', fontSize: 12, fontWeight: 500, cursor: 'pointer',
          }}
        >
          <UserPlus size={14} />
          New Client
        </button>
      </div>

      {/* Search + filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 0 }}>
          <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#8a9ab0' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name, ID, or RM…"
            style={{
              width: '100%', padding: '8px 12px 8px 32px', boxSizing: 'border-box',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(196,164,74,0.1)',
              borderRadius: 6, color: '#e8dcc8', fontSize: 12, outline: 'none',
            }}
          />
        </div>
        {/* KYC filter */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <Filter size={12} style={{ color: '#8a9ab0' }} />
          {(['ALL','VERIFIED','PENDING','EXPIRED'] as KycFilter[]).map(f => (
            <button
              key={f}
              onClick={() => setKycFilter(f)}
              style={{
                padding: '6px 10px', borderRadius: 5, fontSize: 11, cursor: 'pointer',
                background: kycFilter === f ? 'rgba(196,164,74,0.12)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${kycFilter === f ? 'rgba(196,164,74,0.3)' : 'rgba(196,164,74,0.08)'}`,
                color: kycFilter === f ? '#c4a44a' : '#8a9ab0',
              }}
            >
              {f === 'ALL' ? 'All KYC' : f}
            </button>
          ))}
        </div>
        {/* Status filter */}
        <div style={{ display: 'flex', gap: 4 }}>
          {(['ALL','ACTIVE','LOCKED'] as StatusFilter[]).map(f => (
            <button
              key={f}
              onClick={() => setStatFilter(f)}
              style={{
                padding: '6px 10px', borderRadius: 5, fontSize: 11, cursor: 'pointer',
                background: statFilter === f ? 'rgba(196,164,74,0.12)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${statFilter === f ? 'rgba(196,164,74,0.3)' : 'rgba(196,164,74,0.08)'}`,
                color: statFilter === f ? '#c4a44a' : '#8a9ab0',
              }}
            >
              {f === 'ALL' ? 'All Status' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ border: '1px solid rgba(196,164,74,0.1)', borderRadius: 8, overflow: 'hidden' }}>
        {/* Header */}
        <div className="client-table-header" style={{
          display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 80px',
          padding: '10px 20px', background: 'rgba(255,255,255,0.02)',
          borderBottom: '1px solid rgba(196,164,74,0.08)',
        }}>
          {['Client', 'AUM', 'KYC', 'Status', 'Last Login', ''].map(h => (
            <div key={h} style={{ fontSize: 10, fontWeight: 600, color: '#8a9ab0', letterSpacing: '.08em', textTransform: 'uppercase' }}>{h}</div>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#8a9ab0', fontSize: 13 }}>
            No clients match the current filters.
          </div>
        ) : (
          filtered.map((c, i) => (
            <ClientRow
              key={c.clientId}
              client={c}
              isLast={i === filtered.length - 1}
              onClick={() => router.push(`/admin/clients/${c.clientId}`)}
            />
          ))
        )}
      </div>

      <style>{`
        input::placeholder { color: rgba(138,154,176,0.5); }
        @media (max-width: 768px) {
          .client-table-header { display: none !important; }
        }
      `}</style>
    </div>
  )
}

function ClientRow({ client: c, isLast, onClick }: { client: AdminClientRow; isLast: boolean; onClick: () => void }) {
  const kyc    = KYC_STYLE[c.kycStatus]    ?? KYC_STYLE.PENDING
  const status = STATUS_STYLE[c.accountStatus] ?? STATUS_STYLE.ACTIVE

  return (
    <div
      onClick={onClick}
      className="client-row"
      style={{
        display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 80px',
        padding: '14px 20px', cursor: 'pointer',
        borderBottom: isLast ? 'none' : '1px solid rgba(196,164,74,0.06)',
        transition: 'background .15s',
      }}
    >
      {/* Client identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
        <div style={{
          width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
          background: 'rgba(196,164,74,0.1)', border: '1px solid rgba(196,164,74,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontSize: 11, color: '#c4a44a',
        }}>
          {c.displayName.split(' ').map(p => p[0]).join('').slice(0, 2)}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#e8dcc8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.fullName}</div>
          <div style={{ fontSize: 11, color: '#8a9ab0', marginTop: 1 }}>{c.clientId} · {c.ownerAdminName}</div>
        </div>
      </div>

      {/* AUM */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ fontSize: 13, color: '#e8dcc8', fontFamily: 'var(--font-mono)' }}>{fmtChf(c.aum)}</span>
      </div>

      {/* KYC badge */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ padding: '3px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600, letterSpacing: '.06em', background: kyc.bg, color: kyc.color }}>
          {c.kycStatus}
        </span>
      </div>

      {/* Account status */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ padding: '3px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600, letterSpacing: '.06em', background: status.bg, color: status.color }}>
          {c.accountStatus}
        </span>
      </div>

      {/* Last login */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: '#8a9ab0' }}>{relTime(c.lastLoginAt)}</span>
      </div>

      {/* Arrow */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        <ChevronRight size={15} style={{ color: 'rgba(138,154,176,0.4)' }} />
      </div>

      <style>{`
        .client-row:hover { background: rgba(196,164,74,0.03) !important; }
        @media (max-width: 768px) {
          .client-row {
            grid-template-columns: 1fr auto !important;
            grid-template-rows: auto auto;
            gap: 4px 0;
          }
          .client-row > div:nth-child(2),
          .client-row > div:nth-child(4),
          .client-row > div:nth-child(5) { display: none; }
          .client-row > div:nth-child(3) { grid-column: 1; }
          .client-row > div:nth-child(6) { grid-row: 1 / 3; grid-column: 2; align-items: center; }
        }
      `}</style>
    </div>
  )
}
