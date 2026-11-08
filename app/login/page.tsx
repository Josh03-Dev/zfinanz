'use client'

import { useState, useRef, KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import {
  ShieldCheck, Fingerprint, ArrowRight, ArrowLeft,
  Eye, EyeOff, LogIn, Info, KeyRound, RefreshCw, CheckCircle2,
  Users, Lock,
} from 'lucide-react'
import { ZPFLogo } from '@/components/zpf-logo'
import { findByPortalId, VISITOR_CLIENT_REF, VISITOR_ACCESS_KEY } from '@/lib/credentials'
import { writeSession } from '@/lib/session-store'

type Step = 1 | 2 | 3
type LoginMode = 'client' | 'visitor'

export default function LoginPage() {
  const [step,             setStep]          = useState<Step>(1)
  const [loginMode,        setLoginMode]     = useState<LoginMode>('client')
  const [showKey,          setShowKey]       = useState(false)
  const [showVisitorKey,   setShowVisitorKey] = useState(false)
  const [verified,         setVerified]      = useState(false)

  // field values
  const [portalId,     setPortalId]   = useState('')
  const [accessKey,    setAccessKey]  = useState('')
  const [visitorRef,   setVisitorRef] = useState('')
  const [visitorKey,   setVisitorKey] = useState('')

  // errors
  const [idError,      setIdError]      = useState('')
  const [keyError,     setKeyError]     = useState('')
  const [totpError,    setTotpError]    = useState('')
  const [visitorError, setVisitorError] = useState('')

  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', ''])
  const tokenRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()

  function updateOtp(digits: string[]) {
    setOtpDigits(digits)
    // auto-validate when all 6 filled
    if (digits.every(d => d !== '')) {
      const entered = digits.join('')
      const cred = findByPortalId(portalId.trim())
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
      // cleared — treat as backspace
      const next = [...otpDigits]
      next[i] = ''
      updateOtp(next)
      return
    }
    if (digits.length > 1) {
      // iOS autocomplete / autofill sent multiple digits — distribute from position i
      const next = [...otpDigits]
      for (let j = 0; j < digits.length && i + j < 6; j++) next[i + j] = digits[j]
      updateOtp(next)
      const focusIdx = Math.min(i + digits.length, 5)
      tokenRefs.current[focusIdx]?.focus()
      return
    }
    const next = [...otpDigits]
    next[i] = digits
    updateOtp(next)
    if (i < 5) tokenRefs.current[i + 1]?.focus()
  }

  function handleOtpKeyDown(e: KeyboardEvent<HTMLInputElement>, i: number) {
    if (e.key === 'Backspace') {
      e.preventDefault()
      const next = [...otpDigits]
      if (next[i]) {
        next[i] = ''
        updateOtp(next)
      } else if (i > 0) {
        next[i - 1] = ''
        updateOtp(next)
        tokenRefs.current[i - 1]?.focus()
      }
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

  function prev(cur: Step) {
    if (cur > 1) {
      setStep((cur - 1) as Step)
      if (cur === 3) {
        setOtpDigits(['', '', '', '', '', ''])
        setTotpError('')
        setVerified(false)
      }
    }
  }

  // Step 1 — validate portal ID
  function submitId() {
    const id = portalId.trim()
    if (!id) { setIdError('Please enter your Portal Client ID.'); return }
    const cred = findByPortalId(id)
    if (!cred) { setIdError('Portal ID not recognised. Check your details and try again.'); return }
    setIdError('')
    setStep(2)
  }

  // Step 2 — validate access key
  function submitAccessKey() {
    const id = portalId.trim()
    const cred = findByPortalId(id)
    if (!cred || accessKey.trim() !== cred.accessKey) {
      setKeyError('Incorrect access key. Please check and try again.')
      return
    }
    setKeyError('')
    setStep(3)
  }

  function enterDashboard() {
    const cred = findByPortalId(portalId.trim())
    if (!cred) return
    writeSession(cred.session)
    const adminRoles = ['super_admin', 'major_admin', 'admin']
    if (adminRoles.includes(cred.session.role)) {
      router.push('/admin/overview')
    } else {
      router.push('/dashboard/portfolio')
    }
  }

  // Visitor login
  function submitVisitor() {
    const ref = visitorRef.trim()
    const key = visitorKey.trim()
    if (!ref || !key) { setVisitorError('Please fill in both fields.'); return }
    if (ref !== VISITOR_CLIENT_REF || key !== VISITOR_ACCESS_KEY) {
      setVisitorError('Invalid reference ID or access key. Check your details.')
      return
    }
    setVisitorError('')
    router.push('/visitor')
  }

  function switchMode(mode: LoginMode) {
    setLoginMode(mode)
    setStep(1)
    setVerified(false)
    setIdError(''); setKeyError(''); setTotpError(''); setVisitorError('')
  }

  const dots = loginMode === 'client' ? [1, 2, 3] : []

  return (
    <div className="login-page-wrapper" style={{
      display: 'flex', minHeight: '100vh', position: 'relative',
      background: 'var(--navy)', overflow: 'hidden',
    }}>
      {/* Grid overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: [
          'repeating-linear-gradient(0deg,transparent,transparent 79px,rgba(196,164,74,0.04) 80px)',
          'repeating-linear-gradient(90deg,transparent,transparent 79px,rgba(196,164,74,0.04) 80px)',
        ].join(','),
      }} />
      <div style={{
        position: 'absolute', width: 600, height: 600, borderRadius: '50%',
        border: '1px solid rgba(196,164,74,0.07)',
        top: '50%', left: '40%', transform: 'translate(-50%,-50%)', pointerEvents: 'none',
      }} />

      {/* ── Left panel ──────────────────────── */}
      <div className="login-left-panel" style={{
        width: '52%', display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', padding: '52px 64px', position: 'relative', zIndex: 2,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 42, height: 42, border: '1.5px solid var(--gold)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 500,
            color: 'var(--gold)', letterSpacing: 2, position: 'relative', flexShrink: 0,
          }}>
            ZPF
            <div style={{ position: 'absolute', inset: 3, border: '0.5px solid rgba(196,164,74,0.35)' }} />
          </div>
          <div>
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 400, color: 'var(--cream)', letterSpacing: '.05em' }}>
              Zürichberg Privat Finanz
            </span>
            <span style={{ display: 'block', fontSize: 9, color: 'var(--mist)', letterSpacing: '.3em', textTransform: 'uppercase', marginTop: 2 }}>
              Private Client Portal
            </span>
          </div>
        </div>

        {/* Mobile only tagline */}
        <div className="mobile-login-tagline" style={{
          display: 'none', alignItems: 'center', gap: 6,
          fontSize: 9, letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--gold)',
        }}>
          <ShieldCheck size={12} /> Secure Access
        </div>

        {/* Desktop hero */}
        <div className="login-hero" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 0' }}>
          <div style={{
            fontSize: 9, letterSpacing: '.4em', textTransform: 'uppercase',
            color: 'var(--gold)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ display: 'inline-block', width: 32, height: 1, background: 'var(--gold)' }} />
            Secure Access
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 66, fontWeight: 300,
            lineHeight: 1.05, color: 'var(--cream)', marginBottom: 28,
          }}>
            Your wealth,<br />
            <em style={{ fontStyle: 'italic', color: 'var(--gold2)' }}>held in order.</em>
          </h1>
          <p style={{ fontSize: 13, lineHeight: 1.85, color: 'var(--mist)', maxWidth: 380 }}>
            Access your private account, assets, documents, and portfolio through ZPF&apos;s secure client portal.
            Invitation-only. All sessions are encrypted, logged, and monitored in real time.
          </p>
        </div>

        <p className="login-footer-note" style={{ fontSize: 10, color: 'rgba(138,154,176,0.6)', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--mist)', fontWeight: 500 }}>Security notice:</strong> ZPF will never
          request your passphrase or full token code by email, phone, or any unsolicited channel.
          If in doubt, contact your Relationship Manager directly via this portal only.
        </p>
      </div>

      {/* ── Right panel ─────────────────────── */}
      <div className="login-right-panel" style={{
        width: '48%', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: '52px 64px', position: 'relative', zIndex: 2,
        borderLeft: '1px solid var(--border)',
        background: 'rgba(8,22,42,0.7)', backdropFilter: 'blur(8px)',
      }}>
        <div style={{ width: '100%', maxWidth: 380 }}>

          {/* ── Mode tabs (always visible) ── */}
          <div style={{
            display: 'flex', gap: 0, marginBottom: 28,
            background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius)',
            border: '1px solid var(--border)', padding: 3,
          }}>
            <ModeTab
              active={loginMode === 'client'}
              onClick={() => switchMode('client')}
              icon={<Lock size={12} />}
              label="Client Login"
            />
            <ModeTab
              active={loginMode === 'visitor'}
              onClick={() => switchMode('visitor')}
              icon={<Users size={12} />}
              label="Visitor Access"
            />
          </div>

          {/* ── Step dots (client mode only) ── */}
          {loginMode === 'client' && (
            <div style={{ display: 'flex', gap: 6, marginBottom: 32 }}>
              {dots.map(d => (
                <div key={d} style={{
                  width: 24, height: 3, borderRadius: 2,
                  background: d < step
                    ? 'var(--gold)'
                    : d === step
                    ? 'var(--gold2)'
                    : 'rgba(196,164,74,0.2)',
                  transition: 'background .3s',
                }} />
              ))}
            </div>
          )}

          {/* ══ VISITOR MODE ══════════════════════ */}
          {loginMode === 'visitor' && (
            <div>
              <div style={stepTag}>Visitor Access</div>
              <div style={stepTitle}>Enter Passphrase</div>
              <p style={stepDesc}>
                Enter the visitor passphrase provided by your client. This grants read-only access to their portfolio summary.
              </p>

              {/* Info card */}
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px',
                background: 'rgba(196,164,74,0.05)', border: '1px solid rgba(196,164,74,0.15)',
                borderRadius: 'var(--radius)', marginBottom: 22,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 6, flexShrink: 0,
                  background: 'rgba(196,164,74,0.1)', border: '1px solid rgba(196,164,74,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)',
                }}>
                  <Users size={15} />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--cream)', marginBottom: 2 }}>
                    Read-only portfolio view
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--mist)', lineHeight: 1.6 }}>
                    Visitor access is granted by the client and provides a limited, read-only snapshot of their portfolio. No transactions or sensitive data are accessible.
                  </div>
                </div>
              </div>

              <Field label="Client Reference ID">
                <input
                  type="text"
                  placeholder="ZPF-XXXXXXXXXX"
                  maxLength={14}
                  autoComplete="off"
                  value={visitorRef}
                  onChange={e => { setVisitorRef(e.target.value); setVisitorError('') }}
                  style={inputStyle}
                />
                <FieldIcon><Fingerprint size={16} /></FieldIcon>
              </Field>

              <Field label="Visitor Access Key">
                <input
                  type={showVisitorKey ? 'text' : 'password'}
                  placeholder="32-character hex key from your client"
                  autoComplete="off"
                  value={visitorKey}
                  onChange={e => { setVisitorKey(e.target.value); setVisitorError('') }}
                  style={{ ...inputStyle, fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.05em' }}
                />
                <FieldIcon onClick={() => setShowVisitorKey(p => !p)} clickable>
                  {showVisitorKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </FieldIcon>
              </Field>

              {visitorError && <ErrorMsg>{visitorError}</ErrorMsg>}

              <PrimaryBtn onClick={submitVisitor}>
                <Users size={15} /> Access Portfolio View
              </PrimaryBtn>

              <Notice icon={<Info size={13} />}>
                Visitor passphrases are generated and revoked exclusively by the account holder. Contact your client if you have not received one.
              </Notice>
            </div>
          )}

          {/* ══ CLIENT MODE ═══════════════════════ */}

          {/* ── Step 1 ── */}
          {loginMode === 'client' && step === 1 && (
            <div>
              <div style={stepTag}>Step 1 of 3</div>
              <div style={stepTitle}>Client Identifier</div>
              <p style={stepDesc}>
                Enter your ZPF Portal ID — issued by physical post at account establishment.
                This is not your name or email.
              </p>
              <div style={securityBadge}>
                <ShieldCheck size={14} style={{ flexShrink: 0 }} />
                <div>
                  <div>End-to-end encrypted connection</div>
                  <span style={{ color: 'rgba(78,205,164,0.7)', fontSize: 10 }}>Your session is fully protected by ZPF Security</span>
                </div>
              </div>
              <Field label="Portal Client ID">
                <input
                  type="text"
                  placeholder="ZPF-XXXXXXXXXX"
                  maxLength={20}
                  autoComplete="off"
                  value={portalId}
                  onChange={e => { setPortalId(e.target.value); setIdError('') }}
                  onKeyDown={e => e.key === 'Enter' && submitId()}
                  style={{ ...inputStyle, borderColor: idError ? 'rgba(224,92,92,0.5)' : 'rgba(196,164,74,0.2)' }}
                />
                <FieldIcon><Fingerprint size={16} /></FieldIcon>
              </Field>
              {idError && <ErrorMsg>{idError}</ErrorMsg>}
              <PrimaryBtn onClick={submitId}>
                <ArrowRight size={15} /> Continue
              </PrimaryBtn>
              <Notice icon={<Info size={13} />}>
                Your Portal ID was delivered in a sealed, signed envelope. Contact your RM if you cannot locate it.
              </Notice>
            </div>
          )}

          {/* ── Step 2 ── */}
          {loginMode === 'client' && step === 2 && (
            <div>
              <div style={stepTag}>Step 2 of 3</div>
              <div style={stepTitle}>Access Key</div>
              <p style={stepDesc}>Enter your 32-character hex access key. Issued at account activation via sealed document.</p>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: 14,
                background: 'var(--surf)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                marginBottom: 18,
              }}>
                <div style={{
                  width: 36, height: 36, background: 'rgba(196,164,74,0.1)', borderRadius: 6,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', flexShrink: 0,
                }}>
                  <KeyRound size={18} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--cream)' }}>Hex access key required</div>
                  <div style={{ fontSize: 10, color: 'var(--mist)', marginTop: 2 }}>Issued at activation · Never stored or shared by ZPF staff</div>
                </div>
              </div>
              <Field label="Access Key">
                <input
                  type={showKey ? 'text' : 'password'}
                  placeholder="32-character hex string"
                  autoComplete="off"
                  value={accessKey}
                  onChange={e => { setAccessKey(e.target.value); setKeyError('') }}
                  onKeyDown={e => e.key === 'Enter' && submitAccessKey()}
                  style={{ ...inputStyle, fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.05em', borderColor: keyError ? 'rgba(224,92,92,0.5)' : 'rgba(196,164,74,0.2)' }}
                />
                <FieldIcon onClick={() => setShowKey(p => !p)} clickable>
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </FieldIcon>
              </Field>
              {keyError && <ErrorMsg>{keyError}</ErrorMsg>}
              <PrimaryBtn onClick={submitAccessKey}>
                <ArrowRight size={15} /> Verify Access Key
              </PrimaryBtn>
              <GhostBtn onClick={() => prev(2)}><ArrowLeft size={15} /> Back</GhostBtn>
            </div>
          )}

          {/* ── Step 3 ── */}
          {loginMode === 'client' && step === 3 && (
            <div>
              <div style={stepTag}>Step 3 of 3</div>
              <div style={stepTitle}>Verification Code</div>
              <p style={stepDesc}>
                Enter the 6-digit code from your authenticator app.
              </p>

              {/* Auth source card */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                background: 'linear-gradient(135deg, rgba(196,164,74,0.07) 0%, rgba(196,164,74,0.03) 100%)',
                border: '1px solid rgba(196,164,74,0.18)', borderRadius: 'var(--radius)',
                marginBottom: 20, position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(196,164,74,0.3), transparent)' }} />
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: 'rgba(196,164,74,0.1)', border: '1px solid rgba(196,164,74,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <RefreshCw size={15} style={{ color: 'var(--gold)' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--cream)', letterSpacing: '.02em' }}>
                    auth.zpfinanz.ch
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--mist)', marginTop: 2 }}>
                    Time-based one-time code · refreshes every 30 seconds
                  </div>
                </div>
                <div style={{
                  fontSize: 9, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase',
                  color: 'var(--gold)', background: 'rgba(196,164,74,0.1)',
                  border: '1px solid rgba(196,164,74,0.2)', padding: '3px 9px', borderRadius: 20,
                  whiteSpace: 'nowrap',
                }}>
                  Live
                </div>
              </div>

              <div>
                <label style={fieldLabel}>One-Time Code</label>
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
                        background: verified ? 'rgba(29,158,117,0.08)' : totpError ? 'rgba(224,92,92,0.05)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${verified ? 'rgba(29,158,117,0.4)' : totpError ? 'rgba(224,92,92,0.4)' : 'rgba(196,164,74,0.2)'}`,
                        borderRadius: 'var(--radius)', textAlign: 'center',
                        fontFamily: 'var(--font-mono)', fontSize: 16, color: verified ? '#4ecda4' : totpError ? '#e05c5c' : 'var(--gold2)',
                        outline: 'none', caretColor: 'var(--gold)', transition: 'border-color .3s, color .3s, background .3s',
                      }}
                    />
                  ))}
                </div>
              </div>

              {totpError && <ErrorMsg style={{ marginTop: 12 }}>{totpError}</ErrorMsg>}

              {verified && (
                <>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    marginTop: 16, padding: '10px 14px',
                    background: 'rgba(29,158,117,0.08)', border: '1px solid rgba(29,158,117,0.25)',
                    borderRadius: 'var(--radius)', fontSize: 11, color: '#4ecda4',
                  }}>
                    <CheckCircle2 size={14} /> Code verified successfully
                  </div>
                  <PrimaryBtn style={{ marginTop: 10 }} onClick={enterDashboard}>
                    <LogIn size={15} /> Enter Portal — {findByPortalId(portalId.trim())?.session.role === 'trustee' ? 'Trustee' : 'Client'}
                  </PrimaryBtn>
                </>
              )}

              <GhostBtn onClick={() => prev(3)}><ArrowLeft size={15} /> Back</GhostBtn>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .login-page-wrapper {
            flex-direction: column !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
            height: auto !important;
          }
          .login-left-panel {
            width: 100% !important;
            flex-direction: row !important;
            align-items: center !important;
            justify-content: space-between !important;
            padding: calc(28px + var(--safe-top)) 24px 24px !important;
            border-bottom: 1px solid var(--border);
            flex-shrink: 0;
          }
          .login-hero, .login-footer-note { display: none !important; }
          .mobile-login-tagline { display: flex !important; }
          .login-right-panel {
            width: 100% !important;
            flex: 1 !important;
            border-left: none !important;
            padding: 20px 24px calc(24px + var(--safe-bottom)) !important;
            align-items: stretch !important;
            justify-content: flex-start !important;
            background: transparent !important;
            backdrop-filter: none !important;
          }
          input[type="text"],
          input[type="password"],
          input[type="email"],
          input[type="number"] {
            font-size: 16px !important;
          }
        }
      `}</style>
    </div>
  )
}

/* ── Mode tab ────────────────────────────────────────────── */

function ModeTab({ active, onClick, icon, label }: {
  active: boolean; onClick: () => void; icon: React.ReactNode; label: string
}) {
  return (
    <button onClick={onClick} style={{
      flex: 1, height: 36, borderRadius: 4,
      background: active ? 'rgba(196,164,74,0.15)' : 'transparent',
      border: active ? '1px solid rgba(196,164,74,0.3)' : '1px solid transparent',
      color: active ? 'var(--gold)' : 'var(--mist)',
      fontSize: 10, fontWeight: 500, letterSpacing: '.12em', textTransform: 'uppercase',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      transition: 'all .2s', cursor: 'pointer',
    }}>
      {icon} {label}
    </button>
  )
}

/* ── Shared sub-components ───────────────────────────────── */

const stepTag:   React.CSSProperties = { fontSize: 9,  letterSpacing: '.35em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 6 }
const stepTitle: React.CSSProperties = { fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 400, color: 'var(--cream)', marginBottom: 6 }
const stepDesc:  React.CSSProperties = { fontSize: 11, color: 'var(--mist)', lineHeight: 1.65, marginBottom: 28 }
const fieldLabel: React.CSSProperties = { display: 'block', fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 8 }
const inputStyle: React.CSSProperties = {
  width: '100%', height: 48,
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(196,164,74,0.2)',
  color: 'var(--cream)', fontSize: 13, padding: '0 44px 0 14px',
  borderRadius: 'var(--radius)', outline: 'none', letterSpacing: '.02em',
}
const securityBadge: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px',
  background: 'rgba(29,158,117,0.1)', border: '1px solid rgba(29,158,117,0.25)',
  borderRadius: 'var(--radius)', marginBottom: 20, fontSize: 11, color: '#4ecda4',
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={fieldLabel}>{label}</label>
      <div style={{ position: 'relative' }}>{children}</div>
    </div>
  )
}

function FieldIcon({ children, onClick, clickable }: { children: React.ReactNode; onClick?: () => void; clickable?: boolean }) {
  return (
    <div onClick={onClick} style={{
      position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
      color: 'var(--mist)', display: 'flex', cursor: clickable ? 'pointer' : 'default',
    }}>
      {children}
    </div>
  )
}

function PrimaryBtn({ children, onClick, style }: { children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', height: 48, background: 'var(--gold)', color: 'var(--navy)',
      fontSize: 11, fontWeight: 500, letterSpacing: '.2em', textTransform: 'uppercase',
      borderRadius: 'var(--radius)', marginTop: 8,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      transition: 'background .2s',
      ...style,
    }}>
      {children}
    </button>
  )
}

function GhostBtn({ children, onClick, style }: { children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', height: 42, background: 'transparent', color: 'var(--mist)',
      fontSize: 11, letterSpacing: '.15em', textTransform: 'uppercase',
      border: '1px solid rgba(138,154,176,0.2)', borderRadius: 'var(--radius)', marginTop: 10,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      ...style,
    }}>
      {children}
    </button>
  )
}

function ErrorMsg({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12,
      padding: '9px 12px', borderRadius: 'var(--radius)',
      background: 'rgba(224,92,92,0.08)', border: '1px solid rgba(224,92,92,0.25)',
      fontSize: 11, color: '#e05c5c', lineHeight: 1.5,
      ...style,
    }}>
      <span style={{ fontSize: 13, flexShrink: 0 }}>⚠</span>
      {children}
    </div>
  )
}

function Notice({ children, icon, style }: { children: React.ReactNode; icon: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      marginTop: 24, padding: '12px 14px',
      background: 'rgba(196,164,74,0.05)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', fontSize: 10, color: 'rgba(138,154,176,0.7)',
      lineHeight: 1.65, display: 'flex', gap: 10,
      ...style,
    }}>
      <span style={{ color: 'var(--gold3)', marginTop: 1, flexShrink: 0 }}>{icon}</span>
      {children}
    </div>
  )
}
