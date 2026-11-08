'use client'

import {
  Landmark, TrendingUp, Download, Percent, RefreshCw,
  Clock, ArrowDownLeft, ArrowUpRight, Lock, PieChart,
  Send, PhoneCall, DownloadCloud, Calendar,
} from 'lucide-react'
import {
  mockUser,
  mockMonetaryAccounts,
  mockMonetaryActivity,
  type MonetaryAccount,
  type MonetaryTransaction,
} from '@/lib/mock-data'

// ── Transaction helpers ───────────────────────────────────

const TX_ICON: Record<MonetaryTransaction['type'], React.ReactNode> = {
  inbound:  <ArrowDownLeft size={14} />,
  outbound: <ArrowUpRight  size={14} />,
  fx:       <RefreshCw     size={14} />,
  interest: <Percent       size={14} />,
  notice:   <Clock         size={14} />,
}

const TX_STYLE: Record<MonetaryTransaction['type'], React.CSSProperties> = {
  inbound:  { background: 'rgba(29,158,117,0.12)',  color: '#1D9E75' },
  outbound: { background: 'rgba(192,57,43,0.12)',   color: '#c0392b' },
  fx:       { background: 'rgba(55,138,221,0.12)',  color: '#378ADD' },
  interest: { background: 'rgba(196,164,74,0.12)',  color: '#C4A44A' },
  notice:   { background: 'rgba(138,154,176,0.10)', color: '#8A9AB0' },
}

// ── Page ──────────────────────────────────────────────────

