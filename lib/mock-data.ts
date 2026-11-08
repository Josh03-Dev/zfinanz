export const mockUser = {
  name: 'Adebayo S.',
  fullName: 'Adebayo Suleiman',
  initials: 'AS',
  id: 'ZPF-7741-0038',
  // Identity (admin-managed, read-only in portal)
  nationality: 'Nigerian',
  domicile: 'Lagos, Nigeria',
  dateOfBirth: '14 August 1972',
  email: 'a.suleiman@private.zpfinanz.ch',
  // Account meta
  onboardedAt: '12 March 2022',
  kycStatus: 'Verified' as const,
  kycVerifiedAt: '14 March 2022',
  kycExpiresAt: '14 March 2027',
  riskProfile: 'Balanced — Medium',
  mandateType: 'Advisory',
  mandateRevisedAt: 'January 2025',
  accountStatus: 'Fully Active',
}

export const mockPortfolio = {
  totalValue: 12_847_340,
  currency: 'CHF',
  change: { amount: 284_120, percent: 2.26, label: 'since last quarter' },
  subline: 'Across 6 asset classes · 4 currencies · 2 vaulted locations',
  unrealisedGain: { percent: 8.4, amount: 994_416 },
  nextReview: { date: '14 Mar', label: 'Annual RM portfolio review · Zürich', progress: 82 },
  custodian: { name: 'ZPF AG — Primary Custody', address: 'Bahnhofstrasse 72, 8001 Zürich' },
  riskProfile: { label: 'Balanced — Medium', sub: 'Advisory mandate · Revised Jan 2025' },
  accountStatus: { label: 'Fully Active', since: 'Since 12 March 2022' },
}

export interface AssetClass {
  id: string
  name: string
  value: number
  currency: string
  sub: string
  change: { label: string; direction: 'up' | 'down' | 'neutral' }
  color: string
  accentColor: string
  tagLabel: string
  icon: string
  allocation: number
}

export const mockAssets: AssetClass[] = [
  {
    id: 'monetary',
    name: 'Monetary Holdings',
    value: 4_212_500,
    currency: 'CHF',
    sub: '4 currencies · CHF, EUR, USD, GBP',
    change: { label: '+1.2% — interest accrued Q3', direction: 'up' },
    color: '#378ADD',
    accentColor: '#6aaee8',
    tagLabel: 'Monetary',
    icon: 'landmark',
    allocation: 32.8,
  },
  {
    id: 'securities',
    name: 'Securities Portfolio',
    value: 3_940_000,
    currency: 'CHF',
    sub: '24 positions · Equities & Bonds',
    change: { label: '+3.8% — 12-month return', direction: 'up' },
    color: '#1D9E75',
    accentColor: '#4ecda4',
    tagLabel: 'Securities',
    icon: 'bar-chart-2',
    allocation: 30.7,
  },
  {
    id: 'metals',
    name: 'Precious Metals',
    value: 2_184_840,
    currency: 'CHF',
    sub: 'Gold · Silver · Platinum · Zürich vault',
    change: { label: '+6.1% — gold spot YTD', direction: 'up' },
    color: '#C4A44A',
    accentColor: '#dfc27a',
    tagLabel: 'Metals',
    icon: 'hexagon',
    allocation: 17.0,
  },
  {
    id: 'digital',
    name: 'Digital Assets',
    value: 810_000,
    currency: 'CHF',
    sub: 'BTC, ETH · Institutional cold storage',
    change: { label: '−2.4% — 30-day movement', direction: 'down' },
    color: '#7F77DD',
    accentColor: '#afa9ec',
    tagLabel: 'Digital',
    icon: 'cpu',
    allocation: 6.3,
  },
  {
    id: 'real-estate',
    name: 'Real Estate Holdings',
    value: 1_400_000,
    currency: 'CHF',
    sub: '2 title documents in custody',
    change: { label: 'Valuation pending — Q4 assessment', direction: 'neutral' },
    color: '#D85A30',
    accentColor: '#f0997b',
    tagLabel: 'Real Estate',
    icon: 'building-2',
    allocation: 10.9,
  },
  {
    id: 'vault',
    name: 'Document Vault',
    value: 0,
    currency: '',
    sub: 'Physical + digital archive · Zürich',
    change: { label: 'Last lodgement: 18 Oct 2024', direction: 'neutral' },
    color: '#8A9AB0',
    accentColor: '#b4c4d4',
    tagLabel: 'Vault',
    icon: 'archive',
    allocation: 2.3,
  },
]

export const mockMetals = [
  {
    name: 'Gold (XAU)',
    weight: '24.5',
    unit: 'troy oz',
    value: 'CHF 1,482,210',
    vault: 'ZPF Vault · Zürich HB · 3 × 400oz bars',
  },
  {
    name: 'Silver (XAG)',
    weight: '620',
    unit: 'troy oz',
    value: 'CHF 462,540',
    vault: 'ZPF Vault · Zürich HB · 2 × 1,000oz bars',
  },
  {
    name: 'Platinum (XPT)',
    weight: '80',
    unit: 'troy oz',
    value: 'CHF 240,090',
    vault: 'ZPF Vault · Geneva · 1 × 100oz bar',
  },
]

export const mockMetalsDetail = [
  {
    id: 'gold',
    symbol: 'XAU',
    name: 'Gold',
    color: '#C4A44A',
    colorBg: 'rgba(196,164,74,0.1)',
    colorBorder: 'rgba(196,164,74,0.25)',
    troyOz: 24.5,
    spotPriceCHF: 60_498.37,   // per troy oz
    valueCHF: 1_482_210,
    costBasisCHF: 1_398_860,
    unrealisedPnl: +83_350,
    unrealisedPct: +5.96,
    returnYTD: +6.1,
    allocation: 67.8,
    bars: [
      { ref: 'ZPF-AU-001', weight: '400 oz', form: 'Good Delivery Bar', fineness: '999.9', vault: 'Zürich HB', acquired: 'Mar 2022' },
      { ref: 'ZPF-AU-002', weight: '400 oz', form: 'Good Delivery Bar', fineness: '999.9', vault: 'Zürich HB', acquired: 'Sep 2022' },
      { ref: 'ZPF-AU-003', weight: '5 oz',   form: 'Cast Bar',          fineness: '999.9', vault: 'Zürich HB', acquired: 'Nov 2024' },
    ],
    priceHistory: [58_120, 58_640, 59_010, 59_480, 58_900, 59_220, 59_780, 60_100, 59_840, 60_240, 60_498],
    priceLabels:  ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    dailyChange: +0.38,
    vault: 'ZPF Vault · Zürich Hauptbahnhof',
    insured: 'CHF 2,000,000 · Zurich Insurance AG',
    lastAudit: '18 Feb 2026',
    nextAudit: '18 Aug 2026',
  },
  {
    id: 'silver',
    symbol: 'XAG',
    name: 'Silver',
    color: '#8A9AB0',
    colorBg: 'rgba(138,154,176,0.1)',
    colorBorder: 'rgba(138,154,176,0.25)',
    troyOz: 620,
    spotPriceCHF: 746.03,
    valueCHF: 462_540,
    costBasisCHF: 438_820,
    unrealisedPnl: +23_720,
    unrealisedPct: +5.41,
    returnYTD: +4.8,
    allocation: 21.2,
    bars: [
      { ref: 'ZPF-AG-001', weight: '1,000 oz', form: 'Good Delivery Bar', fineness: '999.0', vault: 'Zürich HB', acquired: 'Jun 2022' },
      { ref: 'ZPF-AG-002', weight: '1,000 oz', form: 'Good Delivery Bar', fineness: '999.0', vault: 'Zürich HB', acquired: 'Jun 2022' },
    ],
    priceHistory: [692, 698, 714, 728, 718, 724, 731, 738, 740, 742, 746],
    priceLabels:  ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    dailyChange: +0.54,
    vault: 'ZPF Vault · Zürich Hauptbahnhof',
    insured: 'CHF 600,000 · Zurich Insurance AG',
    lastAudit: '18 Feb 2026',
    nextAudit: '18 Aug 2026',
  },
  {
    id: 'platinum',
    symbol: 'XPT',
    name: 'Platinum',
    color: '#B0C4D8',
    colorBg: 'rgba(176,196,216,0.1)',
    colorBorder: 'rgba(176,196,216,0.22)',
    troyOz: 80,
    spotPriceCHF: 3_001.13,
    valueCHF: 240_090,
    costBasisCHF: 225_440,
    unrealisedPnl: +14_650,
    unrealisedPct: +6.50,
    returnYTD: +3.9,
    allocation: 11.0,
    bars: [
      { ref: 'ZPF-PT-001', weight: '100 oz', form: 'Cast Bar', fineness: '999.5', vault: 'Geneva', acquired: 'Dec 2025' },
    ],
    priceHistory: [2_820, 2_844, 2_870, 2_912, 2_888, 2_920, 2_944, 2_960, 2_978, 2_990, 3_001],
    priceLabels:  ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    dailyChange: -0.18,
    vault: 'ZPF Vault · Geneva Free Port',
    insured: 'CHF 320,000 · Zurich Insurance AG',
    lastAudit: '10 Jan 2026',
    nextAudit: '10 Jul 2026',
  },
]

export const mockMetalsActivity = [
  { name: 'Platinum — 20oz purchased',        date: '18 Dec 2025', amount: -60_022,  currency: 'CHF', detail: 'ZPF Metals desk · Spot + 0.35% · Vault: Geneva · 1 × 100oz bar' },
  { name: 'Gold — 5oz allocated to vault',     date: '02 Nov 2024', amount: -302_150, currency: 'CHF', detail: 'ZPF Metals desk · Spot + 0.35% · Vault: Zürich HB · 1 × 5oz bar' },
  { name: 'Silver — 1,000oz purchased',        date: '12 Jun 2022', amount: -218_600, currency: 'CHF', detail: 'ZPF Metals desk · Spot + 0.30% · Vault: Zürich HB · 1 × 1,000oz bar' },
  { name: 'Gold — 400oz bar acquired',         date: '14 Sep 2022', amount: -696_800, currency: 'CHF', detail: 'ZPF Metals desk · Good Delivery · Vault: Zürich HB · Ref: ZPF-AU-002' },
]

export const mockVaultDocs = [
  {
    icon: 'file-badge',
    name: 'Certificate of Incorporation — Adesa Holdings Ltd',
    meta: 'Lodged 12 Apr 2022 · British Virgin Islands',
    badge: 'Secured',
    badgeStyle: { background: 'rgba(29,158,117,0.12)', color: '#4ecda4' },
  },
  {
    icon: 'home',
    name: 'Title Deed — Victoria Island Property',
    meta: 'Lodged 3 Sep 2022 · Lagos, Nigeria',
    badge: 'Secured',
    badgeStyle: { background: 'rgba(29,158,117,0.12)', color: '#4ecda4' },
  },
  {
    icon: 'scroll-text',
    name: 'Testamentary Will — Sealed Succession Envelope',
    meta: 'Lodged 19 Jan 2023 · Conditional release',
    badge: 'Sealed',
    badgeStyle: { background: 'rgba(196,164,74,0.12)', color: '#dfc27a' },
  },
  {
    icon: 'file-text',
    name: 'Trust Deed — Adesa Family Trust',
    meta: 'Lodged 4 Mar 2024 · Liechtenstein',
    badge: 'Secured',
    badgeStyle: { background: 'rgba(29,158,117,0.12)', color: '#4ecda4' },
  },
  {
    icon: 'shield-alert',
    name: 'Power of Attorney — Dr. K. Adebayo',
    meta: 'Lodged 8 Jul 2024 · Review due Jan 2026',
    badge: 'Review due',
    badgeStyle: { background: 'rgba(216,90,48,0.12)', color: '#f0997b' },
  },
]

export type DocStatus = 'secured' | 'sealed' | 'review' | 'pending'
export type DocCategory = 'corporate' | 'property' | 'succession' | 'legal' | 'financial'

