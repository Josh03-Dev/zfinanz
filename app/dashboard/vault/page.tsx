'use client'

import { useState } from 'react'
import {
  Archive, FileBadge, Home, ScrollText, FileText,
  ShieldAlert, Landmark, Download, FilePlus,
  ShieldCheck, HardDrive, File, CircleAlert,
  ChevronDown, ChevronUp, MapPin, Clock,
} from 'lucide-react'
import { mockVaultDocuments, type VaultDocument, type DocCategory, type DocStatus } from '@/lib/mock-data'

const CATEGORY_FILTERS: { key: DocCategory | 'all'; label: string }[] = [
  { key: 'all',        label: 'All' },
  { key: 'corporate',  label: 'Corporate' },
  { key: 'property',   label: 'Property' },
  { key: 'succession', label: 'Succession' },
  { key: 'legal',      label: 'Legal' },
  { key: 'financial',  label: 'Financial' },
]

const STATUS_META: Record<DocStatus, { label: string; bg: string; color: string; icon: React.ReactNode }> = {
  secured: { label: 'Secured',     bg: 'rgba(29,158,117,0.12)',  color: '#4ecda4',  icon: <ShieldCheck size={10} /> },
  sealed:  { label: 'Sealed',      bg: 'rgba(196,164,74,0.12)',  color: '#dfc27a',  icon: <Archive size={10} /> },
  review:  { label: 'Review due',  bg: 'rgba(216,90,48,0.12)',   color: '#f0997b',  icon: <CircleAlert size={10} /> },
  pending: { label: 'Pending',     bg: 'rgba(138,154,176,0.1)',  color: '#8A9AB0',  icon: <Clock size={10} /> },
}

const STORAGE_META: Record<string, { label: string; icon: React.ReactNode }> = {
  both:     { label: 'Physical + Digital', icon: <><HardDrive size={9} /><File size={9} /></> },
  physical: { label: 'Physical only',      icon: <HardDrive size={9} /> },
  digital:  { label: 'Digital only',       icon: <File size={9} /> },
}

