import {
  TrendingUp, Download, MapPin, Building2,
  FileText, ShieldCheck, Clock, CircleCheck,
  AlertTriangle, Home, Layers,
} from 'lucide-react'
import { mockProperties } from '@/lib/mock-data'

export default function RealEstatePage() {
  const totalValue      = mockProperties.reduce((s, p) => s + p.valuationCHF, 0)
  const totalCost       = mockProperties.reduce((s, p) => s + p.acquisitionCHF, 0)
  const totalPnl        = mockProperties.reduce((s, p) => s + p.unrealisedPnl, 0)
  const totalPnlPct     = ((totalPnl / totalCost) * 100).toFixed(1)

  return (
    <div>
      {/* ── Header ─────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 12, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, color: 'var(--cream)' }}>
            Real Estate Holdings
          </div>
          <div style={{ fontSize: 10, color: 'var(--mist)', marginTop: 4, letterSpacing: '.05em' }}>
            ZPF-7741-0038 · 2 properties · Title deeds in ZPF custody · Lagos, Nigeria
          </div>
        </div>
        <button style={{
          fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--gold)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
          border: '1px solid var(--border2)', padding: '7px 14px', borderRadius: 20, background: 'transparent',
        }}>
          <Download size={12} /> Property Report
        </button>
      </div>

      {/* ── Valuation notice ────────────────── */}
      <div style={{
        display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 16px',
        background: 'rgba(196,164,74,0.05)', border: '1px solid rgba(196,164,74,0.2)',
        borderRadius: 'var(--radius-lg)', marginBottom: 20,
      }}>
        <AlertTriangle size={14} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 1 }} />
        <div style={{ fontSize: 10, color: 'rgba(244,239,230,0.55)', lineHeight: 1.6 }}>
          Independent Q4 2025 valuations are currently in progress for both properties.{' '}
          <span style={{ color: 'var(--cream)' }}>Current figures are estimated</span> and will be updated upon receipt of formal appraisal reports.
          Contact your Relationship Manager for interim assessments.
        </div>
      </div>

      {/* ── KPIs ────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }} className="re-kpi-grid">
        <div style={{
          gridColumn: '1 / 3',
          background: 'linear-gradient(135deg,#0e2040 0%,#1f1408 100%)',
          border: '1px solid var(--border2)', borderRadius: 'var(--radius-lg)',
          padding: '22px 28px', position: 'relative', overflow: 'hidden',
        }} className="re-hero-card">
          <div style={{
            position: 'absolute', right: -10, bottom: -20,
            fontFamily: 'var(--font-display)', fontSize: 96, fontWeight: 600,
            color: 'rgba(216,90,48,0.05)', pointerEvents: 'none',
          }}>RE</div>
          <div style={{ fontSize: 9, letterSpacing: '.35em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 10 }}>
            Total Estimated Value
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 400, color: 'var(--cream)', lineHeight: 1, marginBottom: 6 }}>
            <span style={{ fontSize: 18, color: 'var(--gold2)', marginRight: 6 }}>CHF</span>
            {totalValue.toLocaleString()}
          </div>
          <div style={{ fontSize: 11, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <TrendingUp size={12} />
            +CHF {totalPnl.toLocaleString()} (+{totalPnlPct}%) above acquisition cost · 10.9% of portfolio
          </div>
        </div>

        <KpiCard label="Unrealised Gain" value={`+CHF ${(totalPnl / 1000).toFixed(0)}K`} sub={`+${totalPnlPct}% vs total acquisition cost`} positive />
        <KpiCard label="Acquisition Cost" value={`CHF ${(totalCost / 1000).toFixed(0)}K`} sub="Combined cost basis · 2019 & 2021" neutral />
      </div>

      {/* ── Property cards ──────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
        {mockProperties.map(property => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {/* ── Title documents ─────────────────── */}
      <div style={{ background: 'var(--navy)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <FileText size={14} style={{ color: 'var(--gold)' }} />
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--cream)' }}>Title Documents in Custody</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }} className="re-docs-grid">
          {mockProperties.map((p, i) => (
            <div key={p.id} style={{
              padding: '18px 22px',
              borderRight: i === 0 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                  background: 'rgba(29,158,117,0.1)', color: '#4ecda4',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <FileText size={15} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--cream)', marginBottom: 4 }}>
                    Title Deed — {p.name}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 10 }}>
                    {[
                      { label: 'Reference', value: p.titleRef },
                      { label: 'Lodged',    value: p.titleLodged },
                      { label: 'Encumbrances', value: p.encumbrances },
                    ].map(row => (
                      <div key={row.label} style={{ display: 'flex', gap: 8, fontSize: 10 }}>
                        <span style={{ color: 'var(--mist)', width: 90, flexShrink: 0 }}>{row.label}</span>
                        <span style={{ color: 'var(--cream)', fontFamily: row.label === 'Reference' ? 'var(--font-mono)' : 'inherit' }}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{
                      fontSize: 9, fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase',
                      padding: '2px 8px', borderRadius: 3,
                      background: 'rgba(29,158,117,0.12)', color: '#4ecda4',
                    }}>
                      <CircleCheck size={9} style={{ display: 'inline', marginRight: 4 }} />
                      {p.titleStatus}
                    </span>
                    <span style={{
                      fontSize: 9, fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase',
                      padding: '2px 8px', borderRadius: 3,
                      background: 'rgba(138,154,176,0.1)', color: 'var(--mist)',
                    }}>
                      Physical + Digital
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Valuation summary table ─────────── */}
      <div style={{ background: 'var(--navy)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Clock size={14} style={{ color: 'var(--gold)' }} />
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--cream)' }}>Valuation History</span>
        </div>
        {mockProperties.map((property, pi) => (
          <div key={property.id} style={{ borderBottom: pi < mockProperties.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <div style={{
              padding: '10px 22px',
              background: 'rgba(255,255,255,0.02)',
              fontSize: 10, fontWeight: 500, color: 'var(--mist)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <Building2 size={11} style={{ color: 'var(--gold)' }} />
              {property.name}
            </div>
            {property.valuationHistory.map((v, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '11px 22px 11px 40px',
                borderTop: '1px solid rgba(196,164,74,0.05)',
              }}>
                <div style={{ width: 72, flexShrink: 0, fontSize: 10, color: 'var(--mist)' }}>{v.date}</div>
                <div style={{ flex: 1, fontSize: 11, color: 'var(--cream)' }}>{v.note}</div>
                <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', fontWeight: 500, color: i === property.valuationHistory.length - 1 ? 'var(--gold2)' : 'var(--cream)' }}>
                  CHF {v.valueCHF.toLocaleString()}
                </div>
                {i > 0 && (
                  <div style={{
                    fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--green)',
                    width: 60, textAlign: 'right', flexShrink: 0,
                  }}>
                    +{(((v.valueCHF - property.valuationHistory[0].valueCHF) / property.valuationHistory[0].valueCHF) * 100).toFixed(1)}%
                  </div>
                )}
                {i === 0 && <div style={{ width: 60 }} />}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 1024px) {
          .re-kpi-grid  { grid-template-columns: 1fr 1fr !important; }
          .re-hero-card { grid-column: 1 / -1 !important; }
          .re-docs-grid { grid-template-columns: 1fr !important; }
          .re-docs-grid > div:first-child { border-right: none !important; border-bottom: 1px solid var(--border) !important; }
          .re-prop-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .re-kpi-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

/* ── Sub-components ───────────────────────────────────────── */

function PropertyCard({ property }: { property: typeof mockProperties[0] }) {
  const gain    = property.valuationCHF - property.acquisitionCHF
  const gainPct = ((gain / property.acquisitionCHF) * 100).toFixed(1)

  return (
    <div style={{ background: 'var(--navy)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }} className="re-prop-grid">

        {/* Left: main info */}
        <div style={{ padding: '22px 24px', borderRight: '1px solid var(--border)' }}>
          {/* Type badge + status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 8,
              background: property.colorBg, color: property.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              {property.type.includes('Land') ? <Layers size={15} /> : <Home size={15} />}
            </div>
            <div>
              <div style={{ fontSize: 8, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--mist)' }}>
                {property.type}
              </div>
              <div style={{
                fontSize: 9, fontWeight: 500, marginTop: 3,
                color: property.status === 'occupied' ? '#4ecda4' : 'var(--gold2)',
              }}>
                {property.statusLabel}
              </div>
            </div>
          </div>

          {/* Name + address */}
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 400, color: 'var(--cream)', marginBottom: 6 }}>
            {property.name}
          </div>
          <div style={{ fontSize: 10, color: 'var(--mist)', display: 'flex', alignItems: 'flex-start', gap: 5, marginBottom: 16 }}>
            <MapPin size={11} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 1 }} />
            {property.address}
          </div>

          {/* Value */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 6 }}>
              Estimated Value
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 400, color: 'var(--cream)', lineHeight: 1 }}>
              <span style={{ fontSize: 14, color: 'var(--gold2)', marginRight: 5 }}>CHF</span>
              {property.valuationCHF.toLocaleString()}
            </div>
            <div style={{ fontSize: 10, color: 'var(--mist)', marginTop: 4 }}>
              {property.valuationLocal} · {property.lastValuation}
            </div>
          </div>

          {/* Gain pill */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 10, padding: '4px 12px', borderRadius: 20, fontFamily: 'var(--font-mono)',
              background: 'rgba(29,158,117,0.12)', color: 'var(--green)', fontWeight: 500,
            }}>
              +CHF {gain.toLocaleString()} ({gainPct}%)
            </span>
            <span style={{
              fontSize: 9, padding: '4px 10px', borderRadius: 20, letterSpacing: '.08em',
              background: 'rgba(196,164,74,0.08)', color: 'var(--mist)',
            }}>
              Since {property.acquisitionDate}
            </span>
          </div>
        </div>

        {/* Right: property details */}
        <div style={{ padding: '22px 24px' }}>
          <div style={{ fontSize: 9, letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 14 }}>
            Property Details
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px', marginBottom: 18 }}>
            {[
              { label: 'Land Area',    value: property.landArea },
              property.area ? { label: 'Built Area', value: property.area } : null,
              property.bedrooms ? { label: 'Bedrooms',  value: `${property.bedrooms} bed · ${property.bathrooms} bath` } : null,
              { label: 'Acquired',     value: property.acquisitionDate },
              { label: 'Cost Basis',   value: `CHF ${property.acquisitionCHF.toLocaleString()}` },
              { label: 'Title Ref',    value: property.titleRef },
            ].filter(Boolean).map(row => row && (
              <div key={row.label}>
                <div style={{ fontSize: 8, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 3 }}>{row.label}</div>
                <div style={{ fontSize: 11, color: 'var(--cream)', fontFamily: row.label === 'Title Ref' ? 'var(--font-mono)' : 'inherit' }}>{row.value}</div>
              </div>
            ))}
          </div>

          {/* Features */}
          <div style={{ fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 8 }}>
            Features
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {property.features.map(f => (
              <span key={f} style={{
                fontSize: 9, padding: '3px 9px', borderRadius: 4,
                background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
                color: 'var(--mist)',
              }}>
                {f}
              </span>
            ))}
          </div>

          {/* Title status */}
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldCheck size={12} style={{ color: '#4ecda4', flexShrink: 0 }} />
            <span style={{ fontSize: 10, color: 'var(--mist)' }}>
              Title deed secured · ZPF vault · No encumbrances
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function KpiCard({ label, value, sub, positive, neutral }: { label: string; value: string; sub: string; positive?: boolean; neutral?: boolean }) {
  const col = neutral ? 'var(--cream)' : positive ? 'var(--green)' : 'var(--red)'
  return (
    <div style={{ background: 'var(--surf)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '18px 20px' }}>
      <div style={{ fontSize: 9, letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, color: col, lineHeight: 1, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 9, color: 'var(--mist)' }}>{sub}</div>
    </div>
  )
}
