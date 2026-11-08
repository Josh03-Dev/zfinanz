'use client'

import type { MockSession } from './mock-data'

const KEY = 'zpf_session'

export function writeSession(session: MockSession) {
  sessionStorage.setItem(KEY, JSON.stringify(session))
}

export function readSession(): MockSession | null {
  if (typeof window === 'undefined') return null
  const raw = sessionStorage.getItem(KEY)
  if (!raw) return null
  try { return JSON.parse(raw) as MockSession } catch { return null }
}

export function clearSession() {
  sessionStorage.removeItem(KEY)
}