export interface VaultDocument {
  id: string
  icon: string
  category: DocCategory
  name: string
  description: string
  ref: string
  lodgedDate: string
  jurisdiction: string
  status: DocStatus
  statusLabel: string
  storage: 'physical' | 'digital' | 'both'
  relatedAsset: string | null
  reviewDate: string | null
  pages: number | null
  notes: string
}

export const mockVaultDocuments: VaultDocument[] = [
  {
    id: 'doc-001',
    icon: 'file-badge',
    category: 'corporate',
    name: 'Certificate of Incorporation — Adesa Holdings Ltd',
    description: 'Original certificate of incorporation for Adesa Holdings Ltd, registered in the British Virgin Islands. Governs the primary holding company structure.',
    ref: 'VLT-ZPF-2022-0041',
    lodgedDate: '12 Apr 2022',
    jurisdiction: 'British Virgin Islands',
    status: 'secured',
    statusLabel: 'Secured',
    storage: 'both',
    relatedAsset: null,
    reviewDate: null,
    pages: 6,
    notes: 'Physical original + certified digital copy. Annual renewal confirmation received Feb 2026.',
  },
  {
    id: 'doc-002',
    icon: 'file-badge',
    category: 'corporate',
    name: 'Memorandum & Articles of Association — Adesa Holdings Ltd',
    description: 'Governing constitutional documents of Adesa Holdings Ltd. Defines share structure, director powers, and shareholder rights.',
    ref: 'VLT-ZPF-2022-0042',
    lodgedDate: '12 Apr 2022',
    jurisdiction: 'British Virgin Islands',
    status: 'secured',
    statusLabel: 'Secured',
    storage: 'both',
    relatedAsset: null,
    reviewDate: null,
    pages: 24,
    notes: 'Lodged alongside Certificate of Incorporation. Latest amendment dated 08 Jan 2025.',
  },
  {
    id: 'doc-003',
    icon: 'home',
    category: 'property',
    name: 'Title Deed — Victoria Island Residence',
    description: 'Certificate of occupancy and title deed for residential property at 14 Kofo Abayomi Street, Victoria Island, Lagos.',
    ref: 'VLT-ZPF-2022-0088',
    lodgedDate: '03 Sep 2022',
    jurisdiction: 'Nigeria',
    status: 'secured',
    statusLabel: 'Secured',
    storage: 'both',
    relatedAsset: 'Real Estate — Victoria Island',
    reviewDate: null,
    pages: 12,
    notes: 'Governor\'s consent obtained. No encumbrances. Physical copy in sealed envelope.',
  },
  {
    id: 'doc-004',
    icon: 'home',
    category: 'property',
    name: 'Title Deed — Lekki Phase 1 Land',
    description: 'Deed of assignment for Plot 44B, Admiralty Way, Lekki Phase 1. Commercial zoning certificate included.',
    ref: 'VLT-ZPF-2024-0101',
    lodgedDate: '03 Jan 2024',
    jurisdiction: 'Nigeria',
    status: 'secured',
    statusLabel: 'Secured',
    storage: 'both',
    relatedAsset: 'Real Estate — Lekki Phase 1',
    reviewDate: null,
    pages: 18,
    notes: 'Survey plan attached. Governor\'s consent pending — expected Q3 2026.',
  },
  {
    id: 'doc-005',
    icon: 'scroll-text',
    category: 'succession',
    name: 'Testamentary Will — Sealed Succession Envelope',
    description: 'Last will and testament of Adebayo Suleiman. Held under seal — access restricted to named executor upon verified trigger event.',
    ref: 'VLT-ZPF-2023-0019',
    lodgedDate: '19 Jan 2023',
    jurisdiction: 'Switzerland',
    status: 'sealed',
    statusLabel: 'Sealed',
    storage: 'physical',
    relatedAsset: null,
    reviewDate: '19 Jan 2028',
    pages: null,
    notes: 'Access requires dual authorisation: ZPF Managing Director + named executor. 5-year review cycle.',
  },
  {
    id: 'doc-006',
    icon: 'file-text',
    category: 'legal',
    name: 'Trust Deed — Adesa Family Trust',
    description: 'Constitutive deed establishing the Adesa Family Trust under Liechtenstein law. Names trustees, beneficiaries, and distribution schedule.',
    ref: 'VLT-ZPF-2024-0188',
    lodgedDate: '04 Mar 2024',
    jurisdiction: 'Liechtenstein',
    status: 'secured',
    statusLabel: 'Secured',
    storage: 'both',
    relatedAsset: null,
    reviewDate: '04 Mar 2027',
    pages: 38,
    notes: 'Amendment dated 22 Jul 2025 also lodged — see VLT-ZPF-2025-0501. 3-year review cycle.',
  },
  {
    id: 'doc-007',
    icon: 'file-text',
    category: 'legal',
    name: 'Trust Deed Amendment — Adesa Family Trust',
    description: 'Amendment to the Adesa Family Trust deed dated 20 Jul 2025. Updates distribution provisions for minor beneficiaries.',
    ref: 'VLT-ZPF-2025-0501',
    lodgedDate: '22 Jul 2025',
    jurisdiction: 'Liechtenstein',
    status: 'secured',
    statusLabel: 'Secured',
    storage: 'both',
    relatedAsset: null,
    reviewDate: '04 Mar 2027',
    pages: 8,
    notes: 'Supplementary to VLT-ZPF-2024-0188. Countersigned by all trustees.',
  },
  {
    id: 'doc-008',
    icon: 'shield-alert',
    category: 'legal',
    name: 'Power of Attorney — Dr. K. Adebayo',
    description: 'General power of attorney granted to Dr. Kolade Adebayo for property and financial matters in Nigeria. Notarised and apostilled.',
    ref: 'VLT-ZPF-2024-0412',
    lodgedDate: '08 Jul 2024',
    jurisdiction: 'Nigeria / Switzerland',
    status: 'review',
    statusLabel: 'Review due',
    storage: 'both',
    relatedAsset: null,
    reviewDate: '08 Jan 2026',
    pages: 4,
    notes: 'Review overdue — was due Jan 2026. Contact RM to renew or revoke. Attorney confirms continued availability.',
  },
  {
    id: 'doc-009',
    icon: 'landmark',
    category: 'financial',
    name: 'ZPF Advisory Mandate Agreement',
    description: 'Discretionary advisory mandate agreement governing ZPF\'s management of the portfolio. Defines risk profile, investment universe, and fee schedule.',
    ref: 'VLT-ZPF-2022-0003',
    lodgedDate: '14 Mar 2022',
    jurisdiction: 'Switzerland',
    status: 'secured',
    statusLabel: 'Secured',
    storage: 'both',
    relatedAsset: null,
    reviewDate: '14 Mar 2027',
    pages: 22,
    notes: 'Revised Jan 2025 to reflect updated risk profile (Balanced — Medium). 5-year term.',
  },
  {
    id: 'doc-010',
    icon: 'file-badge',
    category: 'financial',
    name: 'FATCA / CRS Self-Certification',
    description: 'Tax residency self-certification for FATCA and CRS compliance purposes. Covers all account structures held under ZPF-7741-0038.',
    ref: 'VLT-ZPF-2022-0011',
    lodgedDate: '14 Mar 2022',
    jurisdiction: 'Switzerland',
    status: 'secured',
    statusLabel: 'Secured',
    storage: 'digital',
    relatedAsset: null,
    reviewDate: '14 Mar 2027',
    pages: 3,
    notes: 'Annual declaration on file. No material changes since initial submission.',
  },
]

export const mockActivity = [
  {
    icon: 'arrow-down-left',
    iconStyle: { background: 'rgba(29,158,117,0.12)', color: '#1D9E75' },
    name: 'Inbound wire — CHF account',
    date: '14 Nov 2024 · Verified & credited',
    value: '+500,000',
    valueCls: 'up',
    curr: 'CHF',
  },
  {
    icon: 'hexagon',
    iconStyle: { background: 'rgba(196,164,74,0.1)', color: '#C4A44A' },
    name: 'Gold purchase — 5oz allocated',
    date: '02 Nov 2024 · ZPF Vault confirmed',
    value: '−302,150',
    valueCls: 'dn',
    curr: 'CHF',
  },
  {
    icon: 'cpu',
    iconStyle: { background: 'rgba(127,119,221,0.12)', color: '#7F77DD' },
    name: 'BTC custody transfer received',
    date: '28 Oct 2024 · On-chain confirmed',
    value: '+2.1 BTC',
    valueCls: 'up',
    curr: 'Digital',
  },
  {
    icon: 'file-text',
    iconStyle: { background: 'rgba(55,138,221,0.12)', color: '#378ADD' },
    name: 'Quarterly statement generated',
    date: '01 Oct 2024 · Q3 2024',
    value: 'PDF',
    valueCls: 'nt',
    curr: 'Statement',
  },
  {
    icon: 'archive',
    iconStyle: { background: 'rgba(138,154,176,0.1)', color: '#8A9AB0' },
    name: 'Power of Attorney lodged in vault',
    date: '08 Jul 2024 · Vault receipt issued',
    value: 'Doc',
    valueCls: 'nt',
    curr: 'Vault',
  },
]

export const mockRM = {
  initials: 'MvS',
  name: 'Dr. Markus von Steiner',
  title: 'Managing Director & Senior RM',
  availability: 'Available — responds within 4 hours',
  email: 'm.vonsteiner@zpfinanz.ch',
  nextCall: '14 March 2025, 14:00 CET',
}

// ── Performance data ───────────────────────────────────────

export interface ChartPeriod {
  labels: string[]
  portfolio: number[]   // in millions CHF
  benchmark: number[]
  portfolioReturn: number  // %
  benchmarkReturn: number  // %
  absGain: number          // CHF
}

export const mockPerformanceCharts: Record<string, ChartPeriod> = {
  '1M': {
    labels: ['Mar 3', 'Mar 10', 'Mar 17', 'Mar 24', 'Apr 1'],
    portfolio:  [12.685, 12.720, 12.692, 12.760, 12.847],
    benchmark:  [12.685, 12.706, 12.681, 12.730, 12.790],
    portfolioReturn: 1.28,
    benchmarkReturn: 0.82,
    absGain: 162_000,
  },
  '3M': {
    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    portfolio:  [12.583, 12.710, 12.800, 12.847],
    benchmark:  [12.350, 12.440, 12.530, 12.560],
    portfolioReturn: 2.09,
    benchmarkReturn: 1.70,
    absGain: 264_000,
  },
  '6M': {
    labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
    portfolio:  [12.550, 12.300, 12.480, 12.583, 12.710, 12.800, 12.847],
    benchmark:  [12.330, 12.100, 12.260, 12.350, 12.440, 12.530, 12.560],
    portfolioReturn: 2.37,
    benchmarkReturn: 1.86,
    absGain: 297_000,
  },
  'YTD': {
    labels: ['Jan 1', 'Jan', 'Feb', 'Mar', 'Apr 1'],
    portfolio:  [12.541, 12.583, 12.710, 12.800, 12.847],
    benchmark:  [12.320, 12.350, 12.440, 12.530, 12.560],
    portfolioReturn: 2.44,
    benchmarkReturn: 1.95,
    absGain: 306_000,
  },
  '1Y': {
    labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
    portfolio:  [11.820, 11.950, 12.100, 12.340, 12.180, 12.420, 12.550, 12.300, 12.480, 12.583, 12.710, 12.800, 12.847],
    benchmark:  [11.820, 11.890, 12.000, 12.180, 12.050, 12.220, 12.330, 12.100, 12.260, 12.350, 12.440, 12.530, 12.560],
    portfolioReturn: 8.69,
    benchmarkReturn: 6.26,
    absGain: 1_027_000,
  },
  '3Y': {
    labels: ["Q2'23", "Q3'23", "Q4'23", "Q1'24", "Q2'24", "Q3'24", "Q4'24", "Q1'25", "Q2'25", "Q3'25", "Q4'25", "Q1'26"],
    portfolio:  [10.250, 10.480, 10.820, 11.100, 11.380, 11.540, 11.820, 11.950, 12.300, 12.550, 12.680, 12.847],
    benchmark:  [10.250, 10.390, 10.680, 10.900, 11.120, 11.280, 11.500, 11.660, 11.980, 12.200, 12.400, 12.560],
    portfolioReturn: 25.34,
    benchmarkReturn: 22.54,
    absGain: 2_597_000,
  },
  'All': {
    labels: ["Q1'22", "Q3'22", "Q1'23", "Q3'23", "Q1'24", "Q3'24", "Q1'25", "Q3'25", "Q1'26"],
    portfolio:  [9.200, 9.050, 9.700, 10.480, 11.100, 11.540, 11.950, 12.550, 12.847],
    benchmark:  [9.200, 9.000, 9.600, 10.390, 10.900, 11.280, 11.660, 12.200, 12.560],
    portfolioReturn: 39.6,
    benchmarkReturn: 36.5,
    absGain: 3_647_000,
  },
}

