'use client'

import { useState, useMemo } from 'react'
import {
  FileText, Download, DownloadCloud, BarChart2,
  Receipt, Shield, Archive, Activity, Calendar,
} from 'lucide-react'
import { mockStatements, type StatementType } from '@/lib/mock-data'

const TYPE_FILTERS: { key: StatementType | 'all'; label: string }[] = [
  { key: 'all',         label: 'All' },
  { key: 'quarterly',   label: 'Quarterly' },
  { key: 'annual',      label: 'Annual' },
  { key: 'performance', label: 'Performance' },
  { key: 'tax',         label: 'Tax' },
  { key: 'transaction', label: 'Transactions' },
  { key: 'custody',     label: 'Custody' },
]

const TYPE_META: Record<StatementType, { icon: React.ReactNode; color: string; bg: string }> = {
  quarterly:   { icon: <Calendar size={14} />,     color: '#378ADD', bg: 'rgba(55,138,221,0.1)'  },
  annual:      { icon: <FileText size={14} />,     color: '#C4A44A', bg: 'rgba(196,164,74,0.1)'  },
  performance: { icon: <Activity size={14} />,     color: '#1D9E75', bg: 'rgba(29,158,117,0.1)'  },
  tax:         { icon: <Receipt size={14} />,      color: '#7F77DD', bg: 'rgba(127,119,221,0.1)' },
  transaction: { icon: <BarChart2 size={14} />,    color: '#4A90D9', bg: 'rgba(74,144,217,0.1)'  },
  custody:     { icon: <Shield size={14} />,       color: '#8A9AB0', bg: 'rgba(138,154,176,0.1)' },
}

const YEARS = [2026, 2025, 2024, 2023, 2022]

