'use client'

import { useState } from 'react'
import {
  Settings, Bell, Globe, Monitor, FileText, Mail,
  Phone, MessageSquare, CheckCircle2, ChevronRight,
} from 'lucide-react'
import { mockUser } from '@/lib/mock-data'

/* ── Types & data ─────────────────────────────────────────── */

type Currency   = 'CHF' | 'USD' | 'EUR' | 'GBP'
type Language   = 'en' | 'de' | 'fr'
type DateFmt    = 'DD MMM YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD'
type Theme      = 'dark' | 'light' | 'system'

const CURRENCIES: Currency[] = ['CHF', 'USD', 'EUR', 'GBP']
const LANGUAGES:  { key: Language; label: string }[] = [
  { key: 'en', label: 'English' },
  { key: 'de', label: 'Deutsch' },
  { key: 'fr', label: 'Français' },
]
const DATE_FMTS: DateFmt[] = ['DD MMM YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']
const THEMES: { key: Theme; label: string }[] = [
  { key: 'dark',   label: 'Dark' },
  { key: 'light',  label: 'Light' },
  { key: 'system', label: 'System' },
]

/* ── Page ─────────────────────────────────────────────────── */

export default function PreferencesPage() {
  // Display
  const [currency,   setCurrency]   = useState<Currency>('CHF')
  const [language,   setLanguage]   = useState<Language>('en')
  const [dateFmt,    setDateFmt]    = useState<DateFmt>('DD MMM YYYY')
  const [theme,      setTheme]      = useState<Theme>('dark')

  // Notifications
  const [emailTx,       setEmailTx]       = useState(true)
  const [emailStmt,     setEmailStmt]     = useState(true)
  const [emailMsg,      setEmailMsg]      = useState(true)
  const [emailMkt,      setEmailMkt]      = useState(false)
  const [smsTx,         setSmsTx]         = useState(true)
  const [smsLogin,      setSmsLogin]      = useState(true)
  const [pushEnabled,   setPushEnabled]   = useState(false)

  // Statements
  const [stmtDelivery,  setStmtDelivery]  = useState<'portal' | 'email' | 'post'>('portal')
  const [stmtFormat,    setStmtFormat]    = useState<'pdf' | 'pdf+csv'>('pdf')

  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2200)
  }

  return (
    <div>
      {/* ── Header ──────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 12, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, color: 'var(--cream)' }}>
            Preferences
          </div>
          <div style={{ fontSize: 10, color: 'var(--mist)', marginTop: 4, letterSpacing: '.05em' }}>
            {mockUser.id} · Display, notification and statement delivery settings
          </div>
        </div>
        <button onClick={handleSave} style={{
          display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
          fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase',
          color: saved ? '#4ecda4' : 'var(--gold)',
          border: `1px solid ${saved ? 'rgba(78,205,164,0.35)' : 'var(--border2)'}`,
          padding: '7px 16px', borderRadius: 20, background: 'transparent',
          transition: 'color .2s, border-color .2s',
        }}>
          {saved ? <><CheckCircle2 size={12} /> Saved</> : <>Save Changes</>}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* ── Display & Localisation ──────────────── */}
        <Section icon={<Globe size={14} />} title="Display & Localisation" sub="Currency, language and date format shown across the portal">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }} className="pref-2col">

            <FieldGroup label="Display Currency">
              <SegmentControl
                options={CURRENCIES.map(c => ({ key: c, label: c }))}
                value={currency}
                onChange={v => setCurrency(v as Currency)}
              />
            </FieldGroup>

            <FieldGroup label="Language">
              <SegmentControl
                options={LANGUAGES.map(l => ({ key: l.key, label: l.label }))}
                value={language}
                onChange={v => setLanguage(v as Language)}
              />
            </FieldGroup>

            <FieldGroup label="Date Format">
              <SegmentControl
                options={DATE_FMTS.map(d => ({ key: d, label: d }))}
                value={dateFmt}
                onChange={v => setDateFmt(v as DateFmt)}
              />
            </FieldGroup>

            <FieldGroup label="Theme">
              <SegmentControl
                options={THEMES.map(t => ({ key: t.key, label: t.label }))}
                value={theme}
                onChange={v => setTheme(v as Theme)}
              />
              <div style={{ fontSize: 9, color: 'rgba(138,154,176,0.5)', marginTop: 6 }}>
                Light mode will be available in a future release.
              </div>
            </FieldGroup>
          </div>
        </Section>

        {/* ── Notification Preferences ────────────── */}
        <Section icon={<Bell size={14} />} title="Notification Preferences" sub="Choose how and when ZPF contacts you">

          <NotifGroup label="Email Notifications" icon={<Mail size={12} />}>
            <ToggleRow label="Transaction confirmations"   sub="Inbound, outbound and FX settlements"     value={emailTx}   onChange={setEmailTx} />
            <ToggleRow label="New statements available"    sub="Quarterly, annual and tax documents"      value={emailStmt} onChange={setEmailStmt} />
            <ToggleRow label="Secure message received"     sub="RM correspondence and bank notices"       value={emailMsg}  onChange={setEmailMsg} />
            <ToggleRow label="Market commentary & reports" sub="Monthly advisory notes from your RM"     value={emailMkt}  onChange={setEmailMkt} last />
          </NotifGroup>

          <NotifGroup label="SMS Alerts" icon={<Phone size={12} />} style={{ marginTop: 14 }}>
            <ToggleRow label="Transfer authorisation codes" sub="OTP codes for outbound transfers"      value={smsTx}    onChange={setSmsTx} />
            <ToggleRow label="New device login alert"       sub="Alert when a new session is opened"    value={smsLogin} onChange={setSmsLogin} last />
          </NotifGroup>

          <NotifGroup label="Push Notifications" icon={<MessageSquare size={12} />} style={{ marginTop: 14 }}>
            <ToggleRow label="Enable push notifications" sub="Requires the ZPF mobile app (coming soon)" value={pushEnabled} onChange={setPushEnabled} last disabled />
          </NotifGroup>
        </Section>

        {/* ── Statement Delivery ──────────────────── */}
        <Section icon={<FileText size={14} />} title="Statement Delivery" sub="How your periodic statements and documents are delivered">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }} className="pref-2col">

            <FieldGroup label="Delivery Method">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {([
                  { key: 'portal', label: 'Secure portal only',    sub: 'Documents available in Statements tab' },
                  { key: 'email',  label: 'Portal + email',         sub: 'Encrypted PDF sent to registered email' },
                  { key: 'post',   label: 'Portal + physical post', sub: 'Printed copy mailed to registered address' },
                ] as const).map(opt => (
                  <label key={opt.key} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                    <div
                      onClick={() => setStmtDelivery(opt.key)}
                      style={{
                        width: 16, height: 16, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                        border: `2px solid ${stmtDelivery === opt.key ? 'var(--gold)' : 'var(--border)'}`,
                        background: stmtDelivery === opt.key ? 'var(--gold)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                      }}
                    >
                      {stmtDelivery === opt.key && <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--navy)' }} />}
                    </div>
                    <div onClick={() => setStmtDelivery(opt.key)}>
                      <div style={{ fontSize: 11, color: 'var(--cream)', marginBottom: 2 }}>{opt.label}</div>
                      <div style={{ fontSize: 9, color: 'var(--mist)' }}>{opt.sub}</div>
                    </div>
                  </label>
                ))}
              </div>
            </FieldGroup>

            <FieldGroup label="Document Format">
              <SegmentControl
                options={[
                  { key: 'pdf',      label: 'PDF only' },
                  { key: 'pdf+csv',  label: 'PDF + CSV' },
                ]}
                value={stmtFormat}
                onChange={v => setStmtFormat(v as 'pdf' | 'pdf+csv')}
              />
              <div style={{ fontSize: 9, color: 'rgba(138,154,176,0.5)', marginTop: 6 }}>
                CSV export includes transaction-level data for accounting software.
              </div>
            </FieldGroup>
          </div>
        </Section>

        {/* ── Contact Details ──────────────────────── */}
        <Section icon={<Monitor size={14} />} title="Registered Contact Details" sub="Address and contact information on file — contact your RM to update">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14 }} className="pref-2col">
            <ReadOnlyField label="Full Name"          value={mockUser.fullName} />
            <ReadOnlyField label="Client Reference"   value={mockUser.id} mono />
            <ReadOnlyField label="Email (Primary)"    value="a.suleiman@••••••••.com" />
            <ReadOnlyField label="Mobile"             value="+234 •••• •••• 47" />
            <ReadOnlyField label="Registered Address" value="14 Kofo Abayomi Street, Victoria Island, Lagos, NG" />
            <ReadOnlyField label="Correspondence"     value="Same as registered address" />
          </div>
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 5, fontSize: 9,
              letterSpacing: '.12em', textTransform: 'uppercase',
              padding: '7px 14px', borderRadius: 8, cursor: 'pointer',
              background: 'rgba(196,164,74,0.06)', border: '1px solid var(--border2)', color: 'var(--gold)',
            }}>
              Request Contact Update <ChevronRight size={10} />
            </button>
            <span style={{ fontSize: 9, color: 'rgba(138,154,176,0.45)' }}>
              Changes require RM approval and identity verification
            </span>
          </div>
        </Section>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .pref-2col { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

/* ── Sub-components ───────────────────────────────────────── */

function Section({ icon, title, sub, children }: {
  icon: React.ReactNode; title: string; sub: string; children: React.ReactNode
}) {
  return (
    <div style={{ background: 'var(--navy)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      <div style={{ padding: '16px 22px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 7, flexShrink: 0,
          background: 'rgba(196,164,74,0.1)', color: 'var(--gold)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {icon}
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--cream)' }}>{title}</div>
          <div style={{ fontSize: 9, color: 'var(--mist)', marginTop: 2 }}>{sub}</div>
        </div>
      </div>
      <div style={{ padding: '20px 22px' }}>{children}</div>
    </div>
  )
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 10 }}>{label}</div>
      {children}
    </div>
  )
}

