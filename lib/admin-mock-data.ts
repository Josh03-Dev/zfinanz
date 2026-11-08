// ─────────────────────────────────────────────────────────────────────────────
// ZPF Admin Panel — Mock Data
// System-wide data visible to Super Admin (unfiltered)
// ─────────────────────────────────────────────────────────────────────────────

// ── Staff ─────────────────────────────────────────────────────────────────────

export interface StaffProfile {
  id: string
  displayName: string
  fullName: string
  initials: string
  title: string
  department?: string
  role: 'SUPER_ADMIN' | 'MAJOR_ADMIN' | 'ADMIN'
  parentMajorAdminId?: string
  isActive: boolean
  lastLoginAt: string        // ISO
  lastLoginIp: string
  lastLoginCity: string
  totpEnrolled: boolean
  failedTotpAttempts: number
  notificationEmail?: string
  clientCount: number        // direct clients (for ADMIN) or tree total (for MAJOR_ADMIN)
  adminCount?: number        // sub-admins under this MAJOR_ADMIN
  aum: number                // CHF, sum of portfolio values in their tree
  pendingTransfers: number
}

export const mockStaff: StaffProfile[] = [
  {
    id: 'ZPF-MA-0001',
    displayName: 'Dr. Steiner',
    fullName: 'Dr. Hans Steiner',
    initials: 'HS',
    title: 'Managing Director',
    department: 'Private Banking',
    role: 'MAJOR_ADMIN',
    isActive: true,
    lastLoginAt: '2026-04-03T14:22:00Z',
    lastLoginIp: '85.195.12.44',
    lastLoginCity: 'Zürich',
    totpEnrolled: true,
    failedTotpAttempts: 0,
    notificationEmail: 'h.steiner@zpfinanz.ch',
    clientCount: 38,
    adminCount: 4,
    aum: 84_200_000,
    pendingTransfers: 3,
  },
  {
    id: 'ZPF-MA-0002',
    displayName: 'Ms. Varga',
    fullName: 'Éva Varga',
    initials: 'EV',
    title: 'Head of Client Relations',
    department: 'Wealth Management',
    role: 'MAJOR_ADMIN',
    isActive: true,
    lastLoginAt: '2026-04-02T09:11:00Z',
    lastLoginIp: '195.186.7.218',
    lastLoginCity: 'Geneva',
    totpEnrolled: true,
    failedTotpAttempts: 0,
    notificationEmail: 'e.varga@zpfinanz.ch',
    clientCount: 29,
    adminCount: 3,
    aum: 61_750_000,
    pendingTransfers: 1,
  },
  {
    id: 'ZPF-AD-0001',
    displayName: 'Mr. Müller',
    fullName: 'Thomas Müller',
    initials: 'TM',
    title: 'Senior Relationship Manager',
    department: 'Private Banking',
    role: 'ADMIN',
    parentMajorAdminId: 'ZPF-MA-0001',
    isActive: true,
    lastLoginAt: '2026-04-03T11:45:00Z',
    lastLoginIp: '85.195.12.51',
    lastLoginCity: 'Zürich',
    totpEnrolled: true,
    failedTotpAttempts: 0,
    notificationEmail: 't.muller@zpfinanz.ch',
    clientCount: 12,
    aum: 22_100_000,
    pendingTransfers: 1,
  },
  {
    id: 'ZPF-AD-0002',
    displayName: 'Ms. Hoffmann',
    fullName: 'Sarah Hoffmann',
    initials: 'SH',
    title: 'Relationship Manager',
    department: 'Private Banking',
    role: 'ADMIN',
    parentMajorAdminId: 'ZPF-MA-0001',
    isActive: true,
    lastLoginAt: '2026-04-01T16:30:00Z',
    lastLoginIp: '85.195.12.50',
    lastLoginCity: 'Zürich',
    totpEnrolled: true,
    failedTotpAttempts: 2,
    notificationEmail: 's.hoffmann@zpfinanz.ch',
    clientCount: 9,
    aum: 17_840_000,
    pendingTransfers: 0,
  },
  {
    id: 'ZPF-AD-0003',
    displayName: 'Mr. Okonkwo',
    fullName: 'Emeka Okonkwo',
    initials: 'EO',
    title: 'Relationship Manager',
    department: 'Wealth Management',
    role: 'ADMIN',
    parentMajorAdminId: 'ZPF-MA-0002',
    isActive: true,
    lastLoginAt: '2026-04-03T08:02:00Z',
    lastLoginIp: '195.186.7.220',
    lastLoginCity: 'Geneva',
    totpEnrolled: true,
    failedTotpAttempts: 0,
    notificationEmail: 'e.okonkwo@zpfinanz.ch',
    clientCount: 11,
    aum: 24_300_000,
    pendingTransfers: 2,
  },
  {
    id: 'ZPF-AD-0004',
    displayName: 'Ms. Chen',
    fullName: 'Li-Wei Chen',
    initials: 'LC',
    title: 'Associate Relationship Manager',
    department: 'Wealth Management',
    role: 'ADMIN',
    parentMajorAdminId: 'ZPF-MA-0002',
    isActive: false,
    lastLoginAt: '2026-03-20T13:12:00Z',
    lastLoginIp: '195.186.7.225',
    lastLoginCity: 'Geneva',
    totpEnrolled: false,
    failedTotpAttempts: 0,
    clientCount: 6,
    aum: 9_200_000,
    pendingTransfers: 0,
  },
]

