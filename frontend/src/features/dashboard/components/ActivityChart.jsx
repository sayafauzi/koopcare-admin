import React from 'react';
import { formatCurrency } from '../../../utils/formatters';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const ActivityChart = ({ labels = [], inflows = [], outflows = [], period, onPeriodChange }) => {
  const hasData = labels.length > 0 && (inflows.some(v => v > 0) || outflows.some(v => v > 0));
  const totalInflow = inflows.reduce((a, b) => a + b, 0);
  const totalTransactions = inflows.filter(v => v > 0).length + outflows.filter(v => v > 0).length;

  const formatCompact = (val) => {
    if (val === 0) return '0';
    if (val >= 1_000_000) return (val / 1_000_000).toFixed(1).replace('.0', '') + 'M';
    if (val >= 1_000) return Math.round(val / 1000) + 'k';
    return val.toString();
  };

  const maxValue = hasData ? Math.max(...inflows, ...outflows, 100) : 100;
  const chartHeight = 220;
  const yTicks = [maxValue, maxValue * 0.66, maxValue * 0.33, 0];

  const periodOptions = [
    { value: 'week', label: 'Minggu ini' },
    { value: 'month', label: 'Bulan ini' },
    { value: 'year', label: 'Tahun ini' }
  ];

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border border-neutral-200 shadow-sm w-full">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl font-bold text-gray-900">Aktivitas Pengguna</h2>
        <div className="relative">
          <select
            value={period}
            onChange={(e) => onPeriodChange(e.target.value)}
            className="appearance-none bg-transparent pr-6 pl-2 py-1 text-sm font-medium text-gray-900 outline-none cursor-pointer"
          >
            {periodOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDownIcon className="w-4 h-4 text-gray-600 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <div className="mb-10">
        <div className="text-[2.75rem] font-light text-primary-700 leading-none mb-3">
          {formatCurrency(totalInflow)}
        </div>
        <div className="text-xl text-gray-900">{totalTransactions} Transaksi</div>
      </div>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center h-[220px] text-neutral-400 border-t border-neutral-100">
          <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-sm font-medium">Belum ada aktivitas</p>
          <p className="text-xs mt-1">Transaksi akan muncul di sini</p>
        </div>
      ) : (
        <div className="relative overflow-visible">
          <div className="flex">
            {/* Sumbu Y */}
            <div className="flex flex-col justify-between text-sm text-gray-600 pr-4 h-[220px]">
              {yTicks.map((tick, i) => (
                <span key={i} className="text-right w-8">{formatCompact(tick)}</span>
              ))}
            </div>
            {/* Area grafik */}
            <div className="relative flex-1 h-[220px] flex items-end overflow-visible">
              {/* Garis horizontal bantu */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {yTicks.map((_, idx) => <div key={idx} className="border-t border-gray-200/60 w-full"></div>)}
              </div>
              {/* Garis vertikal bantu */}
              <div className="absolute inset-0 flex justify-around pointer-events-none px-4">
                {labels.map((_, idx) => <div key={idx} className="border-l border-gray-200/60 h-full"></div>)}
              </div>
              {/* Batang data */}
              <div className="relative w-full h-full flex justify-around items-end px-4 z-10">
                {labels.map((label, idx) => {
                  const inflowHeight = (inflows[idx] / maxValue) * chartHeight;
                  const outflowHeight = (outflows[idx] / maxValue) * chartHeight;
                  return (
                    <div key={idx} className="flex-1 flex justify-center gap-1.5 group relative h-full items-end">
                      {/* Batang pemasukan */}
                      <div className="relative flex flex-col items-center">
                        <div
                          className="w-3 md:w-4 rounded-t-sm bg-green-600 opacity-90 hover:opacity-100 transition-all"
                          style={{ height: `${inflowHeight}px` }}
                        />
                        {inflows[idx] > 0 && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-20 shadow-lg">
                            +{formatCurrency(inflows[idx])}
                          </div>
                        )}
                      </div>
                      {/* Batang pengeluaran */}
                      <div className="relative flex flex-col items-center">
                        <div
                          className="w-3 md:w-4 rounded-t-sm bg-red-500 opacity-90 hover:opacity-100 transition-all"
                          style={{ height: `${outflowHeight}px` }}
                        />
                        {outflows[idx] > 0 && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-20 shadow-lg">
                            -{formatCurrency(outflows[idx])}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {/* Sumbu X (label) */}
          <div className="flex pl-[3.5rem] pr-4 mt-4">
            {labels.map((label, idx) => (
              <div key={idx} className="flex-1 text-center text-sm text-gray-900">{label}</div>
            ))}
          </div>
        </div>
      )}

      {/* Legenda */}
      <div className="flex items-center gap-6 mt-10">
        <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-full bg-green-600"></span><span className="text-base font-medium">Pemasukan</span></div>
        <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-full bg-red-500"></span><span className="text-base font-medium">Pengeluaran</span></div>
      </div>
    </div>
  );
};

export default ActivityChart;