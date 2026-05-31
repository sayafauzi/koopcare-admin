// frontend/src/features/loans/LoanListPage.jsx
import React, { useState } from 'react';
import { useLoans } from './hooks/useLoans';
import LoanTable from './components/LoanTable';
import LoanReviewModal from './components/LoanReviewModal';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';

const statusOptions = [
  { value: 'PENDING', label: 'Menunggu' },
  { value: 'APPROVED', label: 'Disetujui' },
  { value: 'REJECTED', label: 'Ditolak' },
];

const LoanListPage = () => {
  const { loans, loading, error, pagination, statusFilter, setStatusFilter, loadLoans, handleApprove, handleReject } = useLoans();
  const [selectedLoanId, setSelectedLoanId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleReview = (loan) => {
    setSelectedLoanId(loan.id);
    setModalOpen(true);
  };

  if (loading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;
  if (error) return <div className="bg-red-50 text-error p-4 rounded">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary-700">Manajemen Pinjaman</h2>
        <div className="w-48">
          <Select label="Filter Status" options={statusOptions} value={statusFilter} onChange={e => setStatusFilter(e.target.value)} />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow">
        <LoanTable loans={loans} onReview={handleReview} />
      </div>
      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          <Button variant="outline" disabled={pagination.page === 1} onClick={() => loadLoans(pagination.page - 1)}>Previous</Button>
          <span className="py-2 px-4">Halaman {pagination.page} dari {pagination.totalPages}</span>
          <Button variant="outline" disabled={pagination.page === pagination.totalPages} onClick={() => loadLoans(pagination.page + 1)}>Next</Button>
        </div>
      )}
      <LoanReviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        loanId={selectedLoanId}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};
export default LoanListPage;