// ── Clients (abbreviated for admin panel) ────────────────────────────────────

export interface AdminClientRow {
  clientId: string
  displayName: string
  fullName: string
  ownerAdminId: string
  ownerAdminName: string
  aum: number                // CHF
  kycStatus: 'VERIFIED' | 'PENDING' | 'EXPIRED'
  accountStatus: 'ACTIVE' | 'LOCKED'
  lastLoginAt: string        // ISO or relative
  onboardedAt: string
  riskProfile: string
  mandateType: string
}

export const mockAdminClients: AdminClientRow[] = [
  {
    clientId: 'ZPF-7741-0038',
    displayName: 'Adebayo S.',
    fullName: 'Adebayo Suleiman',
    ownerAdminId: 'ZPF-AD-0001',
    ownerAdminName: 'Mr. Müller',
    aum: 12_847_340,
    kycStatus: 'VERIFIED',
    accountStatus: 'ACTIVE',
    lastLoginAt: '2026-04-02T19:44:00Z',
    onboardedAt: '2022-03-12',
    riskProfile: 'Balanced — Medium',
    mandateType: 'Advisory',
  },
  {
    clientId: 'ZPF-8812-0041',
    displayName: 'Keiko T.',
    fullName: 'Keiko Tanaka',
    ownerAdminId: 'ZPF-AD-0003',
    ownerAdminName: 'Mr. Okonkwo',
    aum: 8_410_000,
    kycStatus: 'VERIFIED',
    accountStatus: 'ACTIVE',
    lastLoginAt: '2026-04-03T10:15:00Z',
    onboardedAt: '2023-07-18',
    riskProfile: 'Growth — High',
    mandateType: 'Discretionary',
  },
  {
    clientId: 'ZPF-5530-0019',
    displayName: 'Viktor B.',
    fullName: 'Viktor Brandão',
    ownerAdminId: 'ZPF-AD-0002',
    ownerAdminName: 'Ms. Hoffmann',
    aum: 5_220_000,
    kycStatus: 'PENDING',
    accountStatus: 'ACTIVE',
    lastLoginAt: '2026-03-28T14:00:00Z',
    onboardedAt: '2024-01-09',
    riskProfile: 'Conservative — Low',
    mandateType: 'Advisory',
  },
  {
    clientId: 'ZPF-3391-0055',
    displayName: 'Amara D.',
    fullName: 'Amara Diallo',
    ownerAdminId: 'ZPF-AD-0001',
    ownerAdminName: 'Mr. Müller',
    aum: 19_100_000,
    kycStatus: 'VERIFIED',
    accountStatus: 'ACTIVE',
    lastLoginAt: '2026-04-01T08:30:00Z',
    onboardedAt: '2021-11-22',
    riskProfile: 'Balanced — Medium',
    mandateType: 'Discretionary',
  },
  {
    clientId: 'ZPF-6640-0072',
    displayName: 'Marina V.',
    fullName: 'Marina Voronova',
    ownerAdminId: 'ZPF-AD-0003',
    ownerAdminName: 'Mr. Okonkwo',
    aum: 3_870_000,
    kycStatus: 'EXPIRED',
    accountStatus: 'LOCKED',
    lastLoginAt: '2026-02-14T17:22:00Z',
    onboardedAt: '2022-08-05',
    riskProfile: 'Growth — High',
    mandateType: 'Advisory',
  },
  {
    clientId: 'ZPF-9910-0088',
    displayName: 'François L.',
    fullName: 'François Leroy',
    ownerAdminId: 'ZPF-AD-0002',
    ownerAdminName: 'Ms. Hoffmann',
    aum: 7_640_000,
    kycStatus: 'VERIFIED',
    accountStatus: 'ACTIVE',
    lastLoginAt: '2026-04-03T07:55:00Z',
    onboardedAt: '2023-03-14',
    riskProfile: 'Balanced — Medium',
    mandateType: 'Advisory',
  },
]

