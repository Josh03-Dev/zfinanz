'use client'

import { useState } from 'react'
import {
  UserCheck, ChevronDown, ChevronUp, BadgeCheck, Clock,
  AlertTriangle, Shield, Eye, ArrowLeftRight, Lock,
  Phone, Globe, MapPin, Calendar, User,
} from 'lucide-react'
import { mockTrustees, type Trustee, type TrusteeStatus, type TrusteeAccessLevel } from '@/lib/mock-data'

const STATUS_META: Record<TrusteeStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  'active':      { label: 'Active',      color: '#1D9E75', bg: 'rgba(29,158,117,0.1)',   icon: <BadgeCheck size={11} /> },
  'pending-kyc': { label: 'Pending KYC', color: '#C4A44A', bg: 'rgba(196,164,74,0.1)',  icon: <Clock size={11} /> },
  'suspended':   { label: 'Suspended',   color: '#DD7777', bg: 'rgba(221,119,119,0.1)', icon: <AlertTriangle size={11} /> },
}

const ACCESS_META: Record<TrusteeAccessLevel, { label: string; color: string; bg: string; icon: React.ReactNode; desc: string }> = {
  'view-only': { label: 'View Only',  color: '#8A9AB0', bg: 'rgba(138,154,176,0.08)', icon: <Eye size={11} />,           desc: 'Can view portfolio and statements only' },
  'transact':  { label: 'Transact',   color: '#378ADD', bg: 'rgba(55,138,221,0.1)',   icon: <ArrowLeftRight size={11} />, desc: 'Can initiate transfer requests — RM approval still required' },
  'full':      { label: 'Full Access', color: '#C4A44A', bg: 'rgba(196,164,74,0.1)',  icon: <Shield size={11} />,         desc: 'Full account access — equivalent to primary account holder' },
}

const KYC_META: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  'Verified': { color: '#1D9E75', bg: 'rgba(29,158,117,0.1)',   icon: <BadgeCheck size={10} /> },
  'Pending':  { color: '#C4A44A', bg: 'rgba(196,164,74,0.1)',  icon: <Clock size={10} /> },
  'Expired':  { color: '#DD7777', bg: 'rgba(221,119,119,0.1)', icon: <AlertTriangle size={10} /> },
}