export const mockAssetReturns = [
  { id: 'monetary',   label: 'Monetary Holdings', return1M: 0.1, returnYTD: 0.4,  return1Y: 4.8,  color: '#378ADD' },
  { id: 'securities', label: 'Securities',         return1M: 1.8, returnYTD: 3.2,  return1Y: 9.2,  color: '#1D9E75' },
  { id: 'metals',     label: 'Precious Metals',    return1M: 2.1, returnYTD: 3.8,  return1Y: 6.1,  color: '#C4A44A' },
  { id: 'digital',    label: 'Digital Assets',     return1M: -1.2, returnYTD: -2.4, return1Y: -4.2, color: '#7F77DD' },
  { id: 'real-estate',label: 'Real Estate',        return1M: 0.0, returnYTD: 0.0,  return1Y: 2.8,  color: '#D85A30' },
]

export const mockMonthlyReturns = [
  { month: 'Apr 25', value: 1.18 },
  { month: 'May 25', value: 1.10 },
  { month: 'Jun 25', value: 1.30 },
  { month: 'Jul 25', value: 1.98 },
  { month: 'Aug 25', value: -1.30 },
  { month: 'Sep 25', value: 1.97 },
  { month: 'Oct 25', value: 1.05 },
  { month: 'Nov 25', value: -1.99 },
  { month: 'Dec 25', value: 1.46 },
  { month: 'Jan 26', value: 0.82 },
  { month: 'Feb 26', value: 1.02 },
  { month: 'Mar 26', value: 0.71 },
]

export const mockRiskMetrics = {
  sharpe:      { value: '1.42', label: 'Sharpe Ratio', sub: 'Risk-adjusted return (1Y)' },
  volatility:  { value: '6.8%', label: 'Annualised Volatility', sub: 'Std dev of monthly returns' },
  maxDrawdown: { value: '−3.6%', label: 'Max Drawdown', sub: 'Peak-to-trough (1Y)' },
  beta:        { value: '0.72', label: 'Beta vs SPI', sub: 'Lower beta = lower market sensitivity' },
  alpha:       { value: '+2.43%', label: 'Alpha (1Y)', sub: 'Excess return over benchmark' },
  correlation: { value: '0.84', label: 'Benchmark Correlation', sub: 'vs ZPF Balanced 60/40 Index' },
}

// ── Real Estate ────────────────────────────────────────────

export const mockProperties = [
  {
    id: 'victoria-island',
    name: 'Victoria Island Residence',
    address: '14 Kofo Abayomi Street, Victoria Island, Lagos, Nigeria',
    type: 'Residential — Detached Villa',
    status: 'occupied',
    statusLabel: 'Owner-occupied',
    valuationCHF: 820_000,
    valuationLocal: '₦ 1,480,000,000',
    localCurrency: 'NGN',
    acquisitionDate: 'August 2019',
    acquisitionCHF: 640_000,
    unrealisedPnl: +180_000,
    unrealisedPct: +28.1,
    lastValuation: 'Pending — Q4 2025 assessment commissioned',
    lastValuationDate: 'Pending',
    prevValuationDate: 'Sep 2022',
    prevValuationCHF: 740_000,
    area: '620 m²',
    landArea: '1,050 m²',
    bedrooms: 5,
    bathrooms: 5,
    features: ['Private pool', 'Staff quarters', 'Double garage', 'Backup generator', 'BQ'],
    titleRef: 'VLT-ZPF-2022-0088',
    titleStatus: 'Secured',
    titleLodged: '03 Sep 2022',
    encumbrances: 'None',
    color: '#D85A30',
    colorBg: 'rgba(216,90,48,0.08)',
    colorBorder: 'rgba(216,90,48,0.22)',
    valuationHistory: [
      { date: 'Aug 2019', valueCHF: 640_000, note: 'Acquisition cost' },
      { date: 'Mar 2021', valueCHF: 680_000, note: 'Desktop appraisal' },
      { date: 'Sep 2022', valueCHF: 740_000, note: 'Full independent valuation' },
      { date: 'Apr 2026', valueCHF: 820_000, note: 'Estimated (Q4 2025 pending)' },
    ],
  },
  {
    id: 'lekki-plot',
    name: 'Lekki Phase 1 — Land Title',
    address: 'Plot 44B, Admiralty Way, Lekki Phase 1, Lagos, Nigeria',
    type: 'Land — Commercial Plot',
    status: 'undeveloped',
    statusLabel: 'Undeveloped — Development review 2026',
    valuationCHF: 580_000,
    valuationLocal: '₦ 1,044,000,000',
    localCurrency: 'NGN',
    acquisitionDate: 'February 2021',
    acquisitionCHF: 420_000,
    unrealisedPnl: +160_000,
    unrealisedPct: +38.1,
    lastValuation: 'Pending — Q4 2025 assessment commissioned',
    lastValuationDate: 'Pending',
    prevValuationDate: 'Jan 2024',
    prevValuationCHF: 540_000,
    area: null,
    landArea: '2,200 m²',
    bedrooms: null,
    bathrooms: null,
    features: ['Waterfront access', 'Commercial zoning', 'Road frontage', 'Serviced plot'],
    titleRef: 'VLT-ZPF-2024-0101',
    titleStatus: 'Secured',
    titleLodged: '03 Jan 2024',
    encumbrances: 'None',
    color: '#D85A30',
    colorBg: 'rgba(216,90,48,0.08)',
    colorBorder: 'rgba(216,90,48,0.22)',
    valuationHistory: [
      { date: 'Feb 2021', valueCHF: 420_000, note: 'Acquisition cost' },
      { date: 'Jun 2022', valueCHF: 468_000, note: 'Desktop appraisal' },
      { date: 'Jan 2024', valueCHF: 540_000, note: 'Full independent valuation' },
      { date: 'Apr 2026', valueCHF: 580_000, note: 'Estimated (Q4 2025 pending)' },
    ],
  },
]

// ── Digital Assets ─────────────────────────────────────────

export const mockDigitalAssets = [
  {
    id: 'btc',
    symbol: 'BTC',
    name: 'Bitcoin',
    color: '#F7931A',
    colorBg: 'rgba(247,147,26,0.1)',
    colorBorder: 'rgba(247,147,26,0.25)',
    holdings: 7.40,
    unit: 'BTC',
    spotPriceCHF: 83_108.11,
    valueCHF: 615_000,
    costBasisCHF: 648_200,
    unrealisedPnl: -33_200,
    unrealisedPct: -5.12,
    return30d: -3.1,
    return1Y: -5.8,
    allocation: 75.9,
    network: 'Bitcoin (BTC)',
    custody: 'ZPF Institutional Cold Storage · Multisig 3-of-5',
    custodyRef: 'ZPF-COLD-BTC-001',
    walletType: 'Air-gapped hardware · HSM-grade',
    priceHistory: [76_420, 79_880, 84_200, 92_440, 88_100, 85_640, 83_200, 79_880, 81_440, 84_920, 83_108],
    priceLabels:  ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    dailyChange: -1.24,
    acquisitions: [
      { date: 'Sep 2022', qty: 3.20, priceCHF: 18_840, ref: 'DIG-ZPF-2022-0441' },
      { date: 'Mar 2023', qty: 2.10, priceCHF: 24_180, ref: 'DIG-ZPF-2023-0187' },
      { date: 'Oct 2024', qty: 2.10, priceCHF: 59_620, ref: 'DIG-ZPF-2024-0749' },
    ],
  },
  {
    id: 'eth',
    symbol: 'ETH',
    name: 'Ethereum',
    color: '#627EEA',
    colorBg: 'rgba(98,126,234,0.1)',
    colorBorder: 'rgba(98,126,234,0.25)',
    holdings: 84.80,
    unit: 'ETH',
    spotPriceCHF: 2_299.53,
    valueCHF: 195_000,
    costBasisCHF: 188_440,
    unrealisedPnl: +6_560,
    unrealisedPct: +3.48,
    return30d: -0.8,
    return1Y: -1.4,
    allocation: 24.1,
    network: 'Ethereum (ETH)',
    custody: 'ZPF Institutional Cold Storage · Multisig 2-of-3',
    custodyRef: 'ZPF-COLD-ETH-001',
    walletType: 'Air-gapped hardware · HSM-grade',
    priceHistory: [2_080, 2_140, 2_260, 2_480, 2_320, 2_280, 2_240, 2_180, 2_220, 2_310, 2_299],
    priceLabels:  ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    dailyChange: -0.49,
    acquisitions: [
      { date: 'Jun 2022', qty: 48.20, priceCHF: 1_840, ref: 'DIG-ZPF-2022-0318' },
      { date: 'Apr 2023', qty: 24.20, priceCHF: 1_980, ref: 'DIG-ZPF-2023-0294' },
      { date: 'Sep 2025', qty: 12.40, priceCHF: 2_300, ref: 'DIG-ZPF-2025-0612' },
    ],
  },
]

export const mockDigitalActivity = [
  { name: 'ETH — 12.4 ETH cold storage transfer', date: '14 Sep 2025', amount: -28_520,  currency: 'CHF', direction: 'down' as const, detail: 'On-chain confirmed · ZPF custody wallet · Ref: DIG-ZPF-2025-0612' },
  { name: 'BTC — 2.1 BTC custody transfer',       date: '28 Oct 2024', amount: 0,         currency: 'BTC', direction: 'up'   as const, detail: 'On-chain confirmed · 2.1 BTC received · Ref: DIG-ZPF-2024-0749' },
  { name: 'ETH — 24.2 ETH purchased',             date: '18 Apr 2023', amount: -47_916,   currency: 'CHF', direction: 'down' as const, detail: 'Acquired via ZPF Digital desk · CHF 1,980/ETH · Ref: DIG-ZPF-2023-0294' },
  { name: 'BTC — 2.1 BTC purchased',              date: '02 Mar 2023', amount: -50_778,   currency: 'CHF', direction: 'down' as const, detail: 'Acquired via ZPF Digital desk · CHF 24,180/BTC · Ref: DIG-ZPF-2023-0187' },
]

// ── Securities ─────────────────────────────────────────────

