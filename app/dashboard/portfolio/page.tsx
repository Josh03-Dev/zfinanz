import {
  TrendingUp, TrendingDown, Minus, Download, SlidersHorizontal,
  Send, FilePlus, DownloadCloud, PhoneCall, MapPin, PieChart,
  Archive, Clock, UserCircle, MessageSquare, ChevronRight,
  Phone, Lock, Calendar, CircleCheck, Mail,
  Landmark, BarChart2, Hexagon, Cpu, Building2,
  FileBadge, Home, ScrollText, FileText, ShieldAlert, ArrowDownLeft,
} from 'lucide-react'
import { mockPortfolio, mockAssets, mockMetals, mockActivity, mockVaultDocs, mockRM } from '@/lib/mock-data'

export default function PortfolioPage() {
  return (
    <div>
      {/* ── Message banner ─────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px',
        background: 'rgba(196,164,74,0.06)', border: '1px solid var(--border2)',
        borderRadius: 'var(--radius-lg)', marginBottom: 28, cursor: 'pointer',
      }}>
        <MessageSquare size={18} style={{ color: 'var(--gold)', flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--cream)' }}>
            New message from your Relationship Manager
          </div>
          <div className="msg-sub" style={{ fontSize: 10, color: 'var(--mist)', marginTop: 2 }}>
            Re: Q3 portfolio review — attached valuation report now available in Statements
          </div>
        </div>
        <div style={{ background: 'var(--gold)', color: 'var(--navy)', fontSize: 10, fontWeight: 500, padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap' }}>
          2 unread
        </div>
        <ChevronRight size={14} style={{ color: 'var(--mist)', flexShrink: 0 }} />
      </div>

      {/* ── Portfolio hero ─────────────────── */}
      <SectionHeader title="Portfolio Summary">
        <ActionBtn icon={<Download size={12} />}>Download Report</ActionBtn>
      </SectionHeader>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 28 }} className="portfolio-hero-grid">
        {/* Main value card */}
        <div style={{
          gridColumn: '1 / 3',
          background: 'linear-gradient(135deg,#0e2040 0%,#162d56 100%)',
          border: '1px solid var(--border2)', borderRadius: 'var(--radius-lg)',
          padding: '28px 32px', position: 'relative', overflow: 'hidden',
        }} className="hero-main-card">
          <div style={{
            position: 'absolute', right: -10, bottom: -24,
            fontFamily: 'var(--font-display)', fontSize: 120, fontWeight: 600,
            color: 'rgba(196,164,74,0.05)', pointerEvents: 'none', letterSpacing: 4,
          }}>ZPF</div>
          <div style={{ fontSize: 9, letterSpacing: '.35em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 12 }}>
            Total Portfolio Value · as of today
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 400, color: 'var(--cream)', lineHeight: 1, marginBottom: 8 }}>
            <span style={{ fontSize: 22, color: 'var(--gold2)', marginRight: 8 }}>CHF</span>
            {mockPortfolio.totalValue.toLocaleString()}
          </div>
          <div style={{ fontSize: 12, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <TrendingUp size={13} />
            +CHF {mockPortfolio.change.amount.toLocaleString()} (+{mockPortfolio.change.percent}%) {mockPortfolio.change.label}
          </div>
          <div style={{ fontSize: 10, color: 'var(--mist)', marginTop: 4 }}>{mockPortfolio.subline}</div>
        </div>

        {/* Mini: unrealised gain */}
        <div style={{
          background: 'var(--surf)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '22px 24px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--mist)' }}>Unrealised Gain (YTD)</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, color: 'var(--green)', margin: '8px 0 4px' }}>
              +{mockPortfolio.unrealisedGain.percent}%
            </div>
            <div style={{ fontSize: 10, color: 'var(--mist)' }}>CHF {mockPortfolio.unrealisedGain.amount.toLocaleString()} above cost basis</div>
          </div>
          <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2, marginTop: 12, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '68%', background: 'var(--green)', borderRadius: 2 }} />
          </div>
        </div>

        {/* Mini: next review */}
        <div style={{
          background: 'var(--surf)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '22px 24px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }} className="hero-mini-review">
          <div>
            <div style={{ fontSize: 9, letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--mist)' }}>Next Scheduled Review</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, color: 'var(--cream)', margin: '8px 0 4px' }}>
              {mockPortfolio.nextReview.date}
            </div>
            <div style={{ fontSize: 10, color: 'var(--mist)' }}>{mockPortfolio.nextReview.label}</div>
          </div>
          <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2, marginTop: 12, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${mockPortfolio.nextReview.progress}%`, background: 'var(--gold)', borderRadius: 2 }} />
          </div>
        </div>

        {/* Stats strip */}
        <div style={{ gridColumn: '1 / -1' }}>
          <div style={{
            background: 'var(--surf)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '16px 28px',
            display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
          }}>
            <StatCell
              label="Custodian"
              value={mockPortfolio.custodian.name}
              sub={mockPortfolio.custodian.address}
            />
            <StatCell
              label="Risk Profile"
              value={mockPortfolio.riskProfile.label}
              sub={mockPortfolio.riskProfile.sub}
              divider
            />
            <StatCell
              label="Account Status"
              divider
              valueNode={
                <div style={{ fontSize: 12, color: 'var(--green)', marginTop: 5, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <CircleCheck size={12} /> {mockPortfolio.accountStatus.label}
                </div>
              }
              sub={mockPortfolio.accountStatus.since}
            />
          </div>
        </div>
      </div>

      {/* ── Quick Actions ──────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 28 }} className="quick-actions-grid">
        {[
          { icon: <Send size={16} />,         label: 'Submit Transfer Request' },
          { icon: <FilePlus size={16} />,      label: 'Lodge Document to Vault' },
          { icon: <DownloadCloud size={16} />, label: 'Download Statement' },
          { icon: <PhoneCall size={16} />,     label: 'Contact RM Securely' },
        ].map(({ icon, label }) => (
          <button key={label} style={{
            background: 'var(--surf)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '16px 14px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            cursor: 'pointer',
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(196,164,74,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
              {icon}
            </div>
            <div style={{ fontSize: 10, color: 'var(--mist)', textAlign: 'center', lineHeight: 1.4 }}>{label}</div>
          </button>
        ))}
      </div>

      {/* ── Asset Cards ────────────────────── */}
      <SectionHeader title="Asset Classes">
        <ActionBtn icon={<SlidersHorizontal size={12} />}>Filter</ActionBtn>
      </SectionHeader>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 28 }} className="asset-grid">
        {mockAssets.map(asset => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>

      {/* ── Metals breakdown ───────────────── */}
      <SectionHeader title="Precious Metals — Vault Breakdown">
        <ActionBtn icon={<MapPin size={12} />}>Vault Details</ActionBtn>
      </SectionHeader>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 28 }} className="metals-grid">
        {mockMetals.map(m => (
          <div key={m.name} style={{
            background: 'var(--navy)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '18px 20px',
          }}>
            <div style={{ fontSize: 9, letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 10 }}>{m.name}</div>
            <div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 400, color: 'var(--cream)' }}>{m.weight}</span>
              {' '}
              <span style={{ fontSize: 13, color: 'var(--mist)' }}>{m.unit}</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--gold2)', marginTop: 4 }}>≈ {m.value}</div>
            <div style={{ fontSize: 9, color: 'var(--mist)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={10} /> {m.vault}
            </div>
          </div>
        ))}
      </div>

      {/* ── Lower panels ───────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }} className="lower-grid">

        {/* Allocation */}
        <Panel title={<><PieChart size={14} style={{ color: 'var(--gold)' }} /> Portfolio Allocation</>}>
          <div style={{ padding: '20px 22px' }}>
            {mockAssets.filter(a => a.id !== 'vault').map(a => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: 'var(--mist)', width: 126, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: a.color, flexShrink: 0 }} />
                  {a.tagLabel}
                </div>
                <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${a.allocation}%`, background: a.color, borderRadius: 3 }} />
                </div>
                <div style={{ fontSize: 11, color: 'var(--cream)', width: 38, textAlign: 'right', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
                  {a.allocation}%
                </div>
                <div className="alloc-val" style={{ fontSize: 10, color: 'var(--mist)', width: 80, textAlign: 'right', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
                  {(a.value / 1000).toFixed(0)}K
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: 'var(--mist)', width: 126, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: '#8A9AB0', flexShrink: 0 }} />
                Other
              </div>
              <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '2.3%', background: '#8A9AB0', borderRadius: 3 }} />
              </div>
              <div style={{ fontSize: 11, color: 'var(--cream)', width: 38, textAlign: 'right', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>2.3%</div>
              <div className="alloc-val" style={{ fontSize: 10, color: 'var(--mist)', width: 80, textAlign: 'right', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>300K</div>
            </div>
          </div>
        </Panel>

        {/* Document Vault */}
        <Panel title={<><Archive size={14} style={{ color: 'var(--gold)' }} /> Document Vault</>} action="View all →">
          {mockVaultDocs.map((doc, i) => (
            <VaultItem key={i} doc={doc} />
          ))}
        </Panel>

        {/* Activity */}
        <Panel title={<><Clock size={14} style={{ color: 'var(--gold)' }} /> Recent Activity</>} action="Full history →">
          {mockActivity.map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '13px 22px',
              borderBottom: i < mockActivity.length - 1 ? '1px solid rgba(196,164,74,0.06)' : 'none',
              cursor: 'pointer',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                ...item.iconStyle,
              }}>
                <ActivityIcon name={item.icon} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, color: 'var(--cream)' }}>{item.name}</div>
                <div style={{ fontSize: 10, color: 'var(--mist)', marginTop: 2 }}>{item.date}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 12,
                  color: item.valueCls === 'up' ? 'var(--green)' : item.valueCls === 'dn' ? 'var(--red)' : 'var(--mist)',
                }}>
                  {item.value}
                </div>
                <div style={{ fontSize: 9, color: 'var(--mist)', marginTop: 2 }}>{item.curr}</div>
              </div>
            </div>
          ))}
        </Panel>

        {/* RM Card */}
        <Panel title={<><UserCircle size={14} style={{ color: 'var(--gold)' }} /> Relationship Manager</>} action="Send message →">
          <div style={{ padding: '20px 22px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18,
              paddingBottom: 18, borderBottom: '1px solid var(--border)', flexWrap: 'wrap',
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: 'rgba(196,164,74,0.12)', border: '1px solid rgba(196,164,74,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--gold2)', flexShrink: 0,
                overflow: 'hidden',
              }}>
                {mockRM.initials}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--cream)' }}>{mockRM.name}</div>
                <div style={{ fontSize: 10, color: 'var(--mist)', marginTop: 2 }}>{mockRM.title}</div>
                <div style={{ fontSize: 10, color: '#4ecda4', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ecda4' }} />
                  {mockRM.availability}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {[
                { icon: <Mail size={13} style={{ color: 'var(--gold)', flexShrink: 0 }} />, text: mockRM.email },
                { icon: <Lock size={13} style={{ color: 'var(--gold)', flexShrink: 0 }} />, text: 'All messages via secure portal only — no external email' },
                { icon: <Calendar size={13} style={{ color: 'var(--gold)', flexShrink: 0 }} />, text: `Next scheduled call: ${mockRM.nextCall}` },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--mist)' }}>
                  {icon} {text}
                </div>
              ))}
            </div>
            <button style={{
              marginTop: 16, width: '100%', height: 38,
              background: 'rgba(196,164,74,0.1)', border: '1px solid rgba(196,164,74,0.3)',
              borderRadius: 'var(--radius)', color: 'var(--gold2)',
              fontSize: 11, fontWeight: 500, letterSpacing: '.15em', textTransform: 'uppercase',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            }}>
              <MessageSquare size={14} /> Send Secure Message
            </button>
          </div>
        </Panel>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 1024px) {
          .portfolio-hero-grid { grid-template-columns: 1fr 1fr !important; }
          .hero-main-card { grid-column: 1 / -1 !important; }
          .hero-mini-review { display: none !important; }
          .asset-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 768px) {
          .portfolio-hero-grid { grid-template-columns: 1fr !important; }
          .hero-main-card { grid-column: auto !important; padding: 20px !important; }
          .quick-actions-grid { grid-template-columns: repeat(4,1fr) !important; gap: 8px !important; }
          .asset-grid { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
          .metals-grid { grid-template-columns: 1fr !important; }
          .lower-grid { grid-template-columns: 1fr !important; }
          .alloc-val { display: none !important; }
          .msg-sub { display: none !important; }
        }
        @media (max-width: 390px) {
          .asset-grid { grid-template-columns: 1fr !important; }
          .quick-actions-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
    </div>
  )
}

