'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Bell, MessageSquare, ArrowLeftRight, FileText, Shield,
  Archive, AlertTriangle, CheckCircle2, ChevronRight, Check,
} from 'lucide-react'
import { mockNotifications, type AppNotification, type NotificationType } from '@/lib/mock-data'

const TYPE_META: Record<NotificationType, { icon: React.ReactNode; color: string; bg: string; groupLabel: string }> = {
  NEW_MESSAGE:           { icon: <MessageSquare size={14} />,   color: '#C4A44A', bg: 'rgba(196,164,74,0.1)',  groupLabel: 'Messages' },
  TRANSFER_APPROVED:     { icon: <ArrowLeftRight size={14} />,  color: '#1D9E75', bg: 'rgba(29,158,117,0.1)',  groupLabel: 'Transfers' },
  TRANSFER_REJECTED:     { icon: <ArrowLeftRight size={14} />,  color: '#DD7777', bg: 'rgba(221,119,119,0.1)', groupLabel: 'Transfers' },
  TRANSFER_EXECUTED:     { icon: <ArrowLeftRight size={14} />,  color: '#1D9E75', bg: 'rgba(29,158,117,0.1)',  groupLabel: 'Transfers' },
  DOCUMENT_LODGED:       { icon: <Archive size={14} />,         color: '#8A9AB0', bg: 'rgba(138,154,176,0.08)',groupLabel: 'Documents' },
  STATEMENT_READY:       { icon: <FileText size={14} />,        color: '#378ADD', bg: 'rgba(55,138,221,0.1)',  groupLabel: 'Statements' },
  SECURITY_ALERT:        { icon: <AlertTriangle size={14} />,   color: '#DD7777', bg: 'rgba(221,119,119,0.1)', groupLabel: 'Security' },
  KYC_EXPIRING:          { icon: <Shield size={14} />,          color: '#d97706', bg: 'rgba(217,119,6,0.1)',   groupLabel: 'Compliance' },
  BENEFICIARY_PROPOSED:  { icon: <CheckCircle2 size={14} />,    color: '#378ADD', bg: 'rgba(55,138,221,0.1)',  groupLabel: 'Beneficiaries' },
}

type FilterKey = 'all' | 'unread' | 'Messages' | 'Transfers' | 'Security' | 'Statements' | 'Documents'

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all',       label: 'All' },
  { key: 'unread',    label: 'Unread' },
  { key: 'Messages',  label: 'Messages' },
  { key: 'Transfers', label: 'Transfers' },
  { key: 'Security',  label: 'Security' },
  { key: 'Statements',label: 'Statements' },
  { key: 'Documents', label: 'Documents' },
]

export default function NotificationsPage() {
  const [items, setItems] = useState<AppNotification[]>(mockNotifications)
  const [filter, setFilter] = useState<FilterKey>('all')

  const unreadCount = items.filter(n => !n.read).length

  const filtered = items.filter(n => {
    if (filter === 'unread') return !n.read
    if (filter === 'all')    return true
    return TYPE_META[n.type].groupLabel === filter
  })

  function markRead(id: string) {
    setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  function markAllRead() {
    setItems(prev => prev.map(n => ({ ...n, read: true })))
  }

  return (
    <div>
      {/* ── Header ──────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 12, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, color: 'var(--cream)' }}>
            Notifications
          </div>
          <div style={{ fontSize: 10, color: 'var(--mist)', marginTop: 4, letterSpacing: '.05em' }}>
            ZPF-7741-0038 · {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </div>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
              fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--gold)',
              border: '1px solid var(--border2)', padding: '7px 14px', borderRadius: 20, background: 'transparent',
            }}
          >
            <Check size={11} /> Mark All Read
          </button>
        )}
      </div>

      {/* ── Filter tabs ─────────────────────────── */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 16, flexWrap: 'wrap',
        background: 'var(--surf)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: 4, width: 'fit-content',
      }}>
        {FILTERS.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{
            padding: '5px 14px', borderRadius: 8, fontSize: 10, fontWeight: 500,
            cursor: 'pointer', border: 'none', letterSpacing: '.04em',
            background: filter === f.key ? 'var(--gold)' : 'transparent',
            color: filter === f.key ? 'var(--navy)' : 'var(--mist)',
          }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* ── List ────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div style={{
          background: 'var(--navy)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '56px 24px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        }}>
          <Bell size={28} style={{ color: 'var(--mist)', opacity: 0.35 }} />
          <div style={{ fontSize: 13, color: 'var(--mist)' }}>No notifications in this category</div>
        </div>
      ) : (
        <div style={{ background: 'var(--navy)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          {filtered.map((notif, i) => {
            const meta = TYPE_META[notif.type]
            const isLast = i === filtered.length - 1
            return (
              <div
                key={notif.id}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 22px',
                  borderBottom: isLast ? 'none' : '1px solid rgba(196,164,74,0.06)',
                  background: notif.read ? 'transparent' : 'rgba(196,164,74,0.03)',
                  position: 'relative',
                }}
              >
                {/* Unread dot */}
                {!notif.read && (
                  <div style={{
                    position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
                    width: 5, height: 5, borderRadius: '50%', background: 'var(--gold)',
                  }} />
                )}

                {/* Icon */}
                <div style={{
                  width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                  background: meta.bg, color: meta.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {meta.icon}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: notif.read ? 'var(--cream)' : 'var(--cream)' }}>
                      {notif.title}
                    </span>
                    <span style={{
                      fontSize: 8, letterSpacing: '.08em', textTransform: 'uppercase',
                      padding: '2px 7px', borderRadius: 3,
                      background: meta.bg, color: meta.color,
                    }}>
                      {meta.groupLabel}
                    </span>
                    {!notif.read && (
                      <span style={{
                        fontSize: 8, letterSpacing: '.08em', textTransform: 'uppercase',
                        padding: '2px 7px', borderRadius: 3,
                        background: 'rgba(196,164,74,0.15)', color: 'var(--gold)',
                      }}>
                        Unread
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--mist)', lineHeight: 1.55, marginBottom: 6 }}>
                    {notif.body}
                  </div>
                  <div style={{ fontSize: 9, color: 'rgba(138,154,176,0.6)', fontFamily: 'var(--font-mono)' }}>
                    {notif.date}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  {!notif.read && (
                    <button
                      onClick={() => markRead(notif.id)}
                      title="Mark as read"
                      style={{
                        width: 28, height: 28, borderRadius: 6, cursor: 'pointer',
                        background: 'rgba(196,164,74,0.08)', border: '1px solid var(--border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--gold)',
                      }}
                    >
                      <Check size={12} />
                    </button>
                  )}
                  <Link
                    href={notif.href}
                    onClick={() => markRead(notif.id)}
                    style={{
                      width: 28, height: 28, borderRadius: 6, cursor: 'pointer',
                      background: 'var(--surf)', border: '1px solid var(--border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--mist)',
                    }}
                    title="Go to"
                  >
                    <ChevronRight size={13} />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
