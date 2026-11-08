'use client'

import { useState } from 'react'
import {
  TrendingUp, TrendingDown, Download, MapPin,
  ShieldCheck, Clock, ArrowUpRight, ArrowDownLeft,
} from 'lucide-react'
import { mockMetalsDetail, mockMetalsActivity } from '@/lib/mock-data'

export default function MetalsPage() {
  const [selected, setSelected] = useState(mockMetalsDetail[0].id)
  const metal = mockMetalsDetail.find(m => m.id === selected)!

  const totalValue = mockMetalsDetail.reduce((s, m) => s + m.valueCHF, 0)
  const totalPnl    = mockMetalsDetail.reduce((s, m) => s + m.unrealisedPnl, 0)
  const totalCost   = mockMetalsDetail.reduce((s, m) => s + m.costBasisCHF, 0)
  const totalPnlPct = ((totalPnl / totalCost) * 100).toFixed(2)

  return (
    <div>
      {/* ── Header ─────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 12, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, color: 'var(--cream)' }}>
            Precious Metals
          </div>
          <div style={{ fontSize: 10, color: 'var(--mist)', marginTop: 4, letterSpacing: '.05em' }}>
            ZPF-7741-0038 · Gold · Silver · Platinum · Physical allocated storage
          </div>
        </div>
        <button style={{
          fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--gold)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
          border: '1px solid var(--border2)', padding: '7px 14px', borderRadius: 20, background: 'transparent',
        }}>
          <Download size={12} /> Vault Certificate
        </button>
      </div>

      {/* ── Summary strip ───────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }} className="metals-kpi-grid">
        <div style={{
          gridColumn: '1 / 3',
          background: 'linear-gradient(135deg,#0e2040 0%,#1a2a18 100%)',
          border: '1px solid var(--border2)', borderRadius: 'var(--radius-lg)',
          padding: '22px 28px', position: 'relative', overflow: 'hidden',
        }} className="metals-hero-card">
          <div style={{
            position: 'absolute', right: -10, bottom: -20,
            fontFamily: 'var(--font-display)', fontSize: 96, fontWeight: 600,
            color: 'rgba(196,164,74,0.05)', pointerEvents: 'none',
          }}>XAU</div>
          <div style={{ fontSize: 9, letterSpacing: '.35em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 10 }}>
            Total Metals Value
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 400, color: 'var(--cream)', lineHeight: 1, marginBottom: 6 }}>
            <span style={{ fontSize: 18, color: 'var(--gold2)', marginRight: 6 }}>CHF</span>
            {totalValue.toLocaleString()}
          </div>
          <div style={{ fontSize: 11, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <TrendingUp size={12} /> +{totalPnlPct}% unrealised · 17.0% of total portfolio
          </div>
        </div>
        <KpiCard label="Unrealised P&L" value={`+CHF ${(totalPnl / 1000).toFixed(0)}K`} sub={`+${totalPnlPct}% above cost basis`} positive />
        <KpiCard label="YTD Return (Gold)" value="+6.1%" sub="Spot price appreciation · XAU" positive />
      </div>

      {/* ── Metal tabs ──────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
        {mockMetalsDetail.map(m => (
          <button
            key={m.id}
            onClick={() => setSelected(m.id)}
            style={{
              background: selected === m.id ? m.colorBg : 'var(--navy)',
              border: `1px solid ${selected === m.id ? m.colorBorder : 'var(--border)'}`,
              borderRadius: 'var(--radius-lg)', padding: '18px 20px',
              cursor: 'pointer', textAlign: 'left',
              boxShadow: selected === m.id ? `0 0 0 1px ${m.colorBorder}` : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{
                fontSize: 10, fontWeight: 600, letterSpacing: '.15em', textTransform: 'uppercase',
                color: m.color,
              }}>
                {m.symbol}
              </span>
              <span style={{
                fontSize: 9, padding: '2px 8px', borderRadius: 20,
                background: m.colorBg, color: m.color,
                fontWeight: 500, letterSpacing: '.05em',
              }}>
                {m.allocation}%
              </span>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--cream)', marginBottom: 2 }}>
              {m.troyOz} <span style={{ fontSize: 13, color: 'var(--mist)' }}>troy oz</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--mist)' }}>
              CHF {m.valueCHF.toLocaleString()}
            </div>
            <div style={{
              marginTop: 8, fontSize: 10, display: 'flex', alignItems: 'center', gap: 3,
              color: m.dailyChange >= 0 ? 'var(--green)' : 'var(--red)',
            }}>
              {m.dailyChange >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {m.dailyChange >= 0 ? '+' : ''}{m.dailyChange.toFixed(2)}% today
            </div>
          </button>
        ))}
      </div>

      {/* ── Detail panel ────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }} className="metals-detail-grid">

        {/* Price chart + stats */}
        <div style={{ background: 'var(--navy)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--cream)' }}>
              {metal.name} — Spot Price (CHF)
            </div>
            <div style={{
              fontSize: 10, color: metal.dailyChange >= 0 ? 'var(--green)' : 'var(--red)',
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              {metal.dailyChange >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {metal.dailyChange >= 0 ? '+' : ''}{metal.dailyChange.toFixed(2)}% today
            </div>
          </div>

          <div style={{ padding: '20px 22px 0' }}>
            {/* Price display */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 400, color: 'var(--cream)', lineHeight: 1 }}>
                <span style={{ fontSize: 15, color: 'var(--gold2)', marginRight: 6 }}>CHF</span>
                {metal.spotPriceCHF.toLocaleString('de-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: 10, color: 'var(--mist)', marginTop: 4 }}>per troy oz · As of 01 Apr 2026</div>
            </div>

            {/* SVG spark chart */}
            <SparkChart values={metal.priceHistory} labels={metal.priceLabels} color={metal.color} />
          </div>

          {/* Stats grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
            padding: '16px 22px', borderTop: '1px solid var(--border)', gap: 0,
          }}>
            <PriceStat label="Cost Basis" value={`CHF ${(metal.costBasisCHF / metal.troyOz).toLocaleString('de-CH', { maximumFractionDigits: 0 })}/oz`} />
            <PriceStat label="Unrealised P&L" value={`+CHF ${metal.unrealisedPnl.toLocaleString()}`} positive divider />
            <PriceStat label="Return YTD" value={`+${metal.returnYTD.toFixed(1)}%`} positive divider />
          </div>
        </div>

        {/* Bar inventory */}
        <div style={{ background: 'var(--navy)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--cream)' }}>
              Bar Inventory — {metal.bars.length} {metal.bars.length === 1 ? 'bar' : 'bars'}
            </div>
          </div>
          <div>
            {metal.bars.map((bar, i) => (
              <div key={bar.ref} style={{
                padding: '14px 22px',
                borderBottom: i < metal.bars.length - 1 ? '1px solid rgba(196,164,74,0.06)' : 'none',
                display: 'flex', alignItems: 'center', gap: 14,
              }}>
                {/* Bar icon */}
                <div style={{
                  width: 40, height: 28, borderRadius: 4, flexShrink: 0,
                  background: metal.colorBg, border: `1px solid ${metal.colorBorder}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 8, fontWeight: 700, letterSpacing: '.08em', color: metal.color,
                }}>
                  {metal.symbol}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: 'var(--cream)', fontWeight: 500 }}>
                    {bar.weight} · {bar.form}
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--mist)', marginTop: 2 }}>
                    Fineness {bar.fineness} · Ref: {bar.ref}
                  </div>
                  <div style={{ fontSize: 9, color: 'rgba(138,154,176,0.5)', marginTop: 2, display: 'flex', gap: 10 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <MapPin size={9} /> {bar.vault}
                    </span>
                    <span>Acquired: {bar.acquired}</span>
                  </div>
                </div>
                <div style={{
                  fontSize: 9, padding: '2px 8px', borderRadius: 3,
                  background: 'rgba(29,158,117,0.1)', color: '#4ecda4', flexShrink: 0,
                }}>
                  Verified
                </div>
              </div>
            ))}
          </div>

          {/* Vault info */}
          <div style={{ borderTop: '1px solid var(--border)', padding: '14px 22px', display: 'flex', flexDirection: 'column', gap: 9 }}>
            {[
              { icon: <MapPin size={12} style={{ color: 'var(--gold)', flexShrink: 0 }} />, text: metal.vault },
              { icon: <ShieldCheck size={12} style={{ color: 'var(--gold)', flexShrink: 0 }} />, text: `Insured: ${metal.insured}` },
              { icon: <Clock size={12} style={{ color: 'var(--gold)', flexShrink: 0 }} />, text: `Last audit: ${metal.lastAudit} · Next: ${metal.nextAudit}` },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--mist)' }}>
                {icon} {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Vault locations ─────────────────── */}
      <div style={{
        background: 'var(--navy)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '18px 24px', marginBottom: 20,
      }}>
        <div style={{ fontSize: 9, letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 16 }}>
          Vault Locations
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="vault-loc-grid">
          {[
            {
              name: 'ZPF Vault — Zürich Hauptbahnhof',
              address: 'Bahnhofstrasse 72, 8001 Zürich',
              contents: 'Gold (24oz) · Silver (620 troy oz)',
              security: 'Grade X · 24/7 armed guard · Biometric access',
              value: 'CHF 1,944,750',
            },
            {
              name: 'ZPF Vault — Geneva Free Port',
              address: 'Route de l\'Aéroport 21, 1215 Geneva',
              contents: 'Platinum (80 troy oz)',
              security: 'Grade X · 24/7 armed guard · Biometric access',
              value: 'CHF 240,090',
            },
          ].map(v => (
            <div key={v.name} style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', padding: '14px 18px',
            }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--cream)', marginBottom: 6 }}>{v.name}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {[
                  { icon: <MapPin size={10} />, text: v.address },
                  { icon: <ShieldCheck size={10} />, text: v.security },
                ].map(({ icon, text }) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: 'var(--mist)' }}>
                    <span style={{ color: 'var(--gold)', flexShrink: 0 }}>{icon}</span> {text}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(196,164,74,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 9, color: 'var(--mist)' }}>{v.contents}</span>
                <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--cream)', fontWeight: 500 }}>{v.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Recent activity ─────────────────── */}
      <div style={{ background: 'var(--navy)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Clock size={14} style={{ color: 'var(--gold)' }} />
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--cream)' }}>Transaction History</span>
        </div>
        {mockMetalsActivity.map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: '14px 22px',
            borderBottom: i < mockMetalsActivity.length - 1 ? '1px solid rgba(196,164,74,0.06)' : 'none',
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: 8, flexShrink: 0,
              background: 'rgba(192,57,43,0.1)', color: 'var(--red)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ArrowUpRight size={14} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, color: 'var(--cream)', fontWeight: 500 }}>{item.name}</div>
              <div style={{ fontSize: 10, color: 'var(--mist)', marginTop: 2 }}>{item.detail}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', fontWeight: 500, color: 'var(--red)' }}>
                −CHF {Math.abs(item.amount).toLocaleString()}
              </div>
              <div style={{ fontSize: 9, color: 'var(--mist)', marginTop: 2 }}>{item.date}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 1024px) {
          .metals-kpi-grid { grid-template-columns: 1fr 1fr !important; }
          .metals-hero-card { grid-column: 1 / -1 !important; }
          .metals-detail-grid { grid-template-columns: 1fr !important; }
          .vault-loc-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .metals-kpi-grid { grid-template-columns: 1fr !important; }
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
      <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 500, color: positive ? 'var(--green)' : 'var(--cream)' }}>{value}</div>
    </div>
  )
}

function SparkChart({ values, labels, color }: { values: number[]; labels: string[]; color: string }) {
  const W = 560, H = 120, PAD = 8
  const chartH = H - PAD * 2
  const min = Math.min(...values) * 0.998
  const max = Math.max(...values) * 1.002
  const range = max - min
  const n = values.length

  const toX = (i: number) => (i / (n - 1)) * W
  const toY = (v: number) => PAD + chartH - ((v - min) / range) * chartH

  const pts = values.map((v, i) => `${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(' ')
  const fill = values.map((v, i) => `${i === 0 ? 'M' : 'L'} ${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(' ')
  const fillPath = `${fill} L ${W},${H} L 0,${H} Z`

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height: 100, display: 'block' }}>
        <defs>
          <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.15" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={fillPath} fill={`url(#grad-${color.replace('#', '')})`} />
        <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={toX(n - 1)} cy={toY(values[n - 1])} r="3.5" fill={color} stroke="#08162A" strokeWidth="2" />
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 16 }}>
        {labels.filter((_, i) => i % 2 === 0).map(l => (
          <span key={l} style={{ fontSize: 8, color: 'var(--mist)', letterSpacing: '.05em' }}>{l}</span>
        ))}
      </div>
    </div>
  )
}