function SegmentControl({ options, value, onChange }: {
  options: { key: string; label: string }[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div style={{ display: 'flex', gap: 3, background: 'var(--surf)', border: '1px solid var(--border)', borderRadius: 8, padding: 3, flexWrap: 'wrap' }}>
      {options.map(o => (
        <button key={o.key} onClick={() => onChange(o.key)} style={{
          padding: '5px 12px', borderRadius: 6, fontSize: 10, fontWeight: 500,
          cursor: 'pointer', border: 'none', letterSpacing: '.03em', flex: '1 0 auto',
          background: value === o.key ? 'rgba(196,164,74,0.15)' : 'transparent',
          color: value === o.key ? 'var(--gold)' : 'var(--mist)',
        }}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

function NotifGroup({ label, icon, children, style }: {
  label: string; icon: React.ReactNode; children: React.ReactNode; style?: React.CSSProperties
}) {
  return (
    <div style={style}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <span style={{ color: 'var(--mist)' }}>{icon}</span>
        <span style={{ fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--mist)' }}>{label}</span>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  )
}

function ToggleRow({ label, sub, value, onChange, last, disabled }: {
  label: string; sub: string; value: boolean; onChange: (v: boolean) => void
  last?: boolean; disabled?: boolean
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      padding: '12px 16px',
      borderBottom: last ? 'none' : '1px solid rgba(196,164,74,0.06)',
      opacity: disabled ? 0.4 : 1,
    }}>
      <div>
        <div style={{ fontSize: 11, color: 'var(--cream)', marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 9, color: 'var(--mist)' }}>{sub}</div>
      </div>
      <button
        disabled={disabled}
        onClick={() => !disabled && onChange(!value)}
        style={{
          width: 40, height: 22, borderRadius: 11, flexShrink: 0, cursor: disabled ? 'default' : 'pointer',
          background: value ? 'var(--gold)' : 'rgba(255,255,255,0.08)',
          border: '1px solid transparent', position: 'relative', transition: 'background .2s',
        }}
      >
        <div style={{
          position: 'absolute', top: 3, left: value ? 20 : 3,
          width: 14, height: 14, borderRadius: '50%',
          background: value ? 'var(--navy)' : 'rgba(138,154,176,0.6)',
          transition: 'left .2s',
        }} />
      </button>
    </div>
  )
}

function ReadOnlyField({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div style={{ fontSize: 8, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 5 }}>{label}</div>
      <div style={{ fontSize: 11, color: 'var(--cream)', fontFamily: mono ? 'var(--font-mono)' : 'inherit' }}>{value}</div>
    </div>
  )
}
