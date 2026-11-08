'use client'

import { useState, useMemo } from 'react'
import {
  ArrowDownLeft, ArrowUpRight, RefreshCw, Landmark,
  BarChart2, Hexagon, Cpu, Building2, Archive, Download,
  Search, SlidersHorizontal, Receipt,
} from 'lucide-react'
import { mockTransactions, type Transaction, type TxCategory } from '@/lib/mock-data'

const FILTERS: { key: TxCategory | 'all'; label: string }[] = [
  { key: 'all',      label: 'All' },
  { key: 'inbound',  label: 'Inbound' },
  { key: 'outbound', label: 'Outbound' },
  { key: 'interest', label: 'Interest' },
  { key: 'fx',       label: 'FX' },
  { key: 'custody',  label: 'Custody' },
  { key: 'document', label: 'Documents' },
]

const ASSET_FILTERS = [
  { key: 'all',         label: 'All Classes' },
  { key: 'monetary',    label: 'Monetary' },
  { key: 'securities',  label: 'Securities' },
  { key: 'metals',      label: 'Metals' },
  { key: 'digital',     label: 'Digital' },
  { key: 'real-estate', label: 'Real Estate' },
  { key: 'vault',       label: 'Vault' },
]

// Group transactions by month label
function groupByMonth(txs: Transaction[]): { label: string; items: Transaction[] }[] {
  const map = new Map<string, Transaction[]>()
  for (const tx of txs) {
    const [y, m] = tx.dateISO.split('-')
    const key = new Date(`${y}-${m}-01`).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(tx)
  }
  return Array.from(map.entries()).map(([label, items]) => ({ label, items }))
}

