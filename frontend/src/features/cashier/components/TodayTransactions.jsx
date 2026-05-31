import React from 'react';
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  CreditCardIcon, 
  BanknotesIcon, 
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { formatCurrency, formatDateTime } from '../../../utils/formatters';

// Mapping ikon & warna
const typeIcons = {
  SETORAN_WAJIB: ArrowUpIcon,
  TARIK_TUNAI: ArrowDownIcon,
  BAYAR_ANGSURAN: CreditCardIcon,
  TOP_UP: BanknotesIcon,
  PENARIKAN_SALDO: ArrowDownIcon,
};

const typeStyles = {
  SETORAN_WAJIB: 'bg-green-100 text-green-700',
  TARIK_TUNAI: 'bg-red-100 text-red-700',
  BAYAR_ANGSURAN: 'bg-blue-100 text-blue-700',
  TOP_UP: 'bg-emerald-100 text-emerald-700',
  PENARIKAN_SALDO: 'bg-orange-100 text-orange-700',
};

// Jenis transaksi yang menambah saldo (kredit) dan mengurangi (debit)
const CREDIT_TYPES = ['SETORAN_WAJIB', 'TOP_UP'];
const DEBIT_TYPES = ['TARIK_TUNAI', 'BAYAR_ANGSURAN', 'PENARIKAN_SALDO'];

const TodayTransactions = ({ transactions, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-neutral-300 border-t-primary-600" />
      </div>
    );
  }

  // Hitung total bersih: (kredit - debit)
  const netTotal = transactions.reduce((sum, t) => {
    const amt = Number(t?.amount) || 0;
    if (CREDIT_TYPES.includes(t.type)) return sum + amt;
    if (DEBIT_TYPES.includes(t.type)) return sum - amt;
    return sum;
  }, 0);

  return (
    <div className="bg-white shadow-sm border border-neutral-200 overflow-hidden">
      <div className="divide-y divide-neutral-100 max-h-[480px] overflow-y-auto">
        {transactions.length === 0 ? (
          <div className="py-12 text-center">
            <BanknotesIcon className="h-10 w-10 mx-auto text-neutral-300 mb-3" />
            <p className="text-sm text-neutral-400">Belum ada transaksi</p>
            <p className="text-xs text-neutral-300 mt-1">Transaksi akan muncul di sini</p>
          </div>
        ) : (
          transactions.map((t) => {
            const Icon = typeIcons[t.type] || ArrowPathIcon;
            const style = typeStyles[t.type] || 'bg-neutral-100 text-neutral-700';
            const safeAmount = t?.amount ?? 0;
            return (
              <div key={t.id} className="px-4 py-3 hover:bg-neutral-50 transition-colors duration-150">
                <div className="flex items-start gap-3">
                  <div className={`p-1.5 rounded-full ${style} flex-shrink-0`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-sm font-medium text-neutral-800 truncate">
                        {t.member_name || 'Tidak diketahui'}
                      </p>
                      <p className={`text-sm font-semibold flex-shrink-0 ${DEBIT_TYPES.includes(t.type) ? 'text-red-600' : 'text-green-600'}`}>
                        {DEBIT_TYPES.includes(t.type) ? '-' : '+'}{formatCurrency(safeAmount)}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-0.5">
                      <span className="text-xs text-neutral-400">
                        {formatDateTime(t.created_at)}
                      </span>
                      <span className="text-xs text-neutral-300">•</span>
                      <span className="text-xs text-neutral-500 capitalize">
                        {t.type?.toLowerCase().replace(/_/g, ' ') || '-'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer total bersih */}
      {transactions.length > 0 && (
        <div className="px-5 py-3 bg-neutral-50 border-t border-neutral-200">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-neutral-600">Total Bersih</span>
            <span className={`text-lg font-bold ${netTotal >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              {formatCurrency(Math.abs(netTotal))} {netTotal >= 0 ? '(masuk)' : '(keluar)'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodayTransactions;