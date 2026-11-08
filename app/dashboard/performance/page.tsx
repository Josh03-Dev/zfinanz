'use client'

import { useState, useMemo } from 'react'
import {
  TrendingUp, TrendingDown, Activity, Download,
  Info, BarChart2, Award, AlertTriangle,
} from 'lucide-react'
import {
  mockPerformanceCharts,
  mockAssetReturns,
  mockMonthlyReturns,
  mockRiskMetrics,
} from '@/lib/mock-data'

const PERIODS = ['1M', '3M', '6M', 'YTD', '1Y', '3Y', 'All'] as const
type Period = typeof PERIODS[number]

const RETURN_VIEWS = ['1M', 'YTD', '1Y'] as const
type ReturnView = typeof RETURN_VIEWS[number]

export default function PerformancePage() {
  const [period, setPeriod] = useState<Period>('1Y')
  const [returnView, setReturnView] = useState<ReturnView>('1Y')

  const chart = mockPerformanceCharts[period]

  /* ── SVG coordinates ───────────────────── */
  const chartCoords = useMemo(() => {
    const W = 600, H = 170, PAD_TOP = 12, PAD_BOT = 8
    const chartH = H - PAD_TOP - PAD_BOT
    const all = [...chart.portfolio, ...chart.benchmark]
    const minV = Math.min(...all) * 0.999
    const maxV = Math.max(...all) * 1.001
    const range = maxV - minV
    const n = chart.portfolio.length

    const toX = (i: number) => n === 1 ? W / 2 : (i / (n - 1)) * W
    const toY = (v: number) => PAD_TOP + chartH - ((v - minV) / range) * chartH

    const pPts = chart.portfolio.map((v, i) => `${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(' ')
    const bPts = chart.benchmark.map((v, i) => `${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(' ')

    const last = chart.portfolio[n - 1]
    const lastX = toX(n - 1)
    const lastY = toY(last).toFixed(1)

    // fill path
    const fillPts = chart.portfolio
      .map((v, i) => `${i === 0 ? 'M' : 'L'} ${toX(i).toFixed(1)},${toY(v).toFixed(1)}`)
      .join(' ')
    const fillPath = `${fillPts} L ${W},${(H - PAD_BOT).toFixed(1)} L 0,${(H - PAD_BOT).toFixed(1)} Z`

    // grid y values (3 levels)
    const gridLevels = [0.25, 0.5, 0.75].map(t => ({
      y: (PAD_TOP + chartH - t * chartH).toFixed(1),
      val: (minV + t * range).toFixed(2),
    }))

    return { pPts, bPts, fillPath, lastX, lastY, gridLevels, W, H }
  }, [chart])

  return (
    <div>
      {/* ── Header ─────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 12, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, color: 'var(--cream)' }}>
            Portfolio Performance
          </div>
          <div style={{ fontSize: 10, color: 'var(--mist)', marginTop: 4, letterSpacing: '.05em' }}>
            ZPF-7741-0038 · Balanced mandate · Benchmarked vs ZPF Balanced 60/40 Index
          </div>
        </div>
        <button style={{
          fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--gold)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
          border: '1px solid var(--border2)', padding: '7px 14px', borderRadius: 20,
          background: 'transparent',
        }}>
          <Download size={12} /> Performance Report
        </button>
      </div>

      {/* ── Period selector ─────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4, marginBottom: 20,
        background: 'var(--surf)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: 4, width: 'fit-content',
      }}>
        {PERIODS.map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            style={{
              padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 500,
              letterSpacing: '.05em', cursor: 'pointer', transition: 'all .15s',
              background: period === p ? 'var(--gold)' : 'transparent',
              color: period === p ? 'var(--navy)' : 'var(--mist)',
              border: 'none',
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* ── KPI cards ───────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }} className="perf-kpi-grid">
        <KpiCard
          label="Portfolio Return"
          value={`${chart.portfolioReturn > 0 ? '+' : ''}${chart.portfolioReturn.toFixed(2)}%`}
          sub={`+CHF ${(chart.absGain / 1000).toFixed(0)}K absolute gain`}
          positive={chart.portfolioReturn > 0}
          icon={<Activity size={14} />}
        />
        <KpiCard
          label="vs Benchmark"
          value={`${(chart.portfolioReturn - chart.benchmarkReturn) > 0 ? '+' : ''}${(chart.portfolioReturn - chart.benchmarkReturn).toFixed(2)}%`}
          sub={`Benchmark: ${chart.benchmarkReturn > 0 ? '+' : ''}${chart.benchmarkReturn.toFixed(2)}%`}
          positive={chart.portfolioReturn >= chart.benchmarkReturn}
          icon={<Award size={14} />}
        />
        <KpiCard
          label="Annualised Return (3Y)"
          value="+7.82%"
          sub="Compound annual growth rate"
          positive
          icon={<TrendingUp size={14} />}
        />
        <KpiCard
          label="Max Drawdown (1Y)"
          value="−3.6%"
          sub="Aug → Nov 2025 trough"
          positive={false}
          neutral
          icon={<AlertTriangle size={14} />}
        />
      </div>

      {/* ── Chart panel ─────────────────────── */}
      <div style={{
        background: 'var(--navy)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '24px 28px', marginBottom: 20,
      }}>
        {/* Chart legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 18 }}>
          <div style={{ fontSize: 9, letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--mist)', flex: 1 }}>
            Portfolio Value — {period} Performance
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: 'var(--gold)' }}>
            <div style={{ width: 20, height: 2, background: 'var(--gold)', borderRadius: 1 }} />
            Your Portfolio
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: 'var(--mist)' }}>
            <div style={{ width: 20, height: 1, background: 'var(--mist)', borderRadius: 1, opacity: 0.5, borderTop: '1px dashed var(--mist)' }} />
            Benchmark
          </div>
        </div>

        {/* SVG Chart */}
        <div style={{ position: 'relative', width: '100%' }}>
          <svg
            viewBox={`0 0 ${chartCoords.W} ${chartCoords.H}`}
            preserveAspectRatio="none"
            style={{ width: '100%', height: 180, display: 'block', overflow: 'visible' }}
          >
            <defs>
              <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C4A44A" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#C4A44A" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {chartCoords.gridLevels.map(g => (
              <line
                key={g.y}
                x1="0" y1={g.y} x2={chartCoords.W} y2={g.y}
                stroke="rgba(255,255,255,0.05)" strokeWidth="1"
              />
            ))}

            {/* Fill under portfolio */}
            <path d={chartCoords.fillPath} fill="url(#portfolioGrad)" />

            {/* Benchmark line */}
            <polyline
              points={chartCoords.bPts}
              fill="none"
              stroke="#8A9AB0"
              strokeWidth="1.2"
              strokeDasharray="4 3"
              strokeOpacity="0.5"
            />

            {/* Portfolio line */}
            <polyline
              points={chartCoords.pPts}
              fill="none"
              stroke="#C4A44A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Current value dot */}
            <circle
              cx={chartCoords.lastX}
              cy={chartCoords.lastY}
              r="4"
              fill="#C4A44A"
              stroke="#08162A"
              strokeWidth="2"
            />
          </svg>

          {/* X-axis labels */}
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            marginTop: 8, paddingInline: 0,
          }}>
            {chart.labels.map((l, i) => (
              <div key={i} style={{ fontSize: 9, color: 'var(--mist)', letterSpacing: '.05em' }}>
                {l}
              </div>
            ))}
          </div>
        </div>

        {/* Below chart strip */}
        <div style={{
          marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)',
          display: 'flex', gap: 32, flexWrap: 'wrap',
        }}>
          <ChartStat
            label="Period Start"
            value={`CHF ${chart.portfolio[0].toLocaleString('de-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}M`}
          />
          <ChartStat
            label="Current Value"
            value={`CHF ${chart.portfolio[chart.portfolio.length - 1].toLocaleString('de-CH', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}M`}
          />
          <ChartStat
            label="Absolute Gain"
            value={`+CHF ${(chart.absGain / 1000).toFixed(0)}K`}
            positive
          />
          <ChartStat
            label="Outperformance"
            value={`+${(chart.portfolioReturn - chart.benchmarkReturn).toFixed(2)}% vs index`}
            positive
          />
        </div>
      </div>

      {/* ── Asset returns + Monthly grid ────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }} className="perf-lower-grid">

        {/* Asset class returns */}
        <div style={{ background: 'var(--navy)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--cream)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <BarChart2 size={14} style={{ color: 'var(--gold)' }} /> Asset Class Returns
            </div>
            <div style={{ display: 'flex', gap: 2 }}>
              {RETURN_VIEWS.map(v => (
                <button key={v} onClick={() => setReturnView(v)} style={{
                  fontSize: 9, letterSpacing: '.1em', padding: '3px 8px', borderRadius: 4,
                  cursor: 'pointer', border: 'none', fontWeight: 500,
                  background: returnView === v ? 'rgba(196,164,74,0.15)' : 'transparent',
                  color: returnView === v ? 'var(--gold)' : 'var(--mist)',
                }}>
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div style={{ padding: '16px 22px' }}>
            {mockAssetReturns.map(asset => {
              const ret = returnView === '1M' ? asset.return1M
                : returnView === 'YTD' ? asset.returnYTD
                : asset.return1Y
              const maxAbs = 10
              const barW = Math.abs(ret) / maxAbs * 100
              const positive = ret >= 0
              return (
                <div key={asset.id} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: asset.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 11, color: 'var(--mist)' }}>{asset.label}</span>
                    </div>
                    <span style={{
                      fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 500,
                      color: positive ? 'var(--green)' : 'var(--red)',
                    }}>
                      {positive ? '+' : ''}{ret.toFixed(1)}%
                    </span>
                  </div>
                  {/* Bar */}
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
                    <div style={{
                      position: 'absolute',
                      left: positive ? '50%' : `calc(50% - ${barW / 2}%)`,
                      width: `${barW / 2}%`,
                      height: '100%',
                      background: positive ? 'var(--green)' : 'var(--red)',
                      borderRadius: 2,
                    }} />
                    {/* center divider */}
                    <div style={{ position: 'absolute', left: '50%', top: 0, width: 1, height: '100%', background: 'rgba(255,255,255,0.1)' }} />
                  </div>
                </div>
              )
            })}

            {/* Portfolio total row */}
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, color: 'var(--cream)', fontWeight: 500 }}>Portfolio Total</span>
                <span style={{ fontSize: 13, fontFamily: 'var(--font-mono)', fontWeight: 500, color: 'var(--gold)' }}>
                  {returnView === '1M' ? '+1.28%' : returnView === 'YTD' ? '+2.44%' : '+8.69%'}
                </span>
              </div>
              <div style={{ fontSize: 9, color: 'var(--mist)', marginTop: 3 }}>
                {returnView === '1M' ? '+0.46% vs benchmark' : returnView === 'YTD' ? '+0.49% vs benchmark' : '+2.43% vs benchmark'}
              </div>
            </div>
          </div>
        </div>

        {/* Monthly returns grid */}
        <div style={{ background: 'var(--navy)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--cream)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Activity size={14} style={{ color: 'var(--gold)' }} /> Monthly Returns — Last 12 Months
            </div>
          </div>
          <div style={{ padding: '16px 22px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
              {mockMonthlyReturns.map(m => {
                const pos = m.value >= 0
                const intensity = Math.min(Math.abs(m.value) / 2.5, 1)
                const bg = pos
                  ? `rgba(29,158,117,${0.08 + intensity * 0.22})`
                  : `rgba(192,57,43,${0.08 + intensity * 0.22})`
                const col = pos ? 'var(--green)' : 'var(--red)'
                return (
                  <div key={m.month} style={{
                    background: bg,
                    border: `1px solid ${pos ? 'rgba(29,158,117,0.2)' : 'rgba(192,57,43,0.2)'}`,
                    borderRadius: 6, padding: '10px 10px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  }}>
                    <span style={{ fontSize: 8, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--mist)' }}>
                      {m.month}
                    </span>
                    <span style={{ fontSize: 13, fontFamily: 'var(--font-mono)', fontWeight: 600, color: col }}>
                      {pos ? '+' : ''}{m.value.toFixed(2)}%
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Legend */}
            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(29,158,117,0.25)' }} />
                <span style={{ fontSize: 9, color: 'var(--mist)' }}>Positive month</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(192,57,43,0.25)' }} />
                <span style={{ fontSize: 9, color: 'var(--mist)' }}>Negative month</span>
              </div>
              <div style={{ marginLeft: 'auto', fontSize: 9, color: 'var(--mist)' }}>
                10 / 12 positive months
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Risk metrics ────────────────────── */}
      <div style={{
        background: 'var(--navy)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 20,
      }}>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--cream)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Info size={14} style={{ color: 'var(--gold)' }} /> Risk Metrics
          </div>
          <div style={{ fontSize: 9, color: 'var(--mist)', letterSpacing: '.05em', marginLeft: 4 }}>
            · Trailing 12 months unless noted
          </div>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
          padding: '20px 22px', gap: 20,
        }} className="risk-grid">
          {Object.values(mockRiskMetrics).map(m => (
            <RiskCell key={m.label} metric={m} />
          ))}
        </div>
      </div>

      {/* ── Disclaimer ──────────────────────── */}
      <div style={{
        fontSize: 9, color: 'rgba(138,154,176,0.5)', lineHeight: 1.7,
        borderTop: '1px solid var(--border)', paddingTop: 16,
      }}>
        Past performance is not indicative of future results. All figures are in CHF unless stated otherwise.
        Performance data is net of custody and advisory fees. Benchmark: ZPF Balanced 60/40 Composite Index.
        Risk metrics are computed on monthly returns over the stated trailing period.
        This information is provided for informational purposes only and does not constitute investment advice.
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 1024px) {
          .perf-kpi-grid { grid-template-columns: repeat(2,1fr) !important; }
          .perf-lower-grid { grid-template-columns: 1fr !important; }
          .risk-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 768px) {
          .perf-kpi-grid { grid-template-columns: 1fr 1fr !important; }
          .perf-lower-grid { grid-template-columns: 1fr !important; }
          .risk-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .perf-kpi-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

/* ── Sub-components ───────────────────────────────────────── */

function KpiCard({
  label, value, sub, positive, neutral, icon,
}: {
  label: string; value: string; sub: string
  positive: boolean; neutral?: boolean; icon: React.ReactNode
}) {
  const col = neutral ? 'var(--mist)' : positive ? 'var(--green)' : 'var(--red)'
  return (
    <div style={{
      background: 'var(--surf)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: '18px 20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 7,
          background: neutral ? 'rgba(138,154,176,0.1)' : positive ? 'rgba(29,158,117,0.12)' : 'rgba(192,57,43,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: col, flexShrink: 0,
        }}>
          {icon}
        </div>
        <div style={{ fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--mist)' }}>
          {label}
        </div>
      </div>
      <div style={{
        fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 400,
        color: col, lineHeight: 1, marginBottom: 6,
      }}>
        {value}
      </div>
      <div style={{ fontSize: 9, color: 'var(--mist)' }}>{sub}</div>
    </div>
  )
}

function ChartStat({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  return (
    <div>
      <div style={{ fontSize: 8, letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 3 }}>
        {label}
      </div>
      <div style={{
        fontSize: 12, fontFamily: 'var(--font-mono)',
        color: positive ? 'var(--green)' : 'var(--cream)',
      }}>
        {value}
      </div>
    </div>
  )
}

function RiskCell({ metric }: { metric: { value: string; label: string; sub: string } }) {
  const isPositive = metric.value.startsWith('+')
  const isNegative = metric.value.startsWith('−') || metric.value.startsWith('-')
  const col = isPositive ? 'var(--green)' : isNegative ? 'var(--red)' : 'var(--cream)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--mist)' }}>
        {metric.label}
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 400, color: col, lineHeight: 1.1 }}>
        {metric.value}
      </div>
      <div style={{ fontSize: 9, color: 'rgba(138,154,176,0.6)', marginTop: 1 }}>
        {metric.sub}
      </div>
    </div>
  )
}