export default function VaultPage() {
  const [category, setCategory]     = useState<DocCategory | 'all'>('all')
  const [expanded, setExpanded]     = useState<string | null>(null)

  const filtered = mockVaultDocuments.filter(d => category === 'all' || d.category === category)

  const counts = {
    total:   mockVaultDocuments.length,
    secured: mockVaultDocuments.filter(d => d.status === 'secured').length,
    sealed:  mockVaultDocuments.filter(d => d.status === 'sealed').length,
    review:  mockVaultDocuments.filter(d => d.status === 'review').length,
  }

  return (
    <div>
      {/* ── Header ─────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 12, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, color: 'var(--cream)' }}>
            Document Vault
          </div>
          <div style={{ fontSize: 10, color: 'var(--mist)', marginTop: 4, letterSpacing: '.05em' }}>
            ZPF-7741-0038 · Physical &amp; digital archive · Zürich HB · Last lodgement: 22 Jul 2025
          </div>
        </div>
        <button style={{
          fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--gold)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
          border: '1px solid var(--border2)', padding: '7px 14px', borderRadius: 20, background: 'transparent',
        }}>
          <FilePlus size={12} /> Lodge Document
        </button>
      </div>

      {/* ── Summary strip ───────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }} className="vault-kpi-grid">
        <SummaryCard icon={<Archive size={16} />}     label="Total Documents" value={String(counts.total)}   sub="Across all categories"     color="var(--gold)" />
        <SummaryCard icon={<ShieldCheck size={16} />} label="Secured"         value={String(counts.secured)} sub="Verified & in custody"     color="#4ecda4" />
        <SummaryCard icon={<Archive size={16} />}     label="Sealed"          value={String(counts.sealed)}  sub="Conditional release only"  color="#dfc27a" />
        <SummaryCard icon={<CircleAlert size={16} />} label="Review Due"      value={String(counts.review)}  sub="Action required"           color="#f0997b" warn />
      </div>

      {/* ── Review alert ────────────────────── */}
      {counts.review > 0 && (
        <div style={{
          display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 16px',
          background: 'rgba(216,90,48,0.06)', border: '1px solid rgba(216,90,48,0.22)',
          borderRadius: 'var(--radius-lg)', marginBottom: 20,
        }}>
          <CircleAlert size={14} style={{ color: '#f0997b', flexShrink: 0, marginTop: 1 }} />
          <div style={{ fontSize: 10, color: 'rgba(244,239,230,0.6)', lineHeight: 1.6 }}>
            <span style={{ color: '#f0997b', fontWeight: 500 }}>1 document requires attention</span> — the Power of Attorney for Dr. K. Adebayo was due for review in January 2026.
            Please contact your Relationship Manager to renew or revoke this instrument.
          </div>
        </div>
      )}

      {/* ── Category filter ─────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4, marginBottom: 16, flexWrap: 'wrap',
        background: 'var(--surf)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: 4, width: 'fit-content',
      }}>
        {CATEGORY_FILTERS.map(f => (
          <button key={f.key} onClick={() => setCategory(f.key)} style={{
            padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 500,
            letterSpacing: '.04em', cursor: 'pointer', border: 'none',
            background: category === f.key ? 'var(--gold)' : 'transparent',
            color: category === f.key ? 'var(--navy)' : 'var(--mist)',
          }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Document list ───────────────────── */}
      <div style={{ background: 'var(--navy)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 20 }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--mist)', fontSize: 13 }}>
            No documents in this category
          </div>
        ) : (
          filtered.map((doc, i) => (
            <DocRow
              key={doc.id}
              doc={doc}
              last={i === filtered.length - 1}
              expanded={expanded === doc.id}
              onToggle={() => setExpanded(expanded === doc.id ? null : doc.id)}
            />
          ))
        )}
      </div>

      {/* ── Vault security info ─────────────── */}
      <div style={{
        background: 'var(--navy)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '20px 24px',
      }}>
        <div style={{ fontSize: 9, letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 16 }}>
          Vault Security
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }} className="vault-sec-grid">
          {[
            { icon: <MapPin size={13} />,      title: 'Physical Storage',     body: 'ZPF Vault · Bahnhofstrasse 72, Zürich · Grade X · Biometric access · 24/7 armed guard' },
            { icon: <HardDrive size={13} />,   title: 'Digital Archive',      body: 'AES-256 encrypted · Redundant off-site backup · Air-gapped primary server · Zürich data centre' },
            { icon: <ShieldCheck size={13} />, title: 'Access & Compliance',  body: 'Dual-authorisation for sealed documents · Full audit log · FINMA-regulated document custody' },
          ].map(item => (
            <div key={item.title} style={{ display: 'flex', gap: 12 }}>
              <div style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 2 }}>{item.icon}</div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--cream)', marginBottom: 5 }}>{item.title}</div>
                <div style={{ fontSize: 10, color: 'var(--mist)', lineHeight: 1.6 }}>{item.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 1024px) {
          .vault-kpi-grid  { grid-template-columns: repeat(2,1fr) !important; }
          .vault-sec-grid  { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .vault-kpi-grid  { grid-template-columns: 1fr 1fr !important; }
          .doc-meta-row    { display: none !important; }
        }
      `}</style>
    </div>
  )
}

/* ── Sub-components ───────────────────────────────────────── */

function DocRow({ doc, last, expanded, onToggle }: {
  doc: VaultDocument; last: boolean; expanded: boolean; onToggle: () => void
}) {
  const status  = STATUS_META[doc.status]
  const storage = STORAGE_META[doc.storage]

  return (
    <div style={{ borderBottom: last ? 'none' : '1px solid rgba(196,164,74,0.06)' }}>
      {/* Main row */}
      <div
        onClick={onToggle}
        style={{
          display: 'flex', alignItems: 'center', gap: 14, padding: '15px 22px',
          cursor: 'pointer',
        }}
      >
        {/* Icon */}
        <div style={{
          width: 36, height: 36, borderRadius: 9, flexShrink: 0,
          background: 'rgba(138,154,176,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--mist)',
        }}>
          <DocIcon icon={doc.icon} />
        </div>

        {/* Name + meta */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--cream)', marginBottom: 3 }}>{doc.name}</div>
          <div className="doc-meta-row" style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 9, color: 'var(--mist)' }}>{doc.jurisdiction}</span>
            <span style={{ fontSize: 9, color: 'rgba(138,154,176,0.4)' }}>·</span>
            <span style={{ fontSize: 9, color: 'var(--mist)' }}>Lodged {doc.lodgedDate}</span>
            <span style={{ fontSize: 9, color: 'rgba(138,154,176,0.4)' }}>·</span>
            <span style={{ fontSize: 9, color: 'var(--mist)', fontFamily: 'var(--font-mono)' }}>{doc.ref}</span>
            {doc.relatedAsset && (
              <>
                <span style={{ fontSize: 9, color: 'rgba(138,154,176,0.4)' }}>·</span>
                <span style={{ fontSize: 9, color: 'var(--gold2)' }}>{doc.relatedAsset}</span>
              </>
            )}
          </div>
        </div>

        {/* Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <span style={{
            fontSize: 8, fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase',
            padding: '3px 8px', borderRadius: 4,
            background: status.bg, color: status.color,
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            {status.icon} {status.label}
          </span>
          <span style={{
            fontSize: 8, letterSpacing: '.06em', padding: '3px 8px', borderRadius: 4,
            background: 'rgba(138,154,176,0.08)', color: 'var(--mist)',
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            {storage.icon} <span style={{ marginLeft: 2 }}>{storage.label}</span>
          </span>
        </div>

        {/* Expand chevron */}
        <div style={{ color: 'var(--mist)', flexShrink: 0 }}>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div style={{
          padding: '0 22px 18px 72px',
          borderTop: '1px solid rgba(196,164,74,0.06)',
          paddingTop: 14,
        }}>
          {/* Description */}
          <div style={{ fontSize: 11, color: 'var(--mist)', lineHeight: 1.7, marginBottom: 14 }}>
            {doc.description}
          </div>

          {/* Detail grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px 20px', marginBottom: 14 }} className="doc-detail-grid">
            <DetailCell label="Category"   value={doc.category.charAt(0).toUpperCase() + doc.category.slice(1)} />
            <DetailCell label="Jurisdiction" value={doc.jurisdiction} />
            <DetailCell label="Pages"      value={doc.pages ? `${doc.pages} pages` : 'Sealed'} />
            <DetailCell label="Review Date" value={doc.reviewDate ?? 'None scheduled'} warn={doc.status === 'review'} />
          </div>

          {/* Notes */}
          {doc.notes && (
            <div style={{
              fontSize: 10, color: 'rgba(138,154,176,0.6)', lineHeight: 1.6,
              background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', padding: '10px 14px', marginBottom: 14,
            }}>
              <span style={{ color: 'var(--mist)', fontWeight: 500 }}>Note: </span>{doc.notes}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8 }}>
            {doc.status !== 'sealed' && (
              <ActionBtn icon={<Download size={11} />}>Download</ActionBtn>
            )}
            <ActionBtn icon={<FileText size={11} />}>View Details</ActionBtn>
          </div>
        </div>
      )}
    </div>
  )
}

function DocIcon({ icon }: { icon: string }) {
  const map: Record<string, React.ReactNode> = {
    'file-badge':    <FileBadge size={15} />,
    'home':          <Home size={15} />,
    'scroll-text':   <ScrollText size={15} />,
    'file-text':     <FileText size={15} />,
    'shield-alert':  <ShieldAlert size={15} />,
    'landmark':      <Landmark size={15} />,
  }
  return <>{map[icon] ?? <Archive size={15} />}</>
}

function SummaryCard({ icon, label, value, sub, color, warn }: {
  icon: React.ReactNode; label: string; value: string; sub: string; color: string; warn?: boolean
}) {
  return (
    <div style={{
      background: warn ? 'rgba(216,90,48,0.05)' : 'var(--surf)',
      border: `1px solid ${warn ? 'rgba(216,90,48,0.2)' : 'var(--border)'}`,
      borderRadius: 'var(--radius-lg)', padding: '16px 20px',
      display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 7,
          background: `${color}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color, flexShrink: 0,
        }}>
          {icon}
        </div>
        <div style={{ fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--mist)' }}>{label}</div>
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 400, color, lineHeight: 1, marginBottom: 3 }}>{value}</div>
        <div style={{ fontSize: 9, color: 'var(--mist)' }}>{sub}</div>
      </div>
    </div>
  )
}

function DetailCell({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div>
      <div style={{ fontSize: 8, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 11, color: warn ? '#f0997b' : 'var(--cream)', fontWeight: warn ? 500 : 400 }}>{value}</div>
    </div>
  )
}

function ActionBtn({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button style={{
      fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase',
      color: 'var(--gold)', cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 5,
      border: '1px solid var(--border2)', padding: '5px 12px', borderRadius: 20,
      background: 'transparent',
    }}>
      {icon}{children}
    </button>
  )
}
