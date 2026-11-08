import type { MockSession } from './mock-data'

export interface Credential {
  portalId: string
  accessKey: string  // 32-char hex key issued at account activation
  totpCode: string   // fixed mock TOTP — in production this is time-based
  session: MockSession
}

export const CLIENT_CREDENTIAL: Credential = {
  portalId: 'ZPF-7741-0038',
  accessKey: 'a3f8c2d1e4b970651f2c8a4e9b03d7f6',
  totpCode: '123456',
  session: {
    role: 'client',
    userId: 'ZPF-7741-0038',
    name: 'Adebayo Suleiman',
    initials: 'AS',
    linkedClientId: 'ZPF-7741-0038',
    linkedClientName: 'Adebayo Suleiman',
  },
}

export const TRUSTEE_CREDENTIAL: Credential = {
  portalId: 'ZPF-7741-0038-T01',
  accessKey: '9e5b2c7f1a43d8620e7f4c91b5a83d2e',
  totpCode: '654321',
  session: {
    role: 'trustee',
    userId: 'ZPF-7741-0038-T01',
    name: 'Kemi Adebayo-Suleiman',
    initials: 'KA',
    linkedClientId: 'ZPF-7741-0038',
    linkedClientName: 'Adebayo Suleiman',
    trusteeId: 'ZPF-7741-0038-T01',
  },
}

export const SUPER_ADMIN_CREDENTIAL: Credential = {
  portalId: 'ZPF-SA-0001',
  accessKey: 'c8d4e2f1a96b3057d4e8f2a1c5b79e3d',
  totpCode: '000000',
  session: {
    role: 'super_admin',
    userId: 'ZPF-SA-0001',
    name: 'Klaus Reinhardt',
    initials: 'KR',
    linkedClientId: '',
    linkedClientName: '',
    staffId: 'ZPF-SA-0001',
    title: 'System Administrator',
  },
}

export const VISITOR_CLIENT_REF = 'ZPF-7741-0038'
export const VISITOR_ACCESS_KEY = 'f2e9a1c4b73d5086e4a2f9c7b1d35a8e'

export function findByPortalId(id: string): Credential | undefined {
  return [CLIENT_CREDENTIAL, TRUSTEE_CREDENTIAL, SUPER_ADMIN_CREDENTIAL].find(c => c.portalId === id)
}

export function findAdminByPortalId(id: string): Credential | undefined {
  return [SUPER_ADMIN_CREDENTIAL].find(c => c.portalId === id)
}
