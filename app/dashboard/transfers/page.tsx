'use client'

import { useState } from 'react'
import {
  ArrowLeftRight, ArrowUpRight, RefreshCw, Building2,
  CircleCheck, Clock, CircleX, ChevronDown, ChevronUp,
  AlertTriangle, Info, Send, FilePlus,
} from 'lucide-react'
import {
  mockTransferRequests, mockMonetaryAccounts,
  type TransferRequest, type TransferStatus, type TransferType,
} from '@/lib/mock-data'

const STATUS_META: Record<TransferStatus, { label: string; bg: string; color: string; icon: React.ReactNode }> = {
  'pending-approval': { label: 'Pending approval', bg: 'rgba(196,164,74,0.12)',  color: '#dfc27a',  icon: <Clock size={10} /> },
  'approved':         { label: 'Approved',          bg: 'rgba(55,138,221,0.12)',  color: '#6aaee8',  icon: <CircleCheck size={10} /> },
  'processing':       { label: 'Processing',         bg: 'rgba(127,119,221,0.12)', color: '#afa9ec',  icon: <RefreshCw size={10} /> },
  'completed':        { label: 'Completed',          bg: 'rgba(29,158,117,0.12)',  color: '#4ecda4',  icon: <CircleCheck size={10} /> },
  'rejected':         { label: 'Rejected',           bg: 'rgba(192,57,43,0.12)',   color: '#f0997b',  icon: <CircleX size={10} /> },
}

const TYPE_META: Record<TransferType, { label: string; icon: React.ReactNode; color: string }> = {
  swift:    { label: 'SWIFT',    icon: <ArrowUpRight size={13} />, color: '#378ADD' },
  sepa:     { label: 'SEPA',     icon: <ArrowUpRight size={13} />, color: '#4A90D9' },
  internal: { label: 'Internal', icon: <ArrowLeftRight size={13} />, color: '#1D9E75' },
  fx:       { label: 'FX',       icon: <RefreshCw size={13} />,    color: '#C4A44A' },
}

const CURRENCIES = ['CHF', 'EUR', 'USD', 'GBP']

type FormStep = 'details' | 'review' | 'submitted'

