'use client'

import { useState } from 'react'
import { MessageSquare, Lock, Paperclip, Send, ChevronLeft, ShieldCheck } from 'lucide-react'
import { mockMessageThreads, type MessageThread, type MessageCategory } from '@/lib/mock-data'

const CATEGORY_META: Record<MessageCategory, { color: string; bg: string }> = {
  rm:          { color: '#C4A44A', bg: 'rgba(196,164,74,0.1)'  },
  compliance:  { color: '#DD7777', bg: 'rgba(221,119,119,0.1)' },
  operations:  { color: '#378ADD', bg: 'rgba(55,138,221,0.1)'  },
  custody:     { color: '#1D9E75', bg: 'rgba(29,158,117,0.1)'  },
  advisory:    { color: '#7F77DD', bg: 'rgba(127,119,221,0.1)' },
}

const totalUnread = mockMessageThreads.reduce((n, t) => n + t.unread, 0)

export default function MessagesPage() {
  const [selectedId, setSelectedId] = useState<string>(mockMessageThreads[0].id)
  const [replyText, setReplyText] = useState('')
  const [showList, setShowList] = useState(true)

  const thread = mockMessageThreads.find(t => t.id === selectedId)!

  function selectThread(id: string) {
    setSelectedId(id)
    setShowList(false)
    setReplyText('')
  }

  return (
    <div>
      {/* ── Header ──────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, gap: 12, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, color: 'var(--cream)' }}>
            Secure Messages
          </div>
          <div style={{ fontSize: 10, color: 'var(--mist)', marginTop: 4, letterSpacing: '.05em' }}>
            ZPF-7741-0038 · End-to-end encrypted · All correspondence with your RM and ZPF teams
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(29,158,117,0.08)', border: '1px solid rgba(29,158,117,0.2)',
          borderRadius: 20, padding: '6px 14px', fontSize: 10, color: '#4ecda4',
        }}>
          <ShieldCheck size={12} />
          End-to-end encrypted
        </div>
      </div>

      {/* ── Main layout ──────────────────────────── */}
      <div className="msg-layout" style={{ display: 'flex', gap: 0, background: 'var(--navy)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', minHeight: 560 }}>

        {/* ── Thread list ────────────────────────── */}
        <div className={`msg-thread-list${showList ? ' msg-list-visible' : ''}`} style={{
          width: 300, flexShrink: 0, borderRight: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* List header */}
          <div style={{ padding: '16px 18px 12px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--cream)' }}>Inbox</div>
              {totalUnread > 0 && (
                <span style={{
                  fontSize: 9, background: 'var(--gold)', color: 'var(--navy)',
                  padding: '1px 7px', borderRadius: 10, fontWeight: 600,
                }}>
                  {totalUnread} new
                </span>
              )}
            </div>
          </div>

          {/* Threads */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {mockMessageThreads.map(t => {
              const meta = CATEGORY_META[t.category]
              const active = t.id === selectedId
              return (
                <button key={t.id} onClick={() => selectThread(t.id)} style={{
                  width: '100%', textAlign: 'left', padding: '14px 18px',
                  borderBottom: '1px solid rgba(196,164,74,0.06)',
                  background: active ? 'rgba(196,164,74,0.06)' : 'transparent',
                  cursor: 'pointer', border: 'none', borderLeft: active ? '2px solid var(--gold)' : '2px solid transparent',
                  display: 'block',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    {/* Avatar */}
                    <div style={{
                      width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                      background: meta.bg, border: `1px solid ${meta.color}44`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-display)', fontSize: 12, color: meta.color,
                    }}>
                      {t.participantInitials}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                        <span style={{ fontSize: 11, fontWeight: t.unread ? 600 : 400, color: 'var(--cream)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 140 }}>
                          {t.participantName}
                        </span>
                        <span style={{ fontSize: 8, color: 'var(--mist)', flexShrink: 0, marginLeft: 4 }}>{t.lastDate}</span>
                      </div>
                      <div style={{ fontSize: 10, color: t.unread ? 'var(--cream)' : 'var(--mist)', fontWeight: t.unread ? 500 : 400, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {t.subject}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                        <span style={{ fontSize: 9, color: 'rgba(138,154,176,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                          {t.lastSnippet}
                        </span>
                        {t.unread > 0 && (
                          <span style={{
                            flexShrink: 0, width: 16, height: 16, borderRadius: '50%',
                            background: '#378ADD', color: '#fff', fontSize: 8, fontWeight: 700,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>{t.unread}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Conversation view ───────────────────── */}
        <div className={`msg-convo${!showList ? ' msg-convo-visible' : ''}`} style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

          {/* Conversation header */}
          <div style={{ padding: '14px 22px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Back button (mobile) */}
            <button className="msg-back-btn" onClick={() => setShowList(true)} style={{
              display: 'none', background: 'transparent', border: 'none', cursor: 'pointer',
              color: 'var(--mist)', padding: '4px 0', alignItems: 'center', gap: 4,
            }}>
              <ChevronLeft size={16} />
            </button>

            <div style={{
              width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
              background: CATEGORY_META[thread.category].bg,
              border: `1px solid ${CATEGORY_META[thread.category].color}44`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontSize: 13, color: CATEGORY_META[thread.category].color,
            }}>
              {thread.participantInitials}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--cream)' }}>{thread.subject}</div>
              <div style={{ fontSize: 9, color: 'var(--mist)', marginTop: 2 }}>
                {thread.participantName} · {thread.participantTitle}
              </div>
            </div>

            <span style={{
              fontSize: 8, letterSpacing: '.08em', textTransform: 'uppercase', flexShrink: 0,
              padding: '3px 9px', borderRadius: 3,
              background: CATEGORY_META[thread.category].bg,
              color: CATEGORY_META[thread.category].color,
            }}>
              {thread.categoryLabel}
            </span>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {thread.messages.map((msg) => {
              const isRight = msg.sender === 'client' || msg.sender === 'trustee'
              const isTrustee = msg.sender === 'trustee'
              return (
                <div key={msg.id} style={{ display: 'flex', flexDirection: isRight ? 'row-reverse' : 'row', gap: 10, alignItems: 'flex-start' }}>
                  {/* Avatar — only for RM/bank side */}
                  {!isRight && (
                    <div style={{
                      width: 30, height: 30, borderRadius: '50%', flexShrink: 0, marginTop: 2,
                      background: CATEGORY_META[thread.category].bg,
                      border: `1px solid ${CATEGORY_META[thread.category].color}44`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-display)', fontSize: 10, color: CATEGORY_META[thread.category].color,
                    }}>
                      {thread.participantInitials}
                    </div>
                  )}

                  <div style={{ maxWidth: '68%', display: 'flex', flexDirection: 'column', alignItems: isRight ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      fontSize: 9, color: 'rgba(138,154,176,0.6)', marginBottom: 5,
                      display: 'flex', gap: 8, alignItems: 'center',
                    }}>
                      {!isRight && <span style={{ color: 'var(--mist)' }}>{msg.senderName}</span>}
                      {isTrustee && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ color: 'var(--mist)' }}>{msg.senderName}</span>
                          <span style={{
                            fontSize: 7, letterSpacing: '.08em', textTransform: 'uppercase',
                            padding: '1px 5px', borderRadius: 3,
                            background: 'rgba(196,164,74,0.15)', color: 'var(--gold)',
                            border: '1px solid rgba(196,164,74,0.3)',
                          }}>Trustee</span>
                        </span>
                      )}
                      <span>{msg.date}</span>
                    </div>

                    <div style={{
                      padding: '12px 16px',
                      borderRadius: isRight ? '12px 4px 12px 12px' : '4px 12px 12px 12px',
                      background: isTrustee ? 'rgba(196,164,74,0.06)' : isRight ? 'rgba(196,164,74,0.1)' : 'rgba(255,255,255,0.04)',
                      border: isRight ? '1px solid rgba(196,164,74,0.2)' : '1px solid var(--border)',
                      fontSize: 12, color: 'var(--cream)', lineHeight: 1.65, whiteSpace: 'pre-line',
                    }}>
                      {msg.content}
                    </div>

                    {/* Attachments */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8, alignItems: isRight ? 'flex-end' : 'flex-start' }}>
                        {msg.attachments.map(att => (
                          <div key={att.name} style={{
                            display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer',
                            padding: '7px 12px', borderRadius: 8,
                            background: 'rgba(196,164,74,0.06)', border: '1px solid var(--border2)',
                          }}>
                            <Paperclip size={11} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                            <span style={{ fontSize: 10, color: 'var(--cream)' }}>{att.name}</span>
                            <span style={{ fontSize: 9, color: 'var(--mist)' }}>{att.size}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Reply box */}
          <div style={{ padding: '14px 22px', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <textarea
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Type a secure reply…"
                  rows={2}
                  style={{
                    width: '100%', resize: 'none', padding: '10px 14px',
                    background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
                    borderRadius: 10, color: 'var(--cream)', fontSize: 12,
                    fontFamily: 'var(--font-sans)', lineHeight: 1.5,
                    outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                <button style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: replyText.trim() ? 'var(--gold)' : 'rgba(196,164,74,0.1)',
                  border: '1px solid var(--border2)',
                  color: replyText.trim() ? 'var(--navy)' : 'var(--mist)',
                  cursor: replyText.trim() ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Send size={14} />
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 8 }}>
              <Lock size={9} style={{ color: 'rgba(138,154,176,0.4)' }} />
              <span style={{ fontSize: 8, color: 'rgba(138,154,176,0.4)', letterSpacing: '.05em' }}>
                Messages are encrypted and stored securely within the ZPF platform · Not monitored by third parties
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Unread notice */}
      {totalUnread > 0 && (
        <div style={{
          marginTop: 12, display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 16px', borderRadius: 10,
          background: 'rgba(55,138,221,0.06)', border: '1px solid rgba(55,138,221,0.15)',
        }}>
          <MessageSquare size={11} style={{ color: '#6aaee8', flexShrink: 0 }} />
          <span style={{ fontSize: 10, color: '#6aaee8' }}>
            You have {totalUnread} unread message{totalUnread !== 1 ? 's' : ''} — please review at your earliest convenience.
          </span>
        </div>
      )}

      <style>{`
        .msg-layout { }

        @media (max-width: 768px) {
          .msg-thread-list {
            display: none !important;
            width: 100% !important;
            border-right: none !important;
          }
          .msg-thread-list.msg-list-visible {
            display: flex !important;
          }
          .msg-convo {
            display: none !important;
          }
          .msg-convo.msg-convo-visible {
            display: flex !important;
          }
          .msg-back-btn {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  )
}
