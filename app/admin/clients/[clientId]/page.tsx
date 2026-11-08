'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft, Lock, Unlock, RefreshCw, Mail,
  ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle,
  TrendingUp, FileText, Clock, ChevronRight,
} from 'lucide-react'
import {
  mockAdminClients,
  mockAdminTransfers,
  mockAuditLog,
  type AdminClientRow,
} from '@/lib/admin-mock-data'
import {
  mockUser,
  mockPortfolio,
  mockAssets,
  mockVaultDocuments,
  mockActivity,
} from '@/lib/mock-data'

// ── Helpers ────────────────────────────────────────────────────────────────────

const FULL_CLIENT_ID = 'ZPF-7741-0038'

function fmtChf(n: number) {
  if (n >= 1_000_000) return `CHF ${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000)     return `CHF ${(n / 1_000).toFixed(0)}K`
  return `CHF ${n.toLocaleString()}`
}

function relTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3_600_000)
  if (h < 1)  return 'Just now'
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 30) return `${d}d ago`
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const KYC_STYLE: Record<string, { bg: string; color: string; icon: React.ReactNode }> = {
  VERIFIED: { bg: 'rgba(29,158,117,0.12)',  color: '#4ecda4',  icon: <ShieldCheck size={13} /> },
  PENDING:  { bg: 'rgba(196,164,74,0.12)',  color: '#c4a44a',  icon: <ShieldAlert size={13} /> },
  EXPIRED:  { bg: 'rgba(216,90,48,0.12)',   color: '#f0997b',  icon: <AlertTriangle size={13} /> },
}
const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  ACTIVE: { bg: 'rgba(29,158,117,0.1)',  color: '#4ecda4' },
  LOCKED: { bg: 'rgba(216,90,48,0.1)',   color: '#f0997b' },
}
const TRANSFER_COLORS: Record<string, { bg: string; color: string }> = {
  PENDING_REVIEW:    { bg: 'rgba(196,164,74,0.12)',  color: '#c4a44a' },
  UNDER_REVIEW:      { bg: 'rgba(55,138,221,0.12)',  color: '#6aaee8' },
  AWAITING_COUNTER:  { bg: 'rgba(127,119,221,0.12)', color: '#afa9ec' },
  APPROVED:          { bg: 'rgba(29,158,117,0.12)',  color: '#4ecda4' },
  EXECUTED:          { bg: 'rgba(138,154,176,0.1)',  color: '#8a9ab0' },
  REJECTED:          { bg: 'rgba(216,90,48,0.12)',   color: '#f0997b' },
}

const DOC_STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  secured: { bg: 'rgba(29,158,117,0.12)',  color: '#4ecda4' },
  sealed:  { bg: 'rgba(196,164,74,0.12)',  color: '#c4a44a' },
  review:  { bg: 'rgba(216,90,48,0.12)',   color: '#f0997b' },
  pending: { bg: 'rgba(138,154,176,0.1)',  color: '#8a9ab0' },
}

// ── Tabs ───────────────────────────────────────────────────────────────────────

type Tab = 'overview' | 'portfolio' | 'transfers' | 'documents' | 'activity'
const TABS: { id: Tab; label: string }[] = [
  { id: 'overview',   label: 'Overview' },
  { id: 'portfolio',  label: 'Portfolio' },
  { id: 'transfers',  label: 'Transfers' },
  { id: 'documents',  label: 'Documents' },
  { id: 'activity',   label: 'Activity' },
]

// ── Page ───────────────────────────────────────────────────────────────────────

export default function ClientProfilePage() {
  const { clientId } = useParams<{ clientId: string }>()
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('overview')

  const client = mockAdminClients.find(c => c.clientId === clientId)
  if (!client) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', color: '#8a9ab0' }}>
        <AlertTriangle size={32} style={{ marginBottom: 12, opacity: 0.4 }} />
        <div style={{ fontSize: 15 }}>Client not found</div>
        <button onClick={() => router.push('/admin/clients')} style={{ marginTop: 16, color: '#c4a44a', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>
          ← Back to Clients
        </button>
      </div>
    )
  }

  const isFull = client.clientId === FULL_CLIENT_ID
  const kyc    = KYC_STYLE[client.kycStatus]    ?? KYC_STYLE.PENDING
  const status = STATUS_STYLE[client.accountStatus] ?? STATUS_STYLE.ACTIVE

  const clientTransfers = mockAdminTransfers.filter(t => t.clientId === clientId)
  const clientAudit     = mockAuditLog.filter(e => e.clientId === clientId)

  return (
    <div style={{ maxWidth: 1000 }}>

      {/* Back + actions header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <button
            onClick={() => router.push('/admin/clients')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12,
              background: 'none', border: 'none', color: '#8a9ab0', cursor: 'pointer', fontSize: 12, padding: 0,
            }}
          >
            <ArrowLeft size={13} />
            All Clients
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: 'rgba(196,164,74,0.1)', border: '1.5px solid rgba(196,164,74,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontSize: 15, color: '#c4a44a', flexShrink: 0,
            }}>
              {client.fullName.split(' ').map(p => p[0]).join('').slice(0,2)}
            </div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 400, color: '#e8dcc8', fontFamily: 'var(--font-display)', margin: 0 }}>{client.fullName}</h1>
              <div style={{ fontSize: 12, color: '#8a9ab0', marginTop: 3 }}>
                {client.clientId} · {client.ownerAdminName} · {client.mandateType} mandate
              </div>
            </div>
          </div>
        </div>
        {/* Quick actions */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ ...status, padding: '4px 10px', borderRadius: 4, fontSize: 11, fontWeight: 600, letterSpacing: '.05em', border: `1px solid ${status.color}22` }}>
            {client.accountStatus}
          </span>
          <button style={actionBtn}>
            <Mail size={13} />
            Message
          </button>
          {client.accountStatus === 'ACTIVE' ? (
            <button style={{ ...actionBtn, color: '#f0997b', borderColor: 'rgba(216,90,48,0.25)' }}>
              <Lock size={13} />
              Lock
            </button>
          ) : (
            <button style={{ ...actionBtn, color: '#4ecda4', borderColor: 'rgba(29,158,117,0.25)' }}>
              <Unlock size={13} />
              Unlock
            </button>
          )}
          <button style={{ ...actionBtn, color: '#afa9ec', borderColor: 'rgba(127,119,221,0.25)' }}>
            <RefreshCw size={13} />
            Reassign RM
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 24, borderBottom: '1px solid rgba(196,164,74,0.1)', paddingBottom: 0, overflowX: 'auto' }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '8px 16px', fontSize: 12, fontWeight: 500, cursor: 'pointer',
              background: 'none', border: 'none',
              color: tab === t.id ? '#c4a44a' : '#8a9ab0',
              borderBottom: tab === t.id ? '2px solid #c4a44a' : '2px solid transparent',
              marginBottom: -1, whiteSpace: 'nowrap',
              transition: 'color .15s',
            }}
          >
            {t.label}
            {t.id === 'transfers' && clientTransfers.length > 0 && (
              <span style={{ marginLeft: 6, padding: '1px 5px', borderRadius: 10, fontSize: 9, fontWeight: 700, background: 'rgba(196,164,74,0.15)', color: '#c4a44a' }}>
                {clientTransfers.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'overview'  && <OverviewTab client={client} isFull={isFull} kyc={kyc} />}
      {tab === 'portfolio' && <PortfolioTab isFull={isFull} />}
      {tab === 'transfers' && <TransfersTab transfers={clientTransfers} />}
      {tab === 'documents' && <DocumentsTab isFull={isFull} />}
      {tab === 'activity'  && <ActivityTab entries={clientAudit} isFull={isFull} />}
    </div>
  )
}

const actionBtn: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 5,
  padding: '7px 12px', borderRadius: 6, fontSize: 11, fontWeight: 500, cursor: 'pointer',
  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(196,164,74,0.12)',
  color: '#8a9ab0',
}

// ── Overview Tab ───────────────────────────────────────────────────────────────

function OverviewTab({ client, isFull, kyc }: {
  client: AdminClientRow
  isFull: boolean
  kyc: { bg: string; color: string; icon: React.ReactNode }
}) {
  const user = isFull ? mockUser : null
  const portfolio = isFull ? mockPortfolio : null

  return (
    <div style={{ display: 'flex', gap: 20, flexDirection: 'column' }}>
      {/* Stats strip */}
      <div className="client-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        <StatCard label="AUM" value={fmtChf(client.aum)} sub={portfolio ? `+${mockPortfolio.change.percent}% ${mockPortfolio.change.label}` : undefined} accent />
        <StatCard label="KYC Status" value={client.kycStatus} valueBg={kyc.bg} valueColor={kyc.color} sub={isFull ? 'Verified 14 Mar 2022 · Exp. 14 Mar 2027' : undefined} />
        <StatCard label="Risk Profile" value={client.riskProfile} sub={`${client.mandateType} Mandate`} />
      </div>

      {/* Two-column detail */}
      <div className="client-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Account info */}
        <Section title="Account Details">
          <Field label="Client ID"     value={client.clientId} mono />
          <Field label="Full Name"     value={isFull ? mockUser.fullName  : client.fullName} />
          {isFull && <Field label="Nationality"  value={mockUser.nationality} />}
          {isFull && <Field label="Domicile"     value={mockUser.domicile} />}
          {isFull && <Field label="Date of Birth" value={mockUser.dateOfBirth} />}
          {isFull && <Field label="Email"         value={mockUser.email} mono />}
          <Field label="Onboarded"    value={fmtDate(client.onboardedAt)} />
          <Field label="RM"           value={client.ownerAdminName} />
          <Field label="Mandate Type" value={client.mandateType} />
          <Field label="Last Login"   value={relTime(client.lastLoginAt)} />
        </Section>

        {/* KYC & compliance */}
        <Section title="KYC & Compliance">
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px',
            borderRadius: 6, background: kyc.bg, border: `1px solid ${kyc.color}33`,
            marginBottom: 14,
          }}>
            <span style={{ color: kyc.color }}>{kyc.icon}</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: kyc.color }}>{client.kycStatus}</div>
              {isFull && <div style={{ fontSize: 11, color: '#8a9ab0', marginTop: 2 }}>Verified 14 Mar 2022 · Expires 14 Mar 2027</div>}
            </div>
          </div>
          {isFull && (
            <>
              <Field label="Account Status" value={mockUser.accountStatus} />
              <Field label="Risk Profile"   value={mockUser.riskProfile} />
              <Field label="Mandate"        value={`${mockUser.mandateType} · Revised ${mockUser.mandateRevisedAt}`} />
            </>
          )}
          <Field label="Account Status" value={client.accountStatus} />
          {client.kycStatus === 'EXPIRED' && (
            <div style={{
              marginTop: 10, padding: '10px 12px', borderRadius: 6,
              background: 'rgba(216,90,48,0.08)', border: '1px solid rgba(216,90,48,0.2)',
              display: 'flex', gap: 8, alignItems: 'flex-start',
            }}>
              <AlertTriangle size={13} style={{ color: '#f0997b', marginTop: 1, flexShrink: 0 }} />
              <div style={{ fontSize: 11, color: '#f0997b' }}>
                KYC has expired. Client portal access may be restricted until documents are renewed.
              </div>
            </div>
          )}
        </Section>
      </div>

      {/* Activity preview (full client only) */}
      {isFull && (
        <Section title="Recent Activity">
          {mockActivity.map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < mockActivity.length - 1 ? '1px solid rgba(196,164,74,0.06)' : 'none' }}>
              <div style={{ width: 30, height: 30, borderRadius: 6, ...a.iconStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <TrendingUp size={13} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, color: '#e8dcc8' }}>{a.name}</div>
                <div style={{ fontSize: 11, color: '#8a9ab0', marginTop: 2 }}>{a.date}</div>
              </div>
              <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: a.valueCls === 'up' ? '#4ecda4' : a.valueCls === 'dn' ? '#f0997b' : '#8a9ab0', flexShrink: 0 }}>
                {a.value}
              </div>
            </div>
          ))}
        </Section>
      )}
    </div>
  )
}

// ── Portfolio Tab ──────────────────────────────────────────────────────────────

function PortfolioTab({ isFull }: { isFull: boolean }) {
  if (!isFull) {
    return <PlaceholderNote message="Full portfolio detail is only available for clients with rich data loaded. Other clients will show their portfolio here once data is available." />
  }

  const total = mockPortfolio.totalValue

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Summary strip */}
      <div style={{ display: 'flex', gap: 20, padding: '16px 20px', borderRadius: 8, background: 'rgba(196,164,74,0.04)', border: '1px solid rgba(196,164,74,0.1)', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 10, color: '#8a9ab0', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 4 }}>Total AUM</div>
          <div style={{ fontSize: 22, fontFamily: 'var(--font-display)', color: '#e8dcc8' }}>CHF {total.toLocaleString()}</div>
        </div>
        <div style={{ width: 1, background: 'rgba(196,164,74,0.1)', alignSelf: 'stretch' }} />
        <div>
          <div style={{ fontSize: 10, color: '#8a9ab0', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 4 }}>Quarter Change</div>
          <div style={{ fontSize: 16, color: '#4ecda4', fontFamily: 'var(--font-mono)' }}>+{mockPortfolio.change.percent}%</div>
          <div style={{ fontSize: 11, color: '#8a9ab0' }}>+CHF {mockPortfolio.change.amount.toLocaleString()}</div>
        </div>
        <div style={{ width: 1, background: 'rgba(196,164,74,0.1)', alignSelf: 'stretch' }} />
        <div>
          <div style={{ fontSize: 10, color: '#8a9ab0', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 4 }}>Unrealised Gain</div>
          <div style={{ fontSize: 16, color: '#4ecda4', fontFamily: 'var(--font-mono)' }}>+{mockPortfolio.unrealisedGain.percent}%</div>
          <div style={{ fontSize: 11, color: '#8a9ab0' }}>CHF {mockPortfolio.unrealisedGain.amount.toLocaleString()}</div>
        </div>
        <div style={{ width: 1, background: 'rgba(196,164,74,0.1)', alignSelf: 'stretch' }} />
        <div>
          <div style={{ fontSize: 10, color: '#8a9ab0', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 4 }}>Custodian</div>
          <div style={{ fontSize: 13, color: '#e8dcc8' }}>{mockPortfolio.custodian.name}</div>
          <div style={{ fontSize: 11, color: '#8a9ab0' }}>{mockPortfolio.custodian.address}</div>
        </div>
      </div>

      {/* Asset classes */}
      <Section title="Asset Classes">
        {mockAssets.filter(a => a.value > 0).map((asset, i, arr) => {
          const pct = asset.allocation
          return (
            <div key={asset.id} style={{ padding: '12px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(196,164,74,0.06)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: asset.color, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 13, color: '#e8dcc8', fontWeight: 500 }}>{asset.name}</span>
                    <span style={{ fontSize: 13, color: '#e8dcc8', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
                      {asset.currency} {asset.value.toLocaleString()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ flex: 1, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.06)' }}>
                      <div style={{ width: `${pct}%`, height: '100%', borderRadius: 2, background: asset.color, opacity: 0.8 }} />
                    </div>
                    <span style={{ fontSize: 11, color: '#8a9ab0', flexShrink: 0 }}>{pct}%</span>
                    <span style={{ fontSize: 11, color: asset.change.direction === 'up' ? '#4ecda4' : asset.change.direction === 'down' ? '#f0997b' : '#8a9ab0', flexShrink: 0 }}>
                      {asset.change.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </Section>
    </div>
  )
}

// ── Transfers Tab ──────────────────────────────────────────────────────────────

function TransfersTab({ transfers }: { transfers: typeof mockAdminTransfers }) {
  if (transfers.length === 0) {
    return <PlaceholderNote message="No transfers on record for this client." />
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {transfers.map(t => {
        const c = TRANSFER_COLORS[t.status] ?? TRANSFER_COLORS.PENDING_REVIEW
        return (
          <div key={t.id} style={{ padding: '16px 18px', borderRadius: 8, border: '1px solid rgba(196,164,74,0.1)', background: 'rgba(255,255,255,0.015)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: '#8a9ab0' }}>{t.id}</span>
                  <span style={{ padding: '2px 7px', borderRadius: 4, fontSize: 10, fontWeight: 600, letterSpacing: '.05em', background: c.bg, color: c.color }}>
                    {t.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <div style={{ fontSize: 15, color: '#e8dcc8', fontWeight: 500 }}>
                  {t.currency} {t.amount.toLocaleString()} → {t.beneficiaryName}
                </div>
                <div style={{ fontSize: 12, color: '#8a9ab0', marginTop: 4 }}>
                  {t.bankName} · {t.maskedIban} · {t.beneficiaryCountry}
                </div>
                {t.reference && (
                  <div style={{ fontSize: 11, color: '#8a9ab0', marginTop: 3 }}>Ref: {t.reference}</div>
                )}
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 14, color: '#e8dcc8', fontFamily: 'var(--font-mono)' }}>{fmtChf(t.amountChf)}</div>
                <div style={{ fontSize: 11, color: '#8a9ab0', marginTop: 2 }}>{relTime(t.submittedAt)}</div>
                <div style={{ fontSize: 11, color: '#8a9ab0' }}>{t.ownerAdminName}</div>
              </div>
            </div>
            {t.settlementRef && (
              <div style={{ marginTop: 10, padding: '6px 10px', borderRadius: 5, background: 'rgba(29,158,117,0.06)', border: '1px solid rgba(29,158,117,0.15)', fontSize: 11, color: '#4ecda4' }}>
                Settlement ref: {t.settlementRef}
              </div>
            )}
            {t.rejectionReason && (
              <div style={{ marginTop: 10, padding: '6px 10px', borderRadius: 5, background: 'rgba(216,90,48,0.06)', border: '1px solid rgba(216,90,48,0.15)', fontSize: 11, color: '#f0997b' }}>
                Rejection reason: {t.rejectionReason}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Documents Tab ──────────────────────────────────────────────────────────────

function DocumentsTab({ isFull }: { isFull: boolean }) {
  if (!isFull) {
    return <PlaceholderNote message="Full document vault is only available for clients with document data loaded." />
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {mockVaultDocuments.map(doc => {
        const ds = DOC_STATUS_STYLE[doc.status] ?? DOC_STATUS_STYLE.pending
        return (
          <div key={doc.id} style={{ padding: '14px 16px', borderRadius: 8, border: '1px solid rgba(196,164,74,0.1)', background: 'rgba(255,255,255,0.015)', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 6, background: 'rgba(196,164,74,0.08)', border: '1px solid rgba(196,164,74,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FileText size={14} style={{ color: '#c4a44a' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                <div style={{ fontSize: 13, color: '#e8dcc8', fontWeight: 500 }}>{doc.name}</div>
                <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600, background: ds.bg, color: ds.color, flexShrink: 0 }}>
                  {doc.statusLabel}
                </span>
              </div>
              <div style={{ fontSize: 11, color: '#8a9ab0', marginTop: 3 }}>
                Ref: {doc.ref} · Lodged {doc.lodgedDate} · {doc.jurisdiction}
                {doc.pages && ` · ${doc.pages}pp`}
              </div>
              {doc.reviewDate && (
                <div style={{ fontSize: 11, color: doc.status === 'review' ? '#f0997b' : '#8a9ab0', marginTop: 2 }}>
                  Review: {doc.reviewDate}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Activity Tab ───────────────────────────────────────────────────────────────

const ACTION_LABELS: Record<string, string> = {
  TRANSACTION_ADDED:    'Transaction added',
  TRANSFER_APPROVED:    'Transfer approved',
  TRANSFER_REJECTED:    'Transfer rejected',
  TRANSFER_EXECUTED:    'Transfer executed',
  TRANSFER_COUNTER_APPROVED: 'Counter-approval',
  CLIENT_CREATED:       'Account created',
  CLIENT_LOCKED:        'Account locked',
  CLIENT_UNLOCKED:      'Account unlocked',
  CLIENT_REASSIGNED:    'RM reassigned',
  KYC_STATUS_CHANGED:   'KYC status changed',
  RISK_PROFILE_CHANGED: 'Risk profile changed',
  DOCUMENT_UPLOADED:    'Document uploaded',
  DOCUMENT_SEALED:      'Document sealed',
  MESSAGE_SENT:         'Message sent',
  THREAD_RESOLVED:      'Thread resolved',
}

const ROLE_DOT: Record<string, string> = {
  SUPER_ADMIN: '#c4a44a',
  MAJOR_ADMIN: '#6aaee8',
  ADMIN:       '#4ecda4',
}

function ActivityTab({ entries, isFull }: { entries: typeof mockAuditLog; isFull: boolean }) {
  const items = isFull && entries.length === 0 ? mockAuditLog.filter(e => e.clientId === FULL_CLIENT_ID) : entries

  if (items.length === 0) {
    return <PlaceholderNote message="No audit activity recorded for this client yet." />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {items.map((e, i) => (
        <div key={e.id} style={{ display: 'flex', gap: 14, padding: '12px 0', borderBottom: i < items.length - 1 ? '1px solid rgba(196,164,74,0.06)' : 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 4, flexShrink: 0, width: 16 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: ROLE_DOT[e.adminRole] ?? '#8a9ab0', flexShrink: 0 }} />
            {i < items.length - 1 && <div style={{ flex: 1, width: 1, background: 'rgba(196,164,74,0.08)', marginTop: 4 }} />}
          </div>
          <div style={{ flex: 1, minWidth: 0, paddingBottom: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: '#e8dcc8', fontWeight: 500 }}>
                {ACTION_LABELS[e.action] ?? e.action.replace(/_/g, ' ')}
              </span>
              {e.entityId && <span style={{ fontSize: 11, color: '#8a9ab0', fontFamily: 'var(--font-mono)' }}>{e.entityId}</span>}
            </div>
            <div style={{ fontSize: 11, color: '#8a9ab0', marginTop: 2 }}>
              {e.adminName} · {new Date(e.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} · {e.ipAddress}
            </div>
            {e.notes && <div style={{ fontSize: 11, color: '#8a9ab0', marginTop: 3 }}>{e.notes}</div>}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Shared primitives ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: '18px 20px', borderRadius: 8, border: '1px solid rgba(196,164,74,0.1)', background: 'rgba(255,255,255,0.015)' }}>
      <div style={{ fontSize: 10, fontWeight: 600, color: '#8a9ab0', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 14 }}>{title}</div>
      {children}
    </div>
  )
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '6px 0', borderBottom: '1px solid rgba(196,164,74,0.04)' }}>
      <span style={{ fontSize: 12, color: '#8a9ab0', flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 12, color: '#e8dcc8', fontFamily: mono ? 'var(--font-mono)' : undefined, textAlign: 'right' }}>{value}</span>
    </div>
  )
}

function StatCard({ label, value, sub, accent, valueBg, valueColor }: { label: string; value: string; sub?: string; accent?: boolean; valueBg?: string; valueColor?: string }) {
  return (
    <div style={{ padding: '16px 18px', borderRadius: 8, border: `1px solid ${accent ? 'rgba(196,164,74,0.18)' : 'rgba(196,164,74,0.08)'}`, background: accent ? 'rgba(196,164,74,0.04)' : 'rgba(255,255,255,0.015)' }}>
      <div style={{ fontSize: 10, color: '#8a9ab0', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
      {valueBg ? (
        <span style={{ padding: '3px 9px', borderRadius: 4, fontSize: 13, fontWeight: 600, background: valueBg, color: valueColor }}>{value}</span>
      ) : (
        <div style={{ fontSize: 15, color: accent ? '#c4a44a' : '#e8dcc8', fontFamily: accent ? 'var(--font-display)' : undefined, fontWeight: 500 }}>{value}</div>
      )}
      {sub && <div style={{ fontSize: 11, color: '#8a9ab0', marginTop: 6 }}>{sub}</div>}
    </div>
  )
}

function PlaceholderNote({ message }: { message: string }) {
  return (
    <div style={{ padding: '32px 20px', textAlign: 'center', color: '#8a9ab0', fontSize: 13, border: '1px dashed rgba(196,164,74,0.12)', borderRadius: 8 }}>
      {message}
    </div>
  )
}