export const mockEquities = [
  { ticker: 'NESN',  name: 'Nestlé SA',             exchange: 'SIX', sector: 'Consumer Staples', shares: 3_680, priceCHF: 84.24, valueCHF: 310_003, weight: 7.9, returnYTD: +4.2, return1Y: +11.4, pnlCHF: +32_810 },
  { ticker: 'ROG',   name: 'Roche Holding AG',       exchange: 'SIX', sector: 'Healthcare',       shares: 940,  priceCHF: 295.80, valueCHF: 278_052, weight: 7.1, returnYTD: +2.8, return1Y: +8.6,  pnlCHF: +21_440 },
  { ticker: 'NOVN',  name: 'Novartis AG',             exchange: 'SIX', sector: 'Healthcare',       shares: 2_620, priceCHF: 93.13, valueCHF: 244_001, weight: 6.2, returnYTD: +5.6, return1Y: +14.2, pnlCHF: +28_760 },
  { ticker: 'MSFT',  name: 'Microsoft Corp',          exchange: 'NASDAQ', sector: 'Technology',   shares: 560,  priceCHF: 385.71, valueCHF: 216_000, weight: 5.5, returnYTD: +3.1, return1Y: +9.8,  pnlCHF: +19_340 },
  { ticker: 'ASML',  name: 'ASML Holding NV',         exchange: 'EURONEXT', sector: 'Technology', shares: 280,  priceCHF: 685.71, valueCHF: 192_000, weight: 4.9, returnYTD: -1.8, return1Y: +6.2,  pnlCHF: -3_480 },
  { ticker: 'AAPL',  name: 'Apple Inc',               exchange: 'NASDAQ', sector: 'Technology',   shares: 980,  priceCHF: 183.67, valueCHF: 179_997, weight: 4.6, returnYTD: +1.4, return1Y: +7.3,  pnlCHF: +12_560 },
  { ticker: 'ABBN',  name: 'ABB Ltd',                 exchange: 'SIX', sector: 'Industrials',     shares: 4_100, priceCHF: 40.00, valueCHF: 164_000, weight: 4.2, returnYTD: +6.8, return1Y: +18.4, pnlCHF: +24_900 },
  { ticker: 'MC',    name: 'LVMH Moët Hennessy',      exchange: 'EURONEXT', sector: 'Consumer',   shares: 210,  priceCHF: 704.76, valueCHF: 148_000, weight: 3.8, returnYTD: -3.2, return1Y: +2.1,  pnlCHF: -4_880 },
  { ticker: 'ZURN',  name: 'Zurich Insurance Group',  exchange: 'SIX', sector: 'Financials',      shares: 280,  priceCHF: 500.00, valueCHF: 140_000, weight: 3.6, returnYTD: +4.4, return1Y: +12.7, pnlCHF: +16_700 },
  { ticker: 'GOOGL', name: 'Alphabet Inc',             exchange: 'NASDAQ', sector: 'Technology',  shares: 740,  priceCHF: 173.00, valueCHF: 128_000, weight: 3.2, returnYTD: +2.2, return1Y: +8.4,  pnlCHF: +10_290 },
  { ticker: 'CFR',   name: 'Richemont SA',             exchange: 'SIX', sector: 'Consumer',       shares: 920,  priceCHF: 128.26, valueCHF: 118_000, weight: 3.0, returnYTD: -0.9, return1Y: +4.8,  pnlCHF: -1_060 },
  { ticker: 'UBS',   name: 'UBS Group AG',             exchange: 'SIX', sector: 'Financials',     shares: 6_240, priceCHF: 25.96, valueCHF: 162_000, weight: 4.1, returnYTD: +7.1, return1Y: +21.3, pnlCHF: +27_500 },
  { ticker: 'LONN',  name: 'Lonza Group AG',           exchange: 'SIX', sector: 'Healthcare',     shares: 220,  priceCHF: 418.18, valueCHF: 92_000,  weight: 2.3, returnYTD: +3.7, return1Y: +9.6,  pnlCHF: +8_100 },
  { ticker: 'PGHN',  name: 'Partners Group Holding',   exchange: 'SIX', sector: 'Financials',     shares: 58,   priceCHF: 1_413.79, valueCHF: 82_000, weight: 2.1, returnYTD: +2.9, return1Y: +8.1, pnlCHF: +6_440 },
  { ticker: 'SGSN',  name: 'SGS SA',                   exchange: 'SIX', sector: 'Industrials',    shares: 3_200, priceCHF: 22.50, valueCHF: 72_000,  weight: 1.8, returnYTD: +1.6, return1Y: +5.3,  pnlCHF: +3_680 },
]

export const mockBonds = [
  { name: 'Swiss Confederation Bond',       isin: 'CH0224397346', coupon: 1.25, maturity: '27 Nov 2030', ytm: 0.92, ratingMoody: 'Aaa', nominal: 400_000, valueCHF: 412_000, weight: 10.5, accrued: 2_083 },
  { name: 'German Federal Bond (Bund)',      isin: 'DE0001102465', coupon: 2.00, maturity: '15 Feb 2029', ytm: 1.84, ratingMoody: 'Aaa', nominal: 240_000, valueCHF: 248_000, weight: 6.3,  accrued: 1_600 },
  { name: 'US Treasury Note',               isin: 'US91282CJN88', coupon: 4.50, maturity: '31 Mar 2027', ytm: 4.18, ratingMoody: 'Aaa', nominal: 240_000, valueCHF: 218_000, weight: 5.5,  accrued: 3_600 },
  { name: 'Nestlé Finance Intl Bond',       isin: 'XS1902618988', coupon: 1.75, maturity: '12 Sep 2027', ytm: 2.04, ratingMoody: 'Aa3', nominal: 170_000, valueCHF: 168_000, weight: 4.3,  accrued:   992 },
  { name: 'World Bank Bond',                isin: 'XS2344887712', coupon: 2.25, maturity: '04 Apr 2028', ytm: 2.41, ratingMoody: 'Aaa', nominal: 145_000, valueCHF: 148_000, weight: 3.8,  accrued: 1_094 },
  { name: 'Apple Inc Corp Bond',            isin: 'US037833EP74', coupon: 3.85, maturity: '05 Aug 2028', ytm: 3.62, ratingMoody: 'Aa1', nominal: 135_000, valueCHF: 138_000, weight: 3.5,  accrued: 1_733 },
  { name: 'UBS AG Subordinated Bond',       isin: 'CH0597290659', coupon: 4.25, maturity: '22 Jan 2029', ytm: 4.48, ratingMoody: 'A2',  nominal: 125_000, valueCHF: 128_000, weight: 3.2,  accrued: 1_771 },
  { name: 'Swiss Federal Railways Bond',    isin: 'CH0419045459', coupon: 1.50, maturity: '09 Jun 2031', ytm: 1.28, ratingMoody: 'Aaa', nominal: 88_000,  valueCHF: 88_000,  weight: 2.2,  accrued:   440 },
  { name: 'ZPF Private Credit Fund I',      isin: 'CH0551188744', coupon: 4.80, maturity: '30 Sep 2026', ytm: 4.80, ratingMoody: 'N/R', nominal: 65_000,  valueCHF: 66_000,  weight: 1.7,  accrued: 1_040 },
]

export const mockSecuritiesActivity = [
  { name: 'Dividend — Nestlé SA (NESN)',     date: '10 Feb 2026', amount: +2_940,  currency: 'CHF', detail: 'CHF 2.45 × 1,200 shares · Ordinary dividend' },
  { name: 'Dividend — Roche Holding (ROG)',  date: '21 Apr 2025', amount: +3_648,  currency: 'CHF', detail: 'CHF 9.60 × 380 shares · Ordinary dividend' },
  { name: 'Coupon — Swiss Confederation',    date: '27 Nov 2025', amount: +5_000,  currency: 'CHF', detail: '1.25% on CHF 400,000 nominal · Annual coupon' },
  { name: 'Coupon — US Treasury Note',       date: '30 Sep 2025', amount: +5_400,  currency: 'USD', detail: '4.50% semi-annual · USD 120,000 nominal' },
  { name: 'Bond purchase — Swiss Confed.',   date: '01 Dec 2025', amount: -412_000, currency: 'CHF', detail: 'CHF 400,000 nominal · Clean price 103.0 · ZPF Securities desk' },
]

// ── Monetary Holdings ──────────────────────────────────────

export interface MonetaryAccount {
  id: string
  currency: string
  currencyName: string
  accountType: string
  accountNumber: string
  balance: number
  balanceCHF: number
  fxRate: number
  fxChange: number         // % daily FX move
  interestRate: number     // % p.a.
  interestAccruedYTD: number  // in native currency
  allocation: number       // % of total monetary holdings
  color: string
  colorBg: string
  colorBorder: string
  maturity: string | null
  status: string
  locked: boolean
}

export const mockMonetaryAccounts: MonetaryAccount[] = [
  {
    id: 'chf-current',
    currency: 'CHF',
    currencyName: 'Swiss Franc',
    accountType: 'Current Account',
    accountNumber: 'CH56 0483 •••• •••• 7800 0',
    balance: 2_100_000,
    balanceCHF: 2_100_000,
    fxRate: 1.0000,
    fxChange: 0.00,
    interestRate: 0.75,
    interestAccruedYTD: 3_937,
    allocation: 49.8,
    color: '#378ADD',
    colorBg: 'rgba(55,138,221,0.08)',
    colorBorder: 'rgba(55,138,221,0.22)',
    maturity: null,
    status: 'Active',
    locked: false,
  },
  {
    id: 'eur-notice',
    currency: 'EUR',
    currencyName: 'Euro',
    accountType: '30-Day Notice Account',
    accountNumber: 'CH93 0076 •••• •••• 5295 7',
    balance: 875_420,
    balanceCHF: 812_500,
    fxRate: 0.9283,
    fxChange: +0.12,
    interestRate: 2.10,
    interestAccruedYTD: 4_597,
    allocation: 19.3,
    color: '#4A90D9',
    colorBg: 'rgba(74,144,217,0.08)',
    colorBorder: 'rgba(74,144,217,0.22)',
    maturity: '30-day notice required',
    status: 'Active — 30-day notice',
    locked: false,
  },
  {
    id: 'usd-fixed',
    currency: 'USD',
    currencyName: 'US Dollar',
    accountType: 'Fixed Deposit — 6M',
    accountNumber: 'CH56 0483 •••• •••• 7800 2',
    balance: 830_580,
    balanceCHF: 750_000,
    fxRate: 0.9031,
    fxChange: -0.08,
    interestRate: 4.85,
    interestAccruedYTD: 10_070,
    allocation: 17.8,
    color: '#5BA3E0',
    colorBg: 'rgba(91,163,224,0.08)',
    colorBorder: 'rgba(91,163,224,0.22)',
    maturity: '15 Jul 2026',
    status: 'Locked — matures 15 Jul 2026',
    locked: true,
  },
  {
    id: 'gbp-current',
    currency: 'GBP',
    currencyName: 'British Pound',
    accountType: 'Current Account',
    accountNumber: 'CH56 0483 •••• •••• 7800 3',
    balance: 437_500,
    balanceCHF: 550_000,
    fxRate: 1.2571,
    fxChange: +0.21,
    interestRate: 0.50,
    interestAccruedYTD: 2_187,
    allocation: 13.1,
    color: '#6BB8E8',
    colorBg: 'rgba(107,184,232,0.08)',
    colorBorder: 'rgba(107,184,232,0.22)',
    maturity: null,
    status: 'Active',
    locked: false,
  },
]

export interface MonetaryTransaction {
  type: 'inbound' | 'outbound' | 'fx' | 'interest' | 'notice'
  name: string
  ref: string
  date: string
  detail: string
  amount: number   // negative for debits, 0 for notices
  currency: string
  direction: 'up' | 'down' | 'neutral'
}