/* ── Sub-components ───────────────────────────────────────── */

function SectionHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 400, color: 'var(--cream)' }}>{title}</div>
      {children}
    </div>
  )
}

function ActionBtn({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <button style={{
      fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--gold)',
      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
      border: '1px solid var(--border2)', padding: '5px 12px', borderRadius: 20,
    }}>
      {icon}{children}
    </button>
  )
}

function AssetCard({ asset }: { asset: typeof mockAssets[0] }) {
  const iconMap: Record<string, React.ReactNode> = {
    'landmark':   <Landmark size={17} />,
    'bar-chart-2': <BarChart2 size={17} />,
    'hexagon':    <Hexagon size={17} />,
    'cpu':        <Cpu size={17} />,
    'building-2': <Building2 size={17} />,
    'archive':    <Archive size={17} />,
  }

  return (
    <div style={{
      background: 'var(--navy)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: '20px 22px',
      cursor: 'pointer', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: asset.color, opacity: 0 }}
        className="asset-accent" />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${asset.color}1f`, color: asset.color }}>
          {iconMap[asset.icon]}
        </div>
        <span style={{ fontSize: 8, fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 20, background: `${asset.color}1f`, color: asset.accentColor }}>
          {asset.tagLabel}
        </span>
      </div>
      <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--cream)', marginBottom: 4 }}>{asset.name}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, color: 'var(--cream)', lineHeight: 1.2 }}>
        {asset.value > 0 ? `CHF ${asset.value.toLocaleString()}` : '14 Documents'}
      </div>
      <div style={{ fontSize: 10, color: 'var(--mist)', marginTop: 4 }}>{asset.sub}</div>
      <div style={{
        fontSize: 10, marginTop: 6, display: 'flex', alignItems: 'center', gap: 3,
        color: asset.change.direction === 'up' ? 'var(--green)' : asset.change.direction === 'down' ? 'var(--red)' : 'var(--mist)',
      }}>
        {asset.change.direction === 'up'      && <TrendingUp size={11} />}
        {asset.change.direction === 'down'    && <TrendingDown size={11} />}
        {asset.change.direction === 'neutral' && <Minus size={11} />}
        {asset.change.label}
      </div>
    </div>
  )
}

function Panel({ title, action, children }: { title: React.ReactNode; action?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--navy)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--cream)', display: 'flex', alignItems: 'center', gap: 8 }}>{title}</div>
        {action && <div style={{ fontSize: 10, color: 'var(--gold)', letterSpacing: '.1em', cursor: 'pointer' }}>{action}</div>}
      </div>
      {children}
    </div>
  )
}

function VaultItem({ doc }: { doc: typeof mockVaultDocs[0] }) {
  const iconMap: Record<string, React.ReactNode> = {
    'file-badge':   <FileBadge size={14} />,
    'home':         <Home size={14} />,
    'scroll-text':  <ScrollText size={14} />,
    'file-text':    <FileText size={14} />,
    'shield-alert': <ShieldAlert size={14} />,
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '13px 22px',
      borderBottom: '1px solid rgba(196,164,74,0.06)', cursor: 'pointer',
    }}>
      <div style={{ width: 32, height: 32, background: 'rgba(138,154,176,0.1)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--mist)', flexShrink: 0 }}>
        {iconMap[doc.icon]}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, color: 'var(--cream)' }}>{doc.name}</div>
        <div style={{ fontSize: 10, color: 'var(--mist)', marginTop: 2 }}>{doc.meta}</div>
      </div>
      <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 3, fontWeight: 500, flexShrink: 0, ...doc.badgeStyle }}>
        {doc.badge}
      </span>
    </div>
  )
}

function StatCell({ label, value, sub, valueNode, divider }: { label: string; value?: string; sub?: string; valueNode?: React.ReactNode; divider?: boolean }) {
  return (
    <div style={{ paddingLeft: divider ? 24 : 0, borderLeft: divider ? '1px solid var(--border)' : 'none' }}>
      <div style={{ fontSize: 9, letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--mist)' }}>{label}</div>
      {valueNode ?? <div style={{ fontSize: 12, color: 'var(--cream)', marginTop: 5, fontWeight: 500 }}>{value}</div>}
      {sub && <div style={{ fontSize: 10, color: 'var(--mist)', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

function ActivityIcon({ name }: { name: string }) {
  const map: Record<string, React.ReactNode> = {
    'arrow-down-left': <ArrowDownLeft size={14} />,
    'hexagon': <Hexagon size={14} />,
    'cpu': <Cpu size={14} />,
    'file-text': <FileText size={14} />,
    'archive': <Archive size={14} />,
  }
  return <>{map[name] ?? <Archive size={14} />}</>
}
