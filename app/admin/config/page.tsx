'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, AlertTriangle, Check, RefreshCw } from 'lucide-react'
import { mockSystemConfig, type SystemConfig } from '@/lib/admin-mock-data'
import { readSession } from '@/lib/session-store'

// ── Page ───────────────────────────────────────────────────────────────────────

export default function AdminConfigPage() {
  const router  = useRouter()
  const session = readSession()

  if (session?.role !== 'super_admin') {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <Lock size={32} style={{ color: '#8a9ab0', marginBottom: 12, opacity: 0.4 }} />
        <div style={{ fontSize: 15, color: '#8a9ab0' }}>Super Admin access required</div>
        <button
          onClick={() => router.push('/admin/overview')}
          style={{ marginTop: 16, color: '#c4a44a', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}
        >
          ← Back to Overview
        </button>
      </div>
    )
  }

  return <ConfigForm initial={mockSystemConfig} />
}

// ── Config Form ────────────────────────────────────────────────────────────────

function ConfigForm({ initial }: { initial: SystemConfig }) {
  const [cfg, setCfg]         = useState<SystemConfig>(initial)
  const [saved, setSaved]     = useState(false)
  const [dirty, setDirty]     = useState(false)

  function update<K extends keyof SystemConfig>(key: K, value: SystemConfig[K]) {
    setCfg(prev => ({ ...prev, [key]: value }))
    setDirty(true)
    setSaved(false)
  }

  function handleSave() {
    // In production this would POST to API; here we just simulate
    setSaved(true)
    setDirty(false)
    setTimeout(() => setSaved(false), 3000)
  }

  function handleReset() {
    setCfg(initial)
    setDirty(false)
    setSaved(false)
  }

  return (
    <div style={{ maxWidth: 820 }}>

      {/* Warning banner */}
      <div style={{
        display: 'flex', gap: 10, alignItems: 'flex-start',
        padding: '12px 16px', borderRadius: 8, marginBottom: 28,
        background: 'rgba(196,164,74,0.06)', border: '1px solid rgba(196,164,74,0.2)',
      }}>
        <AlertTriangle size={15} style={{ color: '#c4a44a', flexShrink: 0, marginTop: 1 }} />
        <div style={{ fontSize: 12, color: '#c4a44a' }}>
          Changes to system configuration take effect immediately and are logged in the audit trail. This panel is accessible to Super Admins only.
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Transfer thresholds */}
        <ConfigSection title="Transfer Thresholds">
          <ConfigRow
            label="Counter-approval threshold"
            description="Transfers above this amount (CHF) require a second approval from a Major Admin."
            value={cfg.counterApprovalThreshold}
            onChange={v => update('counterApprovalThreshold', Number(v))}
            type="number"
            suffix="CHF"
          />
        </ConfigSection>

        {/* Session settings */}
        <ConfigSection title="Session & Security">
          <ConfigRow
            label="Idle timeout"
            description="Session expires after this many hours of inactivity."
            value={cfg.sessionIdleTimeoutHours}
            onChange={v => update('sessionIdleTimeoutHours', Number(v))}
            type="number"
            suffix="hrs"
          />
          <ConfigRow
            label="Absolute session timeout"
            description="Maximum session duration regardless of activity."
            value={cfg.sessionAbsoluteTimeoutHours}
            onChange={v => update('sessionAbsoluteTimeoutHours', Number(v))}
            type="number"
            suffix="hrs"
          />
          <ConfigRow
            label="TOTP enrollment window"
            description="New staff must complete TOTP enrollment within this window."
            value={cfg.totpEnrollmentExpiryHours}
            onChange={v => update('totpEnrollmentExpiryHours', Number(v))}
            type="number"
            suffix="hrs"
          />
          <ConfigRow
            label="Max failed TOTP attempts"
            description="Account is flagged after this many consecutive TOTP failures."
            value={cfg.maxFailedTotpAttempts}
            onChange={v => update('maxFailedTotpAttempts', Number(v))}
            type="number"
            suffix="attempts"
          />
        </ConfigSection>

        {/* Document settings */}
        <ConfigSection title="Documents & Uploads">
          <ConfigRow
            label="Max upload size"
            description="Maximum file size per document upload."
            value={cfg.maxDocUploadMb}
            onChange={v => update('maxDocUploadMb', Number(v))}
            type="number"
            suffix="MB"
          />
          <div style={{ padding: '14px 0', borderBottom: '1px solid rgba(196,164,74,0.06)' }}>
            <div style={{ fontSize: 12, color: '#e8dcc8', marginBottom: 4 }}>Allowed file types</div>
            <div style={{ fontSize: 11, color: '#8a9ab0', marginBottom: 10 }}>Comma-separated list of allowed extensions.</div>
            <input
              value={cfg.allowedFileTypes.join(', ')}
              onChange={e => update('allowedFileTypes', e.target.value.split(',').map(s => s.trim().toUpperCase()).filter(Boolean))}
              style={inputStyle}
            />
          </div>
        </ConfigSection>

        {/* Data feeds */}
        <ConfigSection title="Market Data Feeds">
          {([
            { key: 'fxSource',     labelKey: 'fxIntervalMinutes',     name: 'FX rates',    desc: 'Foreign exchange rates' },
            { key: 'metalsSource', labelKey: 'metalsIntervalMinutes', name: 'Metals',       desc: 'Precious metals spot prices' },
            { key: 'cryptoSource', labelKey: 'cryptoIntervalMinutes', name: 'Crypto',       desc: 'Cryptocurrency prices' },
          ] as { key: keyof SystemConfig; labelKey: keyof SystemConfig; name: string; desc: string }[]).map(feed => (
            <div key={feed.key} style={{ padding: '14px 0', borderBottom: '1px solid rgba(196,164,74,0.06)', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 180 }}>
                <div style={{ fontSize: 12, color: '#e8dcc8', marginBottom: 2 }}>{feed.name}</div>
                <div style={{ fontSize: 11, color: '#8a9ab0' }}>{feed.desc}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <select
                  value={cfg[feed.key] as string}
                  onChange={e => update(feed.key, e.target.value as 'auto' | 'manual')}
                  style={selectStyle}
                >
                  <option value="auto">Auto</option>
                  <option value="manual">Manual</option>
                </select>
                {cfg[feed.key] === 'auto' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input
                      type="number"
                      value={cfg[feed.labelKey] as number}
                      onChange={e => update(feed.labelKey, Number(e.target.value))}
                      style={{ ...inputStyle, width: 70 }}
                    />
                    <span style={{ fontSize: 11, color: '#8a9ab0' }}>min</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </ConfigSection>

        {/* Maintenance mode */}
        <ConfigSection title="Maintenance Mode">
          <div style={{ padding: '14px 0', borderBottom: '1px solid rgba(196,164,74,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 12, color: '#e8dcc8', marginBottom: 3 }}>Enable maintenance mode</div>
                <div style={{ fontSize: 11, color: '#8a9ab0' }}>Blocks client portal access and shows the maintenance message below.</div>
              </div>
              <button
                onClick={() => update('maintenanceMode', !cfg.maintenanceMode)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', borderRadius: 6, cursor: 'pointer', flexShrink: 0,
                  background: cfg.maintenanceMode ? 'rgba(216,90,48,0.12)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${cfg.maintenanceMode ? 'rgba(216,90,48,0.35)' : 'rgba(196,164,74,0.12)'}`,
                  color: cfg.maintenanceMode ? '#f0997b' : '#8a9ab0',
                  fontSize: 12, fontWeight: 500,
                }}
              >
                {cfg.maintenanceMode ? '● ON' : '○ OFF'}
              </button>
            </div>
          </div>
          <div style={{ padding: '14px 0' }}>
            <div style={{ fontSize: 12, color: '#e8dcc8', marginBottom: 4 }}>Maintenance message</div>
            <textarea
              value={cfg.maintenanceMessage}
              onChange={e => update('maintenanceMessage', e.target.value)}
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>
        </ConfigSection>

        {/* Contact */}
        <ConfigSection title="General">
          <ConfigRow
            label="Public contact email"
            description="Displayed on the portal login page and error pages."
            value={cfg.publicContactEmail}
            onChange={v => update('publicContactEmail', v as string)}
            type="email"
          />
        </ConfigSection>

      </div>

      {/* Save bar */}
      <div style={{
        position: 'sticky', bottom: 0, marginTop: 32,
        padding: '14px 20px', borderRadius: 8,
        background: 'rgba(6,16,30,0.95)', backdropFilter: 'blur(8px)',
        border: '1px solid rgba(196,164,74,0.12)',
        display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end',
      }}>
        {saved && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#4ecda4', marginRight: 'auto' }}>
            <Check size={13} /> Saved — changes logged to audit trail
          </div>
        )}
        <button
          onClick={handleReset}
          disabled={!dirty}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '8px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: dirty ? 'pointer' : 'default',
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(196,164,74,0.1)',
            color: dirty ? '#8a9ab0' : 'rgba(138,154,176,0.35)',
          }}
        >
          <RefreshCw size={12} />
          Reset
        </button>
        <button
          onClick={handleSave}
          disabled={!dirty}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '8px 18px', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: dirty ? 'pointer' : 'default',
            background: dirty ? 'rgba(196,164,74,0.12)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${dirty ? 'rgba(196,164,74,0.3)' : 'rgba(196,164,74,0.08)'}`,
            color: dirty ? '#c4a44a' : 'rgba(196,164,74,0.3)',
          }}
        >
          Save Changes
        </button>
      </div>

      <style>{`
        input::placeholder, textarea::placeholder { color: rgba(138,154,176,0.5); }
      `}</style>
    </div>
  )
}

