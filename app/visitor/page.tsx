'use client'

import { useMemo, Fragment } from 'react'
import {
  TrendingUp, TrendingDown, Minus, ShieldCheck, Eye, Lock,
  Landmark, BarChart2, Hexagon, Cpu, Building2, Archive,
  Calendar, Info, Activity, Award,
} from 'lucide-react'
import {
  mockUser, mockPortfolio, mockAssets,
  mockPerformanceCharts, mockAssetReturns, mockMonthlyReturns, mockRiskMetrics,
} from '@/lib/mock-data'

const assetIcons: Record<string, React.ReactNode> = {
  monetary:      <Landmark size={13} />,
  securities:    <BarChart2 size={13} />,
  metals:        <Hexagon size={13} />,
  digital:       <Cpu size={13} />,
  'real-estate': <Building2 size={13} />,
  vault:         <Archive size={13} />,
}

function TrendIcon({ dir }: { dir: 'up' | 'down' | 'neutral' }) {
  if (dir === 'up')   return <TrendingUp   size={12} style={{ color: 'var(--green)' }} />
  if (dir === 'down') return <TrendingDown size={12} style={{ color: 'var(--red)' }} />
  return <Minus size={12} style={{ color: 'var(--mist)' }} />
}

/* ── Inline section header ── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16,
    }}>
      <span style={{ display: 'inline-block', width: 20, height: 1, background: 'var(--border2)' }} />
      <span style={{ fontSize: 9, letterSpacing: '.35em', textTransform: 'uppercase', color: 'var(--mist)' }}>
        {children}
      </span>
    </div>
  )
}

export default function VisitorDashboard() {
  const chart = mockPerformanceCharts['1Y']
  const visibleAssets = mockAssets.filter(a => a.id !== 'vault')

  /* ── SVG chart coordinates ── */
  const coords = useMemo(() => {
    const W = 600, H = 140, PAD = 8
    const all = [...chart.portfolio, ...chart.benchmark]
    const minV = Math.min(...all) * 0.999
    const maxV = Math.max(...all) * 1.001
    const range = maxV - minV
    const n = chart.portfolio.length
    const toX = (i: number) => (i / (n - 1)) * W
    const toY = (v: number) => PAD + (H - 2 * PAD) - ((v - minV) / range) * (H - 2 * PAD)
    const pPts = chart.portfolio.map((v, i) => `${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(' ')
    const bPts = chart.benchmark.map((v, i) => `${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(' ')
    const fillPath = chart.portfolio
      .map((v, i) => `${i === 0 ? 'M' : 'L'} ${toX(i).toFixed(1)},${toY(v).toFixed(1)}`)
      .join(' ') + ` L ${W},${H - PAD} L 0,${H - PAD} Z`
    const gridLevels = [0.25, 0.5, 0.75].map(t => ({
      y: (PAD + (H - 2 * PAD) - t * (H - 2 * PAD)).toFixed(1),
    }))
    return { pPts, bPts, fillPath, gridLevels, W, H, labels: chart.labels }
  }, [chart])

  /* ── Monthly returns bar scale ── */
  const monthMax = Math.max(...mockMonthlyReturns.map(m => Math.abs(m.value)))

  return (
    <div>

      {/* ── Header ──────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{
            fontSize: 9, letterSpacing: '.4em', textTransform: 'uppercase',
            color: 'var(--gold)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ display: 'inline-block', width: 24, height: 1, background: 'var(--gold)' }} />
            Portfolio View
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 300, color: 'var(--cream)', lineHeight: 1.1 }}>
            Shared Portfolio Snapshot
          </div>
          <div style={{ fontSize: 11, color: 'var(--mist)', marginTop: 6 }}>
            Authorised read-only access · Figures as of latest valuation
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {/* Account owner */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px 8px 8px',
            background: 'var(--surf)', border: '1px solid var(--border2)',
            borderRadius: 20,
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
              background: 'rgba(196,164,74,0.15)', border: '1px solid rgba(196,164,74,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--gold2)',
              overflow: 'hidden',
            }}>
              {mockUser.initials}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--cream)', lineHeight: 1.2 }}>{mockUser.fullName}</div>
              <div style={{ fontSize: 9, color: 'var(--mist)', fontFamily: 'var(--font-mono)' }}>{mockUser.id}</div>
            </div>
          </div>
          {/* Auth badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px',
            background: 'rgba(29,158,117,0.08)', border: '1px solid rgba(29,158,117,0.2)',
            borderRadius: 20, fontSize: 10, color: '#4ecda4', whiteSpace: 'nowrap',
          }}>
            <ShieldCheck size={12} /> Authorised Access
          </div>
        </div>
      </div>

      {/* ── Portfolio hero row ───────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 14, marginBottom: 28 }} className="visitor-hero-grid">
        {/* Total value */}
        <div style={{
          background: 'linear-gradient(135deg, #0e2040 0%, #162d56 100%)',
          border: '1px solid var(--border2)', borderRadius: 'var(--radius-lg)',
          padding: '28px 32px', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', right: -8, bottom: -20,
            fontFamily: 'var(--font-display)', fontSize: 110, fontWeight: 600,
            color: 'rgba(196,164,74,0.05)', pointerEvents: 'none', letterSpacing: 4,
          }}>ZPF</div>
          <div style={{ fontSize: 9, letterSpacing: '.35em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 12 }}>
            Total Portfolio Value
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 46, fontWeight: 400, color: 'var(--cream)', lineHeight: 1, marginBottom: 10 }}>
            <span style={{ fontSize: 20, color: 'var(--gold2)', marginRight: 8 }}>CHF</span>
            {mockPortfolio.totalValue.toLocaleString()}
          </div>
          <div style={{ fontSize: 12, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 5, marginBottom: 16 }}>
            <TrendingUp size={13} />
            +{mockPortfolio.change.percent}% · {mockPortfolio.change.label}
          </div>
          <div style={{ paddingTop: 16, borderTop: '1px solid var(--border)', fontSize: 10, color: 'var(--mist)' }}>
            {mockPortfolio.subline}
          </div>
        </div>

        {/* Unrealised gain */}
        <div style={{
          background: 'var(--surf)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
          padding: '22px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div style={{ fontSize: 9, letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 12 }}>
            Unrealised Gain
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 400, color: '#4ecda4', marginBottom: 4 }}>
              +{mockPortfolio.unrealisedGain.percent}%
            </div>
            <div style={{ fontSize: 12, color: 'var(--mist)' }}>
              CHF {mockPortfolio.unrealisedGain.amount.toLocaleString()}
            </div>
          </div>
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)', fontSize: 10, color: 'var(--mist)' }}>
            Since inception · March 2022
          </div>
        </div>

        {/* Next review */}
        <div style={{
          background: 'var(--surf)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
          padding: '22px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div style={{ fontSize: 9, letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 12 }}>
            Next Portfolio Review
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Calendar size={14} style={{ color: 'var(--gold)', flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, color: 'var(--cream)' }}>
                {mockPortfolio.nextReview.date}
              </span>
            </div>
            <div style={{ fontSize: 10, color: 'var(--mist)' }}>{mockPortfolio.nextReview.label}</div>
          </div>
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 9, color: 'var(--mist)', marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
              <span>Review progress</span>
              <span>{mockPortfolio.nextReview.progress}%</span>
            </div>
            <div style={{ height: 3, background: 'rgba(196,164,74,0.12)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ width: `${mockPortfolio.nextReview.progress}%`, height: '100%', background: 'var(--gold)', borderRadius: 2 }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Performance chart + risk metrics ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 14, marginBottom: 28, alignItems: 'start' }} className="visitor-perf-grid">
      <div style={{
        background: 'var(--surf)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
        padding: '24px 28px',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <SectionLabel>1-Year Performance</SectionLabel>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 400, color: 'var(--cream)' }}>
              Portfolio vs Benchmark
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
              <span style={{ width: 20, height: 2, background: 'var(--gold)', display: 'inline-block', borderRadius: 1 }} />
              <span style={{ color: 'var(--mist)' }}>Portfolio</span>
              <span style={{ color: '#4ecda4', fontWeight: 500 }}>+{chart.portfolioReturn}%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
              <span style={{ width: 20, height: 2, background: 'rgba(138,154,176,0.5)', display: 'inline-block', borderRadius: 1 }} />
              <span style={{ color: 'var(--mist)' }}>Benchmark</span>
              <span style={{ color: 'var(--mist)', fontWeight: 500 }}>+{chart.benchmarkReturn}%</span>
            </div>
          </div>
        </div>

        <svg viewBox={`0 0 ${coords.W} ${coords.H}`} style={{ width: '100%', display: 'block', overflow: 'visible' }}>
          <defs>
            <linearGradient id="vfill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(196,164,74,0.18)" />
              <stop offset="100%" stopColor="rgba(196,164,74,0)" />
            </linearGradient>
          </defs>
          {/* Grid lines */}
          {coords.gridLevels.map((g, i) => (
            <line key={i} x1="0" y1={g.y} x2={coords.W} y2={g.y}
              stroke="rgba(196,164,74,0.07)" strokeWidth="1" />
          ))}
          {/* Fill */}
          <path d={coords.fillPath} fill="url(#vfill)" />
          {/* Benchmark line */}
          <polyline points={coords.bPts} fill="none"
            stroke="rgba(138,154,176,0.35)" strokeWidth="1.5" strokeDasharray="4 3" />
          {/* Portfolio line */}
          <polyline points={coords.pPts} fill="none"
            stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {/* End dot */}
          {(() => {
            const pts = coords.pPts.split(' ')
            const last = pts[pts.length - 1].split(',')
            return <circle cx={last[0]} cy={last[1]} r="4" fill="var(--gold)" />
          })()}
        </svg>

        {/* X-axis labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          {coords.labels.filter((_, i) => i % 2 === 0).map((l, i) => (
            <span key={i} style={{ fontSize: 9, color: 'rgba(138,154,176,0.5)', letterSpacing: '.05em' }}>{l}</span>
          ))}
        </div>
      </div>

        {/* Risk metrics */}
        <div style={{
          background: 'var(--surf)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
          padding: '24px 28px',
        }}>
          <SectionLabel>Risk Profile</SectionLabel>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 400, color: 'var(--cream)', marginBottom: 20 }}>
            Key Risk Metrics · 1Y
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              mockRiskMetrics.sharpe,
              mockRiskMetrics.volatility,
              mockRiskMetrics.maxDrawdown,
              mockRiskMetrics.alpha,
            ].map((m, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', padding: '14px 16px',
              }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, color: 'var(--cream)', marginBottom: 4 }}>
                  {m.value}
                </div>
                <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--mist)', marginBottom: 2 }}>{m.label}</div>
                <div style={{ fontSize: 9, color: 'rgba(138,154,176,0.5)' }}>{m.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>{/* end visitor-perf-grid */}

      {/* ── Monthly returns ──── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 28 }} className="visitor-mid-grid">

        {/* Monthly returns bars */}
        <div style={{
          background: 'var(--surf)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
          padding: '24px 28px',
        }}>
          <SectionLabel>Monthly Returns</SectionLabel>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 400, color: 'var(--cream)', marginBottom: 20 }}>
            Last 12 Months
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 80 }}>
            {mockMonthlyReturns.map((m, i) => {
              const pct = m.value / monthMax
              const isPos = m.value >= 0
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, height: '100%', justifyContent: 'center' }}>
                  {isPos && (
                    <div style={{
                      width: '100%', background: 'var(--green)', opacity: 0.75, borderRadius: '2px 2px 0 0',
                      height: `${pct * 48}%`, minHeight: 2,
                    }} />
                  )}
                  <div style={{ width: '100%', height: 1, background: 'rgba(138,154,176,0.2)' }} />
                  {!isPos && (
                    <div style={{
                      width: '100%', background: 'var(--red)', opacity: 0.7, borderRadius: '0 0 2px 2px',
                      height: `${Math.abs(pct) * 48}%`, minHeight: 2,
                    }} />
                  )}
                </div>
              )
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            {mockMonthlyReturns.filter((_, i) => i % 3 === 0).map((m, i) => (
              <span key={i} style={{ fontSize: 8, color: 'rgba(138,154,176,0.45)', letterSpacing: '.04em' }}>{m.month}</span>
            ))}
          </div>
          {/* Legend */}
          <div style={{ display: 'flex', gap: 16, marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
            {[['var(--green)', 'Positive month'], ['var(--red)', 'Negative month']].map(([c, l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 9, color: 'var(--mist)' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: c, display: 'inline-block' }} />
                {l}
              </div>
            ))}
          </div>
        </div>

        {/* Asset class returns */}
        <div style={{
          background: 'var(--surf)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
          padding: '24px 28px',
        }}>
        <SectionLabel>Returns by Asset Class</SectionLabel>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 400, color: 'var(--cream)', marginBottom: 20 }}>
          Performance Breakdown
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr repeat(3, auto)', gap: 0 }}>
          {/* Header */}
          {['Asset Class', '1M', 'YTD', '1Y'].map((h, i) => (
            <div key={h} style={{
              fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--mist)',
              padding: '0 12px 10px', textAlign: i === 0 ? 'left' : 'right',
              borderBottom: '1px solid var(--border)',
            }}>{h}</div>
          ))}
          {/* Rows */}
          {mockAssetReturns.map((a, ri) => (
            <Fragment key={a.id}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 12px', borderBottom: ri < mockAssetReturns.length - 1 ? '1px solid rgba(196,164,74,0.06)' : 'none',
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', background: a.color, flexShrink: 0,
                }} />
                <span style={{ fontSize: 11, color: 'var(--cream)' }}>{a.label}</span>
              </div>
              {[a.return1M, a.returnYTD, a.return1Y].map((v, ci) => (
                <div key={ci} style={{
                  padding: '12px 12px', textAlign: 'right',
                  borderBottom: ri < mockAssetReturns.length - 1 ? '1px solid rgba(196,164,74,0.06)' : 'none',
                  fontSize: 11, fontFamily: 'var(--font-mono)',
                  color: v > 0 ? 'var(--green)' : v < 0 ? 'var(--red)' : 'var(--mist)',
                }}>
                  {v > 0 ? '+' : ''}{v.toFixed(1)}%
                </div>
              ))}
            </Fragment>
          ))}
        </div>
        </div>
      </div>{/* end visitor-mid-grid */}

      {/* ── Allocation breakdown ─────────────── */}
      <div style={{ marginBottom: 28 }}>
        <SectionLabel>Asset Allocation</SectionLabel>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 400, color: 'var(--cream)', marginBottom: 16 }}>
          Portfolio Composition
        </div>
        {/* Stacked bar */}
        <div style={{ height: 8, borderRadius: 4, overflow: 'hidden', display: 'flex', gap: 1, marginBottom: 18 }}>
          {visibleAssets.map(a => (
            <div key={a.id} style={{ flex: a.allocation, background: a.color, opacity: 0.8 }} />
          ))}
        </div>
        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }} className="visitor-assets-grid">
          {visibleAssets.map(a => (
            <div key={a.id} style={{
              background: 'var(--surf)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
              padding: '16px 18px', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                background: `linear-gradient(90deg, ${a.color}, transparent)`,
              }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 6,
                  background: `${a.color}18`, border: `1px solid ${a.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: a.color,
                }}>
                  {assetIcons[a.id]}
                </div>
                <span style={{
                  fontSize: 9, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase',
                  color: a.accentColor, background: `${a.color}14`,
                  border: `1px solid ${a.color}28`, padding: '2px 7px', borderRadius: 20,
                }}>
                  {a.allocation}%
                </span>
              </div>
              <div style={{ fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 3 }}>
                {a.tagLabel}
              </div>
              {a.value > 0 ? (
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 400, color: 'var(--cream)', marginBottom: 4 }}>
                  <span style={{ fontSize: 10, color: 'var(--mist)', marginRight: 3 }}>{a.currency}</span>
                  {a.value.toLocaleString()}
                </div>
              ) : (
                <div style={{ fontSize: 10, color: 'var(--mist)', fontStyle: 'italic', marginBottom: 4 }}>Non-monetary</div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9,
                color: a.change.direction === 'up' ? 'var(--green)' : a.change.direction === 'down' ? 'var(--red)' : 'var(--mist)',
              }}>
                <TrendIcon dir={a.change.direction} />
                {a.change.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Custodian + mandate strip ────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 28 }} className="visitor-strip-grid">
        <div style={{
          background: 'var(--surf)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
          padding: '18px 22px', display: 'flex', alignItems: 'flex-start', gap: 14,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8, flexShrink: 0,
            background: 'rgba(196,164,74,0.1)', border: '1px solid var(--border2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)',
          }}>
            <Landmark size={16} />
          </div>
          <div>
            <div style={{ fontSize: 9, letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 4 }}>Custodian</div>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--cream)', marginBottom: 3 }}>{mockPortfolio.custodian.name}</div>
            <div style={{ fontSize: 10, color: 'var(--mist)' }}>{mockPortfolio.custodian.address}</div>
          </div>
        </div>
        <div style={{
          background: 'var(--surf)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
          padding: '18px 22px', display: 'flex', alignItems: 'flex-start', gap: 14,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8, flexShrink: 0,
            background: 'rgba(196,164,74,0.1)', border: '1px solid var(--border2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)',
          }}>
            <Award size={16} />
          </div>
          <div>
            <div style={{ fontSize: 9, letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 4 }}>Mandate &amp; Risk</div>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--cream)', marginBottom: 3 }}>{mockPortfolio.riskProfile.label}</div>
            <div style={{ fontSize: 10, color: 'var(--mist)' }}>{mockPortfolio.riskProfile.sub}</div>
          </div>
        </div>
      </div>

      {/* ── Restricted notice ────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 18px',
        background: 'rgba(196,164,74,0.03)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
      }}>
        <Lock size={13} style={{ color: 'var(--gold3)', flexShrink: 0, marginTop: 1 }} />
        <div style={{ fontSize: 10, color: 'rgba(138,154,176,0.7)', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--mist)', fontWeight: 500 }}>Visitor access is limited.</strong>{' '}
          Transaction history, secure messages, document vault, beneficiary details, and account settings are not accessible.
          To arrange broader access, contact the account holder or ZPF directly.
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .visitor-hero-grid { grid-template-columns: 1fr 1fr !important; }
          .visitor-hero-grid > div:first-child { grid-column: 1 / -1; }
          .visitor-perf-grid { grid-template-columns: 1fr !important; }
          .visitor-assets-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .visitor-hero-grid { grid-template-columns: 1fr !important; }
          .visitor-perf-grid { grid-template-columns: 1fr !important; }
          .visitor-mid-grid { grid-template-columns: 1fr !important; }
          .visitor-assets-grid { grid-template-columns: 1fr !important; }
          .visitor-strip-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

