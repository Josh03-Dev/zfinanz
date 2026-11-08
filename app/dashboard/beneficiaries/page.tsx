'use client'

import { useState } from 'react'
import {
  Users, Plus, ChevronDown, ChevronUp, AlertTriangle, Clock,
  CheckCircle2, Building2, Landmark, Heart, UserRound,
} from 'lucide-react'
import { mockBeneficiaries, type Beneficiary, type BeneficiaryStatus } from '@/lib/mock-data'

const STATUS_META: Record<BeneficiaryStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  'active':               { label: 'Active',               color: '#1D9E75', bg: 'rgba(29,158,117,0.1)',   icon: <CheckCircle2 size={11} /> },
  'pending-verification': { label: 'Pending Verification', color: '#C4A44A', bg: 'rgba(196,164,74,0.1)',  icon: <Clock size={11} /> },
  'suspended':            { label: 'Suspended',            color: '#DD7777', bg: 'rgba(221,119,119,0.1)', icon: <AlertTriangle size={11} /> },
}

const RELATION_META: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  trust:   { color: '#C4A44A', bg: 'rgba(196,164,74,0.1)',   icon: <Landmark size={13} /> },
  business:{ color: '#378ADD', bg: 'rgba(55,138,221,0.1)',   icon: <Building2 size={13} /> },
  spouse:  { color: '#7F77DD', bg: 'rgba(127,119,221,0.1)',  icon: <UserRound size={13} /> },
  sibling: { color: '#7F77DD', bg: 'rgba(127,119,221,0.1)',  icon: <UserRound size={13} /> },
  child:   { color: '#7F77DD', bg: 'rgba(127,119,221,0.1)',  icon: <UserRound size={13} /> },
  parent:  { color: '#7F77DD', bg: 'rgba(127,119,221,0.1)',  icon: <UserRound size={13} /> },
  charity: { color: '#4ecda4', bg: 'rgba(78,205,164,0.1)',   icon: <Heart size={13} /> },
  self:    { color: '#8A9AB0', bg: 'rgba(138,154,176,0.1)',  icon: <UserRound size={13} /> },
}

const STATUS_FILTERS: { key: BeneficiaryStatus | 'all'; label: string }[] = [
  { key: 'all',                 label: 'All' },
  { key: 'active',              label: 'Active' },
  { key: 'pending-verification',label: 'Pending' },
  { key: 'suspended',           label: 'Suspended' },
]

