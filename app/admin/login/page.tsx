'use client'

import { useState, useRef, KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import {
  ShieldCheck, ArrowRight, ArrowLeft,
  Eye, EyeOff, LogIn, KeyRound, RefreshCw, CheckCircle2,
  Lock, AlertTriangle,
} from 'lucide-react'
import { findAdminByPortalId } from '@/lib/credentials'
import { writeSession } from '@/lib/session-store'

type Step = 1 | 2 | 3

export default function AdminLoginPage() {
  const [step,      setStep]      = useState<Step>(1)
  const [showKey,   setShowKey]   = useState(false)
  const [verified,  setVerified]  = useState(false)

  const [portalId,   setPortalId]  = useState('')
  const [accessKey,  setAccessKey] = useState('')

  const [idError,   setIdError]   = useState('')
  const [keyError,  setKeyError]  = useState('')
  const [totpError, setTotpError] = useState('')

  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', ''])
  const tokenRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()

  function updateOtp(digits: string[]) {
    setOtpDigits(digits)
    if (digits.every(d => d !== '')) {
      const entered = digits.join('')
      const cred = findAdminByPortalId(portalId.trim())
      if (cred && entered === cred.totpCode) {
        setTotpError('')
        setVerified(true)
      } else {
        setTotpError('Invalid code. Check your authenticator and try again.')
        setVerified(false)
      }
    } else {
      setVerified(false)
    }
  }

  function handleOtpChange(value: string, i: number) {
    const digits = value.replace(/\D/g, '')
    if (!digits) {
      const next = [...otpDigits]; next[i] = ''
      updateOtp(next); return
    }
    if (digits.length > 1) {
      const next = [...otpDigits]
      for (let j = 0; j < digits.length && i + j < 6; j++) next[i + j] = digits[j]
      updateOtp(next)
      tokenRefs.current[Math.min(i + digits.length, 5)]?.focus()
      return
    }
    const next = [...otpDigits]; next[i] = digits
    updateOtp(next)
    if (i < 5) tokenRefs.current[i + 1]?.focus()
  }

  function handleOtpKeyDown(e: KeyboardEvent<HTMLInputElement>, i: number) {
    if (e.key === 'Backspace') {
      e.preventDefault()
      const next = [...otpDigits]
      if (next[i]) { next[i] = ''; updateOtp(next) }
      else if (i > 0) { next[i - 1] = ''; updateOtp(next); tokenRefs.current[i - 1]?.focus() }
    } else if (e.key === 'ArrowLeft' && i > 0) {
      tokenRefs.current[i - 1]?.focus()
    } else if (e.key === 'ArrowRight' && i < 5) {
      tokenRefs.current[i + 1]?.focus()
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return
    const next = ['', '', '', '', '', '']
    for (let j = 0; j < pasted.length; j++) next[j] = pasted[j]
    updateOtp(next)
    tokenRefs.current[Math.min(pasted.length, 5)]?.focus()
  }

  function submitId() {
    const id = portalId.trim()
    if (!id) { setIdError('Enter your Staff Portal ID.'); return }
    const cred = findAdminByPortalId(id)
    if (!cred) { setIdError('Staff Portal ID not recognised. Check your credentials.'); return }
    setIdError('')
    setStep(2)
  }

  function submitAccessKey() {
    const id = portalId.trim()
    const cred = findAdminByPortalId(id)
    if (!cred || accessKey.trim() !== cred.accessKey) {
      setKeyError('Incorrect passphrase. Please check and try again.')
      return
    }
    setKeyError('')
    setStep(3)
  }

  function enterPanel() {
    const cred = findAdminByPortalId(portalId.trim())
    if (!cred) return
    writeSession(cred.session)
    router.push('/admin/overview')
  }

  return (
    <div style={{
      display: 'flex', minHeight: '100vh', position: 'relative',
      background: '#06101e', overflow: 'hidden',
    }}>
      {/* Grid overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: [
          'repeating-linear-gradient(0deg,transparent,transparent 79px,rgba(196,164,74,0.03) 80px)',
          'repeating-linear-gradient(90deg,transparent,transparent 79px,rgba(196,164,74,0.03) 80px)',
        ].join(','),
      }} />

      {/* ── Left branding panel ───────────────── */}
      <div className="admin-login-left" style={{
        width: '52%', display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', padding: '52px 64px',
        position: 'relative', zIndex: 2,
      }}>
        {/* Wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 42, height: 42, border: '1.5px solid #c4a44a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 500,
            color: '#c4a44a', letterSpacing: 2, position: 'relative', flexShrink: 0,
          }}>
            ZPF
            <div style={{ position: 'absolute', inset: 3, border: '0.5px solid rgba(196,164,74,0.35)' }} />
          </div>
          <div>
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 14, color: '#e8dcc8', letterSpacing: '.05em' }}>
              Zürichberg Privat Finanz
            </span>
            <span style={{ display: 'block', fontSize: 9, color: '#8a9ab0', letterSpacing: '.3em', textTransform: 'uppercase', marginTop: 2 }}>
              Internal Administration
            </span>
          </div>
        </div>

        {/* Hero */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 0' }}
             className="admin-login-hero">
          <div style={{
            fontSize: 9, letterSpacing: '.4em', textTransform: 'uppercase',
            color: '#c4a44a', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ display: 'inline-block', width: 32, height: 1, background: '#c4a44a' }} />
            Staff Access Only
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 58, fontWeight: 300,
            lineHeight: 1.05, color: '#e8dcc8', marginBottom: 24,
          }}>
            Administration<br />
            <em style={{ fontStyle: 'italic', color: '#a08c3a' }}>Control Panel</em>
          </h1>
          <p style={{ fontSize: 13, lineHeight: 1.85, color: '#8a9ab0', maxWidth: 380 }}>
            Authorised ZPF staff only. All actions are logged and audited in real time.
            Unauthorised access is a criminal offence under Swiss law.
          </p>

          {/* Warning card */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 12, marginTop: 32,
            padding: '14px 16px',
            background: 'rgba(196,164,74,0.05)', border: '1px solid rgba(196,164,74,0.15)',
            borderRadius: 8, maxWidth: 380,
          }}>
            <AlertTriangle size={15} style={{ color: '#c4a44a', flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 11, color: 'rgba(138,154,176,0.8)', lineHeight: 1.65, margin: 0 }}>
              This system contains client financial data protected under Swiss banking secrecy law.
              Every session is recorded and tied to your staff identity.
            </p>
          </div>
        </div>

        <p style={{ fontSize: 10, color: 'rgba(138,154,176,0.5)', lineHeight: 1.7 }}>
          ZPF AG · Bahnhofstrasse 72, 8001 Zürich · All sessions encrypted · Monitored 24/7
        </p>
      </div>

      {/* ── Right form panel ──────────────────── */}
      <div className="admin-login-right" style={{
        width: '48%', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: '52px 64px', position: 'relative', zIndex: 2,
        borderLeft: '1px solid rgba(196,164,74,0.12)',
        background: 'rgba(6,16,30,0.8)', backdropFilter: 'blur(8px)',
      }}>
        <div style={{ width: '100%', maxWidth: 380 }}>

          {/* Role badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 28,
            padding: '6px 14px', borderRadius: 20,
            background: 'rgba(196,164,74,0.08)', border: '1px solid rgba(196,164,74,0.2)',
            fontSize: 9, letterSpacing: '.25em', textTransform: 'uppercase', color: '#c4a44a',
          }}>
            <Lock size={10} /> Staff Portal
          </div>

          {/* Step dots */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 32 }}>
            {[1, 2, 3].map(d => (
              <div key={d} style={{
                width: 24, height: 3, borderRadius: 2,
                background: d < step
                  ? '#c4a44a'
                  : d === step
                  ? '#a08c3a'
                  : 'rgba(196,164,74,0.15)',
                transition: 'background .3s',
              }} />
            ))}
          </div>

          {/* ── Step 1: Portal ID ── */}
          {step === 1 && (
            <div>
              <div style={sTag}>Step 1 of 3</div>
              <div style={sTitle}>Staff Portal ID</div>
              <p style={sDesc}>
                Enter your ZPF staff portal ID. This was issued at account creation via secure credential sheet.
              </p>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 22,
                padding: '10px 12px',
                background: 'rgba(29,158,117,0.08)', border: '1px solid rgba(29,158,117,0.2)',
                borderRadius: 6, fontSize: 11, color: '#4ecda4',
              }}>
                <ShieldCheck size={13} style={{ flexShrink: 0 }} />
                <span>Encrypted connection · Session logged to staff record</span>
              </div>

              <Field label="Staff Portal ID">
                <input
                  type="text"
                  placeholder="ZPF-XX-XXXX"
                  maxLength={20}
                  autoComplete="off"
                  value={portalId}
                  onChange={e => { setPortalId(e.target.value); setIdError('') }}
                  onKeyDown={e => e.key === 'Enter' && submitId()}
                  style={{ ...inputSt, borderColor: idError ? 'rgba(224,92,92,0.5)' : 'rgba(196,164,74,0.2)' }}
                />
              </Field>
              {idError && <ErrMsg>{idError}</ErrMsg>}
              <PBtn onClick={submitId}><ArrowRight size={15} /> Continue</PBtn>
            </div>
          )}

          {/* ── Step 2: Passphrase ── */}
          {step === 2 && (
            <div>
              <div style={sTag}>Step 2 of 3</div>
              <div style={sTitle}>Passphrase</div>
              <p style={sDesc}>
                Enter your 32-character hex passphrase issued at account creation. Contact ZPF IT if you cannot locate it.
              </p>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: 14,
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(196,164,74,0.12)',
                borderRadius: 6, marginBottom: 18,
              }}>
                <div style={{
                  width: 36, height: 36, background: 'rgba(196,164,74,0.08)', borderRadius: 6,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c4a44a', flexShrink: 0,
                }}>
                  <KeyRound size={18} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: '#e8dcc8' }}>32-character hex passphrase</div>
                  <div style={{ fontSize: 10, color: '#8a9ab0', marginTop: 2 }}>Issued at account creation · Never shared by ZPF staff</div>
                </div>
              </div>

              <Field label="Passphrase">
                <input
                  type={showKey ? 'text' : 'password'}
                  placeholder="32-character hex string"
                  autoComplete="off"
                  value={accessKey}
                  onChange={e => { setAccessKey(e.target.value); setKeyError('') }}
                  onKeyDown={e => e.key === 'Enter' && submitAccessKey()}
                  style={{ ...inputSt, fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.05em', borderColor: keyError ? 'rgba(224,92,92,0.5)' : 'rgba(196,164,74,0.2)' }}
                />
                <EyeBtn onClick={() => setShowKey(p => !p)}>
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </EyeBtn>
              </Field>
              {keyError && <ErrMsg>{keyError}</ErrMsg>}
              <PBtn onClick={submitAccessKey}><ArrowRight size={15} /> Verify Passphrase</PBtn>
              <GBtn onClick={() => setStep(1)}><ArrowLeft size={15} /> Back</GBtn>
            </div>
          )}

          {/* ── Step 3: TOTP ── */}
          {step === 3 && (
            <div>
              <div style={sTag}>Step 3 of 3</div>
              <div style={sTitle}>Verification Code</div>
              <p style={sDesc}>Enter the 6-digit code from your ZPF authenticator app.</p>

              <div style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                background: 'linear-gradient(135deg, rgba(196,164,74,0.07), rgba(196,164,74,0.03))',
                border: '1px solid rgba(196,164,74,0.18)', borderRadius: 6, marginBottom: 20,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: 'rgba(196,164,74,0.1)', border: '1px solid rgba(196,164,74,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <RefreshCw size={15} style={{ color: '#c4a44a' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 500, color: '#e8dcc8' }}>auth.zpfinanz.ch</div>
                  <div style={{ fontSize: 10, color: '#8a9ab0', marginTop: 2 }}>Time-based code · refreshes every 30 s</div>
                </div>
                <div style={{
                  fontSize: 9, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase',
                  color: '#c4a44a', background: 'rgba(196,164,74,0.1)',
                  border: '1px solid rgba(196,164,74,0.2)', padding: '3px 9px', borderRadius: 20,
                }}>
                  Live
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: '#8a9ab0', marginBottom: 8 }}>
                  One-Time Code
                </label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[0,1,2,3,4,5].map(i => (
                    <input
                      key={i}
                      ref={el => { tokenRefs.current[i] = el }}
                      type="text" maxLength={1} inputMode="numeric"
                      value={otpDigits[i]}
                      onChange={e => handleOtpChange(e.target.value, i)}
                      onKeyDown={e => handleOtpKeyDown(e, i)}
                      onPaste={handleOtpPaste}
                      style={{
                        flex: 1, height: 48, minWidth: 0,
                        background: verified ? 'rgba(29,158,117,0.08)' : totpError ? 'rgba(224,92,92,0.05)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${verified ? 'rgba(29,158,117,0.4)' : totpError ? 'rgba(224,92,92,0.4)' : 'rgba(196,164,74,0.2)'}`,
                        borderRadius: 6, textAlign: 'center',
                        fontFamily: 'var(--font-mono)', fontSize: 16,
                        color: verified ? '#4ecda4' : totpError ? '#e05c5c' : '#c4a44a',
                        outline: 'none', caretColor: '#c4a44a', transition: 'all .3s',
                      }}
                    />
                  ))}
                </div>
              </div>

              {totpError && <ErrMsg style={{ marginTop: 12 }}>{totpError}</ErrMsg>}

              {verified && (
                <>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    marginTop: 16, padding: '10px 14px',
                    background: 'rgba(29,158,117,0.08)', border: '1px solid rgba(29,158,117,0.25)',
                    borderRadius: 6, fontSize: 11, color: '#4ecda4',
                  }}>
                    <CheckCircle2 size={14} /> Code verified
                  </div>
                  <PBtn style={{ marginTop: 10 }} onClick={enterPanel}>
                    <LogIn size={15} /> Enter Admin Panel
                  </PBtn>
                </>
              )}

              <GBtn onClick={() => { setStep(2); setOtpDigits(['','','','','','']); setTotpError(''); setVerified(false) }}>
                <ArrowLeft size={15} /> Back
              </GBtn>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-login-left {
            width: 100% !important;
            padding: calc(28px + var(--safe-top)) 24px 20px !important;
            flex-direction: row !important;
            align-items: center !important;
            justify-content: space-between !important;
            border-bottom: 1px solid rgba(196,164,74,0.12);
          }
          .admin-login-hero, .admin-login-footer { display: none !important; }
          .admin-login-right {
            width: 100% !important;
            padding: 20px 24px calc(24px + var(--safe-bottom)) !important;
            align-items: stretch !important;
            justify-content: flex-start !important;
            border-left: none !important;
            background: transparent !important;
          }
          input[type="text"], input[type="password"] { font-size: 16px !important; }
        }
      `}</style>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

const sTag:   React.CSSProperties = { fontSize: 9, letterSpacing: '.35em', textTransform: 'uppercase', color: '#c4a44a', marginBottom: 6 }
const sTitle: React.CSSProperties = { fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 400, color: '#e8dcc8', marginBottom: 6 }
const sDesc:  React.CSSProperties = { fontSize: 11, color: '#8a9ab0', lineHeight: 1.65, marginBottom: 24 }

const inputSt: React.CSSProperties = {
  width: '100%', height: 48,
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(196,164,74,0.2)',
  color: '#e8dcc8', fontSize: 13, padding: '0 44px 0 14px',
  borderRadius: 6, outline: 'none', letterSpacing: '.02em',
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: 'block', fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: '#8a9ab0', marginBottom: 8 }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>{children}</div>
    </div>
  )
}

function EyeBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <div onClick={onClick} style={{
      position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
      color: '#8a9ab0', display: 'flex', cursor: 'pointer',
    }}>{children}</div>
  )
}

function PBtn({ children, onClick, style }: { children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', height: 48, background: '#c4a44a', color: '#06101e',
      fontSize: 11, fontWeight: 500, letterSpacing: '.2em', textTransform: 'uppercase',
      borderRadius: 6, marginTop: 8, border: 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      cursor: 'pointer', transition: 'background .2s',
      ...style,
    }}>
      {children}
    </button>
  )
}

function GBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', height: 42, background: 'transparent', color: '#8a9ab0',
      fontSize: 11, letterSpacing: '.15em', textTransform: 'uppercase',
      border: '1px solid rgba(138,154,176,0.15)', borderRadius: 6, marginTop: 10,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer',
    }}>
      {children}
    </button>
  )
}

function ErrMsg({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12,
      padding: '9px 12px', borderRadius: 6,
      background: 'rgba(224,92,92,0.07)', border: '1px solid rgba(224,92,92,0.2)',
      fontSize: 11, color: '#e05c5c', lineHeight: 1.5, ...style,
    }}>
      <span style={{ fontSize: 13, flexShrink: 0 }}>⚠</span>
      {children}
    </div>
  )
}
