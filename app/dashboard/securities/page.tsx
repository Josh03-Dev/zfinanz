'use client'

import { useState } from 'react'
import {
  TrendingUp, TrendingDown, Minus, Download, SlidersHorizontal,
  BarChart2, ArrowDownLeft, ArrowUpRight, Clock,
} from 'lucide-react'
import {
  mockEquities, mockBonds, mockSecuritiesActivity,
} from '@/lib/mock-data'

type Tab = 'equities' | 'bonds'

const SECTORS: Record<string, string> = {
  'Consumer Staples': '#1D9E75',
  'Consumer':         '#C4A44A',
  'Healthcare':       '#378ADD',
  'Technology':       '#7F77DD',
  'Industrials':      '#D85A30',
  'Financials':       '#4A90D9',
}

export default function SecuritiesPage() {
  const [tab, setTab] = useState<Tab>('equities')

  const totalValue  = 3_940_000
  const equityValue = mockEquities.reduce((s, e) => s + e.valueCHF, 0)
  const bondValue   = mockBonds.reduce((s, b) => s + b.valueCHF, 0)
  const equityPct   = ((equityValue / totalValue) * 100).toFixed(1)
  const bondPct     = ((bondValue   / totalValue) * 100).toFixed(1)

  return (
    <div>
      {/* ── Header ─────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 12, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, color: 'var(--cream)' }}>
            Securities Portfolio
          </div>
          <div style={{ fontSize: 10, color: 'var(--mist)', marginTop: 4, letterSpacing: '.05em' }}>
            ZPF-7741-0038 · 24 positions · Equities & Fixed Income · Custody: ZPF AG, Zürich
          </div>
        </div>
        <button style={{
          fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--gold)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
          border: '1px solid var(--border2)', padding: '7px 14px', borderRadius: 20, background: 'transparent',
        }}>
          <Download size={12} /> Holdings Report
        </button>
      </div>

      {/* ── KPIs ────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }} className="sec-kpi-grid">
        <div style={{
          gridColumn: '1 / 3',
          background: 'linear-gradient(135deg,#0e2040 0%,#162d56 100%)',
          border: '1px solid var(--border2)', borderRadius: 'var(--radius-lg)',
          padding: '22px 28px', position: 'relative', overflow: 'hidden',
        }} className="sec-hero-card">
          <div style={{ position: 'absolute', right: -8, bottom: -20, fontFamily: 'var(--font-display)', fontSize: 96, fontWeight: 600, color: 'rgba(29,158,117,0.05)', pointerEvents: 'none' }}>SEC</div>
          <div style={{ fontSize: 9, letterSpacing: '.35em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 10 }}>Total Securities Value</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 400, color: 'var(--cream)', lineHeight: 1, marginBottom: 6 }}>
            <span style={{ fontSize: 18, color: 'var(--gold2)', marginRight: 6 }}>CHF</span>
            {totalValue.toLocaleString()}
          </div>
          <div style={{ fontSize: 11, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <TrendingUp size={12} /> +3.8% — 12-month return · 30.7% of total portfolio
          </div>
        </div>

        <KpiCard label="YTD Return" value="+3.2%" sub="Equities +4.1% · Bonds +0.6%" positive />
        <KpiCard label="Unrealised P&L" value="+CHF 103K" sub="Net across all positions" positive />
      </div>

      {/* ── Allocation bar ──────────────────── */}
      <div style={{
        background: 'var(--navy)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '18px 24px', marginBottom: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
          <div style={{ fontSize: 9, letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--mist)' }}>
            Asset Allocation
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            <LegendDot color="#1D9E75" label={`Equities ${equityPct}%`} />
            <LegendDot color="#378ADD" label={`Bonds ${bondPct}%`} />
          </div>
        </div>
        {/* Split bar */}
        <div style={{ height: 8, borderRadius: 4, overflow: 'hidden', display: 'flex', gap: 2 }}>
          <div style={{ width: `${equityPct}%`, background: '#1D9E75', borderRadius: '4px 0 0 4px' }} />
          <div style={{ flex: 1, background: '#378ADD', borderRadius: '0 4px 4px 0' }} />
        </div>
        {/* Sub labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
          <div style={{ fontSize: 10, color: 'var(--mist)' }}>
            <span style={{ color: 'var(--cream)', fontFamily: 'var(--font-mono)' }}>CHF {equityValue.toLocaleString()}</span> · 15 positions
          </div>
          <div style={{ fontSize: 10, color: 'var(--mist)', textAlign: 'right' }}>
            <span style={{ color: 'var(--cream)', fontFamily: 'var(--font-mono)' }}>CHF {bondValue.toLocaleString()}</span> · 9 positions
          </div>
        </div>
      </div>

      {/* ── Tab selector ────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
        <div style={{
          display: 'flex', gap: 4,
          background: 'var(--surf)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: 4,
        }}>
          {(['equities', 'bonds'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '6px 20px', borderRadius: 8, fontSize: 11, fontWeight: 500,
              cursor: 'pointer', border: 'none', letterSpacing: '.04em',
              background: tab === t ? (t === 'equities' ? '#1D9E75' : '#378ADD') : 'transparent',
              color: tab === t ? '#fff' : 'var(--mist)',
            }}>
              {t === 'equities' ? `Equities (15)` : `Fixed Income (9)`}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: 'var(--mist)' }}>
          <SlidersHorizontal size={12} /> Sorted by value
        </div>
      </div>

      {/* ── Equities table ──────────────────── */}
      {tab === 'equities' && (
        <div style={{ background: 'var(--navy)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 20 }}>
          {/* Table header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 100px 110px 80px 90px 90px',
            padding: '10px 22px', borderBottom: '1px solid var(--border)',
            fontSize: 8, letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--mist)',
          }} className="eq-table-header">
            <span>Name / Ticker</span>
            <span style={{ textAlign: 'right' }}>Shares</span>
            <span style={{ textAlign: 'right' }}>Value (CHF)</span>
            <span style={{ textAlign: 'right' }}>Weight</span>
            <span style={{ textAlign: 'right' }}>YTD</span>
            <span style={{ textAlign: 'right' }}>P&amp;L</span>
          </div>
          {mockEquities.map((eq, i) => (
            <div key={eq.ticker} style={{
              display: 'grid', gridTemplateColumns: '1fr 100px 110px 80px 90px 90px',
              padding: '13px 22px', alignItems: 'center',
              borderBottom: i < mockEquities.length - 1 ? '1px solid rgba(196,164,74,0.05)' : 'none',
              cursor: 'pointer',
            }} className="eq-table-row">
              {/* Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                  background: `${SECTORS[eq.sector] ?? '#8A9AB0'}18`,
                  color: SECTORS[eq.sector] ?? '#8A9AB0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, fontWeight: 700, letterSpacing: '.04em',
                }}>
                  {eq.ticker.slice(0, 3)}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: 'var(--cream)', fontWeight: 500 }}>{eq.name}</div>
                  <div style={{ fontSize: 9, color: 'var(--mist)', marginTop: 1 }}>
                    {eq.exchange} · {eq.sector}
                  </div>
                </div>
              </div>
              {/* Shares */}
              <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--mist)', fontFamily: 'var(--font-mono)' }}>
                {eq.shares.toLocaleString()}
              </div>
              {/* Value */}
              <div style={{ textAlign: 'right', fontSize: 12, color: 'var(--cream)', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                {eq.valueCHF.toLocaleString()}
              </div>
              {/* Weight bar */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 10, color: 'var(--mist)', fontFamily: 'var(--font-mono)', marginBottom: 3 }}>
                  {eq.weight.toFixed(1)}%
                </div>
                <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(eq.weight / 8) * 100}%`, background: '#1D9E75', borderRadius: 2 }} />
                </div>
              </div>
              {/* YTD */}
              <div style={{
                textAlign: 'right', fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 500,
                color: eq.returnYTD >= 0 ? 'var(--green)' : 'var(--red)',
                display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 3,
              }}>
                {eq.returnYTD >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {eq.returnYTD > 0 ? '+' : ''}{eq.returnYTD.toFixed(1)}%
              </div>
              {/* P&L */}
              <div style={{
                textAlign: 'right', fontSize: 11, fontFamily: 'var(--font-mono)',
                color: eq.pnlCHF >= 0 ? 'var(--green)' : 'var(--red)',
              }}>
                {eq.pnlCHF >= 0 ? '+' : '−'}{Math.abs(eq.pnlCHF).toLocaleString()}
              </div>
            </div>
          ))}
          {/* Footer totals */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 100px 110px 80px 90px 90px',
            padding: '12px 22px', borderTop: '1px solid var(--border)',
            background: 'rgba(29,158,117,0.04)',
          }} className="eq-table-header">
            <div style={{ fontSize: 10, color: 'var(--cream)', fontWeight: 500 }}>Equities Total</div>
            <div />
            <div style={{ textAlign: 'right', fontSize: 12, color: 'var(--cream)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
              {equityValue.toLocaleString()}
            </div>
            <div style={{ textAlign: 'right', fontSize: 10, color: 'var(--mist)', fontFamily: 'var(--font-mono)' }}>{equityPct}%</div>
            <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--green)', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>+4.1%</div>
            <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--green)', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>+197,340</div>
          </div>
        </div>
      )}

      {/* ── Bonds table ─────────────────────── */}
      {tab === 'bonds' && (
        <div style={{ background: 'var(--navy)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 20 }}>
          {/* Table header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 70px 80px 80px 90px 90px',
            padding: '10px 22px', borderBottom: '1px solid var(--border)',
            fontSize: 8, letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--mist)',
          }} className="bond-table-header">
            <span>Name / ISIN</span>
            <span style={{ textAlign: 'right' }}>Coupon</span>
            <span style={{ textAlign: 'right' }}>Maturity</span>
            <span style={{ textAlign: 'right' }}>YTM</span>
            <span style={{ textAlign: 'right' }}>Value (CHF)</span>
            <span style={{ textAlign: 'right' }}>Accrued</span>
          </div>
          {mockBonds.map((bond, i) => (
            <div key={bond.isin} style={{
              display: 'grid', gridTemplateColumns: '1fr 70px 80px 80px 90px 90px',
              padding: '13px 22px', alignItems: 'center',
              borderBottom: i < mockBonds.length - 1 ? '1px solid rgba(196,164,74,0.05)' : 'none',
              cursor: 'pointer',
            }} className="bond-table-row">
              {/* Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                  background: 'rgba(55,138,221,0.1)', color: '#6aaee8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 8, fontWeight: 700,
                }}>
                  BOND
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: 'var(--cream)', fontWeight: 500 }}>{bond.name}</div>
                  <div style={{ fontSize: 9, color: 'var(--mist)', fontFamily: 'var(--font-mono)', marginTop: 1 }}>
                    {bond.isin} · {bond.ratingMoody}
                  </div>
                </div>
              </div>
              {/* Coupon */}
              <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--gold2)', fontFamily: 'var(--font-mono)' }}>
                {bond.coupon.toFixed(2)}%
              </div>
              {/* Maturity */}
              <div style={{ textAlign: 'right', fontSize: 10, color: 'var(--mist)' }}>
                {bond.maturity}
              </div>
              {/* YTM */}
              <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--cream)', fontFamily: 'var(--font-mono)' }}>
                {bond.ytm.toFixed(2)}%
              </div>
              {/* Value */}
              <div style={{ textAlign: 'right', fontSize: 12, color: 'var(--cream)', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                {bond.valueCHF.toLocaleString()}
              </div>
              {/* Accrued */}
              <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>
                +{bond.accrued.toLocaleString()}
              </div>
            </div>
          ))}
          {/* Footer */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 70px 80px 80px 90px 90px',
            padding: '12px 22px', borderTop: '1px solid var(--border)',
            background: 'rgba(55,138,221,0.04)',
          }} className="bond-table-header">
            <div style={{ fontSize: 10, color: 'var(--cream)', fontWeight: 500 }}>Fixed Income Total</div>
            <div />
            <div />
            <div style={{ textAlign: 'right', fontSize: 10, color: 'var(--mist)', fontFamily: 'var(--font-mono)' }}>Avg 2.62%</div>
            <div style={{ textAlign: 'right', fontSize: 12, color: 'var(--cream)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
              {bondValue.toLocaleString()}
            </div>
            <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--green)', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
              +{mockBonds.reduce((s, b) => s + b.accrued, 0).toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {/* ── Sector breakdown ────────────────── */}
      {tab === 'equities' && (
        <div style={{ background: 'var(--navy)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '18px 22px', marginBottom: 20 }}>
          <div style={{ fontSize: 9, letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 16 }}>
            Sector Breakdown
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Object.entries(
              mockEquities.reduce<Record<string, number>>((acc, eq) => {
                acc[eq.sector] = (acc[eq.sector] ?? 0) + eq.valueCHF
                return acc
              }, {})
            ).sort((a, b) => b[1] - a[1]).map(([sector, value]) => {
              const pct = ((value / equityValue) * 100)
              return (
                <div key={sector} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: SECTORS[sector] ?? '#8A9AB0', flexShrink: 0 }} />
                  <div style={{ fontSize: 11, color: 'var(--mist)', width: 140, flexShrink: 0 }}>{sector}</div>
                  <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: SECTORS[sector] ?? '#8A9AB0', borderRadius: 3 }} />
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--cream)', fontFamily: 'var(--font-mono)', width: 36, textAlign: 'right' }}>
                    {pct.toFixed(1)}%
                  </div>
                  <div className="sec-sector-val" style={{ fontSize: 10, color: 'var(--mist)', fontFamily: 'var(--font-mono)', width: 80, textAlign: 'right' }}>
                    {(value / 1000).toFixed(0)}K
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Recent activity ─────────────────── */}
      <div style={{ background: 'var(--navy)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Clock size={14} style={{ color: 'var(--gold)' }} />
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--cream)' }}>Recent Activity</span>
        </div>
        {mockSecuritiesActivity.map((item, i) => {
          const positive = item.amount > 0
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '13px 22px',
              borderBottom: i < mockSecuritiesActivity.length - 1 ? '1px solid rgba(196,164,74,0.06)' : 'none',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                background: positive ? 'rgba(29,158,117,0.12)' : 'rgba(192,57,43,0.1)',
                color: positive ? 'var(--green)' : 'var(--red)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {positive ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, color: 'var(--cream)', fontWeight: 500 }}>{item.name}</div>
                <div style={{ fontSize: 10, color: 'var(--mist)', marginTop: 2 }}>{item.detail}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{
                  fontSize: 12, fontFamily: 'var(--font-mono)', fontWeight: 500,
                  color: positive ? 'var(--green)' : 'var(--red)',
                }}>
                  {positive ? '+' : '−'}{item.currency} {Math.abs(item.amount).toLocaleString()}
                </div>
                <div style={{ fontSize: 9, color: 'var(--mist)', marginTop: 2 }}>{item.date}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 1100px) {
          .sec-kpi-grid { grid-template-columns: 1fr 1fr !important; }
          .sec-hero-card { grid-column: 1 / -1 !important; }
          .eq-table-header, .eq-table-row { grid-template-columns: 1fr 110px 80px 90px !important; }
          .eq-table-header span:nth-child(2),
          .eq-table-row > div:nth-child(2) { display: none !important; }
          .eq-table-header span:last-child,
          .eq-table-row > div:last-child { display: none !important; }
          .bond-table-header, .bond-table-row { grid-template-columns: 1fr 70px 80px 80px !important; }
          .bond-table-header span:last-child,
          .bond-table-row > div:last-child { display: none !important; }
        }
        @media (max-width: 768px) {
          .sec-kpi-grid { grid-template-columns: 1fr !important; }
          .eq-table-header, .eq-table-row { grid-template-columns: 1fr 90px 70px !important; }
          .eq-table-header span:nth-child(4),
          .eq-table-row > div:nth-child(4) { display: none !important; }
          .bond-table-header, .bond-table-row { grid-template-columns: 1fr 70px 80px !important; }
          .bond-table-header span:nth-child(4),
          .bond-table-row > div:nth-child(4) { display: none !important; }
          .sec-sector-val { display: none !important; }
        }
      `}</style>
    </div>
  )
}

/* ── Sub-components ───────────────────────────────────────── */

function KpiCard({ label, value, sub, positive }: { label: string; value: string; sub: string; positive: boolean }) {
  return (
    <div style={{
      background: 'var(--surf)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: '18px 20px',
    }}>
      <div style={{ fontSize: 9, letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, color: positive ? 'var(--green)' : 'var(--red)', lineHeight: 1, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 9, color: 'var(--mist)' }}>{sub}</div>
    </div>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: 'var(--mist)' }}>
      <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
      {label}
    </div>
  )
}
