'use client'

import { useState } from 'react'
import {
  TrendingUp, TrendingDown, Download, ShieldCheck,
  Clock, ArrowUpRight, ArrowDownLeft, Cpu, Lock,
  AlertTriangle,
} from 'lucide-react'
import { mockDigitalAssets, mockDigitalActivity } from '@/lib/mock-data'

export default function DigitalPage() {
  const [selected, setSelected] = useState(mockDigitalAssets[0].id)
  const asset = mockDigitalAssets.find(a => a.id === selected)!

  const totalValue   = mockDigitalAssets.reduce((s, a) => s + a.valueCHF, 0)
  const totalCost    = mockDigitalAssets.reduce((s, a) => s + a.costBasisCHF, 0)
  const totalPnl     = mockDigitalAssets.reduce((s, a) => s + a.unrealisedPnl, 0)
  const totalPnlPct  = ((totalPnl / totalCost) * 100).toFixed(2)
  const pnlPositive  = totalPnl >= 0

  return (
    <div>
      {/* ── Header ─────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 12, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, color: 'var(--cream)' }}>
            Digital Assets
          </div>
          <div style={{ fontSize: 10, color: 'var(--mist)', marginTop: 4, letterSpacing: '.05em' }}>
            ZPF-7741-0038 · BTC · ETH · Institutional cold storage · Air-gapped custody
          </div>
        </div>
        <button style={{
          fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--gold)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
          border: '1px solid var(--border2)', padding: '7px 14px', borderRadius: 20, background: 'transparent',
        }}>
          <Download size={12} /> Custody Statement
        </button>
      </div>

      {/* ── Risk notice ─────────────────────── */}
      <div style={{
        display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 16px',
        background: 'rgba(247,147,26,0.05)', border: '1px solid rgba(247,147,26,0.18)',
        borderRadius: 'var(--radius-lg)', marginBottom: 20,
      }}>
        <AlertTriangle size={14} style={{ color: '#F7931A', flexShrink: 0, marginTop: 1 }} />
        <div style={{ fontSize: 10, color: 'rgba(244,239,230,0.55)', lineHeight: 1.6 }}>
          Digital assets are highly volatile and unregulated. Your allocation represents{' '}
          <span style={{ color: 'var(--cream)' }}>6.3% of total portfolio</span> — within your agreed risk mandate.
          All holdings are held in institutional cold storage under ZPF custody and are not lent or rehypothecated.
        </div>
      </div>

      {/* ── KPIs ────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }} className="dig-kpi-grid">
        <div style={{
          gridColumn: '1 / 3',
          background: 'linear-gradient(135deg,#0e2040 0%,#161030 100%)',
          border: '1px solid var(--border2)', borderRadius: 'var(--radius-lg)',
          padding: '22px 28px', position: 'relative', overflow: 'hidden',
        }} className="dig-hero-card">
          <div style={{
            position: 'absolute', right: -10, bottom: -20,
            fontFamily: 'var(--font-display)', fontSize: 96, fontWeight: 600,
            color: 'rgba(98,126,234,0.05)', pointerEvents: 'none',
          }}>₿</div>
          <div style={{ fontSize: 9, letterSpacing: '.35em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 10 }}>
            Total Digital Assets Value
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 400, color: 'var(--cream)', lineHeight: 1, marginBottom: 6 }}>
            <span style={{ fontSize: 18, color: 'var(--gold2)', marginRight: 6 }}>CHF</span>
            {totalValue.toLocaleString()}
          </div>
          <div style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4, color: pnlPositive ? 'var(--green)' : 'var(--red)' }}>
            {pnlPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {pnlPositive ? '+' : ''}CHF {totalPnl.toLocaleString()} ({pnlPositive ? '+' : ''}{totalPnlPct}%) unrealised · 6.3% of portfolio
          </div>
        </div>

        <KpiCard label="Unrealised P&L" value={`${pnlPositive ? '+' : ''}CHF ${(Math.abs(totalPnl) / 1000).toFixed(1)}K`} sub={`${pnlPositive ? '+' : ''}${totalPnlPct}% vs cost basis`} positive={pnlPositive} />
        <KpiCard label="30-Day Return" value="−2.4%" sub="Combined BTC + ETH movement" positive={false} />
      </div>

      {/* ── Asset selector ──────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        {mockDigitalAssets.map(a => (
          <button
            key={a.id}
            onClick={() => setSelected(a.id)}
            style={{
              background: selected === a.id ? a.colorBg : 'var(--navy)',
              border: `1px solid ${selected === a.id ? a.colorBorder : 'var(--border)'}`,
              borderRadius: 'var(--radius-lg)', padding: '18px 22px',
              cursor: 'pointer', textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: a.colorBg, border: `1px solid ${a.colorBorder}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: a.color,
                }}>
                  {a.symbol[0]}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--cream)' }}>{a.name}</div>
                  <div style={{ fontSize: 9, color: 'var(--mist)', marginTop: 1 }}>{a.symbol} · {a.network}</div>
                </div>
              </div>
              <span style={{
                fontSize: 9, padding: '2px 8px', borderRadius: 20,
                background: a.colorBg, color: a.color, fontWeight: 500,
              }}>
                {a.allocation}%
              </span>
            </div>

            {/* Holdings */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
              <div>
                <div style={{ fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 4 }}>Holdings</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 400, color: 'var(--cream)', lineHeight: 1 }}>
                  {a.holdings.toFixed(2)}
                  <span style={{ fontSize: 13, color: 'var(--mist)', marginLeft: 5 }}>{a.unit}</span>
                </div>
                <div style={{ fontSize: 10, color: 'var(--mist)', marginTop: 3 }}>
                  CHF {a.valueCHF.toLocaleString()}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 9, color: 'var(--mist)', marginBottom: 4 }}>Spot</div>
                <div style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--cream)', fontWeight: 500 }}>
                  CHF {a.spotPriceCHF.toLocaleString('de-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div style={{
                  fontSize: 10, marginTop: 3, display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'flex-end',
                  color: a.dailyChange >= 0 ? 'var(--green)' : 'var(--red)',
                }}>
                  {a.dailyChange >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {a.dailyChange >= 0 ? '+' : ''}{a.dailyChange.toFixed(2)}% today
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* ── Detail panel ────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }} className="dig-detail-grid">

        {/* Price chart */}
        <div style={{ background: 'var(--navy)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--cream)' }}>
              {asset.name} — Spot Price (CHF)
            </div>
            <div style={{
              fontSize: 10, display: 'flex', alignItems: 'center', gap: 4,
              color: asset.dailyChange >= 0 ? 'var(--green)' : 'var(--red)',
            }}>
              {asset.dailyChange >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {asset.dailyChange >= 0 ? '+' : ''}{asset.dailyChange.toFixed(2)}% today
            </div>
          </div>
          <div style={{ padding: '20px 22px 0' }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 400, color: 'var(--cream)', lineHeight: 1 }}>
                <span style={{ fontSize: 14, color: 'var(--gold2)', marginRight: 6 }}>CHF</span>
                {asset.spotPriceCHF.toLocaleString('de-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: 10, color: 'var(--mist)', marginTop: 4 }}>per {asset.unit} · As of 01 Apr 2026</div>
            </div>
            <SparkChart values={asset.priceHistory} labels={asset.priceLabels} color={asset.color} />
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
            padding: '14px 22px', borderTop: '1px solid var(--border)',
          }}>
            <PriceStat label="Cost Basis" value={`CHF ${(asset.costBasisCHF / asset.holdings).toLocaleString('de-CH', { maximumFractionDigits: 0 })}/${asset.unit}`} />
            <PriceStat label="Unrealised P&L" value={`${asset.unrealisedPnl >= 0 ? '+' : ''}CHF ${asset.unrealisedPnl.toLocaleString()}`} positive={asset.unrealisedPnl >= 0} divider />
            <PriceStat label="1Y Return" value={`${asset.return1Y >= 0 ? '+' : ''}${asset.return1Y.toFixed(1)}%`} positive={asset.return1Y >= 0} divider />
          </div>
        </div>

        {/* Custody + acquisitions */}
        <div style={{ background: 'var(--navy)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--cream)' }}>Custody Details</div>
          </div>
          <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { icon: <Cpu size={12} />,       label: 'Wallet type',   value: asset.walletType },
              { icon: <ShieldCheck size={12} />, label: 'Custody',     value: asset.custody },
              { icon: <Lock size={12} />,       label: 'Reference',    value: asset.custodyRef },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', gap: 10 }}>
                <div style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 1 }}>{row.icon}</div>
                <div>
                  <div style={{ fontSize: 9, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 2 }}>{row.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--cream)' }}>{row.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Security note */}
          <div style={{ padding: '12px 22px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 10 }}>
            <ShieldCheck size={13} style={{ color: '#4ecda4', flexShrink: 0, marginTop: 1 }} />
            <div style={{ fontSize: 10, color: 'var(--mist)', lineHeight: 1.6 }}>
              Assets held in air-gapped cold storage. Private keys are never exposed to networked systems.
              No lending, staking, or rehypothecation without explicit client instruction.
            </div>
          </div>

          {/* Acquisition history */}
          <div style={{ padding: '14px 22px 0' }}>
            <div style={{ fontSize: 9, letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 12 }}>
              Acquisition History
            </div>
            {asset.acquisitions.map((acq, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                paddingBottom: 12, marginBottom: i < asset.acquisitions.length - 1 ? 12 : 0,
                borderBottom: i < asset.acquisitions.length - 1 ? '1px solid rgba(196,164,74,0.06)' : 'none',
              }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--cream)', fontWeight: 500 }}>
                    {acq.qty.toFixed(asset.id === 'btc' ? 2 : 1)} {asset.unit}
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--mist)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>{acq.ref}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--cream)' }}>
                    CHF {acq.priceCHF.toLocaleString()}/{asset.unit}
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--mist)', marginTop: 2 }}>{acq.date}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: '0 22px 16px' }} />
        </div>
      </div>

      {/* ── Transaction history ─────────────── */}
      <div style={{ background: 'var(--navy)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Clock size={14} style={{ color: 'var(--gold)' }} />
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--cream)' }}>Transaction History</span>
        </div>
        {mockDigitalActivity.map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: '14px 22px',
            borderBottom: i < mockDigitalActivity.length - 1 ? '1px solid rgba(196,164,74,0.06)' : 'none',
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: 8, flexShrink: 0,
              background: item.direction === 'up' ? 'rgba(29,158,117,0.12)' : 'rgba(192,57,43,0.1)',
              color: item.direction === 'up' ? 'var(--green)' : 'var(--red)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {item.direction === 'up' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, color: 'var(--cream)', fontWeight: 500 }}>{item.name}</div>
              <div style={{ fontSize: 10, color: 'var(--mist)', marginTop: 2 }}>{item.detail}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{
                fontSize: 12, fontFamily: 'var(--font-mono)', fontWeight: 500,
                color: item.direction === 'up' ? 'var(--green)' : 'var(--red)',
              }}>
                {item.amount === 0 ? `+${item.currency}` : `${item.direction === 'up' ? '+' : '−'}CHF ${Math.abs(item.amount).toLocaleString()}`}
              </div>
              <div style={{ fontSize: 9, color: 'var(--mist)', marginTop: 2 }}>{item.date}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 1024px) {
          .dig-kpi-grid    { grid-template-columns: 1fr 1fr !important; }
          .dig-hero-card   { grid-column: 1 / -1 !important; }
          .dig-detail-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .dig-kpi-grid { grid-template-columns: 1fr !important; }
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

function PriceStat({ label, value, positive, divider }: { label: string; value: string; positive?: boolean; divider?: boolean }) {
  return (
    <div style={{ paddingLeft: divider ? 16 : 0, borderLeft: divider ? '1px solid var(--border)' : 'none' }}>
      <div style={{ fontSize: 8, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 500, color: positive === true ? 'var(--green)' : positive === false ? 'var(--red)' : 'var(--cream)' }}>{value}</div>
    </div>
  )
}

function SparkChart({ values, labels, color }: { values: number[]; labels: string[]; color: string }) {
  const W = 560, H = 120, PAD = 8
  const chartH = H - PAD * 2
  const min = Math.min(...values) * 0.996
  const max = Math.max(...values) * 1.004
  const range = max - min
  const n = values.length

  const toX = (i: number) => (i / (n - 1)) * W
  const toY = (v: number) => PAD + chartH - ((v - min) / range) * chartH

  const pts  = values.map((v, i) => `${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(' ')
  const fill = values.map((v, i) => `${i === 0 ? 'M' : 'L'} ${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(' ')
  const fillPath = `${fill} L ${W},${H} L 0,${H} Z`
  const id = `dg-${color.replace('#', '')}`

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height: 100, display: 'block' }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={fillPath} fill={`url(#${id})`} />
        <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={toX(n - 1)} cy={toY(values[n - 1])} r="3.5" fill={color} stroke="#08162A" strokeWidth="2" />
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 16 }}>
        {labels.filter((_, i) => i % 2 === 0).map(l => (
          <span key={l} style={{ fontSize: 8, color: 'var(--mist)' }}>{l}</span>
        ))}
      </div>
    </div>
  )
}