export default function BeneficiariesPage() {
  const [statusFilter, setStatusFilter] = useState<BeneficiaryStatus | 'all'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = mockBeneficiaries.filter(b =>
    statusFilter === 'all' || b.status === statusFilter
  )

  const activeCount  = mockBeneficiaries.filter(b => b.status === 'active').length
  const pendingCount = mockBeneficiaries.filter(b => b.status === 'pending-verification').length
  const suspended    = mockBeneficiaries.filter(b => b.status === 'suspended').length

  return (
    <div>
      {/* ── Header ──────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 12, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, color: 'var(--cream)' }}>
            Beneficiaries
          </div>
          <div style={{ fontSize: 10, color: 'var(--mist)', marginTop: 4, letterSpacing: '.05em' }}>
            ZPF-7741-0038 · Approved transfer recipients · All beneficiaries are compliance-verified
          </div>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
          fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--gold)',
          border: '1px solid var(--border2)', padding: '7px 14px', borderRadius: 20, background: 'transparent',
        }}>
          <Plus size={12} /> Add Beneficiary
        </button>
      </div>

      {/* ── Summary cards ───────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }} className="ben-kpi-grid">
        <KpiCard icon={<Users size={14} />}        label="Active Beneficiaries"  value={String(activeCount)}  sub="Compliance verified" color="#1D9E75" />
        <KpiCard icon={<Clock size={14} />}         label="Pending Verification"  value={String(pendingCount)} sub="Documents awaited"   color="#C4A44A" highlight />
        <KpiCard icon={<AlertTriangle size={14} />} label="Suspended"             value={String(suspended)}    sub="Action required"     color="#DD7777" />
      </div>

      {/* ── Compliance notice ───────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 16px', marginBottom: 16,
        background: 'rgba(196,164,74,0.05)', border: '1px solid rgba(196,164,74,0.18)', borderRadius: 10,
      }}>
        <AlertTriangle size={12} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontSize: 10, color: 'rgba(196,164,74,0.85)', lineHeight: 1.6 }}>
          Adding or amending beneficiaries requires identity verification and RM co-authorisation. New beneficiaries may take up to 5 business days to activate. Contact Dr. von Steiner to initiate a change.
        </span>
      </div>

      {/* ── Filter tabs ─────────────────────────── */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 16,
        background: 'var(--surf)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: 4, width: 'fit-content',
      }}>
        {STATUS_FILTERS.map(f => (
          <button key={f.key} onClick={() => setStatusFilter(f.key)} style={{
            padding: '5px 14px', borderRadius: 8, fontSize: 10, fontWeight: 500,
            cursor: 'pointer', border: 'none', letterSpacing: '.04em',
            background: statusFilter === f.key ? 'var(--gold)' : 'transparent',
            color: statusFilter === f.key ? 'var(--navy)' : 'var(--mist)',
          }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Beneficiary list ────────────────────── */}
      {filtered.length === 0 ? (
        <div style={{
          background: 'var(--navy)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '48px 24px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        }}>
          <Users size={28} style={{ color: 'var(--mist)', opacity: 0.4 }} />
          <div style={{ fontSize: 13, color: 'var(--mist)' }}>No beneficiaries match your filter</div>
        </div>
      ) : (
        <div style={{ background: 'var(--navy)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          {filtered.map((ben, i) => (
            <BenRow
              key={ben.id}
              ben={ben}
              last={i === filtered.length - 1}
              expanded={expandedId === ben.id}
              onToggle={() => setExpandedId(expandedId === ben.id ? null : ben.id)}
            />
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 1024px) { .ben-kpi-grid { grid-template-columns: repeat(3,1fr) !important; } }
        @media (max-width: 768px)  { .ben-kpi-grid { grid-template-columns: 1fr 1fr !important; } .ben-meta-cols { display: none !important; } }
      `}</style>
    </div>
  )
}

/* ── BenRow ───────────────────────────────────────────────── */

function BenRow({ ben, last, expanded, onToggle }: {
  ben: Beneficiary; last: boolean; expanded: boolean; onToggle: () => void
}) {
  const rel    = RELATION_META[ben.relation] ?? RELATION_META['self']
  const status = STATUS_META[ben.status]

  return (
    <div style={{ borderBottom: last && !expanded ? 'none' : '1px solid rgba(196,164,74,0.06)' }}>
      {/* ── Row summary ── */}
      <div
        onClick={onToggle}
        style={{
          display: 'flex', alignItems: 'center', gap: 14, padding: '16px 22px',
          cursor: 'pointer',
        }}
      >
        {/* Relation icon */}
        <div style={{
          width: 38, height: 38, borderRadius: 10, flexShrink: 0,
          background: rel.bg, color: rel.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {rel.icon}
        </div>

        {/* Name + relation */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--cream)' }}>{ben.name}</span>
            <span style={{
              fontSize: 8, letterSpacing: '.08em', textTransform: 'uppercase',
              padding: '2px 7px', borderRadius: 3, background: rel.bg, color: rel.color,
            }}>
              {ben.relationLabel}
            </span>
          </div>
          <div style={{ fontSize: 9, color: 'var(--mist)' }}>{ben.bank} · {ben.bankCountry}</div>
        </div>

        {/* Meta columns */}
        <div className="ben-meta-cols" style={{ display: 'flex', gap: 28, alignItems: 'center', flexShrink: 0 }}>
          <MetaCol label="IBAN"         value={ben.iban} mono />
          <MetaCol label="Currency"     value={ben.currency} />
          <MetaCol label="Last Transfer" value={ben.lastUsedDate ?? '—'} />
          <MetaCol label="Total Sent"   value={ben.totalTransferred > 0 ? `CHF ${(ben.totalTransferred / 1000).toFixed(0)}k` : '—'} />
        </div>

        {/* Status + toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <span style={{
            display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, fontWeight: 500,
            padding: '3px 9px', borderRadius: 20, background: status.bg, color: status.color,
          }}>
            {status.icon} {status.label}
          </span>
          {expanded
            ? <ChevronUp size={13} style={{ color: 'var(--mist)' }} />
            : <ChevronDown size={13} style={{ color: 'var(--mist)' }} />
          }
        </div>
      </div>

      {/* ── Expanded detail ── */}
      {expanded && (
        <div style={{
          margin: '0 22px 18px', padding: '18px 20px',
          background: 'rgba(255,255,255,0.025)', border: '1px solid var(--border)',
          borderRadius: 10,
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 16 }} className="ben-detail-grid">
            <DetailField label="Reference"         value={ben.ref} mono />
            <DetailField label="Bank"              value={ben.bank} />
            <DetailField label="Country"           value={ben.bankCountry} />
            <DetailField label="IBAN"              value={ben.iban} mono />
            <DetailField label="SWIFT / BIC"       value={ben.swift} mono />
            <DetailField label="Currency"          value={ben.currency} />
            <DetailField label="Added"             value={ben.addedDate} />
            <DetailField label="Last Used"         value={ben.lastUsedDate ?? 'Never'} />
            <DetailField label="Transfers"         value={`${ben.transferCount} transfer${ben.transferCount !== 1 ? 's' : ''}`} />
          </div>

          <div style={{ height: '0.5px', background: 'rgba(196,164,74,0.1)', marginBottom: 14 }} />

          <div style={{ marginBottom: ben.notes ? 12 : 0 }}>
            <div style={{ fontSize: 8, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 5 }}>Verification</div>
            <div style={{ fontSize: 10, color: 'var(--cream)' }}>{ben.verifiedBy}</div>
          </div>

          {ben.notes && (
            <div style={{
              marginTop: 12, padding: '10px 14px', borderRadius: 8,
              background: ben.status === 'suspended'
                ? 'rgba(221,119,119,0.07)'
                : 'rgba(196,164,74,0.05)',
              border: `1px solid ${ben.status === 'suspended' ? 'rgba(221,119,119,0.2)' : 'rgba(196,164,74,0.15)'}`,
            }}>
              <div style={{ fontSize: 8, letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 5,
                color: ben.status === 'suspended' ? '#DD7777' : 'var(--gold)' }}>
                Notes
              </div>
              <div style={{ fontSize: 10, color: 'var(--cream)', lineHeight: 1.6 }}>{ben.notes}</div>
            </div>
          )}

          {ben.status === 'suspended' && (
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <button style={{
                fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase',
                padding: '7px 16px', borderRadius: 8, cursor: 'pointer',
                background: 'rgba(196,164,74,0.1)', border: '1px solid var(--border2)', color: 'var(--gold)',
              }}>
                Contact RM to Resolve
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ── Sub-components ───────────────────────────────────────── */

function MetaCol({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ textAlign: 'right' }}>
      <div style={{ fontSize: 8, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 10, color: 'var(--cream)', fontFamily: mono ? 'var(--font-mono)' : 'inherit' }}>{value}</div>
    </div>
  )
}

function DetailField({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div style={{ fontSize: 8, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 11, color: 'var(--cream)', fontFamily: mono ? 'var(--font-mono)' : 'inherit' }}>{value}</div>
    </div>
  )
}

function KpiCard({ icon, label, value, sub, color, highlight }: {
  icon: React.ReactNode; label: string; value: string; sub: string; color: string; highlight?: boolean
}) {
  return (
    <div style={{
      background: highlight ? `${color}08` : 'var(--surf)',
      border: `1px solid ${highlight ? `${color}30` : 'var(--border)'}`,
      borderRadius: 'var(--radius-lg)', padding: '16px 20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 7, flexShrink: 0,
          background: `${color}18`, color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {icon}
        </div>
        <div style={{ fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--mist)' }}>{label}</div>
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, color, lineHeight: 1, marginBottom: 3 }}>{value}</div>
      <div style={{ fontSize: 9, color: 'var(--mist)' }}>{sub}</div>
    </div>
  )
}
