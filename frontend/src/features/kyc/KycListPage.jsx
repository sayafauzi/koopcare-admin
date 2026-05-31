// frontend/src/features/kyc/KycListPage.jsx
import React, { useState } from 'react';
import { useKyc } from './hooks/useKyc';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Spinner from '../../components/ui/Spinner';
import KycDetailModal from './components/KycDetailModal';

const statusOptions = [
  { value: 'PENDING', label: 'Menunggu Persetujuan' },
  { value: 'APPROVED', label: 'Disetujui' },
  { value: 'REJECTED', label: 'Ditolak' },
];

const KycListPage = () => {
  const {
    submissions,
    loading,
    error,
    pagination,
    statusFilter,
    setStatusFilter,
    loadKyc,
  } = useKyc();

  const [selectedId, setSelectedId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const columns = [
    { header: 'Nama Lengkap', accessor: 'full_name' },
    { header: 'NIK', accessor: 'nik' },
    {
      header: 'Tanggal Daftar',
      accessor: (row) => new Date(row.registration_date).toLocaleDateString('id-ID'),
    },
    {
      header: 'Status',
      accessor: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
          row.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {row.status === 'APPROVED' ? 'Disetujui' : row.status === 'REJECTED' ? 'Ditolak' : 'Menunggu'}
        </span>
      ),
    },
    {
      header: 'Aksi',
      accessor: (row) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setSelectedId(row.id);
            setModalOpen(true);
          }}
        >
          Tinjau
        </Button>
      ),
    },
  ];

  if (loading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;
  if (error) return <div className="bg-red-50 text-error p-4 rounded">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary-700">Verifikasi KYC</h2>
        <div className="w-56">
          <Select
            label="Filter Status"
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table columns={columns} data={submissions} />
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 space-x-2">
          <Button
            variant="outline"
            disabled={pagination.page === 1}
            onClick={() => loadKyc(pagination.page - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-neutral-600">
            Halaman {pagination.page} dari {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            disabled={pagination.page === pagination.totalPages}
            onClick={() => loadKyc(pagination.page + 1)}
          >
            Next
          </Button>
        </div>
      )}

      <KycDetailModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedId(null);
        }}
        submissionId={selectedId}
        onRefresh={() => loadKyc(pagination.page)}
      />
    </div>
  );
};

export default KycListPage;