export default function StatementsPage() {
  const [typeFilter, setTypeFilter] = useState<StatementType | 'all'>('all')
  const [yearFilter, setYearFilter] = useState<number | 'all'>('all')

  const filtered = useMemo(() =>
    mockStatements
      .filter(s => typeFilter === 'all' || s.type === typeFilter)
      .filter(s => yearFilter === 'all' || s.year === yearFilter),
    [typeFilter, yearFilter]
  )

  const newCount = mockStatements.filter(s => s.new).length
  const groups   = useMemo(() => {
    const map = new Map<number, typeof filtered>()
    for (const s of filtered) {
      if (!map.has(s.year)) map.set(s.year, [])
      map.get(s.year)!.push(s)
    }
    return Array.from(map.entries()).sort((a, b) => b[0] - a[0])
  }, [filtered])

  return (
    <div>
      {/* ── Header ─────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 12, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, color: 'var(--cream)' }}>
            Statements
          </div>
          <div style={{ fontSize: 10, color: 'var(--mist)', marginTop: 4, letterSpacing: '.05em' }}>
            ZPF-7741-0038 · Portfolio valuations · Tax certificates · Performance reports
          </div>
        </div>
        <button style={{
          fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--gold)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
          border: '1px solid var(--border2)', padding: '7px 14px', borderRadius: 20, background: 'transparent',
        }}>
          <DownloadCloud size={12} /> Download All
        </button>
      </div>

      {/* ── Summary cards ───────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }} className="stmt-kpi-grid">
        <SummaryCard icon={<Archive size={15} />}   label="Total Statements" value={String(mockStatements.length)} sub="Since account opening 2022" color="var(--gold)" />
        <SummaryCard icon={<FileText size={15} />}  label="New This Period"  value={String(newCount)} sub="Q1 2026 + full year 2025" color="#6aaee8" highlight />
        <SummaryCard icon={<Receipt size={15} />}   label="Latest Tax Cert"  value="2025" sub="Generated 20 Jan 2026" color="#afa9ec" />
        <SummaryCard icon={<Activity size={15} />}  label="Latest Quarterly" value="Q1 2026" sub="Generated 01 Apr 2026" color="#4ecda4" />
      </div>

      {/* ── Filters ─────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        {/* Type tabs */}
        <div style={{
          display: 'flex', gap: 4,
          background: 'var(--surf)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: 4,
        }}>
          {TYPE_FILTERS.map(f => (
            <button key={f.key} onClick={() => setTypeFilter(f.key)} style={{
              padding: '5px 12px', borderRadius: 8, fontSize: 10, fontWeight: 500,
              cursor: 'pointer', border: 'none', letterSpacing: '.04em',
              background: typeFilter === f.key ? 'var(--gold)' : 'transparent',
              color: typeFilter === f.key ? 'var(--navy)' : 'var(--mist)',
            }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Year pills */}
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={() => setYearFilter('all')} style={{
            padding: '5px 12px', borderRadius: 20, fontSize: 10, cursor: 'pointer', border: 'none', fontWeight: 500,
            background: yearFilter === 'all' ? 'rgba(196,164,74,0.15)' : 'rgba(255,255,255,0.04)',
            color: yearFilter === 'all' ? 'var(--gold)' : 'var(--mist)',
          }}>All years</button>
          {YEARS.map(y => (
            <button key={y} onClick={() => setYearFilter(y)} style={{
              padding: '5px 12px', borderRadius: 20, fontSize: 10, cursor: 'pointer', border: 'none', fontWeight: 500,
              background: yearFilter === y ? 'rgba(196,164,74,0.15)' : 'rgba(255,255,255,0.04)',
              color: yearFilter === y ? 'var(--gold)' : 'var(--mist)',
            }}>{y}</button>
          ))}
        </div>
      </div>

      {/* ── Statement groups ─────────────────── */}
      {groups.length === 0 ? (
        <div style={{
          background: 'var(--navy)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '48px 24px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        }}>
          <FileText size={28} style={{ color: 'var(--mist)', opacity: 0.4 }} />
          <div style={{ fontSize: 13, color: 'var(--mist)' }}>No statements match your filters</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {groups.map(([year, stmts]) => (
            <div key={year}>
              {/* Year divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <div style={{ fontSize: 9, letterSpacing: '.35em', textTransform: 'uppercase', color: 'var(--mist)' }}>{year}</div>
                <div style={{ flex: 1, height: '0.5px', background: 'rgba(196,164,74,0.12)' }} />
                <div style={{ fontSize: 9, color: 'rgba(138,154,176,0.4)' }}>{stmts.length} {stmts.length === 1 ? 'document' : 'documents'}</div>
              </div>

              <div style={{ background: 'var(--navy)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                {stmts.map((stmt, i) => (
                  <StatementRow key={stmt.id} stmt={stmt} last={i === stmts.length - 1} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Responsive */}
      <style>{`
        @media (max-width: 1024px) {
          .stmt-kpi-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 768px) {
          .stmt-kpi-grid   { grid-template-columns: 1fr 1fr !important; }
          .stmt-meta-cols  { display: none !important; }
        }
      `}</style>
    </div>
  )
}

/* ── Sub-components ───────────────────────────────────────── */

function StatementRow({ stmt, last }: { stmt: typeof mockStatements[0]; last: boolean }) {
  const meta = TYPE_META[stmt.type]

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14, padding: '14px 22px',
      borderBottom: last ? 'none' : '1px solid rgba(196,164,74,0.06)',
    }}>
      {/* Icon */}
      <div style={{
        width: 36, height: 36, borderRadius: 9, flexShrink: 0,
        background: meta.bg, color: meta.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {meta.icon}
      </div>

      {/* Title + meta */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--cream)' }}>{stmt.title}</span>
          {stmt.new && (
            <span style={{
              fontSize: 8, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase',
              padding: '2px 7px', borderRadius: 3,
              background: 'rgba(55,138,221,0.15)', color: '#6aaee8',
            }}>New</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 8, fontWeight: 500, letterSpacing: '.08em', textTransform: 'uppercase',
            padding: '2px 7px', borderRadius: 3, background: meta.bg, color: meta.color,
          }}>
            {stmt.typeLabel}
          </span>
          <span style={{ fontSize: 9, color: 'var(--mist)' }}>{stmt.period}</span>
        </div>
      </div>

      {/* Meta columns */}
      <div className="stmt-meta-cols" style={{ display: 'flex', gap: 28, alignItems: 'center', flexShrink: 0 }}>
        <MetaCol label="Generated" value={stmt.generatedDate} />
        <MetaCol label="Pages"     value={`${stmt.pages} pp`} />
        <MetaCol label="Size"      value={stmt.size} mono />
      </div>

      {/* Download */}
      <button style={{
        flexShrink: 0, width: 32, height: 32, borderRadius: 8,
        background: 'rgba(196,164,74,0.08)', border: '1px solid var(--border2)',
        color: 'var(--gold)', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Download size={13} />
      </button>
    </div>
  )
}

function MetaCol({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ textAlign: 'right' }}>
      <div style={{ fontSize: 8, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 10, color: 'var(--cream)', fontFamily: mono ? 'var(--font-mono)' : 'inherit' }}>{value}</div>
    </div>
  )
}

function SummaryCard({ icon, label, value, sub, color, highlight }: {
  icon: React.ReactNode; label: string; value: string; sub: string; color: string; highlight?: boolean
}) {
  return (
    <div style={{
      background: highlight ? 'rgba(55,138,221,0.05)' : 'var(--surf)',
      border: `1px solid ${highlight ? 'rgba(55,138,221,0.2)' : 'var(--border)'}`,
      borderRadius: 'var(--radius-lg)', padding: '16px 20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 7,
          background: `${color}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color, flexShrink: 0,
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
