// frontend/src/components/ui/Table.jsx
import React from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

const Table = ({ columns, data, className = '', onRowClick, isLoading = false }) => {
  // Ambil nilai dari row berdasarkan accessor (function atau string)
  const getValue = (row, accessor) => {
    if (typeof accessor === 'function') return accessor(row);
    return row[accessor] ?? '-';
  };

  // Tentukan alignment teks berdasarkan properti kolom atau tipe
  const getAlignment = (col) => {
    if (col.align) return col.align;
    if (col.type === 'number') return 'text-right';
    if (col.type === 'action') return 'text-center';
    return 'text-left';
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
        <table className="min-w-full divide-y divide-neutral-200">
          {/* Header */}
          <thead className="bg-neutral-50">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 ${getAlignment(col)}`}
                  style={{ width: col.width }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-neutral-100">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center">
                  <div className="flex justify-center items-center gap-2 text-neutral-400">
                    <div className="h-5 w-5 border-2 border-neutral-300 border-t-primary-600 rounded-full animate-spin" />
                    <span className="text-sm">Memuat data...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-neutral-400">
                    <InformationCircleIcon className="h-8 w-8" />
                    <span className="text-sm">Tidak ada data</span>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className={`transition-colors ${
                    onRowClick ? 'cursor-pointer hover:bg-neutral-50' : 'hover:bg-neutral-50/50'
                  }`}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      className={`px-4 py-2.5 text-xs text-neutral-700 ${getAlignment(col)} ${
                        col.truncate ? 'truncate max-w-[200px]' : ''
                      }`}
                      title={
                        col.truncate && typeof getValue(row, col.accessor) === 'string'
                          ? getValue(row, col.accessor)
                          : undefined
                      }
                    >
                      {getValue(row, col.accessor)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;