export const mockMonetaryActivity: MonetaryTransaction[] = [
  {
    type: 'inbound',
    name: 'Inbound wire — CHF account',
    ref: 'REF-ZPF-2024-1847',
    date: '14 Nov 2024',
    detail: 'Verified & credited · Source: Adesa Holdings Ltd',
    amount: 500_000,
    currency: 'CHF',
    direction: 'up',
  },
  {
    type: 'outbound',
    name: 'Outbound transfer — Metals settlement',
    ref: 'REF-ZPF-2024-1521',
    date: '02 Nov 2024',
    detail: 'Settled — ZPF Metals desk · Gold purchase 5oz',
    amount: -302_150,
    currency: 'CHF',
    direction: 'down',
  },
  {
    type: 'fx',
    name: 'FX conversion — EUR → CHF',
    ref: 'FX-ZPF-2024-0892',
    date: '05 Nov 2024',
    detail: 'Executed at EUR/CHF 0.9314 · EUR 155,728 converted',
    amount: 145_000,
    currency: 'CHF',
    direction: 'up',
  },
  {
    type: 'interest',
    name: 'USD Fixed Deposit — Q3 2024 interest',
    ref: 'INT-ZPF-2024-0331',
    date: '01 Oct 2024',
    detail: 'Q3 accrual · 4.85% p.a. · Credited to USD account',
    amount: 10_066,
    currency: 'USD',
    direction: 'up',
  },
  {
    type: 'interest',
    name: 'EUR Notice Account — Q3 2024 interest',
    ref: 'INT-ZPF-2024-0287',
    date: '01 Oct 2024',
    detail: 'Q3 accrual · 2.10% p.a. · Credited to EUR account',
    amount: 4_312,
    currency: 'EUR',
    direction: 'up',
  },
  {
    type: 'notice',
    name: 'EUR Notice Account — withdrawal notice filed',
    ref: 'NOT-ZPF-2024-0142',
    date: '18 Sep 2024',
    detail: 'Notice period expired 18 Oct 2024 · Funds retained on instruction',
    amount: 0,
    currency: 'EUR',
    direction: 'neutral',
  },
]

// ── All-transactions feed ──────────────────────────────────

export type TxCategory = 'inbound' | 'outbound' | 'fx' | 'interest' | 'custody' | 'document' | 'notice'

export interface Transaction {
  id: string
  category: TxCategory
  assetClass: string      // 'monetary' | 'metals' | 'securities' | 'digital' | 'real-estate' | 'vault'
  name: string
  detail: string
  ref: string
  date: string            // display date
  dateISO: string         // for sorting
  amount: number          // 0 = non-monetary
  currency: string
  direction: 'up' | 'down' | 'neutral'
  status: 'completed' | 'pending' | 'locked' | 'notice'
  icon: string
}

export const mockTransactions: Transaction[] = [
  // 2026
  {
    id: 'tx-26-006',
    category: 'interest',
    assetClass: 'monetary',
    name: 'USD Fixed Deposit — Q1 2026 interest',
    detail: 'Q1 2026 accrual · 4.85% p.a. · Credited to USD account',
    ref: 'INT-ZPF-2026-0112',
    date: '01 Mar 2026',
    dateISO: '2026-03-01',
    amount: 10_070,
    currency: 'USD',
    direction: 'up',
    status: 'completed',
    icon: 'landmark',
  },
  {
    id: 'tx-26-005',
    category: 'inbound',
    assetClass: 'monetary',
    name: 'Inbound wire — CHF current account',
    detail: 'Verified & credited · Source: Adesa Holdings Ltd',
    ref: 'REF-ZPF-2026-0287',
    date: '14 Feb 2026',
    dateISO: '2026-02-14',
    amount: 250_000,
    currency: 'CHF',
    direction: 'up',
    status: 'completed',
    icon: 'landmark',
  },
  {
    id: 'tx-26-004',
    category: 'custody',
    assetClass: 'securities',
    name: 'Dividend received — Nestlé SA',
    detail: 'Ordinary dividend · CHF 2.45 per share · 1,200 shares held',
    ref: 'DIV-ZPF-2026-0041',
    date: '10 Feb 2026',
    dateISO: '2026-02-10',
    amount: 2_940,
    currency: 'CHF',
    direction: 'up',
    status: 'completed',
    icon: 'bar-chart-2',
  },
  {
    id: 'tx-26-003',
    category: 'fx',
    assetClass: 'monetary',
    name: 'FX conversion — GBP → CHF',
    detail: 'Executed at GBP/CHF 1.2571 · GBP 43,750 converted',
    ref: 'FX-ZPF-2026-0058',
    date: '03 Feb 2026',
    dateISO: '2026-02-03',
    amount: 54_998,
    currency: 'CHF',
    direction: 'up',
    status: 'completed',
    icon: 'landmark',
  },
  {
    id: 'tx-26-002',
    category: 'outbound',
    assetClass: 'monetary',
    name: 'Transfer — Adesa Family Trust account',
    detail: 'Approved by client · Trust administration fee settlement',
    ref: 'OUT-ZPF-2026-0031',
    date: '22 Jan 2026',
    dateISO: '2026-01-22',
    amount: -85_000,
    currency: 'CHF',
    direction: 'down',
    status: 'completed',
    icon: 'landmark',
  },
  {
    id: 'tx-26-001',
    category: 'interest',
    assetClass: 'monetary',
    name: 'EUR Notice Account — Q4 2025 interest',
    detail: 'Q4 2025 accrual · 2.10% p.a. · Credited to EUR account',
    ref: 'INT-ZPF-2026-0007',
    date: '02 Jan 2026',
    dateISO: '2026-01-02',
    amount: 4_597,
    currency: 'EUR',
    direction: 'up',
    status: 'completed',
    icon: 'landmark',
  },
  // 2025
  {
    id: 'tx-25-012',
    category: 'custody',
    assetClass: 'metals',
    name: 'Platinum allocated — 20oz added to vault',
    detail: 'Purchased via ZPF Metals desk · Vault: Geneva · 1 × 100oz bar split',
    ref: 'MET-ZPF-2025-0884',
    date: '18 Dec 2025',
    dateISO: '2025-12-18',
    amount: -60_022,
    currency: 'CHF',
    direction: 'down',
    status: 'completed',
    icon: 'hexagon',
  },
  {
    id: 'tx-25-011',
    category: 'outbound',
    assetClass: 'monetary',
    name: 'Outbound transfer — securities settlement',
    detail: 'Settled — CHF account debit · Bond purchase execution',
    ref: 'OUT-ZPF-2025-1102',
    date: '05 Dec 2025',
    dateISO: '2025-12-05',
    amount: -412_000,
    currency: 'CHF',
    direction: 'down',
    status: 'completed',
    icon: 'bar-chart-2',
  },
  {
    id: 'tx-25-010',
    category: 'custody',
    assetClass: 'securities',
    name: 'Swiss Government Bond purchase — ISIN CH0224397346',
    detail: '5-year term · 1.25% p.a. · Maturity Nov 2030 · CHF 400,000 nominal',
    ref: 'SEC-ZPF-2025-0774',
    date: '01 Dec 2025',
    dateISO: '2025-12-01',
    amount: -412_000,
    currency: 'CHF',
    direction: 'down',
    status: 'completed',
    icon: 'bar-chart-2',
  },
  {
    id: 'tx-25-009',
    category: 'interest',
    assetClass: 'monetary',
    name: 'USD Fixed Deposit — Q3 2025 interest',
    detail: 'Q3 2025 accrual · 4.85% p.a. · Credited to USD account',
    ref: 'INT-ZPF-2025-0863',
    date: '01 Oct 2025',
    dateISO: '2025-10-01',
    amount: 10_070,
    currency: 'USD',
    direction: 'up',
    status: 'completed',
    icon: 'landmark',
  },
  {
    id: 'tx-25-008',
    category: 'custody',
    assetClass: 'digital',
    name: 'ETH institutional cold storage — transfer in',
    detail: 'On-chain confirmed · 12.4 ETH transferred to ZPF custody wallet',
    ref: 'DIG-ZPF-2025-0612',
    date: '14 Sep 2025',
    dateISO: '2025-09-14',
    amount: 28_520,
    currency: 'CHF',
    direction: 'up',
    status: 'completed',
    icon: 'cpu',
  },
  {
    id: 'tx-25-007',
    category: 'document',
    assetClass: 'vault',
    name: 'Trust Deed (Amendment) lodged — Adesa Family Trust',
    detail: 'Liechtenstein · Amendment dated 20 Jul 2025 · Vault receipt issued',
    ref: 'VLT-ZPF-2025-0501',
    date: '22 Jul 2025',
    dateISO: '2025-07-22',
    amount: 0,
    currency: '—',
    direction: 'neutral',
    status: 'completed',
    icon: 'archive',
  },
  {
    id: 'tx-25-006',
    category: 'inbound',
    assetClass: 'monetary',
    name: 'Inbound wire — CHF current account',
    detail: 'Verified & credited · Source: Sunridge Capital Ltd',
    ref: 'REF-ZPF-2025-0498',
    date: '08 Jul 2025',
    dateISO: '2025-07-08',
    amount: 750_000,
    currency: 'CHF',
    direction: 'up',
    status: 'completed',
    icon: 'landmark',
  },
  {
    id: 'tx-25-005',
    category: 'fx',
    assetClass: 'monetary',
    name: 'FX conversion — USD → CHF',
    detail: 'Executed at USD/CHF 0.9031 · USD 110,780 converted',
    ref: 'FX-ZPF-2025-0344',
    date: '12 Jun 2025',
    dateISO: '2025-06-12',
    amount: 100_045,
    currency: 'CHF',
    direction: 'up',
    status: 'completed',
    icon: 'landmark',
  },
  {
    id: 'tx-25-004',
    category: 'custody',
    assetClass: 'securities',
    name: 'Dividend received — Roche Holding AG',
    detail: 'Ordinary dividend · CHF 9.60 per share · 380 shares held',
    ref: 'DIV-ZPF-2025-0198',
    date: '21 Apr 2025',
    dateISO: '2025-04-21',
    amount: 3_648,
    currency: 'CHF',
    direction: 'up',
    status: 'completed',
    icon: 'bar-chart-2',
  },
  // 2024
  {
    id: 'tx-24-007',
    category: 'inbound',
    assetClass: 'monetary',
    name: 'Inbound wire — CHF current account',
    detail: 'Verified & credited · Source: Adesa Holdings Ltd',
    ref: 'REF-ZPF-2024-1847',
    date: '14 Nov 2024',
    dateISO: '2024-11-14',
    amount: 500_000,
    currency: 'CHF',
    direction: 'up',
    status: 'completed',
    icon: 'landmark',
  },
  {
    id: 'tx-24-006',
    category: 'custody',
    assetClass: 'metals',
    name: 'Gold purchase — 5oz allocated to vault',
    detail: 'ZPF Vault confirmed · Zürich HB · Spot + 0.35% premium',
    ref: 'MET-ZPF-2024-1521',
    date: '02 Nov 2024',
    dateISO: '2024-11-02',
    amount: -302_150,
    currency: 'CHF',
    direction: 'down',
    status: 'completed',
    icon: 'hexagon',
  },
  {
    id: 'tx-24-005',
    category: 'fx',
    assetClass: 'monetary',
    name: 'FX conversion — EUR → CHF',
    detail: 'Executed at EUR/CHF 0.9314 · EUR 155,728 converted',
    ref: 'FX-ZPF-2024-0892',
    date: '05 Nov 2024',
    dateISO: '2024-11-05',
    amount: 145_000,
    currency: 'CHF',
    direction: 'up',
    status: 'completed',
    icon: 'landmark',
  },
  {
    id: 'tx-24-004',
    category: 'custody',
    assetClass: 'digital',
    name: 'BTC custody transfer — received',
    detail: 'On-chain confirmed · 2.1 BTC transferred to ZPF custody wallet',
    ref: 'DIG-ZPF-2024-0749',
    date: '28 Oct 2024',
    dateISO: '2024-10-28',
    amount: 0,
    currency: 'BTC',
    direction: 'up',
    status: 'completed',
    icon: 'cpu',
  },
  {
    id: 'tx-24-003',
    category: 'interest',
    assetClass: 'monetary',
    name: 'USD Fixed Deposit — Q3 2024 interest',
    detail: 'Q3 2024 accrual · 4.85% p.a. · Credited to USD account',
    ref: 'INT-ZPF-2024-0331',
    date: '01 Oct 2024',
    dateISO: '2024-10-01',
    amount: 10_066,
    currency: 'USD',
    direction: 'up',
    status: 'completed',
    icon: 'landmark',
  },
  {
    id: 'tx-24-002',
    category: 'document',
    assetClass: 'vault',
    name: 'Power of Attorney lodged — Dr. K. Adebayo',
    detail: 'Vault receipt issued · Review due Jan 2026',
    ref: 'VLT-ZPF-2024-0412',
    date: '08 Jul 2024',
    dateISO: '2024-07-08',
    amount: 0,
    currency: '—',
    direction: 'neutral',
    status: 'completed',
    icon: 'archive',
  },
  {
    id: 'tx-24-001',
    category: 'custody',
    assetClass: 'real-estate',
    name: 'Title Deed — Victoria Island Property lodged',
    detail: 'Lagos, Nigeria · Document custody confirmed · Physical + digital copy',
    ref: 'VLT-ZPF-2024-0101',
    date: '03 Jan 2024',
    dateISO: '2024-01-03',
    amount: 0,
    currency: '—',
    direction: 'neutral',
    status: 'completed',
    icon: 'building-2',
  },
]