export default function TransfersPage() {
  const [showForm,  setShowForm]  = useState(false)
  const [step,      setStep]      = useState<FormStep>('details')
  const [expanded,  setExpanded]  = useState<string | null>(null)

  // form state
  const [fromAcc,   setFromAcc]   = useState(mockMonetaryAccounts[0].id)
  const [toName,    setToName]    = useState('')
  const [toIban,    setToIban]    = useState('')
  const [toBank,    setToBank]    = useState('')
  const [toCountry, setToCountry] = useState('')
  const [amount,    setAmount]    = useState('')
  const [currency,  setCurrency]  = useState('CHF')
  const [valueDate, setValueDate] = useState('')
  const [purpose,   setPurpose]   = useState('')
  const [txType,    setTxType]    = useState<TransferType>('swift')

  const pending   = mockTransferRequests.filter(t => t.status === 'pending-approval' || t.status === 'approved')
  const history   = mockTransferRequests.filter(t => t.status === 'completed' || t.status === 'rejected')

  const fromAccount = mockMonetaryAccounts.find(a => a.id === fromAcc)!

  const formValid = toName && toIban && amount && purpose && valueDate

  function handleSubmit() { setStep('review') }
  function handleConfirm() { setStep('submitted'); setShowForm(false); setStep('details') }

  return (
    <div>
      {/* ── Header ─────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 12, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, color: 'var(--cream)' }}>
            Transfer Requests
          </div>
          <div style={{ fontSize: 10, color: 'var(--mist)', marginTop: 4, letterSpacing: '.05em' }}>
            ZPF-7741-0038 · All transfers subject to ZPF compliance review and RM authorisation
          </div>
        </div>
        <button
          onClick={() => { setShowForm(v => !v); setStep('details') }}
          style={{
            fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase',
            color: showForm ? 'var(--mist)' : 'var(--navy)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
            border: '1px solid var(--border2)', padding: '7px 14px', borderRadius: 20,
            background: showForm ? 'transparent' : 'var(--gold)',
          }}
        >
          <Send size={12} /> {showForm ? 'Cancel' : 'New Request'}
        </button>
      </div>

      {/* ── Policy notice ───────────────────── */}
      <div style={{
        display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 16px',
        background: 'rgba(55,138,221,0.05)', border: '1px solid rgba(55,138,221,0.18)',
        borderRadius: 'var(--radius-lg)', marginBottom: 20,
      }}>
        <Info size={14} style={{ color: '#6aaee8', flexShrink: 0, marginTop: 1 }} />
        <div style={{ fontSize: 10, color: 'rgba(244,239,230,0.55)', lineHeight: 1.6 }}>
          All outbound transfer requests are reviewed by ZPF compliance and require authorisation from your Relationship Manager.
          Standard processing is <span style={{ color: 'var(--cream)' }}>T+1 to T+2</span> for approved transfers.
          SWIFT transfers to high-risk jurisdictions are subject to enhanced due diligence.
        </div>
      </div>

      {/* ── New request form ────────────────── */}
      {showForm && step === 'details' && (
        <div style={{
          background: 'var(--navy)', border: '1px solid var(--border2)',
          borderRadius: 'var(--radius-lg)', marginBottom: 20, overflow: 'hidden',
        }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Send size={14} style={{ color: 'var(--gold)' }} />
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--cream)' }}>New Transfer Request</span>
          </div>

          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Transfer type */}
            <div>
              <FieldLabel>Transfer Type</FieldLabel>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {(['swift', 'sepa', 'internal', 'fx'] as TransferType[]).map(t => (
                  <button key={t} onClick={() => setTxType(t)} style={{
                    padding: '7px 16px', borderRadius: 8, fontSize: 11, fontWeight: 500, cursor: 'pointer', border: 'none',
                    background: txType === t ? 'rgba(196,164,74,0.15)' : 'rgba(255,255,255,0.04)',
                    color: txType === t ? 'var(--gold)' : 'var(--mist)',
                    outline: txType === t ? '1px solid rgba(196,164,74,0.3)' : 'none',
                  }}>
                    {TYPE_META[t].label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="form-grid">
              {/* Debit account */}
              <div>
                <FieldLabel>Debit Account</FieldLabel>
                <select
                  value={fromAcc}
                  onChange={e => setFromAcc(e.target.value)}
                  style={selectStyle}
                >
                  {mockMonetaryAccounts.filter(a => !a.locked).map(a => (
                    <option key={a.id} value={a.id}>
                      {a.currency} {a.accountType} — {(a.balance / 1000).toFixed(0)}K available
                    </option>
                  ))}
                </select>
                <div style={{ fontSize: 9, color: 'var(--mist)', marginTop: 5 }}>
                  Available: {fromAccount.currency} {fromAccount.balance.toLocaleString()}
                  {fromAccount.locked && ' · Locked — cannot debit'}
                </div>
              </div>

              {/* Beneficiary name */}
              <div>
                <FieldLabel>Beneficiary Name</FieldLabel>
                <input value={toName} onChange={e => setToName(e.target.value)}
                  placeholder="Full legal name of recipient" style={inputStyle} />
              </div>

              {/* IBAN */}
              <div>
                <FieldLabel>IBAN / Account Number</FieldLabel>
                <input value={toIban} onChange={e => setToIban(e.target.value)}
                  placeholder="e.g. CH56 0483 5012 3456 7800 9" style={inputStyle} />
              </div>

              {/* Bank */}
              <div>
                <FieldLabel>Beneficiary Bank</FieldLabel>
                <input value={toBank} onChange={e => setToBank(e.target.value)}
                  placeholder="Bank name and branch" style={inputStyle} />
              </div>

              {/* Amount + currency */}
              <div>
                <FieldLabel>Amount</FieldLabel>
                <div style={{ display: 'flex', gap: 8 }}>
                  <select value={currency} onChange={e => setCurrency(e.target.value)}
                    style={{ ...selectStyle, width: 90, flexShrink: 0 }}>
                    {CURRENCIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                  <input value={amount} onChange={e => setAmount(e.target.value)}
                    placeholder="0.00" type="number" style={{ ...inputStyle, flex: 1 }} />
                </div>
              </div>

              {/* Value date */}
              <div>
                <FieldLabel>Requested Value Date</FieldLabel>
                <input value={valueDate} onChange={e => setValueDate(e.target.value)}
                  type="date" style={inputStyle} />
              </div>

              {/* Country */}
              <div>
                <FieldLabel>Destination Country</FieldLabel>
                <input value={toCountry} onChange={e => setToCountry(e.target.value)}
                  placeholder="e.g. United Kingdom" style={inputStyle} />
              </div>

              {/* Purpose */}
              <div>
                <FieldLabel>Payment Purpose / Reference</FieldLabel>
                <input value={purpose} onChange={e => setPurpose(e.target.value)}
                  placeholder="e.g. Investment capital repatriation" style={inputStyle} />
              </div>
            </div>

            {/* Supporting docs */}
            <div>
              <FieldLabel>Supporting Documents (optional)</FieldLabel>
              <div style={{
                border: '1px dashed rgba(196,164,74,0.25)', borderRadius: 'var(--radius)',
                padding: '18px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 8, cursor: 'pointer', color: 'var(--mist)', fontSize: 11,
              }}>
                <FilePlus size={14} /> Attach invoice or supporting document
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!formValid}
              style={{
                height: 44, borderRadius: 'var(--radius)',
                background: formValid ? 'var(--gold)' : 'rgba(255,255,255,0.06)',
                color: formValid ? 'var(--navy)' : 'var(--mist)',
                fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase',
                cursor: formValid ? 'pointer' : 'default', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              }}
            >
              <Send size={13} /> Review Transfer Request
            </button>
          </div>
        </div>
      )}

      {/* ── Review step ─────────────────────── */}
      {showForm && step === 'review' && (
        <div style={{
          background: 'var(--navy)', border: '1px solid var(--border2)',
          borderRadius: 'var(--radius-lg)', marginBottom: 20, overflow: 'hidden',
        }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <CircleCheck size={14} style={{ color: 'var(--gold)' }} />
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--cream)' }}>Review & Confirm</span>
          </div>
          <div style={{ padding: '24px' }}>
            <div style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', padding: '18px 20px', marginBottom: 18,
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px',
            }} className="form-grid">
              {[
                { label: 'Type',         value: TYPE_META[txType].label },
                { label: 'From',         value: fromAccount.currency + ' ' + fromAccount.accountType },
                { label: 'Beneficiary',  value: toName },
                { label: 'IBAN',         value: toIban },
                { label: 'Bank',         value: toBank || '—' },
                { label: 'Country',      value: toCountry || '—' },
                { label: 'Amount',       value: `${currency} ${Number(amount).toLocaleString()}` },
                { label: 'Value Date',   value: valueDate },
                { label: 'Purpose',      value: purpose },
              ].map(row => (
                <div key={row.label}>
                  <div style={{ fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 3 }}>{row.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--cream)' }}>{row.value}</div>
                </div>
              ))}
            </div>
            <div style={{
              background: 'rgba(196,164,74,0.06)', border: '1px solid rgba(196,164,74,0.2)',
              borderRadius: 'var(--radius)', padding: '10px 14px', marginBottom: 18,
              fontSize: 10, color: 'var(--mist)', display: 'flex', gap: 8,
            }}>
              <AlertTriangle size={13} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 1 }} />
              By confirming, you authorise ZPF to process this transfer request subject to compliance review and RM approval.
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setStep('details')} style={{
                flex: 1, height: 40, borderRadius: 'var(--radius)',
                background: 'transparent', border: '1px solid var(--border)',
                color: 'var(--mist)', fontSize: 11, cursor: 'pointer',
              }}>
                ← Back
              </button>
              <button onClick={handleConfirm} style={{
                flex: 2, height: 40, borderRadius: 'var(--radius)',
                background: 'var(--gold)', color: 'var(--navy)',
                fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase',
                cursor: 'pointer', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              }}>
                <Send size={13} /> Confirm &amp; Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Pending requests ────────────────── */}
      {pending.length > 0 && (
        <>
          <SectionHeader title="Pending Requests" count={pending.length} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            {pending.map(tfr => (
              <TransferCard
                key={tfr.id} tfr={tfr}
                expanded={expanded === tfr.id}
                onToggle={() => setExpanded(expanded === tfr.id ? null : tfr.id)}
              />
            ))}
          </div>
        </>
      )}

      {/* ── Transfer history ────────────────── */}
      <SectionHeader title="Transfer History" count={history.length} />
      <div style={{ background: 'var(--navy)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        {history.map((tfr, i) => (
          <TransferCard
            key={tfr.id} tfr={tfr}
            expanded={expanded === tfr.id}
            onToggle={() => setExpanded(expanded === tfr.id ? null : tfr.id)}
            inList last={i === history.length - 1}
          />
        ))}
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 768px) {
          .form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

/* ── Transfer card ────────────────────────────────────────── */

function TransferCard({ tfr, expanded, onToggle, inList, last }: {
  tfr: TransferRequest; expanded: boolean; onToggle: () => void
  inList?: boolean; last?: boolean
}) {
  const status = STATUS_META[tfr.status]
  const type   = TYPE_META[tfr.type]

  const wrapper: React.CSSProperties = inList
    ? { borderBottom: last ? 'none' : '1px solid rgba(196,164,74,0.06)' }
    : {
        background: 'var(--navy)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', overflow: 'hidden',
        outline: tfr.status === 'pending-approval' ? '1px solid rgba(196,164,74,0.2)' : 'none',
      }

  return (
    <div style={wrapper}>
      <div onClick={onToggle} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '15px 22px', cursor: 'pointer' }}>
        {/* Type icon */}
        <div style={{
          width: 36, height: 36, borderRadius: 9, flexShrink: 0,
          background: `${type.color}18`, color: type.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {type.icon}
        </div>

        {/* Main info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--cream)' }}>{tfr.toName}</span>
            <span style={{
              fontSize: 8, fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase',
              padding: '2px 7px', borderRadius: 3, background: `${type.color}18`, color: type.color,
            }}>{type.label}</span>
          </div>
          <div style={{ fontSize: 10, color: 'var(--mist)' }}>
            {tfr.fromAccount.split('—')[0].trim()} → {tfr.toCountry} · {tfr.submittedDate} · <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9 }}>{tfr.ref}</span>
          </div>
        </div>

        {/* Amount + status */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 13, fontFamily: 'var(--font-mono)', fontWeight: 500, color: 'var(--cream)', marginBottom: 4 }}>
            {tfr.currency} {tfr.amount.toLocaleString()}
          </div>
          <span style={{
            fontSize: 8, fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase',
            padding: '2px 8px', borderRadius: 4,
            background: status.bg, color: status.color,
            display: 'inline-flex', alignItems: 'center', gap: 4,
          }}>
            {status.icon} {status.label}
          </span>
        </div>

        <div style={{ color: 'var(--mist)', flexShrink: 0 }}>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </div>

      {expanded && (
        <div style={{
          padding: '0 22px 18px 72px',
          borderTop: '1px solid rgba(196,164,74,0.06)', paddingTop: 14,
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px 24px', marginBottom: 14 }} className="form-grid">
            {[
              { label: 'Debit Account',  value: tfr.fromAccount },
              { label: 'Beneficiary',    value: tfr.toName },
              { label: 'Bank',           value: tfr.toBank },
              { label: 'IBAN',           value: tfr.toIban },
              { label: 'Country',        value: tfr.toCountry },
              { label: 'Amount',         value: `${tfr.currency} ${tfr.amount.toLocaleString()} (≈ CHF ${tfr.amountCHF.toLocaleString()})` },
              { label: 'Value Date',     value: tfr.valueDate },
              { label: 'Purpose',        value: tfr.purpose },
              { label: 'Submitted',      value: tfr.submittedDate },
            ].map(row => (
              <div key={row.label}>
                <div style={{ fontSize: 8, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 3 }}>{row.label}</div>
                <div style={{ fontSize: 11, color: 'var(--cream)', fontFamily: row.label === 'IBAN' ? 'var(--font-mono)' : 'inherit' }}>{row.value}</div>
              </div>
            ))}
          </div>

          {tfr.rmNote && (
            <div style={{
              display: 'flex', gap: 10, padding: '10px 14px',
              background: tfr.status === 'rejected' ? 'rgba(192,57,43,0.07)' : 'rgba(196,164,74,0.06)',
              border: `1px solid ${tfr.status === 'rejected' ? 'rgba(192,57,43,0.2)' : 'rgba(196,164,74,0.15)'}`,
              borderRadius: 'var(--radius)', fontSize: 10, color: 'var(--mist)',
            }}>
              <Building2 size={12} style={{ color: tfr.status === 'rejected' ? '#f0997b' : 'var(--gold)', flexShrink: 0, marginTop: 1 }} />
              <div>
                <span style={{ color: tfr.status === 'rejected' ? '#f0997b' : 'var(--gold2)', fontWeight: 500 }}>
                  RM Note:{' '}
                </span>
                {tfr.rmNote}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ── Helpers ──────────────────────────────────────────────── */

function SectionHeader({ title, count }: { title: string; count: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--cream)' }}>{title}</div>
      <span style={{
        fontSize: 9, padding: '2px 8px', borderRadius: 10,
        background: 'rgba(255,255,255,0.06)', color: 'var(--mist)',
      }}>{count}</span>
      <div style={{ flex: 1, height: '0.5px', background: 'rgba(196,164,74,0.1)' }} />
    </div>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 6 }}>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', height: 38, borderRadius: 'var(--radius)',
  background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
  color: 'var(--cream)', fontSize: 12, padding: '0 12px',
  outline: 'none', fontFamily: 'inherit',
}

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: 'pointer',
}
