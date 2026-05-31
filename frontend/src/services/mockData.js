// frontend/src/services/mockData.js

export const mockDashboardStats = {
  totalAssets: 4200000000, // Rp 4.2M
  activeLoans: 1500000000, // Rp 1.5M
  activeMembers: 318,
  delinquentMembers: 7,
  monthlyGrowth: 18.02,
  newMembersThisMonth: 12,
  totalSavings: 27500000, // Rp 27.5Jt
};

export const mockRecentLoans = [
  { id: '#021', memberName: 'Ahmad Fauzi', date: '2025-02-20', amount: 1000000, status: 'Rejected' },
  { id: '#022', memberName: 'Siti Nurhaliza', date: '2025-02-19', amount: 5000000, status: 'Pending' },
  { id: '#023', memberName: 'Budi Santoso', date: '2025-02-18', amount: 7500000, status: 'Approved' },
];

export const mockInviteCode = {
  code: 'KOD-A61wjjoSj',
  invited: 45,
  joined: 32,
  conversionRate: 71,
  validUntil: '2025-03-30',
};

export const mockMembers = [
  { id: 1, name: 'Ahmad Fauzi', nik: '3201234567890123', phone: '+628123456789', status: 'ACTIVE' },
  { id: 2, name: 'Siti Nurhaliza', nik: '3209876543210987', phone: '+628123456780', status: 'ACTIVE' },
  { id: 3, name: 'Budi Santoso', nik: '3205555555555555', phone: '+628123456781', status: 'INACTIVE' },
];

export const mockKycList = [
  { id: 1, fullName: 'Siti Nurhaliza binti Abdullah', nik: '3201234567890123', phone: '+6281234567890', registrationDate: '2024-12-15T07:32:00Z', status: 'PENDING', documents: { ktp: 'ktp_url', selfie: 'selfie_url' } },
  { id: 2, fullName: 'Ahmad Fauzi', nik: '3209876543210987', phone: '+628123456788', status: 'APPROVED' },
];

export const mockLoans = [
  { id: 'AKD-101', memberName: 'Budi Santoso', occupation: 'Pedagang', type: 'Murabahah', amount: 5000000, tenor: '20 Hari', aiScore: 87, status: 'PENDING' },
  { id: 'AKD-102', memberName: 'Siti Aminah', occupation: 'Guru Honorer', type: 'Qardhul Hasan', amount: 2000000, tenor: '01 M', aiScore: 65, status: 'PENDING' },
  { id: 'AKD-103', memberName: 'Ahmad Fauzi', occupation: 'Wiraswasta', type: 'Murabahah', amount: 7500000, tenor: '01 Y', aiScore: 92, status: 'PENDING' },
];

export const mockLedgerTransactions = [
  { date: '2026-03-14', refId: '#TRX-091', description: 'Simpanan Pokok - Ahmad Fauzi', debit: 500000, credit: 0, runningBalance: 80000000 },
  { date: '2026-03-14', refId: '#TRX-090', description: 'Pembayaran Margin Murabahah #MRB-045', debit: 0, credit: 750000, runningBalance: 79250000 },
  // tambahkan sesuai wireframe
];