export default function MonetaryPage() {
  const total       = 4_212_500
  const interestYTD = 20_048

  return (
    <div>

      {/* ── Header ─────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 12, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, color: 'var(--cream)' }}>
            Monetary Holdings
          </div>
          <div style={{ fontSize: 10, color: 'var(--mist)', marginTop: 4, letterSpacing: '.05em' }}>
            {mockUser.id} · 4 cash accounts · Primary custody ZPF AG · Bahnhofstrasse 72, Zürich
          </div>
        </div>
        <button style={{
          fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--gold)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
          border: '1px solid var(--border2)', padding: '7px 14px', borderRadius: 20,
          background: 'transparent',
        }}>
          <Download size={12} /> Account Statement
        </button>
      </div>

      {/* ── Hero ───────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 28 }} className="mon-hero-grid">

        {/* Main value card */}
        <div style={{
          gridColumn: '1 / 3',
          background: 'linear-gradient(135deg,#0e2040 0%,#162d56 100%)',
          border: '1px solid var(--border2)', borderRadius: 'var(--radius-lg)',
          padding: '28px 32px', position: 'relative', overflow: 'hidden',
        }} className="mon-hero-main">
          <div style={{
            position: 'absolute', right: -10, bottom: -24,
            fontFamily: 'var(--font-display)', fontSize: 120, fontWeight: 600,
            color: 'rgba(196,164,74,0.05)', pointerEvents: 'none', letterSpacing: 4,
          }}>ZPF</div>
          <div style={{ fontSize: 9, letterSpacing: '.35em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 12 }}>
            Total Cash Holdings · as of today
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 400, color: 'var(--cream)', lineHeight: 1, marginBottom: 8 }}>
            <span style={{ fontSize: 22, color: 'var(--gold2)', marginRight: 8 }}>CHF</span>
            {total.toLocaleString('de-CH')}
          </div>
          <div style={{ fontSize: 12, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <TrendingUp size={13} />
            +CHF 49,500 (+1.2%) interest accrued — Q3 2025
          </div>
          <div style={{ fontSize: 10, color: 'var(--mist)', marginTop: 4 }}>
            4 accounts · CHF, EUR, USD, GBP denominations · All values shown in CHF
          </div>
        </div>

        {/* Mini: Interest YTD */}
        <div style={{
          background: 'var(--surf)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '22px 24px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--mist)' }}>
              Interest Income — YTD
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, color: 'var(--gold)', margin: '8px 0 4px' }}>
              +{interestYTD.toLocaleString('de-CH')}
            </div>
            <div style={{ fontSize: 10, color: 'var(--mist)' }}>CHF · Projected annual ≈ 72,000</div>
          </div>
          <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2, marginTop: 12, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '28%', background: 'var(--gold)', borderRadius: 2 }} />
          </div>
        </div>

        {/* Mini: Best yield — hidden at ≤1024px */}
        <div style={{
          background: 'var(--surf)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '22px 24px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }} className="mon-mini-yield">
          <div>
            <div style={{ fontSize: 9, letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--mist)' }}>
              Highest Yield Account
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, color: 'var(--green)', margin: '8px 0 4px' }}>
              4.85% p.a.
            </div>
            <div style={{ fontSize: 10, color: 'var(--mist)' }}>USD Fixed Deposit · Matures 15 Jul 2026</div>
          </div>
          <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2, marginTop: 12, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '88%', background: 'var(--green)', borderRadius: 2 }} />
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
              label="Cash Accounts"
              value="4 active"
              sub="2 current · 1 notice · 1 fixed deposit"
            />
            <StatCell
              label="Portfolio Weight"
              value="32.8% of total"
              sub={`CHF ${total.toLocaleString('de-CH')} of CHF 12,847,340`}
              divider
            />
            <StatCell
              label="Next Interest Payment"
              valueNode={
                <div style={{ fontSize: 12, color: 'var(--gold2)', marginTop: 5, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Calendar size={12} /> 01 Jul 2026
                </div>
              }
              sub="USD Fixed Deposit maturity + Q2 accrual"
              divider
            />
          </div>
        </div>
      </div>

      {/* ── Quick Actions ──────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 28 }} className="quick-actions-grid">
        {[
          { icon: <Send size={16} />,         label: 'Request Transfer' },
          { icon: <RefreshCw size={16} />,     label: 'Currency Exchange' },
          { icon: <DownloadCloud size={16} />, label: 'Download Statement' },
          { icon: <PhoneCall size={16} />,     label: 'Contact RM' },
        ].map(({ icon, label }) => (
          <button key={label} style={{
            background: 'var(--surf)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '16px 14px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            cursor: 'pointer',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: 'rgba(196,164,74,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--gold)',
            }}>
              {icon}
            </div>
            <div style={{ fontSize: 10, color: 'var(--mist)', textAlign: 'center', lineHeight: 1.4 }}>{label}</div>
          </button>
        ))}
      </div>

      {/* ── Account Breakdown header ────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 400, color: 'var(--cream)' }}>
          Account Breakdown
        </div>
        <div style={{ fontSize: 9, color: 'var(--mist)', letterSpacing: '.05em' }}>
          Values in CHF · Display currency configurable in Settings
        </div>
      </div>

      {/* ── Account cards ──────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14, marginBottom: 28 }} className="mon-accounts-grid">
        {mockMonetaryAccounts.map(acc => (
          <AccountCard key={acc.id} account={acc} />
        ))}
      </div>

      {/* ── Lower panels ───────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }} className="mon-lower-grid">

        {/* Holdings breakdown */}
        <Panel title={<><PieChart size={14} style={{ color: 'var(--gold)' }} /> Holdings Breakdown</>}>
          <div style={{ padding: '20px 22px' }}>
            {/* Stacked bar */}
            <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden', display: 'flex', marginBottom: 20 }}>
              {mockMonetaryAccounts.map(acc => (
                <div key={acc.id} style={{ width: `${acc.allocation}%`, height: '100%', background: acc.color }} />
              ))}
            </div>
            {mockMonetaryAccounts.map((acc, i) => (
              <div key={acc.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: i < mockMonetaryAccounts.length - 1 ? 12 : 0 }}>
                <div style={{ fontSize: 11, color: 'var(--mist)', width: 148, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: acc.color, flexShrink: 0 }} />
                  {acc.currency} — {acc.accountType.split(' ').slice(0, 2).join(' ')}
                </div>
                <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${acc.allocation}%`, background: acc.color, borderRadius: 3 }} />
                </div>
                <div style={{ fontSize: 11, color: 'var(--cream)', width: 38, textAlign: 'right', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
                  {acc.allocation}%
                </div>
                <div style={{ fontSize: 10, color: 'var(--mist)', width: 72, textAlign: 'right', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
                  {(acc.balanceCHF / 1000).toFixed(0)}K
                </div>
              </div>
            ))}
            {/* FX context note */}
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <RefreshCw size={10} style={{ color: 'var(--mist)', flexShrink: 0, marginTop: 1 }} />
              <div style={{ fontSize: 9, color: 'rgba(138,154,176,0.6)', lineHeight: 1.6 }}>
                EUR/CHF 0.9283 · USD/CHF 0.9031 · GBP/CHF 1.2571 · Rates as of 1 Apr 2026
              </div>
            </div>
          </div>
        </Panel>

        {/* Interest summary */}
        <Panel title={<><Percent size={14} style={{ color: 'var(--gold)' }} /> Interest Summary</>}>
          <div style={{ padding: '20px 22px' }}>
            {mockMonetaryAccounts.map((acc, i) => (
              <div key={acc.id} style={{ marginBottom: i < mockMonetaryAccounts.length - 1 ? 16 : 0 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 7, height: 7, borderRadius: 1, background: acc.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 11, color: 'var(--cream)' }}>{acc.currency} — {acc.accountType}</span>
                    </div>
                    <div style={{ fontSize: 9, color: 'var(--mist)', marginTop: 2, paddingLeft: 13 }}>
                      {acc.locked ? `Locked · ${acc.maturity}` : (acc.maturity ?? 'No notice required')}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, fontFamily: 'var(--font-mono)', fontWeight: 500, color: 'var(--gold)' }}>
                      {acc.interestRate.toFixed(2)}%
                    </div>
                    <div style={{ fontSize: 9, color: 'var(--mist)', marginTop: 1 }}>
                      YTD: {acc.currency} {acc.interestAccruedYTD.toLocaleString('de-CH')}
                    </div>
                  </div>
                </div>
                <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(acc.interestRate / 5.5 * 100, 100)}%`, height: '100%', background: acc.color, borderRadius: 2 }} />
                </div>
              </div>
            ))}
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, color: 'var(--cream)', fontWeight: 500 }}>Total YTD (CHF equiv.)</span>
              <span style={{ fontSize: 14, fontFamily: 'var(--font-mono)', fontWeight: 500, color: 'var(--gold)' }}>
                CHF {interestYTD.toLocaleString('de-CH')}
              </span>
            </div>
            <div style={{ fontSize: 9, color: 'var(--mist)', marginTop: 3, textAlign: 'right' }}>
              Projected annual income: ≈ CHF 72,000
            </div>
          </div>
        </Panel>
      </div>

      {/* ── Recent transactions ─────────────── */}
      <Panel title={<><Clock size={14} style={{ color: 'var(--gold)' }} /> Recent Transactions</>} action="Full history →">
        {mockMonetaryActivity.map((tx, i) => (
          <TxRow key={i} tx={tx} last={i === mockMonetaryActivity.length - 1} />
        ))}
      </Panel>

      {/* ── Disclaimer ──────────────────────── */}
      <div style={{
        fontSize: 9, color: 'rgba(138,154,176,0.5)', lineHeight: 1.7,
        borderTop: '1px solid var(--border)', paddingTop: 16, marginTop: 28,
      }}>
        All monetary holdings are held in custody with Zürichberg Privat Finanz AG, Bahnhofstrasse 72, 8001 Zürich.
        Exchange rates are indicative end-of-day rates and do not represent executable quotes.
        Interest rates are subject to variation; fixed deposits are governed by agreed contractual terms.
        CHF equivalents are computed at prevailing spot rates. Display currency is configurable in Account Settings.
        This statement is provided for informational purposes only and does not constitute financial advice.
      </div>

      {/* ── Responsive ──────────────────────── */}
      <style>{`
        @media (max-width: 1024px) {
          .mon-hero-grid      { grid-template-columns: 1fr 1fr !important; }
          .mon-hero-main      { grid-column: 1 / -1 !important; }
          .mon-mini-yield     { display: none !important; }
          .mon-accounts-grid  { grid-template-columns: 1fr !important; }
          .mon-lower-grid     { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .mon-hero-grid  { grid-template-columns: 1fr !important; }
          .mon-hero-main  { grid-column: auto !important; padding: 20px !important; }
          .quick-actions-grid { grid-template-columns: repeat(4,1fr) !important; gap: 8px !important; }
          .mon-lower-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 390px) {
          .quick-actions-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────

function AccountCard({ account }: { account: MonetaryAccount }) {
  return (
    <div style={{
      background: 'var(--navy)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', overflow: 'hidden',
    }}>
      {/* Top accent line in asset colour */}
      <div style={{ height: 2, background: account.color, opacity: 0.7 }} />

      <div style={{ padding: '20px 22px' }}>
        {/* Account type + currency */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 5 }}>
              {account.accountType}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: account.color }} />
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--cream)' }}>
                {account.currency} — {account.currencyName}
              </span>
            </div>
          </div>
          {account.locked && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, color: 'var(--mist)' }}>
              <Lock size={10} /> Locked
            </div>
          )}
        </div>

        {/* Balance — large serif */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 400, color: 'var(--cream)', lineHeight: 1 }}>
            {account.balance.toLocaleString('de-CH')}
          </div>
          {account.currency !== 'CHF' && (
            <div style={{ fontSize: 10, color: 'var(--gold2)', marginTop: 6 }}>
              ≈ CHF {account.balanceCHF.toLocaleString('de-CH')}
            </div>
          )}
        </div>

        {/* 3-col micro stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
          borderTop: '1px solid var(--border)', paddingTop: 14, marginBottom: 14,
        }}>
          <div style={{ paddingRight: 12, borderRight: '1px solid var(--border)' }}>
            <div style={{ fontSize: 8, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 4 }}>
              {account.currency !== 'CHF' ? `${account.currency}/CHF` : 'Base'}
            </div>
            <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--cream)' }}>
              {account.currency !== 'CHF' ? account.fxRate.toFixed(4) : '1.0000'}
            </div>
          </div>
          <div style={{ paddingLeft: 12, paddingRight: 12, borderRight: '1px solid var(--border)' }}>
            <div style={{ fontSize: 8, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 4 }}>
              Rate p.a.
            </div>
            <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--gold)' }}>
              {account.interestRate.toFixed(2)}%
            </div>
          </div>
          <div style={{ paddingLeft: 12 }}>
            <div style={{ fontSize: 8, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 4 }}>
              YTD Income
            </div>
            <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--green)' }}>
              +{account.interestAccruedYTD.toLocaleString('de-CH')}
            </div>
          </div>
        </div>

        {/* Footer — account ref + maturity */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 9, color: 'rgba(138,154,176,0.4)', fontFamily: 'var(--font-mono)', letterSpacing: '.06em' }}>
              {account.accountNumber}
            </div>
            {(account.maturity || account.locked) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                {account.locked
                  ? <Lock size={8} style={{ color: '#5BA3E0' }} />
                  : <Clock size={8} style={{ color: 'var(--mist)' }} />}
                <span style={{ fontSize: 8, color: account.locked ? '#5BA3E0' : 'var(--mist)' }}>
                  {account.maturity}
                </span>
              </div>
            )}
          </div>
          <div style={{ fontSize: 8, color: 'var(--mist)' }}>ZPF AG</div>
        </div>
      </div>
    </div>
  )
}

function TxRow({ tx, last }: { tx: MonetaryTransaction; last: boolean }) {
  const displayAmount = tx.amount > 0
    ? `+${tx.amount.toLocaleString('de-CH')}`
    : tx.amount < 0
      ? tx.amount.toLocaleString('de-CH')
      : null

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '13px 22px',
      borderBottom: last ? 'none' : '1px solid rgba(196,164,74,0.06)',
      cursor: 'pointer',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        ...TX_STYLE[tx.type],
      }}>
        {TX_ICON[tx.type]}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, color: 'var(--cream)' }}>{tx.name}</div>
        <div style={{ fontSize: 10, color: 'var(--mist)', marginTop: 2 }}>{tx.date} · {tx.detail}</div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        {displayAmount ? (
          <>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 12,
              color: tx.direction === 'up' ? 'var(--green)' : tx.direction === 'down' ? 'var(--red)' : 'var(--mist)',
            }}>
              {displayAmount}
            </div>
            <div style={{ fontSize: 9, color: 'var(--mist)', marginTop: 2 }}>{tx.currency}</div>
          </>
        ) : (
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--mist)' }}>—</div>
        )}
      </div>
    </div>
  )
}

function Panel({ title, action, children }: {
  title: React.ReactNode; action?: string; children: React.ReactNode
}) {
  return (
    <div style={{ background: 'var(--navy)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--cream)', display: 'flex', alignItems: 'center', gap: 8 }}>
          {title}
        </div>
        {action && (
          <div style={{ fontSize: 10, color: 'var(--gold)', letterSpacing: '.1em', cursor: 'pointer' }}>{action}</div>
        )}
      </div>
      {children}
    </div>
  )
}

function StatCell({ label, value, sub, valueNode, divider }: {
  label: string; value?: string; sub?: string; valueNode?: React.ReactNode; divider?: boolean
}) {
  return (
    <div style={{ paddingLeft: divider ? 24 : 0, borderLeft: divider ? '1px solid var(--border)' : 'none' }}>
      <div style={{ fontSize: 9, letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--mist)' }}>{label}</div>
      {valueNode ?? <div style={{ fontSize: 12, color: 'var(--cream)', marginTop: 5, fontWeight: 500 }}>{value}</div>}
      {sub && <div style={{ fontSize: 10, color: 'var(--mist)', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}