// ── Transfers ─────────────────────────────────────────────────────────────────

export type TransferStatus =
  | 'PENDING_REVIEW'
  | 'UNDER_REVIEW'
  | 'AWAITING_COUNTER'
  | 'APPROVED'
  | 'EXECUTED'
  | 'REJECTED'

export interface AdminTransferRow {
  id: string
  clientId: string
  clientName: string
  ownerAdminName: string
  currency: string
  amount: number
  amountChf: number
  beneficiaryName: string
  beneficiaryCountry: string
  maskedIban: string
  bankName: string
  bic: string
  reference: string
  category: string
  clientNotes?: string
  submittedAt: string        // ISO
  status: TransferStatus
  rejectionReason?: string
  settlementRef?: string
}

export const mockAdminTransfers: AdminTransferRow[] = [
  {
    id: 'TRF-00412',
    clientId: 'ZPF-7741-0038',
    clientName: 'Adebayo S.',
    ownerAdminName: 'Mr. Müller',
    currency: 'CHF',
    amount: 142_000,
    amountChf: 142_000,
    beneficiaryName: 'Suleiman Holdings Ltd.',
    beneficiaryCountry: 'United Kingdom',
    maskedIban: 'GB** **** **** **** **44 12',
    bankName: 'Barclays PLC',
    bic: 'BARCGB22',
    reference: 'Investment disbursement Q1-2026',
    category: 'Business Transfer',
    submittedAt: '2026-04-02T11:30:00Z',
    status: 'PENDING_REVIEW',
  },
  {
    id: 'TRF-00411',
    clientId: 'ZPF-3391-0055',
    clientName: 'Amara D.',
    ownerAdminName: 'Mr. Müller',
    currency: 'EUR',
    amount: 680_000,
    amountChf: 738_000,
    beneficiaryName: 'Diallo Family Trust',
    beneficiaryCountry: 'Luxembourg',
    maskedIban: 'LU** **** **** **** **19 88',
    bankName: 'Banque de Luxembourg',
    bic: 'BLUXLULL',
    reference: 'Trust capital contribution',
    category: 'Trust Transfer',
    submittedAt: '2026-04-01T14:10:00Z',
    status: 'AWAITING_COUNTER',
  },
  {
    id: 'TRF-00410',
    clientId: 'ZPF-8812-0041',
    clientName: 'Keiko T.',
    ownerAdminName: 'Mr. Okonkwo',
    currency: 'USD',
    amount: 95_000,
    amountChf: 84_200,
    beneficiaryName: 'Tanaka Real Estate LLC',
    beneficiaryCountry: 'United States',
    maskedIban: 'US** **** **** **** **07 33',
    bankName: 'JP Morgan Chase',
    bic: 'CHASUS33',
    reference: 'Property acquisition deposit',
    category: 'Real Estate',
    submittedAt: '2026-04-01T09:55:00Z',
    status: 'UNDER_REVIEW',
  },
  {
    id: 'TRF-00409',
    clientId: 'ZPF-9910-0088',
    clientName: 'François L.',
    ownerAdminName: 'Ms. Hoffmann',
    currency: 'CHF',
    amount: 25_000,
    amountChf: 25_000,
    beneficiaryName: 'Leroy SA',
    beneficiaryCountry: 'France',
    maskedIban: 'FR** **** **** **** **82 41',
    bankName: 'BNP Paribas',
    bic: 'BNPAFRPP',
    reference: 'Operating expense reimbursement',
    category: 'Business Transfer',
    submittedAt: '2026-03-31T16:44:00Z',
    status: 'APPROVED',
  },
  {
    id: 'TRF-00408',
    clientId: 'ZPF-5530-0019',
    clientName: 'Viktor B.',
    ownerAdminName: 'Ms. Hoffmann',
    currency: 'EUR',
    amount: 310_000,
    amountChf: 336_500,
    beneficiaryName: 'Brandão Investments GmbH',
    beneficiaryCountry: 'Germany',
    maskedIban: 'DE** **** **** **** **55 70',
    bankName: 'Deutsche Bank',
    bic: 'DEUTDEDB',
    reference: 'Capital injection — Series B',
    category: 'Investment',
    submittedAt: '2026-03-28T10:20:00Z',
    status: 'EXECUTED',
    settlementRef: 'SEPA-2026-0028-BDB',
  },
]