// ── Transfer Requests ──────────────────────────────────────

export type TransferStatus = 'pending-approval' | 'approved' | 'processing' | 'completed' | 'rejected'
export type TransferType   = 'swift' | 'sepa' | 'internal' | 'fx'

export interface TransferRequest {
  id: string
  ref: string
  type: TransferType
  typeLabel: string
  status: TransferStatus
  submittedDate: string
  valueDate: string
  fromAccount: string
  fromCurrency: string
  toName: string
  toBank: string
  toIban: string
  toCountry: string
  amount: number
  currency: string
  amountCHF: number
  purpose: string
  rmNote: string | null
  completedDate: string | null
}

export const mockTransferRequests: TransferRequest[] = [
  {
    id: 'tfr-001',
    ref: 'TFR-ZPF-2026-0031',
    type: 'internal',
    typeLabel: 'Internal Transfer',
    status: 'pending-approval',
    submittedDate: '01 Apr 2026',
    valueDate: '03 Apr 2026',
    fromAccount: 'CHF Current — CH56 0483 •••• •••• 7800 0',
    fromCurrency: 'CHF',
    toName: 'Adesa Family Trust — ZPF Trust Account',
    toBank: 'ZPF AG, Zürich',
    toIban: 'CH93 0076 •••• •••• 4412 8',
    toCountry: 'Switzerland',
    amount: 150_000,
    currency: 'CHF',
    amountCHF: 150_000,
    purpose: 'Trust administration — Q2 2026 distribution',
    rmNote: 'Under review — Dr. von Steiner will confirm by 02 Apr 2026.',
    completedDate: null,
  },
  {
    id: 'tfr-002',
    ref: 'TFR-ZPF-2026-0022',
    type: 'swift',
    typeLabel: 'SWIFT Transfer',
    status: 'approved',
    submittedDate: '28 Mar 2026',
    valueDate: '04 Apr 2026',
    fromAccount: 'GBP Current — CH56 0483 •••• •••• 7800 3',
    fromCurrency: 'GBP',
    toName: 'Sunridge Capital Ltd',
    toBank: 'Barclays Bank plc, London',
    toIban: 'GB29 BARC 2014 7016 1349 20',
    toCountry: 'United Kingdom',
    amount: 85_000,
    currency: 'GBP',
    amountCHF: 106_854,
    purpose: 'Investment capital repatriation',
    rmNote: 'Approved. Compliance check complete. Funds will settle T+2.',
    completedDate: null,
  },
  {
    id: 'tfr-003',
    ref: 'TFR-ZPF-2026-0014',
    type: 'fx',
    typeLabel: 'FX Conversion',
    status: 'completed',
    submittedDate: '03 Feb 2026',
    valueDate: '03 Feb 2026',
    fromAccount: 'GBP Current — CH56 0483 •••• •••• 7800 3',
    fromCurrency: 'GBP',
    toName: 'CHF Current Account (same client)',
    toBank: 'ZPF AG, Zürich',
    toIban: 'CH56 0483 •••• •••• 7800 0',
    toCountry: 'Switzerland',
    amount: 43_750,
    currency: 'GBP',
    amountCHF: 54_998,
    purpose: 'FX conversion — GBP to CHF · Rate: 1.2571',
    rmNote: null,
    completedDate: '03 Feb 2026',
  },
  {
    id: 'tfr-004',
    ref: 'TFR-ZPF-2026-0007',
    type: 'internal',
    typeLabel: 'Internal Transfer',
    status: 'completed',
    submittedDate: '22 Jan 2026',
    valueDate: '22 Jan 2026',
    fromAccount: 'CHF Current — CH56 0483 •••• •••• 7800 0',
    fromCurrency: 'CHF',
    toName: 'Adesa Family Trust — ZPF Trust Account',
    toBank: 'ZPF AG, Zürich',
    toIban: 'CH93 0076 •••• •••• 4412 8',
    toCountry: 'Switzerland',
    amount: 85_000,
    currency: 'CHF',
    amountCHF: 85_000,
    purpose: 'Trust administration fee settlement',
    rmNote: null,
    completedDate: '22 Jan 2026',
  },
  {
    id: 'tfr-005',
    ref: 'TFR-ZPF-2025-1102',
    type: 'swift',
    typeLabel: 'SWIFT Transfer',
    status: 'rejected',
    submittedDate: '04 Dec 2025',
    valueDate: '08 Dec 2025',
    fromAccount: 'CHF Current — CH56 0483 •••• •••• 7800 0',
    fromCurrency: 'CHF',
    toName: 'Horizon Ventures Ltd',
    toBank: 'First Bank Nigeria, Lagos',
    toIban: 'NG14 FBNI 0150 0010 0000 0001',
    toCountry: 'Nigeria',
    amount: 200_000,
    currency: 'CHF',
    amountCHF: 200_000,
    purpose: 'Investment capital',
    rmNote: 'Rejected — enhanced due diligence required for this destination. Please contact your RM to proceed.',
    completedDate: null,
  },
]

// ── Secure Messages ────────────────────────────────────────

export type MessageSender = 'client' | 'trustee' | 'rm' | 'bank'
export type MessageCategory = 'rm' | 'compliance' | 'operations' | 'custody' | 'advisory'

export interface SecureMessage {
  id: string
  sender: MessageSender
  senderName: string
  content: string
  date: string
  dateISO: string
  attachments?: { name: string; size: string }[]
}

export interface MessageThread {
  id: string
  subject: string
  category: MessageCategory
  categoryLabel: string
  participantName: string
  participantTitle: string
  participantInitials: string
  lastSnippet: string
  lastDate: string
  lastDateISO: string
  unread: number
  messages: SecureMessage[]
}

export const mockMessageThreads: MessageThread[] = [
  {
    id: 'msg-001',
    subject: 'Q1 2026 Portfolio Review — Scheduled',
    category: 'rm',
    categoryLabel: 'RM Correspondence',
    participantName: 'Dr. Markus von Steiner',
    participantTitle: 'Managing Director & Senior RM',
    participantInitials: 'MvS',
    lastSnippet: 'Please confirm your availability for a call on 14 April at 14:00 CET.',
    lastDate: '01 Apr 2026',
    lastDateISO: '2026-04-01',
    unread: 1,
    messages: [
      {
        id: 'msg-001-a',
        sender: 'client',
        senderName: 'Adebayo Suleiman',
        content: 'Dear Markus, I wanted to check in ahead of the Q1 close. Could we schedule a call to discuss the portfolio performance and any rebalancing opportunities?',
        date: '28 Mar 2026',
        dateISO: '2026-03-28',
      },
      {
        id: 'msg-001-b',
        sender: 'rm',
        senderName: 'Dr. Markus von Steiner',
        content: 'Dear Adebayo,\n\nThank you for reaching out. I have reviewed your Q1 figures and I am pleased to say the portfolio has performed very well against our benchmark.\n\nI have attached the preliminary Q1 performance summary for your review ahead of our call.',
        date: '29 Mar 2026',
        dateISO: '2026-03-29',
        attachments: [{ name: 'Q1-2026-Preliminary-Summary.pdf', size: '0.8 MB' }],
      },
      {
        id: 'msg-001-c',
        sender: 'rm',
        senderName: 'Dr. Markus von Steiner',
        content: 'Dear Adebayo,\n\nFollowing up on my previous message — I have now confirmed availability in my diary. Please confirm your availability for a call on 14 April at 14:00 CET. I will send a secure video link upon confirmation.\n\nBest regards,\nMarkus',
        date: '01 Apr 2026',
        dateISO: '2026-04-01',
      },
      {
        id: 'msg-001-d',
        sender: 'trustee',
        senderName: 'Kemi Adebayo-Suleiman',
        content: 'Good afternoon Markus — Adebayo is travelling this week. On his behalf, 14 April at 14:00 CET works well. Please send the video link to both of us.',
        date: '02 Apr 2026',
        dateISO: '2026-04-02',
      },
    ],
  },
  {
    id: 'msg-002',
    subject: 'Annual Client Declaration — Action Required by 30 Apr 2026',
    category: 'compliance',
    categoryLabel: 'Compliance',
    participantName: 'ZPF Compliance Team',
    participantTitle: 'Client Compliance & Onboarding',
    participantInitials: 'ZC',
    lastSnippet: 'Your annual FATCA/CRS self-certification is due by 30 April 2026.',
    lastDate: '25 Mar 2026',
    lastDateISO: '2026-03-25',
    unread: 1,
    messages: [
      {
        id: 'msg-002-a',
        sender: 'bank',
        senderName: 'ZPF Compliance Team',
        content: 'Dear Mr. Suleiman,\n\nAs part of our annual regulatory obligations under FATCA and CRS (Common Reporting Standard), we are required to collect an updated self-certification of your tax residency status.\n\nPlease complete and return the attached form by 30 April 2026. If your circumstances have not changed since your last declaration (filed January 2025), you may confirm this by replying to this message.\n\nFailure to respond may result in temporary restrictions on outbound transfer services.',
        date: '25 Mar 2026',
        dateISO: '2026-03-25',
        attachments: [
          { name: 'FATCA-CRS-Self-Certification-2026.pdf', size: '0.3 MB' },
          { name: 'Guidance-Notes-CRS-2026.pdf', size: '0.2 MB' },
        ],
      },
    ],
  },
  {
    id: 'msg-003',
    subject: 'SWIFT Transfer TFR-ZPF-2026-0022 — Approved',
    category: 'operations',
    categoryLabel: 'Operations',
    participantName: 'ZPF Operations Desk',
    participantTitle: 'Client Operations & Transfers',
    participantInitials: 'ZO',
    lastSnippet: 'Your transfer of GBP 85,000 to Sunridge Capital has been approved and will settle T+2.',
    lastDate: '28 Mar 2026',
    lastDateISO: '2026-03-28',
    unread: 0,
    messages: [
      {
        id: 'msg-003-a',
        sender: 'bank',
        senderName: 'ZPF Operations Desk',
        content: 'Dear Mr. Suleiman,\n\nWe confirm that your SWIFT transfer request TFR-ZPF-2026-0022 has been reviewed by your relationship manager and cleared by our compliance desk.\n\nDetails:\n— Amount: GBP 85,000\n— Beneficiary: Sunridge Capital Ltd, Barclays Bank plc, London\n— Value Date: 04 April 2026 (T+2)\n— Reference: TFR-ZPF-2026-0022\n\nFunds will be debited from your GBP Current Account on the value date. A transaction confirmation will be issued upon settlement.',
        date: '28 Mar 2026',
        dateISO: '2026-03-28',
      },
    ],
  },
  {
    id: 'msg-004',
    subject: 'Precious Metals Custody — 2025 Annual Confirmation',
    category: 'custody',
    categoryLabel: 'Custody',
    participantName: 'ZPF Custody & Vault',
    participantTitle: 'Precious Metals & Custody Services',
    participantInitials: 'ZV',
    lastSnippet: 'Your 2025 annual custody statement has been generated and is available in Statements.',
    lastDate: '05 Jan 2026',
    lastDateISO: '2026-01-05',
    unread: 0,
    messages: [
      {
        id: 'msg-004-a',
        sender: 'bank',
        senderName: 'ZPF Custody & Vault',
        content: 'Dear Mr. Suleiman,\n\nWe are pleased to confirm that your annual precious metals custody statement for the period 01 January 2025 – 31 December 2025 has been generated.\n\nYour holdings at 31 December 2025:\n— Gold: 42.5 troy oz · ZPF Zürich Vault (Bahnhofstrasse 72)\n— Silver: 950 troy oz · ZPF Zürich Vault\n— Platinum: 8.0 troy oz · ZPF Zürich Vault\n\nThe full custody confirmation document is available in your Statements section. All holdings are fully insured under ZPF\'s institutional vault coverage policy (ZPF-INS-2025-VLT).',
        date: '05 Jan 2026',
        dateISO: '2026-01-05',
        attachments: [{ name: 'Custody-Confirmation-Metals-2025.pdf', size: '0.4 MB' }],
      },
      {
        id: 'msg-004-b',
        sender: 'client',
        senderName: 'Adebayo Suleiman',
        content: 'Thank you. Received and noted. Please confirm when the next physical audit is scheduled.',
        date: '06 Jan 2026',
        dateISO: '2026-01-06',
      },
      {
        id: 'msg-004-c',
        sender: 'bank',
        senderName: 'ZPF Custody & Vault',
        content: 'Dear Mr. Suleiman,\n\nThe next scheduled physical audit of your precious metals holdings is 15 March 2026. You will receive a formal audit certificate within 5 business days of completion. An independent auditor appointed by ZPF AG will conduct the audit under our standard custody protocol.',
        date: '07 Jan 2026',
        dateISO: '2026-01-07',
      },
    ],
  },
  {
    id: 'msg-005',
    subject: 'Advisory Note — Digital Assets Market Conditions',
    category: 'advisory',
    categoryLabel: 'Advisory',
    participantName: 'Dr. Markus von Steiner',
    participantTitle: 'Managing Director & Senior RM',
    participantInitials: 'MvS',
    lastSnippet: 'Given recent volatility, we recommend a brief review of your digital assets allocation.',
    lastDate: '18 Feb 2026',
    lastDateISO: '2026-02-18',
    unread: 0,
    messages: [
      {
        id: 'msg-005-a',
        sender: 'rm',
        senderName: 'Dr. Markus von Steiner',
        content: 'Dear Adebayo,\n\nI wanted to bring to your attention some recent developments in the digital assets market. BTC has experienced a 6.3% drawdown over the past 30 days, and ETH is down approximately 4.8% over the same period.\n\nGiven that your digital assets allocation currently represents 6.3% of total portfolio value, and in line with your Balanced–Medium risk profile, I would recommend we schedule a brief review call to discuss whether any adjustment is appropriate.\n\nI am not recommending any immediate action — this is purely a monitoring note. Please let me know your thoughts.',
        date: '18 Feb 2026',
        dateISO: '2026-02-18',
      },
      {
        id: 'msg-005-b',
        sender: 'client',
        senderName: 'Adebayo Suleiman',
        content: 'Thanks Markus. I\'m comfortable holding for now. Let\'s revisit this during our Q1 review call.',
        date: '19 Feb 2026',
        dateISO: '2026-02-19',
      },
      {
        id: 'msg-005-c',
        sender: 'rm',
        senderName: 'Dr. Markus von Steiner',
        content: 'Understood. I have noted your instruction to hold. We will revisit during the Q1 review. Thank you, Adebayo.',
        date: '19 Feb 2026',
        dateISO: '2026-02-19',
      },
    ],
  },
]

