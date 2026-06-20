import React from 'react';
import Table from '../../../components/ui/Table';
import Button from '../../../components/ui/Button';
import { formatCurrency, formatDate } from '../../../utils/formatters';

const LoanTable = ({ loans, onReview }) => {
  const columns = [
    { header: 'ID Permintaan', accessor: 'request_number' },
    { header: 'Nama Anggota', accessor: 'member_name' },
    { header: 'Jenis', accessor: 'type' },
    { header: 'Jumlah', accessor: (row) => formatCurrency(row.amount) },
    { header: 'Tenor', accessor: (row) => `${row.tenor} bulan` },
    { header: 'Skor AI', accessor: (row) => `${row.ai_score}%` },
    { header: 'Status', accessor: (row) => {
      const statusMap = {
        PENDING: 'Menunggu',
        APPROVED: 'Disetujui',
        ACTIVE: 'Aktif',
        PAID_OFF: 'Lunas',
        DEFAULTED: 'Gagal Bayar',
        REJECTED: 'Ditolak',
      };
      const classMap = {
        PENDING: 'bg-yellow-100 text-yellow-800',
        APPROVED: 'bg-green-100 text-green-800',
        ACTIVE: 'bg-blue-100 text-blue-800',
        PAID_OFF: 'bg-teal-100 text-teal-800',
        DEFAULTED: 'bg-neutral-100 text-neutral-800',
        REJECTED: 'bg-red-100 text-red-800',
      };
      return <span className={`px-2 py-1 rounded-full text-xs font-medium ${classMap[row.status] || 'bg-neutral-100 text-neutral-800'}`}>{statusMap[row.status] || row.status}</span>;
    }},
    { header: 'Aksi', accessor: (row) => (
      <Button size="sm" variant="outline" onClick={() => onReview(row)}>Tinjau</Button>
    ) },
  ];
  return <Table columns={columns} data={loans} />;
};
export default LoanTable;