// ── Audit Log ─────────────────────────────────────────────────────────────────

export type AuditAction =
  | 'CLIENT_CREATED'
  | 'CLIENT_LOCKED'
  | 'CLIENT_UNLOCKED'
  | 'CLIENT_REASSIGNED'
  | 'KYC_STATUS_CHANGED'
  | 'RISK_PROFILE_CHANGED'
  | 'TRANSACTION_ADDED'
  | 'TRANSACTION_EDITED'
  | 'TRANSFER_APPROVED'
  | 'TRANSFER_COUNTER_APPROVED'
  | 'TRANSFER_REJECTED'
  | 'TRANSFER_EXECUTED'
  | 'DOCUMENT_UPLOADED'
  | 'DOCUMENT_SEALED'
  | 'MESSAGE_SENT'
  | 'THREAD_RESOLVED'
  | 'THREAD_REASSIGNED'
  | 'STAFF_CREATED'
  | 'STAFF_EDITED'
  | 'STAFF_DEACTIVATED'
  | 'STAFF_ROLE_CHANGED'
  | 'SYSTEM_CONFIG_CHANGED'
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'LOGOUT'
  | 'TOTP_ENROLLMENT_GENERATED'

export interface AuditEntry {
  id: string
  timestamp: string          // ISO
  adminId: string
  adminName: string
  adminRole: 'SUPER_ADMIN' | 'MAJOR_ADMIN' | 'ADMIN'
  action: AuditAction
  clientId?: string
  clientName?: string
  entityType?: string
  entityId?: string
  ipAddress: string
  notes: string
  isAnomaly?: boolean
}

export const mockAuditLog: AuditEntry[] = [
  {
    id: 'AUD-001',
    timestamp: '2026-04-03T14:22:00Z',
    adminId: 'ZPF-MA-0001',
    adminName: 'Dr. Steiner',
    adminRole: 'MAJOR_ADMIN',
    action: 'TRANSFER_APPROVED',
    clientId: 'ZPF-7741-0038',
    clientName: 'Adebayo S.',
    entityType: 'Transfer',
    entityId: 'TRF-00412',
    ipAddress: '85.195.12.44',
    notes: 'Amount: CHF 142,000 → APPROVED',
  },
  {
    id: 'AUD-002',
    timestamp: '2026-04-03T11:45:00Z',
    adminId: 'ZPF-AD-0001',
    adminName: 'Mr. Müller',
    adminRole: 'ADMIN',
    action: 'TRANSACTION_ADDED',
    clientId: 'ZPF-7741-0038',
    clientName: 'Adebayo S.',
    entityType: 'Transaction',
    entityId: 'TXN-2214',
    ipAddress: '85.195.12.51',
    notes: 'CHF 42,000 — Securities purchase (Nestlé N)',
  },
  {
    id: 'AUD-003',
    timestamp: '2026-04-03T10:15:00Z',
    adminId: 'ZPF-AD-0003',
    adminName: 'Mr. Okonkwo',
    adminRole: 'ADMIN',
    action: 'LOGIN_SUCCESS',
    ipAddress: '195.186.7.220',
    notes: 'Login from Geneva, CH',
  },
  {
    id: 'AUD-004',
    timestamp: '2026-04-02T19:44:00Z',
    adminId: 'ZPF-AD-0001',
    adminName: 'Mr. Müller',
    adminRole: 'ADMIN',
    action: 'CLIENT_CREATED',
    clientId: 'ZPF-8812-0041',
    clientName: 'Keiko T.',
    ipAddress: '85.195.12.51',
    notes: 'New client account created: ZPF-8812-0041 (Keiko Tanaka)',
  },
  {
    id: 'AUD-005',
    timestamp: '2026-04-01T14:10:00Z',
    adminId: 'ZPF-SA-0001',
    adminName: 'Klaus Reinhardt',
    adminRole: 'SUPER_ADMIN',
    action: 'SYSTEM_CONFIG_CHANGED',
    ipAddress: '89.206.100.5',
    notes: 'Counter-approval threshold: CHF 500,000 → CHF 700,000',
    isAnomaly: true,
  },
  {
    id: 'AUD-006',
    timestamp: '2026-04-01T09:55:00Z',
    adminId: 'ZPF-AD-0003',
    adminName: 'Mr. Okonkwo',
    adminRole: 'ADMIN',
    action: 'DOCUMENT_UPLOADED',
    clientId: 'ZPF-8812-0041',
    clientName: 'Keiko T.',
    entityType: 'Document',
    entityId: 'DOC-0381',
    ipAddress: '195.186.7.220',
    notes: 'KYC — Passport (renewed)',
  },
  {
    id: 'AUD-007',
    timestamp: '2026-03-31T16:44:00Z',
    adminId: 'ZPF-MA-0001',
    adminName: 'Dr. Steiner',
    adminRole: 'MAJOR_ADMIN',
    action: 'TRANSFER_COUNTER_APPROVED',
    clientId: 'ZPF-3391-0055',
    clientName: 'Amara D.',
    entityType: 'Transfer',
    entityId: 'TRF-00411',
    ipAddress: '85.195.12.44',
    notes: 'EUR 680,000 counter-approved → AWAITING_COUNTER',
  },
  {
    id: 'AUD-008',
    timestamp: '2026-03-28T10:20:00Z',
    adminId: 'ZPF-SA-0001',
    adminName: 'Klaus Reinhardt',
    adminRole: 'SUPER_ADMIN',
    action: 'STAFF_CREATED',
    entityType: 'Staff',
    entityId: 'ZPF-AD-0004',
    ipAddress: '89.206.100.5',
    notes: 'New staff account: Li-Wei Chen (ADMIN, reports to Ms. Varga)',
  },
  {
    id: 'AUD-009',
    timestamp: '2026-03-20T13:12:00Z',
    adminId: 'ZPF-SA-0001',
    adminName: 'Klaus Reinhardt',
    adminRole: 'SUPER_ADMIN',
    action: 'STAFF_DEACTIVATED',
    entityType: 'Staff',
    entityId: 'ZPF-AD-0004',
    ipAddress: '89.206.100.5',
    notes: 'Account deactivated — TOTP enrollment expired without completion',
  },
  {
    id: 'AUD-010',
    timestamp: '2026-03-14T15:30:00Z',
    adminId: 'ZPF-AD-0002',
    adminName: 'Ms. Hoffmann',
    adminRole: 'ADMIN',
    action: 'KYC_STATUS_CHANGED',
    clientId: 'ZPF-6640-0072',
    clientName: 'Marina V.',
    ipAddress: '85.195.12.50',
    notes: 'KYC status: VERIFIED → EXPIRED (document expiry)',
  },
  {
    id: 'AUD-011',
    timestamp: '2026-03-10T08:40:00Z',
    adminId: 'ZPF-SA-0001',
    adminName: 'Klaus Reinhardt',
    adminRole: 'SUPER_ADMIN',
    action: 'CLIENT_REASSIGNED',
    clientId: 'ZPF-9910-0088',
    clientName: 'François L.',
    ipAddress: '89.206.100.5',
    notes: 'Reassigned from Mr. Müller → Ms. Hoffmann. Reason: workload rebalancing.',
  },
  {
    id: 'AUD-012',
    timestamp: '2026-03-08T09:12:00Z',
    adminId: 'ZPF-SA-0001',
    adminName: 'Klaus Reinhardt',
    adminRole: 'SUPER_ADMIN',
    action: 'TOTP_ENROLLMENT_GENERATED',
    entityType: 'Staff',
    entityId: 'ZPF-AD-0003',
    ipAddress: '89.206.100.5',
    notes: 'TOTP reset issued for Mr. Okonkwo (ZPF-AD-0003)',
  },
]