// ── Statements ─────────────────────────────────────────────

export type StatementType = 'quarterly' | 'annual' | 'tax' | 'transaction' | 'custody' | 'performance'

export interface Statement {
  id: string
  type: StatementType
  typeLabel: string
  title: string
  period: string
  year: number
  generatedDate: string
  size: string
  pages: number
  new: boolean
}

export const mockStatements: Statement[] = [
  // 2026
  { id: 'stmt-2026-q1',  type: 'quarterly',    typeLabel: 'Quarterly Valuation',  title: 'Portfolio Valuation — Q1 2026',         period: 'Jan – Mar 2026',  year: 2026, generatedDate: '01 Apr 2026', size: '1.2 MB', pages: 14, new: true  },
  // 2025
  { id: 'stmt-2025-q4',  type: 'quarterly',    typeLabel: 'Quarterly Valuation',  title: 'Portfolio Valuation — Q4 2025',         period: 'Oct – Dec 2025',  year: 2025, generatedDate: '02 Jan 2026', size: '1.4 MB', pages: 16, new: true  },
  { id: 'stmt-2025-ann', type: 'annual',        typeLabel: 'Annual Statement',     title: 'Annual Portfolio Statement — 2025',     period: 'Full Year 2025',  year: 2025, generatedDate: '15 Jan 2026', size: '3.8 MB', pages: 42, new: true  },
  { id: 'stmt-2025-tax', type: 'tax',           typeLabel: 'Tax Certificate',      title: 'Tax Reporting Certificate — 2025',      period: 'Full Year 2025',  year: 2025, generatedDate: '20 Jan 2026', size: '0.6 MB', pages: 6,  new: false },
  { id: 'stmt-2025-q3',  type: 'quarterly',    typeLabel: 'Quarterly Valuation',  title: 'Portfolio Valuation — Q3 2025',         period: 'Jul – Sep 2025',  year: 2025, generatedDate: '01 Oct 2025', size: '1.3 MB', pages: 14, new: false },
  { id: 'stmt-2025-prf', type: 'performance',  typeLabel: 'Performance Report',   title: 'Performance Attribution Report — 2025', period: 'Full Year 2025',  year: 2025, generatedDate: '15 Jan 2026', size: '2.1 MB', pages: 28, new: false },
  { id: 'stmt-2025-q2',  type: 'quarterly',    typeLabel: 'Quarterly Valuation',  title: 'Portfolio Valuation — Q2 2025',         period: 'Apr – Jun 2025',  year: 2025, generatedDate: '01 Jul 2025', size: '1.2 MB', pages: 13, new: false },
  { id: 'stmt-2025-q1',  type: 'quarterly',    typeLabel: 'Quarterly Valuation',  title: 'Portfolio Valuation — Q1 2025',         period: 'Jan – Mar 2025',  year: 2025, generatedDate: '01 Apr 2025', size: '1.1 MB', pages: 13, new: false },
  { id: 'stmt-2025-cus', type: 'custody',      typeLabel: 'Custody Confirmation', title: 'Precious Metals Custody — 2025',        period: 'Full Year 2025',  year: 2025, generatedDate: '05 Jan 2026', size: '0.4 MB', pages: 4,  new: false },
  // 2024
  { id: 'stmt-2024-q4',  type: 'quarterly',    typeLabel: 'Quarterly Valuation',  title: 'Portfolio Valuation — Q4 2024',         period: 'Oct – Dec 2024',  year: 2024, generatedDate: '02 Jan 2025', size: '1.3 MB', pages: 15, new: false },
  { id: 'stmt-2024-ann', type: 'annual',        typeLabel: 'Annual Statement',     title: 'Annual Portfolio Statement — 2024',     period: 'Full Year 2024',  year: 2024, generatedDate: '15 Jan 2025', size: '3.6 MB', pages: 40, new: false },
  { id: 'stmt-2024-tax', type: 'tax',           typeLabel: 'Tax Certificate',      title: 'Tax Reporting Certificate — 2024',      period: 'Full Year 2024',  year: 2024, generatedDate: '20 Jan 2025', size: '0.6 MB', pages: 6,  new: false },
  { id: 'stmt-2024-prf', type: 'performance',  typeLabel: 'Performance Report',   title: 'Performance Attribution Report — 2024', period: 'Full Year 2024',  year: 2024, generatedDate: '15 Jan 2025', size: '2.0 MB', pages: 26, new: false },
  { id: 'stmt-2024-trn', type: 'transaction',  typeLabel: 'Transaction Listing',  title: 'Full Transaction Listing — 2024',       period: 'Full Year 2024',  year: 2024, generatedDate: '15 Jan 2025', size: '0.9 MB', pages: 18, new: false },
  // 2023
  { id: 'stmt-2023-ann', type: 'annual',        typeLabel: 'Annual Statement',     title: 'Annual Portfolio Statement — 2023',     period: 'Full Year 2023',  year: 2023, generatedDate: '15 Jan 2024', size: '3.2 MB', pages: 38, new: false },
  { id: 'stmt-2023-tax', type: 'tax',           typeLabel: 'Tax Certificate',      title: 'Tax Reporting Certificate — 2023',      period: 'Full Year 2023',  year: 2023, generatedDate: '20 Jan 2024', size: '0.5 MB', pages: 5,  new: false },
  { id: 'stmt-2023-prf', type: 'performance',  typeLabel: 'Performance Report',   title: 'Performance Attribution Report — 2023', period: 'Full Year 2023',  year: 2023, generatedDate: '15 Jan 2024', size: '1.9 MB', pages: 24, new: false },
  { id: 'stmt-2023-trn', type: 'transaction',  typeLabel: 'Transaction Listing',  title: 'Full Transaction Listing — 2023',       period: 'Full Year 2023',  year: 2023, generatedDate: '15 Jan 2024', size: '0.8 MB', pages: 16, new: false },
  // 2022
  { id: 'stmt-2022-ann', type: 'annual',        typeLabel: 'Annual Statement',     title: 'Annual Portfolio Statement — 2022',     period: 'Full Year 2022',  year: 2022, generatedDate: '15 Jan 2023', size: '2.8 MB', pages: 34, new: false },
  { id: 'stmt-2022-tax', type: 'tax',           typeLabel: 'Tax Certificate',      title: 'Tax Reporting Certificate — 2022',      period: 'Full Year 2022',  year: 2022, generatedDate: '20 Jan 2023', size: '0.5 MB', pages: 5,  new: false },
]

// ── Beneficiaries ──────────────────────────────────────────

export type BeneficiaryStatus  = 'active' | 'pending-verification' | 'suspended'
export type BeneficiaryRelation = 'self' | 'spouse' | 'child' | 'sibling' | 'parent' | 'business' | 'trust' | 'charity'

export interface Beneficiary {
  id: string
  ref: string
  name: string
  relation: BeneficiaryRelation
  relationLabel: string
  status: BeneficiaryStatus
  addedDate: string
  lastUsedDate: string | null
  bank: string
  bankCountry: string
  iban: string
  swift: string
  currency: string
  verifiedBy: string
  notes: string | null
  totalTransferred: number
  transferCount: number
}