// ── Config Section ─────────────────────────────────────────────────────────────

function ConfigSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: '20px', borderRadius: 8, border: '1px solid rgba(196,164,74,0.1)', background: 'rgba(255,255,255,0.015)' }}>
      <div style={{ fontSize: 10, fontWeight: 600, color: '#8a9ab0', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 16 }}>{title}</div>
      {children}
    </div>
  )
}

// ── Config Row ─────────────────────────────────────────────────────────────────

function ConfigRow({ label, description, value, onChange, type, suffix }: {
  label: string
  description: string
  value: string | number
  onChange: (v: string | number) => void
  type?: string
  suffix?: string
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, padding: '12px 0', borderBottom: '1px solid rgba(196,164,74,0.06)', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ fontSize: 12, color: '#e8dcc8', marginBottom: 3 }}>{label}</div>
        <div style={{ fontSize: 11, color: '#8a9ab0' }}>{description}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <input
          type={type ?? 'text'}
          value={value}
          onChange={e => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
          style={{ ...inputStyle, width: type === 'number' ? 100 : 240 }}
        />
        {suffix && <span style={{ fontSize: 11, color: '#8a9ab0' }}>{suffix}</span>}
      </div>
    </div>
  )
}

// ── Shared styles ──────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  padding: '7px 10px', borderRadius: 5, fontSize: 12,
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(196,164,74,0.12)',
  color: '#e8dcc8', outline: 'none', fontFamily: 'var(--font-mono)',
  width: '100%', boxSizing: 'border-box',
}

const selectStyle: React.CSSProperties = {
  padding: '7px 10px', borderRadius: 5, fontSize: 12,
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(196,164,74,0.12)',
  color: '#e8dcc8', outline: 'none', cursor: 'pointer',
}