export default function TrusteesPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const activeCount  = mockTrustees.filter(t => t.status === 'active').length
  const pendingCount = mockTrustees.filter(t => t.status === 'pending-kyc').length

  return (
    <div>
      {/* ── Header ──────────────────────────────── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, color: 'var(--cream)' }}>
          Trustees
        </div>
        <div style={{ fontSize: 10, color: 'var(--mist)', marginTop: 4, letterSpacing: '.05em' }}>
          ZPF-7741-0038 · Authorised sub-account holders · All access levels are admin-managed
        </div>
      </div>

      {/* ── KPI strip ───────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }} className="trustee-kpi-grid">
        <KpiCard icon={<UserCheck size={14} />}     label="Total Trustees"    value={String(mockTrustees.length)} sub="Registered sub-holders"  color="#C4A44A" />
        <KpiCard icon={<BadgeCheck size={14} />}    label="Active"            value={String(activeCount)}          sub="KYC verified & enabled"  color="#1D9E75" />
        <KpiCard icon={<Clock size={14} />}         label="Pending KYC"       value={String(pendingCount)}         sub="Awaiting verification"   color="#C4A44A" highlight />
      </div>

      {/* ── Notice ──────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 16px', marginBottom: 16,
        background: 'rgba(196,164,74,0.05)', border: '1px solid rgba(196,164,74,0.18)', borderRadius: 10,
      }}>
        <Lock size={12} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontSize: 10, color: 'rgba(196,164,74,0.85)', lineHeight: 1.6 }}>
          Trustee access levels and KYC status are managed exclusively by ZPF administration. To add, amend, or remove a trustee, contact Dr. von Steiner. Changes require compliance verification and may take up to 5 business days.
        </span>
      </div>

      {/* ── Trustee list ────────────────────────── */}
      <div style={{ background: 'var(--navy)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        {mockTrustees.map((trustee, i) => (
          <TrusteeRow
            key={trustee.id}
            trustee={trustee}
            last={i === mockTrustees.length - 1}
            expanded={expandedId === trustee.id}
            onToggle={() => setExpandedId(expandedId === trustee.id ? null : trustee.id)}
          />
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) { .trustee-kpi-grid { grid-template-columns: 1fr 1fr !important; } .trustee-meta-cols { display: none !important; } }
      `}</style>
    </div>
  )
}

/* ── TrusteeRow ───────────────────────────────────────────── */

function TrusteeRow({ trustee, last, expanded, onToggle }: {
  trustee: Trustee; last: boolean; expanded: boolean; onToggle: () => void
}) {
  const status = STATUS_META[trustee.status]
  const access = ACCESS_META[trustee.accessLevel]
  const kyc    = KYC_META[trustee.kycStatus]

  return (
    <div style={{ borderBottom: last && !expanded ? 'none' : '1px solid rgba(196,164,74,0.06)' }}>
      {/* ── Summary row ── */}
      <div
        onClick={onToggle}
        style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 22px', cursor: 'pointer' }}
      >
        {/* Avatar */}
        <div style={{
          width: 40, height: 40, borderRadius: 12, flexShrink: 0,
          background: 'rgba(196,164,74,0.1)', border: '1px solid rgba(196,164,74,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--gold2)',
          overflow: 'hidden',
        }}>
          {trustee.initials}
        </div>

        {/* Name + relation */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--cream)' }}>{trustee.fullName}</span>
            <span style={{
              fontSize: 8, letterSpacing: '.08em', textTransform: 'uppercase',
              padding: '2px 7px', borderRadius: 3,
              background: 'rgba(138,154,176,0.1)', color: 'var(--mist)',
            }}>
              {trustee.relation}
            </span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--mist)' }}>{trustee.id}</div>
        </div>

        {/* Meta columns */}
        <div className="trustee-meta-cols" style={{ display: 'flex', gap: 28, alignItems: 'center', flexShrink: 0 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 8, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 3 }}>Access</div>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 9, fontWeight: 500,
              padding: '2px 8px', borderRadius: 20, background: access.bg, color: access.color,
            }}>
              {access.icon} {access.label}
            </span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 8, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 3 }}>KYC</div>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 9, fontWeight: 500,
              padding: '2px 8px', borderRadius: 20, background: kyc.bg, color: kyc.color,
            }}>
              {kyc.icon} {trustee.kycStatus}
            </span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 8, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 3 }}>Added</div>
            <div style={{ fontSize: 10, color: 'var(--cream)' }}>{trustee.onboardedAt}</div>
          </div>
        </div>

        {/* Status + toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <span style={{
            display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, fontWeight: 500,
            padding: '3px 9px', borderRadius: 20, background: status.bg, color: status.color,
          }}>
            {status.icon} {status.label}
          </span>
          {expanded
            ? <ChevronUp size={13} style={{ color: 'var(--mist)' }} />
            : <ChevronDown size={13} style={{ color: 'var(--mist)' }} />
          }
        </div>
      </div>

      {/* ── Expanded detail ── */}
      {expanded && (
        <div style={{
          margin: '0 22px 18px', padding: '20px 22px',
          background: 'rgba(255,255,255,0.025)', border: '1px solid var(--border)',
          borderRadius: 10,
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, marginBottom: 20 }} className="trustee-detail-grid">
            {/* Left col — identity */}
            <div style={{ borderRight: '1px solid rgba(196,164,74,0.08)', paddingRight: 20 }}>
              <SectionLabel>Identity</SectionLabel>
              <div style={{ display: 'grid', gap: 14 }}>
                <DetailField label="Full Name"    value={trustee.fullName}    icon={<User size={10} />} />
                <DetailField label="Date of Birth" value={trustee.dateOfBirth} icon={<Calendar size={10} />} />
                <DetailField label="Nationality"  value={trustee.nationality} icon={<Globe size={10} />} />
                <DetailField label="Domicile"     value={trustee.domicile}    icon={<MapPin size={10} />} />
                <DetailField label="Phone"        value={trustee.phoneNumber} icon={<Phone size={10} />} mono />
              </div>
            </div>

            {/* Mid col — account */}
            <div style={{ borderRight: '1px solid rgba(196,164,74,0.08)', padding: '0 20px' }}>
              <SectionLabel>Account</SectionLabel>
              <div style={{ display: 'grid', gap: 14 }}>
                <DetailField label="Sub-ID"      value={trustee.id}          mono />
                <DetailField label="Relation"    value={trustee.relation}    />
                <DetailField label="Onboarded"   value={trustee.onboardedAt} />
                <DetailField label="Added By"    value={trustee.addedBy}     />
              </div>
            </div>

            {/* Right col — access & KYC */}
            <div style={{ paddingLeft: 20 }}>
              <SectionLabel>Access & KYC</SectionLabel>
              <div style={{ display: 'grid', gap: 14 }}>
                {/* Access level */}
                <div>
                  <div style={{ fontSize: 8, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 6 }}>Access Level</div>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 500,
                    padding: '3px 10px', borderRadius: 20, background: access.bg, color: access.color, marginBottom: 5,
                  }}>
                    {access.icon} {access.label}
                  </span>
                  <div style={{ fontSize: 9, color: 'var(--mist)', lineHeight: 1.5 }}>{access.desc}</div>
                </div>

                {/* KYC */}
                <div>
                  <div style={{ fontSize: 8, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 6 }}>KYC Status</div>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 500,
                    padding: '3px 10px', borderRadius: 20, background: kyc.bg, color: kyc.color, marginBottom: 5,
                  }}>
                    {kyc.icon} {trustee.kycStatus}
                  </span>
                  {trustee.kycVerifiedAt && (
                    <div style={{ fontSize: 9, color: 'var(--mist)' }}>Verified {trustee.kycVerifiedAt}</div>
                  )}
                  {trustee.kycExpiresAt && (
                    <div style={{ fontSize: 9, color: 'var(--mist)' }}>Valid until {trustee.kycExpiresAt}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {trustee.notes && (
            <>
              <div style={{ height: 1, background: 'rgba(196,164,74,0.08)', marginBottom: 14 }} />
              <div style={{
                padding: '10px 14px', borderRadius: 8,
                background: trustee.status === 'pending-kyc' ? 'rgba(196,164,74,0.05)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${trustee.status === 'pending-kyc' ? 'rgba(196,164,74,0.2)' : 'rgba(255,255,255,0.06)'}`,
              }}>
                <div style={{
                  fontSize: 8, letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 5,
                  color: trustee.status === 'pending-kyc' ? 'var(--gold)' : 'var(--mist)',
                }}>Notes</div>
                <div style={{ fontSize: 10, color: 'var(--cream)', lineHeight: 1.6 }}>{trustee.notes}</div>
              </div>
            </>
          )}

          {/* Pending KYC CTA */}
          {trustee.status === 'pending-kyc' && (
            <div style={{ marginTop: 14 }}>
              <button style={{
                fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase',
                padding: '7px 16px', borderRadius: 8, cursor: 'pointer',
                background: 'rgba(196,164,74,0.1)', border: '1px solid var(--border2)', color: 'var(--gold)',
              }}>
                Contact RM — Expedite Verification
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ── Sub-components ───────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 8, letterSpacing: '.25em', textTransform: 'uppercase',
      color: 'var(--gold)', marginBottom: 14, paddingBottom: 8,
      borderBottom: '1px solid rgba(196,164,74,0.1)',
    }}>
      {children}
    </div>
  )
}

function DetailField({ label, value, icon, mono }: { label: string; value: string; icon?: React.ReactNode; mono?: boolean }) {
  return (
    <div>
      <div style={{ fontSize: 8, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 4 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        {icon && <span style={{ color: 'var(--mist)', flexShrink: 0 }}>{icon}</span>}
        <span style={{ fontSize: 11, color: 'var(--cream)', fontFamily: mono ? 'var(--font-mono)' : 'inherit' }}>{value}</span>
      </div>
    </div>
  )
}

function KpiCard({ icon, label, value, sub, color, highlight }: {
  icon: React.ReactNode; label: string; value: string; sub: string; color: string; highlight?: boolean
}) {
  return (
    <div style={{
      background: highlight ? `${color}08` : 'var(--surf)',
      border: `1px solid ${highlight ? `${color}30` : 'var(--border)'}`,
      borderRadius: 'var(--radius-lg)', padding: '16px 20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 7, flexShrink: 0,
          background: `${color}18`, color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{icon}</div>
        <div style={{ fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--mist)' }}>{label}</div>
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, color, lineHeight: 1, marginBottom: 3 }}>{value}</div>
      <div style={{ fontSize: 9, color: 'var(--mist)' }}>{sub}</div>
    </div>
  )
}