export default function TransactionsPage() {
  const [category, setCategory] = useState<TxCategory | 'all'>('all')
  const [assetClass, setAssetClass] = useState('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    return mockTransactions
      .filter(tx => category === 'all' || tx.category === category)
      .filter(tx => assetClass === 'all' || tx.assetClass === assetClass)
      .filter(tx => {
        if (!query) return true
        const q = query.toLowerCase()
        return tx.name.toLowerCase().includes(q) || tx.ref.toLowerCase().includes(q) || tx.detail.toLowerCase().includes(q)
      })
  }, [category, assetClass, query])

  const groups = useMemo(() => groupByMonth(filtered), [filtered])

  // Summary counts
  const inboundTotal = filtered.filter(t => t.direction === 'up' && t.amount > 0).reduce((s, t) => s + t.amount, 0)
  const outboundTotal = Math.abs(filtered.filter(t => t.direction === 'down').reduce((s, t) => s + t.amount, 0))

  return (
    <div>
      {/* ── Header ─────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 12, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, color: 'var(--cream)' }}>
            Transaction History
          </div>
          <div style={{ fontSize: 10, color: 'var(--mist)', marginTop: 4, letterSpacing: '.05em' }}>
            ZPF-7741-0038 · All asset classes · Chronological order
          </div>
        </div>
        <button style={{
          fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--gold)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
          border: '1px solid var(--border2)', padding: '7px 14px', borderRadius: 20,
          background: 'transparent',
        }}>
          <Download size={12} /> Export CSV
        </button>
      </div>

      {/* ── Summary strip ───────────────────── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20,
      }} className="tx-summary-grid">
        <SummaryCard label="Total Transactions" value={String(filtered.length)} sub="matching current filters" icon="count" />
        <SummaryCard label="Total Inbound" value={inboundTotal > 0 ? `+CHF ${(inboundTotal / 1000).toFixed(0)}K` : '—'} sub="credits & interest" icon="up" />
        <SummaryCard label="Total Outbound" value={outboundTotal > 0 ? `−CHF ${(outboundTotal / 1000).toFixed(0)}K` : '—'} sub="debits & purchases" icon="down" />
      </div>

      {/* ── Filters ─────────────────────────── */}
      <div style={{
        background: 'var(--navy)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '16px 20px', marginBottom: 16,
      }}>
        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', padding: '8px 14px', marginBottom: 14,
        }}>
          <Search size={13} style={{ color: 'var(--mist)', flexShrink: 0 }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name, reference, or detail…"
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              fontSize: 12, color: 'var(--cream)',
            }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ color: 'var(--mist)', fontSize: 10, cursor: 'pointer' }}>
              ✕
            </button>
          )}
        </div>

        {/* Category tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
          <SlidersHorizontal size={12} style={{ color: 'var(--mist)', flexShrink: 0, marginRight: 4 }} />
          {FILTERS.map(f => (
            <button key={f.key} onClick={() => setCategory(f.key)} style={{
              padding: '4px 12px', borderRadius: 20, fontSize: 10, fontWeight: 500,
              letterSpacing: '.05em', cursor: 'pointer', border: 'none',
              background: category === f.key ? 'var(--gold)' : 'rgba(255,255,255,0.05)',
              color: category === f.key ? 'var(--navy)' : 'var(--mist)',
            }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Asset class tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
          <div style={{ width: 16, flexShrink: 0, marginRight: 4 }} />
          {ASSET_FILTERS.map(f => (
            <button key={f.key} onClick={() => setAssetClass(f.key)} style={{
              padding: '4px 12px', borderRadius: 20, fontSize: 10, cursor: 'pointer', border: 'none',
              background: assetClass === f.key ? 'rgba(196,164,74,0.15)' : 'rgba(255,255,255,0.04)',
              color: assetClass === f.key ? 'var(--gold)' : 'var(--mist)',
            }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Transaction list ─────────────────── */}
      {groups.length === 0 ? (
        <div style={{
          background: 'var(--navy)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '48px 24px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        }}>
          <Receipt size={28} style={{ color: 'var(--mist)', opacity: 0.4 }} />
          <div style={{ fontSize: 13, color: 'var(--mist)' }}>No transactions match your filters</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {groups.map(({ label, items }) => (
            <div key={label}>
              {/* Month divider */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8,
              }}>
                <div style={{ fontSize: 9, letterSpacing: '.35em', textTransform: 'uppercase', color: 'var(--mist)', whiteSpace: 'nowrap' }}>
                  {label}
                </div>
                <div style={{ flex: 1, height: '0.5px', background: 'rgba(196,164,74,0.12)' }} />
                <div style={{ fontSize: 9, color: 'rgba(138,154,176,0.4)', whiteSpace: 'nowrap' }}>
                  {items.length} {items.length === 1 ? 'entry' : 'entries'}
                </div>
              </div>

              {/* Transactions */}
              <div style={{ background: 'var(--navy)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                {items.map((tx, i) => (
                  <TxRow key={tx.id} tx={tx} last={i === items.length - 1} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Responsive */}
      <style>{`
        @media (max-width: 768px) {
          .tx-summary-grid { grid-template-columns: 1fr !important; }
          .tx-amount { display: none !important; }
          .tx-ref { display: none !important; }
        }
        @media (max-width: 480px) {
          .tx-summary-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  )
}

/* ── Sub-components ───────────────────────────────────────── */

function TxRow({ tx, last }: { tx: Transaction; last: boolean }) {
  const iconNode = <TxIcon icon={tx.icon} category={tx.category} />

  const iconBg: Record<string, string> = {
    inbound:  'rgba(29,158,117,0.12)',
    outbound: 'rgba(192,57,43,0.12)',
    interest: 'rgba(196,164,74,0.1)',
    fx:       'rgba(55,138,221,0.12)',
    custody:  'rgba(127,119,221,0.12)',
    document: 'rgba(138,154,176,0.1)',
    notice:   'rgba(138,154,176,0.1)',
  }
  const iconColor: Record<string, string> = {
    inbound:  '#1D9E75',
    outbound: '#C0392B',
    interest: '#C4A44A',
    fx:       '#378ADD',
    custody:  '#7F77DD',
    document: '#8A9AB0',
    notice:   '#8A9AB0',
  }

  const amtColor = tx.direction === 'up' ? 'var(--green)' : tx.direction === 'down' ? 'var(--red)' : 'var(--mist)'
  const amtPrefix = tx.direction === 'up' ? '+' : tx.direction === 'down' ? '−' : ''
  const amtAbs = Math.abs(tx.amount)
  const amtDisplay = tx.amount === 0 ? '—' : `${amtPrefix}${tx.currency} ${amtAbs.toLocaleString()}`

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px',
      borderBottom: last ? 'none' : '1px solid rgba(196,164,74,0.06)',
      cursor: 'pointer',
    }}>
      {/* Icon */}
      <div style={{
        width: 36, height: 36, borderRadius: 9, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: iconBg[tx.category] ?? 'rgba(138,154,176,0.1)',
        color: iconColor[tx.category] ?? '#8A9AB0',
      }}>
        {iconNode}
      </div>

      {/* Main info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 12, color: 'var(--cream)', fontWeight: 500 }}>{tx.name}</div>
          <CategoryBadge category={tx.category} />
        </div>
        <div style={{ fontSize: 10, color: 'var(--mist)', marginTop: 3, lineHeight: 1.4 }}>{tx.detail}</div>
        <div className="tx-ref" style={{ fontSize: 9, color: 'rgba(138,154,176,0.4)', marginTop: 3, fontFamily: 'var(--font-mono)' }}>
          {tx.ref}
        </div>
      </div>

      {/* Date */}
      <div style={{ flexShrink: 0, textAlign: 'right' }}>
        <div style={{ fontSize: 10, color: 'var(--mist)', whiteSpace: 'nowrap' }}>{tx.date}</div>
        <div className="tx-amount" style={{
          fontSize: 12, fontFamily: 'var(--font-mono)', fontWeight: 500,
          color: amtColor, marginTop: 4, whiteSpace: 'nowrap',
        }}>
          {amtDisplay}
        </div>
      </div>
    </div>
  )
}

function CategoryBadge({ category }: { category: TxCategory }) {
  const map: Record<TxCategory, { label: string; bg: string; color: string }> = {
    inbound:  { label: 'Inbound',  bg: 'rgba(29,158,117,0.12)',  color: '#4ecda4' },
    outbound: { label: 'Outbound', bg: 'rgba(192,57,43,0.12)',   color: '#f0997b' },
    interest: { label: 'Interest', bg: 'rgba(196,164,74,0.12)',  color: '#dfc27a' },
    fx:       { label: 'FX',       bg: 'rgba(55,138,221,0.14)',  color: '#6aaee8' },
    custody:  { label: 'Custody',  bg: 'rgba(127,119,221,0.12)', color: '#afa9ec' },
    document: { label: 'Document', bg: 'rgba(138,154,176,0.1)',  color: '#8A9AB0' },
    notice:   { label: 'Notice',   bg: 'rgba(138,154,176,0.1)',  color: '#8A9AB0' },
  }
  const s = map[category]
  return (
    <span style={{
      fontSize: 8, fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase',
      padding: '2px 7px', borderRadius: 3,
      background: s.bg, color: s.color, flexShrink: 0,
    }}>
      {s.label}
    </span>
  )
}

function TxIcon({ icon, category }: { icon: string; category: TxCategory }) {
  if (category === 'inbound')  return <ArrowDownLeft size={15} />
  if (category === 'outbound') return <ArrowUpRight size={15} />
  if (category === 'fx')       return <RefreshCw size={14} />
  if (category === 'interest') return <Landmark size={14} />
  const map: Record<string, React.ReactNode> = {
    'landmark':   <Landmark size={14} />,
    'bar-chart-2': <BarChart2 size={14} />,
    'hexagon':    <Hexagon size={14} />,
    'cpu':        <Cpu size={14} />,
    'building-2': <Building2 size={14} />,
    'archive':    <Archive size={14} />,
  }
  return <>{map[icon] ?? <Archive size={14} />}</>
}

function SummaryCard({ label, value, sub, icon }: { label: string; value: string; sub: string; icon: 'count' | 'up' | 'down' }) {
  const col = icon === 'up' ? 'var(--green)' : icon === 'down' ? 'var(--red)' : 'var(--cream)'
  return (
    <div style={{
      background: 'var(--surf)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: '16px 20px',
    }}>
      <div style={{ fontSize: 9, letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 400, color: col, lineHeight: 1, marginBottom: 4 }}>
        {value}
      </div>
      <div style={{ fontSize: 9, color: 'var(--mist)' }}>{sub}</div>
    </div>
  )
}
