// frontend/src/features/ledger/components/LedgerTable.jsx
import React from 'react';
import Table from '../../../components/ui/Table';
import { formatCurrency, formatDateTime } from '../../../utils/formatters';

const LedgerTable = ({ transactions }) => {
  const columns = [
    {
      header: 'Tanggal',
      accessor: (row) => formatDateTime(row.created_at),
      align: 'text-left',
    },
    {
      header: 'Ref ID',
      accessor: (row) => row.reference_id || '-',
      align: 'text-left',
    },
    {
      header: 'Deskripsi',
      accessor: (row) => row.description || '-',
      align: 'text-left',
      truncate: true, // memotong teks panjang dengan ellipsis
    },
    {
      header: 'Debit (IN)',
      accessor: (row) => {
        const isDebit = (row.type === 'SETORAN_WAJIB' || row.type === 'TOP_UP');
        return isDebit ? formatCurrency(row.amount) : '-';
      },
      align: 'text-right',
    },
    {
      header: 'Kredit (OUT)',
      accessor: (row) => {
        const isCredit = (row.type === 'TARIK_TUNAI' || row.type === 'BAYAR_ANGSURAN' || row.type === 'PENARIKAN_SALDO');
        return isCredit ? formatCurrency(row.amount) : '-';
      },
      align: 'text-right',
    },
    {
      header: 'Anggota',
      accessor: 'member_name',
      align: 'text-left',
    },
  ];

  return (
    <div className="overflow-x-auto">
      <Table columns={columns} data={transactions} />
    </div>
  );
};

export default LedgerTable;