export const mockBeneficiaries: Beneficiary[] = [
  {
    id: 'ben-001',
    ref: 'BEN-ZPF-0038-001',
    name: 'Adesa Family Trust',
    relation: 'trust',
    relationLabel: 'Family Trust',
    status: 'active',
    addedDate: '15 Mar 2022',
    lastUsedDate: '22 Jan 2026',
    bank: 'ZPF AG — Trust Services Division',
    bankCountry: 'Switzerland',
    iban: 'CH93 0076 •••• •••• 4412 8',
    swift: 'ZPFZCHZZ',
    currency: 'CHF',
    verifiedBy: 'Dr. Markus von Steiner · Verified 15 Mar 2022',
    notes: 'Primary family trust vehicle. All distributions require RM co-authorisation.',
    totalTransferred: 510_000,
    transferCount: 6,
  },
  {
    id: 'ben-002',
    ref: 'BEN-ZPF-0038-002',
    name: 'Sunridge Capital Ltd',
    relation: 'business',
    relationLabel: 'Business Entity',
    status: 'active',
    addedDate: '08 Nov 2023',
    lastUsedDate: '28 Mar 2026',
    bank: 'Barclays Bank plc',
    bankCountry: 'United Kingdom',
    iban: 'GB29 BARC 2014 7016 1349 20',
    swift: 'BARCGB22',
    currency: 'GBP',
    verifiedBy: 'ZPF Compliance Team · Verified 10 Nov 2023',
    notes: 'Investment holding company — British Virgin Islands registered. Enhanced due diligence on file.',
    totalTransferred: 85_000,
    transferCount: 1,
  },
  {
    id: 'ben-003',
    ref: 'BEN-ZPF-0038-003',
    name: 'Kemi Adebayo-Suleiman',
    relation: 'spouse',
    relationLabel: 'Spouse',
    status: 'active',
    addedDate: '12 Mar 2022',
    lastUsedDate: '04 Sep 2025',
    bank: 'First Bank of Nigeria plc',
    bankCountry: 'Nigeria',
    iban: 'NG14 FBNI 0150 0010 2847 0001',
    swift: 'FBNINGLA',
    currency: 'NGN',
    verifiedBy: 'Dr. Markus von Steiner · Verified 12 Mar 2022',
    notes: null,
    totalTransferred: 48_000,
    transferCount: 4,
  },
  {
    id: 'ben-004',
    ref: 'BEN-ZPF-0038-004',
    name: 'Dr. Kolade Adebayo',
    relation: 'sibling',
    relationLabel: 'Sibling',
    status: 'active',
    addedDate: '20 Jun 2023',
    lastUsedDate: '11 Mar 2025',
    bank: 'Access Bank Nigeria plc',
    bankCountry: 'Nigeria',
    iban: 'NG14 ACCE 0440 1501 1200 0024',
    swift: 'ABNGNGLA',
    currency: 'NGN',
    verifiedBy: 'ZPF Compliance Team · Verified 22 Jun 2023',
    notes: 'Power of Attorney holder. Document on file at ZPF vault (VLT-ZPF-2024-0412).',
    totalTransferred: 22_000,
    transferCount: 2,
  },
  {
    id: 'ben-005',
    ref: 'BEN-ZPF-0038-005',
    name: 'Horizon Ventures Ltd',
    relation: 'business',
    relationLabel: 'Business Entity',
    status: 'suspended',
    addedDate: '01 Dec 2025',
    lastUsedDate: null,
    bank: 'First Bank Nigeria',
    bankCountry: 'Nigeria',
    iban: 'NG14 FBNI 0150 0010 0000 0001',
    swift: 'FBNINGLA',
    currency: 'CHF',
    verifiedBy: 'Pending — enhanced due diligence in progress',
    notes: 'Suspended pending enhanced due diligence. Transfer TFR-ZPF-2025-1102 was rejected. Contact your RM to resolve.',
    totalTransferred: 0,
    transferCount: 0,
  },
  {
    id: 'ben-006',
    ref: 'BEN-ZPF-0038-006',
    name: 'Lagos Business School Foundation',
    relation: 'charity',
    relationLabel: 'Charitable Organisation',
    status: 'pending-verification',
    addedDate: '22 Mar 2026',
    lastUsedDate: null,
    bank: 'Guaranty Trust Bank plc',
    bankCountry: 'Nigeria',
    iban: 'NG14 GTBI 0000 0000 3314 2200',
    swift: 'GTBINGLA',
    currency: 'USD',
    verifiedBy: 'ZPF Compliance Team · Verification in progress',
    notes: 'Charitable donation beneficiary. Awaiting charity registration documents.',
    totalTransferred: 0,
    transferCount: 0,
  },
]


// ── Trustees ───────────────────────────────────────────────

export type TrusteeStatus = 'active' | 'suspended' | 'pending-kyc'
export type TrusteeAccessLevel = 'view-only' | 'transact' | 'full'

export interface Trustee {
  id: string                    // ZPF-7741-0038-T01 etc
  fullName: string
  initials: string
  relation: string
  nationality: string
  domicile: string
  dateOfBirth: string
  phoneNumber: string
  status: TrusteeStatus
  accessLevel: TrusteeAccessLevel
  kycStatus: 'Verified' | 'Pending' | 'Expired'
  kycVerifiedAt: string | null
  kycExpiresAt: string | null
  onboardedAt: string
  addedBy: string               // admin who added them
  notes: string | null
}

export const mockTrustees: Trustee[] = [
  {
    id: 'ZPF-7741-0038-T01',
    fullName: 'Kemi Adebayo-Suleiman',
    initials: 'KA',
    relation: 'Spouse',
    nationality: 'Nigerian',
    domicile: 'Lagos, Nigeria',
    dateOfBirth: '3 June 1978',
    phoneNumber: '+234 802 318 5540',
    status: 'active',
    accessLevel: 'full',
    kycStatus: 'Verified',
    kycVerifiedAt: '18 March 2022',
    kycExpiresAt: '18 March 2027',
    onboardedAt: '18 March 2022',
    addedBy: 'Dr. Markus von Steiner',
    notes: null,
  },
  {
    id: 'ZPF-7741-0038-T02',
    fullName: 'Tunde Adebayo',
    initials: 'TA',
    relation: 'Son',
    nationality: 'Nigerian',
    domicile: 'London, United Kingdom',
    dateOfBirth: '11 February 2001',
    phoneNumber: '+44 7700 194 382',
    status: 'active',
    accessLevel: 'view-only',
    kycStatus: 'Verified',
    kycVerifiedAt: '04 Jan 2024',
    kycExpiresAt: '04 Jan 2029',
    onboardedAt: '04 January 2024',
    addedBy: 'Dr. Markus von Steiner',
    notes: 'View-only access granted per client instruction. Portfolio visibility only — no transaction rights.',
  },
  {
    id: 'ZPF-7741-0038-T03',
    fullName: 'Chukwuemeka Osei',
    initials: 'CO',
    relation: 'Family Office Representative',
    nationality: 'Ghanaian',
    domicile: 'Accra, Ghana',
    dateOfBirth: '29 September 1969',
    phoneNumber: '+233 244 771 008',
    status: 'active',
    accessLevel: 'transact',
    kycStatus: 'Verified',
    kycVerifiedAt: '22 Sep 2023',
    kycExpiresAt: '22 Sep 2028',
    onboardedAt: '22 September 2023',
    addedBy: 'Dr. Markus von Steiner',
    notes: 'Authorised to initiate transfer requests on behalf of the primary account holder. RM co-authorisation still required for execution.',
  },
  {
    id: 'ZPF-7741-0038-T04',
    fullName: 'Adaeze Adebayo',
    initials: 'AA',
    relation: 'Daughter',
    nationality: 'Nigerian / British',
    domicile: 'London, United Kingdom',
    dateOfBirth: '07 August 2004',
    phoneNumber: '+44 7700 902 114',
    status: 'pending-kyc',
    accessLevel: 'view-only',
    kycStatus: 'Pending',
    kycVerifiedAt: null,
    kycExpiresAt: null,
    onboardedAt: '15 March 2026',
    addedBy: 'Dr. Markus von Steiner',
    notes: 'KYC documents submitted 15 March 2026. Awaiting compliance review. Access will be activated upon verification.',
  },
]

// ── Notifications ──────────────────────────────────────────

export type NotificationType =
  | 'NEW_MESSAGE'
  | 'TRANSFER_APPROVED'
  | 'TRANSFER_REJECTED'
  | 'TRANSFER_EXECUTED'
  | 'DOCUMENT_LODGED'
  | 'STATEMENT_READY'
  | 'SECURITY_ALERT'
  | 'KYC_EXPIRING'
  | 'BENEFICIARY_PROPOSED'

export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  body: string
  date: string
  dateISO: string
  read: boolean
  href: string        // deep link into the portal
}

export const mockNotifications: AppNotification[] = [
  {
    id: 'notif-001',
    type: 'NEW_MESSAGE',
    title: 'New message from Dr. von Steiner',
    body: 'Please confirm your availability for a call on 14 April at 14:00 CET.',
    date: '01 Apr 2026',
    dateISO: '2026-04-01',
    read: false,
    href: '/dashboard/messages',
  },
  {
    id: 'notif-002',
    type: 'NEW_MESSAGE',
    title: 'Compliance — Action Required',
    body: 'Annual Client Declaration must be submitted by 30 Apr 2026.',
    date: '28 Mar 2026',
    dateISO: '2026-03-28',
    read: false,
    href: '/dashboard/messages',
  },
  {
    id: 'notif-003',
    type: 'TRANSFER_REJECTED',
    title: 'Transfer Request Rejected',
    body: 'TFR-ZPF-2025-1102 to Horizon Ventures Ltd was rejected. Enhanced due diligence required.',
    date: '10 Dec 2025',
    dateISO: '2025-12-10',
    read: true,
    href: '/dashboard/transfers',
  },
  {
    id: 'notif-004',
    type: 'TRANSFER_APPROVED',
    title: 'Transfer Request Approved',
    body: 'TFR-ZPF-2025-0988 of CHF 45,000 to Kemi Adebayo-Suleiman has been approved.',
    date: '28 Nov 2025',
    dateISO: '2025-11-28',
    read: true,
    href: '/dashboard/transfers',
  },
  {
    id: 'notif-005',
    type: 'TRANSFER_EXECUTED',
    title: 'Transfer Executed',
    body: 'CHF 45,000 to Kemi Adebayo-Suleiman has been settled. Reference: TFR-ZPF-2025-0988.',
    date: '30 Nov 2025',
    dateISO: '2025-11-30',
    read: true,
    href: '/dashboard/transfers',
  },
  {
    id: 'notif-006',
    type: 'STATEMENT_READY',
    title: 'Q3 2025 Statement Available',
    body: 'Your quarterly portfolio statement for Q3 2025 is ready to download.',
    date: '01 Oct 2025',
    dateISO: '2025-10-01',
    read: true,
    href: '/dashboard/statements',
  },
  {
    id: 'notif-007',
    type: 'DOCUMENT_LODGED',
    title: 'Document Added to Vault',
    body: 'Power of Attorney has been lodged in your document vault.',
    date: '08 Jul 2024',
    dateISO: '2024-07-08',
    read: true,
    href: '/dashboard/vault',
  },
  {
    id: 'notif-008',
    type: 'SECURITY_ALERT',
    title: 'Unusual Login Attempt Blocked',
    body: 'A login attempt from Amsterdam (Netherlands) was blocked. If this was not you, contact your RM immediately.',
    date: '14 Feb 2025',
    dateISO: '2025-02-14',
    read: true,
    href: '/dashboard/security',
  },
]


// ── Session ────────────────────────────────────────────────
// Simulates the currently authenticated session.
// role: 'client'  → primary account holder is logged in
// role: 'trustee' → a trustee is logged in on behalf of the client
// In production this comes from the auth token / server session.

export type SessionRole = 'client' | 'trustee' | 'super_admin' | 'major_admin' | 'admin'

export interface MockSession {
  role: SessionRole
  userId: string           // trustee's own sub-ID, or the client ID if role === 'client'
  name: string             // the logged-in person's own full name
  initials: string
  linkedClientId: string   // always the primary client's ID (data scope)
  linkedClientName: string // primary client's display name (shown in trustee badge)
  trusteeId?: string       // set only when role === 'trustee'
  staffId?: string         // set when role is super_admin / major_admin / admin
  title?: string           // staff display title
}

// Toggle role to 'client' to preview the primary account holder's experience.
export const mockSession: MockSession = {
  role: 'trustee',
  userId: 'ZPF-7741-0038-T01',
  name: 'Kemi Adebayo-Suleiman',
  initials: 'KA',
  linkedClientId: 'ZPF-7741-0038',
  linkedClientName: 'Adebayo Suleiman',
  trusteeId: 'ZPF-7741-0038-T01',
}
