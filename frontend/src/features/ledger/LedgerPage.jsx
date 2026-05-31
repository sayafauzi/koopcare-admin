// frontend/src/features/ledger/LedgerPage.jsx
import React from 'react';
import { useLedger } from './hooks/useLedger';
import FilterBar from './components/FilterBar';
import LedgerTable from './components/LedgerTable';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';
import { formatCurrency } from '../../utils/formatters';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

const LedgerPage = () => {
  const { transactions, summary, loading, error, pagination, filters, applyFilters, exportCSV, loadLedger } = useLedger();

  if (loading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;
  if (error) return <div className="bg-red-50 text-red-700 p-4 rounded-xl text-center">{error}</div>;

  return (
    <div className="space-y-6">
      {/* Header sederhana dengan badge jumlah transaksi */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-primary-700">Buku Besar</h1>
        <span className="text-xs text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full">
          {transactions.length} transaksi
        </span>
      </div>

      {/* Ringkasan Pemasukan & Pengeluaran — seimbang dan rapi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Kartu Pemasukan */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-5 flex items-center gap-4 transition hover:shadow-md">
          <div className="p-3 bg-green-100 rounded-full">
            <ArrowUpIcon className="h-6 w-6 text-green-700" />
          </div>
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-wide">Pemasukan</p>
            <p className="text-2xl font-bold text-green-700">{formatCurrency(summary.inflow)}</p>
          </div>
        </div>
        {/* Kartu Pengeluaran */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-5 flex items-center gap-4 transition hover:shadow-md">
          <div className="p-3 bg-red-100 rounded-full">
            <ArrowDownIcon className="h-6 w-6 text-red-700" />
          </div>
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-wide">Pengeluaran</p>
            <p className="text-2xl font-bold text-red-700">{formatCurrency(summary.outflow)}</p>
          </div>
        </div>
      </div>

      {/* FilterBar — sudah memiliki tombol dengan ikon dan layout sejajar */}
      <FilterBar filters={filters} onApply={applyFilters} onExport={exportCSV} />

      {/* Tabel transaksi dengan border dan shadow konsisten */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <LedgerTable transactions={transactions} />
      </div>

      {/* Pagination dengan tombol lebar tetap dan teks seimbang */}
      {pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-2">
          <Button
            variant="outline"
            size="md"
            disabled={pagination.page === 1}
            onClick={() => loadLedger(pagination.page - 1)}
            className="w-32 justify-center"
          >
            ← Sebelumnya
          </Button>
          <span className="text-sm text-neutral-600 font-medium px-3 py-1 bg-neutral-50 rounded-full">
            Halaman {pagination.page} dari {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="md"
            disabled={pagination.page === pagination.totalPages}
            onClick={() => loadLedger(pagination.page + 1)}
            className="w-32 justify-center"
          >
            Berikutnya →
          </Button>
        </div>
      )}
    </div>
  );
};

export default LedgerPage;