// ── AUM Trend (last 12 months) ────────────────────────────────────────────────

export interface AumSnapshot {
  month: string    // "Apr", "May", etc.
  year: number
  value: number    // total CHF
}

export const mockAumTrend: AumSnapshot[] = [
  { month: 'Apr', year: 2025, value: 128_400_000 },
  { month: 'May', year: 2025, value: 131_200_000 },
  { month: 'Jun', year: 2025, value: 129_800_000 },
  { month: 'Jul', year: 2025, value: 133_600_000 },
  { month: 'Aug', year: 2025, value: 136_100_000 },
  { month: 'Sep', year: 2025, value: 138_400_000 },
  { month: 'Oct', year: 2025, value: 135_900_000 },
  { month: 'Nov', year: 2025, value: 140_200_000 },
  { month: 'Dec', year: 2025, value: 143_800_000 },
  { month: 'Jan', year: 2026, value: 145_100_000 },
  { month: 'Feb', year: 2026, value: 147_600_000 },
  { month: 'Mar', year: 2026, value: 150_300_000 },
]

// ── System Config (current values) ───────────────────────────────────────────

export interface SystemConfig {
  counterApprovalThreshold: number
  sessionIdleTimeoutHours: number
  sessionAbsoluteTimeoutHours: number
  totpEnrollmentExpiryHours: number
  maxFailedTotpAttempts: number
  maxDocUploadMb: number
  allowedFileTypes: string[]
  fxSource: 'auto' | 'manual'
  fxIntervalMinutes: number
  metalsSource: 'auto' | 'manual'
  metalsIntervalMinutes: number
  cryptoSource: 'auto' | 'manual'
  cryptoIntervalMinutes: number
  maintenanceMode: boolean
  maintenanceMessage: string
  publicContactEmail: string
}

export const mockSystemConfig: SystemConfig = {
  counterApprovalThreshold: 700_000,
  sessionIdleTimeoutHours: 8,
  sessionAbsoluteTimeoutHours: 24,
  totpEnrollmentExpiryHours: 72,
  maxFailedTotpAttempts: 10,
  maxDocUploadMb: 50,
  allowedFileTypes: ['PDF', 'DOCX', 'XLSX', 'PNG', 'JPG', 'HEIC'],
  fxSource: 'auto',
  fxIntervalMinutes: 60,
  metalsSource: 'auto',
  metalsIntervalMinutes: 5,
  cryptoSource: 'auto',
  cryptoIntervalMinutes: 2,
  maintenanceMode: false,
  maintenanceMessage: 'The portal is currently undergoing scheduled maintenance. Please check back shortly.',
  publicContactEmail: 'contact@zpfinanz.ch',
}

// ── Computed overview stats ───────────────────────────────────────────────────

export const mockOverviewStats = {
  totalAum: 150_300_000,
  aumChangePercent: 5.2,
  totalClients: 67,
  activeClients: 61,
  lockedClients: 3,
  pendingTotpClients: 3,
  pendingTransfers: 4,
  awaitingCounterTransfers: 1,
  unreadMessages: 9,
  openThreads: 14,
  activeStaff: 5,
  majorAdmins: 2,
  admins: 3,
  systemHealth: {
    db: true,
    redis: true,
    s3: true,
  },
}
