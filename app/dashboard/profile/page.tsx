'use client'

import Link from 'next/link'
import {
  Lock, Shield, Settings, ChevronRight, Globe, Mail,
  Calendar, MapPin, BadgeCheck, AlertTriangle, User,
  Building2, Briefcase, Clock,
} from 'lucide-react'
import { mockUser, mockRM, mockPortfolio } from '@/lib/mock-data'

export default function ProfilePage() {
  const kycExpiry = new Date('2027-03-14')
  const today = new Date('2026-04-01')
  const daysToKycExpiry = Math.ceil((kycExpiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  const kycSoonExpiring = daysToKycExpiry < 180

  return (
    <div>
      {/* ── Header ──────────────────────────────── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, color: 'var(--cream)' }}>
          Client Profile
        </div>
        <div style={{ fontSize: 10, color: 'var(--mist)', marginTop: 4, letterSpacing: '.05em' }}>
          {mockUser.id} · Identity and account information · Read-only
        </div>
      </div>

      {/* ── Profile hero ────────────────────────── */}
      <div style={{
        background: 'var(--surf)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '28px 28px 24px',
        marginBottom: 20, display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap',
      }}>
        {/* Avatar */}
        <div style={{
          width: 72, height: 72, borderRadius: 18, flexShrink: 0,
          background: 'rgba(196,164,74,0.12)', border: '1.5px solid rgba(196,164,74,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--gold2)',
          overflow: 'hidden',
        }}>
          {mockUser.initials}
        </div>

        {/* Identity */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 400, color: 'var(--cream)', marginBottom: 4 }}>
            {mockUser.fullName}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--gold)', letterSpacing: '.08em', marginBottom: 12 }}>
            {mockUser.id}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <StatusPill
              icon={<BadgeCheck size={10} />}
              label={mockUser.accountStatus}
              color="#1D9E75"
              bg="rgba(29,158,117,0.1)"
            />
            <StatusPill
              icon={<Shield size={10} />}
              label={`KYC ${mockUser.kycStatus}`}
              color="#1D9E75"
              bg="rgba(29,158,117,0.1)"
            />
            <StatusPill
              icon={<Briefcase size={10} />}
              label={mockUser.mandateType}
              color="var(--gold)"
              bg="rgba(196,164,74,0.1)"
            />
            <StatusPill
              icon={<User size={10} />}
              label={mockUser.riskProfile}
              color="#8A9AB0"
              bg="rgba(138,154,176,0.08)"
            />
          </div>
        </div>

        {/* Onboarded */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 8, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 4 }}>Client Since</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--cream)' }}>{mockUser.onboardedAt}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="prof-grid">

        {/* ── Identity ──────────────────────────── */}
        <Section
          icon={<Lock size={13} />}
          title="Identity"
          subtitle="Managed by ZPF — contact your RM to request amendments"
          notice
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Full Legal Name"    value={mockUser.fullName}    icon={<User size={11} />} />
            <Field label="Date of Birth"      value={mockUser.dateOfBirth} icon={<Calendar size={11} />} />
            <Field label="Nationality"        value={mockUser.nationality} icon={<Globe size={11} />} />
            <Field label="Domicile"           value={mockUser.domicile}    icon={<MapPin size={11} />} />
          </div>
          <div style={{ height: 1, background: 'rgba(196,164,74,0.08)', margin: '14px 0' }} />
          <Field label="Email Address" value={mockUser.email} icon={<Mail size={11} />} mono />
        </Section>

        {/* ── Account ───────────────────────────── */}
        <Section icon={<Shield size={13} />} title="Account Details" subtitle="KYC and mandate configuration">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Client ID"      value={mockUser.id}            mono />
            <Field label="Onboarded"      value={mockUser.onboardedAt}   />
            <Field label="Risk Profile"   value={mockUser.riskProfile}   />
            <Field label="Mandate Type"   value={mockUser.mandateType}   />
            <Field label="Mandate Revised" value={mockUser.mandateRevisedAt} />
            <div>
              <div style={{ fontSize: 8, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 4 }}>
                KYC Status
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <BadgeCheck size={12} style={{ color: '#1D9E75', flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: '#1D9E75', fontWeight: 500 }}>{mockUser.kycStatus}</span>
              </div>
            </div>
          </div>

          <div style={{ height: 1, background: 'rgba(196,164,74,0.08)', margin: '14px 0' }} />

          {/* KYC expiry row */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 12px',
            borderRadius: 8,
            background: kycSoonExpiring ? 'rgba(217,119,6,0.06)' : 'rgba(29,158,117,0.06)',
            border: `1px solid ${kycSoonExpiring ? 'rgba(217,119,6,0.2)' : 'rgba(29,158,117,0.15)'}`,
          }}>
            {kycSoonExpiring
              ? <AlertTriangle size={11} style={{ color: '#d97706', marginTop: 1, flexShrink: 0 }} />
              : <BadgeCheck size={11} style={{ color: '#1D9E75', marginTop: 1, flexShrink: 0 }} />
            }
            <div>
              <div style={{ fontSize: 9, fontWeight: 500, color: kycSoonExpiring ? '#d97706' : '#1D9E75', marginBottom: 2 }}>
                KYC Valid Until {mockUser.kycExpiresAt}
              </div>
              <div style={{ fontSize: 9, color: 'var(--mist)' }}>
                {kycSoonExpiring
                  ? `Renewal due in ${daysToKycExpiry} days — ZPF compliance will contact you`
                  : `Next renewal due ${mockUser.kycExpiresAt} · Verified ${mockUser.kycVerifiedAt}`
                }
              </div>
            </div>
          </div>
        </Section>

        {/* ── Relationship Manager ──────────────── */}
        <Section icon={<Briefcase size={13} />} title="Relationship Manager" subtitle="Your dedicated ZPF contact">
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12, flexShrink: 0,
              background: 'rgba(196,164,74,0.12)', border: '1px solid rgba(196,164,74,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--gold2)',
              overflow: 'hidden',
            }}>
              {mockRM.initials}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--cream)', marginBottom: 3 }}>{mockRM.name}</div>
              <div style={{ fontSize: 9, color: 'var(--mist)', marginBottom: 8 }}>{mockRM.title}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1D9E75', flexShrink: 0 }} />
                <span style={{ fontSize: 9, color: '#1D9E75' }}>{mockRM.availability}</span>
              </div>
            </div>
          </div>

          <div style={{ height: 1, background: 'rgba(196,164,74,0.08)', margin: '14px 0' }} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <div style={{ fontSize: 8, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 4 }}>Email</div>
              <div style={{ fontSize: 10, color: 'var(--cream)', fontFamily: 'var(--font-mono)' }}>{mockRM.email}</div>
            </div>
            <div>
              <div style={{ fontSize: 8, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 4 }}>Next Scheduled Call</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Clock size={10} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: 'var(--cream)' }}>{mockRM.nextCall}</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <Link href="/dashboard/messages" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase',
              color: 'var(--gold)', border: '1px solid var(--border2)',
              padding: '7px 14px', borderRadius: 20, cursor: 'pointer',
            }}>
              Send Secure Message <ChevronRight size={10} />
            </Link>
          </div>
        </Section>

        {/* ── Custodian ─────────────────────────── */}
        <Section icon={<Building2 size={13} />} title="Custodian" subtitle="Primary asset custody arrangement">
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 14 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, flexShrink: 0,
              background: 'rgba(55,138,221,0.1)', border: '1px solid rgba(55,138,221,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Building2 size={16} style={{ color: '#378ADD' }} />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--cream)', marginBottom: 3 }}>
                {mockPortfolio.custodian.name}
              </div>
              <div style={{ fontSize: 9, color: 'var(--mist)', lineHeight: 1.6 }}>
                {mockPortfolio.custodian.address}
              </div>
            </div>
          </div>

          <div style={{ height: 1, background: 'rgba(196,164,74,0.08)', margin: '14px 0' }} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Jurisdiction"  value="Switzerland" />
            <Field label="Regulated By"  value="FINMA" />
            <Field label="Deposit Scheme" value="esisuisse (up to CHF 100k)" />
            <Field label="Reporting"     value="Annual FATCA / CRS" />
          </div>
        </Section>

      </div>

      {/* ── Quick links ─────────────────────────── */}
      <div style={{
        display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap',
      }}>
        <QuickLink href="/dashboard/settings" icon={<Settings size={13} />} label="Account Preferences" sub="Currency, timezone, notifications" />
        <QuickLink href="/dashboard/security" icon={<Shield size={13} />} label="Security Settings" sub="Sessions, passphrase, 2FA" />
      </div>

      <style>{`
        @media (max-width: 900px) { .prof-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}

/* ── Sub-components ───────────────────────────────────────── */

function Section({ icon, title, subtitle, notice, children }: {
  icon: React.ReactNode; title: string; subtitle: string; notice?: boolean; children: React.ReactNode
}) {
  return (
    <div style={{
      background: 'var(--navy)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: '20px 22px',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 18 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8, flexShrink: 0,
          background: 'rgba(196,164,74,0.1)', border: '1px solid rgba(196,164,74,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)',
        }}>
          {icon}
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--cream)' }}>{title}</div>
          <div style={{ fontSize: 9, color: 'var(--mist)', marginTop: 2 }}>{subtitle}</div>
        </div>
        {notice && (
          <div style={{
            marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 8, letterSpacing: '.1em', textTransform: 'uppercase',
            color: 'var(--mist)', background: 'var(--surf)', border: '1px solid var(--border)',
            padding: '3px 8px', borderRadius: 4,
          }}>
            <Lock size={8} /> Admin-Managed
          </div>
        )}
      </div>
      {children}
    </div>
  )
}

function Field({ label, value, icon, mono }: { label: string; value: string; icon?: React.ReactNode; mono?: boolean }) {
  return (
    <div>
      <div style={{ fontSize: 8, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        {icon && <span style={{ color: 'var(--mist)', flexShrink: 0 }}>{icon}</span>}
        <span style={{ fontSize: 11, color: 'var(--cream)', fontFamily: mono ? 'var(--font-mono)' : 'inherit' }}>{value}</span>
      </div>
    </div>
  )
}

function StatusPill({ icon, label, color, bg }: { icon: React.ReactNode; label: string; color: string; bg: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 9, fontWeight: 500,
      padding: '3px 9px', borderRadius: 20, background: bg, color,
    }}>
      {icon} {label}
    </span>
  )
}

function QuickLink({ href, icon, label, sub }: { href: string; icon: React.ReactNode; label: string; sub: string }) {
  return (
    <Link href={href} style={{
      display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 220,
      padding: '14px 18px', borderRadius: 'var(--radius-lg)',
      background: 'var(--surf)', border: '1px solid var(--border)', cursor: 'pointer',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
        background: 'rgba(196,164,74,0.1)', border: '1px solid rgba(196,164,74,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)',
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--cream)', marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 9, color: 'var(--mist)' }}>{sub}</div>
      </div>
      <ChevronRight size={13} style={{ color: 'var(--mist)', flexShrink: 0 }} />
    </Link>
  )
}
