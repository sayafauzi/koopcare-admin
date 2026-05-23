// frontend/src/features/loans/components/LoanReviewModal.jsx
import React, { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Spinner from '../../../components/ui/Spinner';
import { fetchLoanDetail } from '../../../services/loanService';
import { formatCurrency } from '../../../utils/formatters';
import { UserIcon, BriefcaseIcon, CalendarIcon, CurrencyDollarIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const LoanReviewModal = ({ isOpen, onClose, loanId, onApprove, onReject }) => {
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [approvedAmount, setApprovedAmount] = useState('');
  const [approvedTenor, setApprovedTenor] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  useEffect(() => {
    if (isOpen && loanId) {
      setLoading(true);
      fetchLoanDetail(loanId)
        .then(res => {
          setLoan(res.data);
          setApprovedAmount(res.data.amount);
          setApprovedTenor(res.data.tenor);
        })
        .catch(err => alert(err.response?.data?.error || 'Gagal ambil detail'))
        .finally(() => setLoading(false));
    }
  }, [isOpen, loanId]);

  const handleApprove = async () => {
    if (!approvedAmount || approvedAmount <= 0) return alert('Jumlah harus diisi');
    if (!approvedTenor || approvedTenor <= 0) return alert('Tenor harus diisi');
    setActionLoading(true);
    const success = await onApprove(loanId, approvedAmount, approvedTenor);
    if (success) onClose();
    setActionLoading(false);
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) return alert('Alasan penolakan harus diisi');
    setActionLoading(true);
    const success = await onReject(loanId, rejectReason);
    if (success) onClose();
    setActionLoading(false);
  };

  if (!isOpen) return null;

  const isEligible = loan?.ai_score >= 80;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tinjau Pinjaman" showConfirm={false} size="lg">
      {loading ? (
        <div className="flex justify-center py-8"><Spinner size="lg" /></div>
      ) : loan ? (
        <div className="space-y-6">
          {/* Informasi Anggota */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <InfoItem icon={UserIcon} label="Anggota" value={loan.member_name} />
            <InfoItem icon={BriefcaseIcon} label="Pekerjaan" value={loan.occupation || '-'} />
            <InfoItem icon={CalendarIcon} label="Lama Anggota" value={loan.tenure_months ? `${loan.tenure_months} bulan` : '-'} />
            <InfoItem icon={CurrencyDollarIcon} label="Jumlah Pinjaman" value={formatCurrency(loan.amount)} />
          </div>

          {/* AI Scoring */}
          {/* <div className={`p-3 rounded-lg border ${isEligible ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center gap-2">
              {isEligible ? <CheckCircleIcon className="h-5 w-5 text-green-600" /> : <XCircleIcon className="h-5 w-5 text-red-600" />}
              <span className={`font-semibold ${isEligible ? 'text-green-700' : 'text-red-700'}`}>
                {isEligible ? 'LAYAK' : 'TIDAK LAYAK'}
              </span>
              <span className="text-xs text-neutral-500">(Skor: {loan.ai_score}%)</span>
            </div>
            <p className="text-sm text-neutral-600 mt-1">Maksimal disetujui: <span className="font-medium">{formatCurrency(loan.max_approved_amount || loan.amount * 0.8)}</span></p>
          </div> */}

          {/* Rekomendasi AI */}
          {loan.ai_recommendation && (
              <div className={`p-3 rounded-lg border ${loan.ai_recommendation === 'LAYAK' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center gap-2">
                      {loan.ai_recommendation === 'LAYAK' ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      ) : (
                          <XCircleIcon className="h-5 w-5 text-red-600" />
                      )}
                      <span className="font-semibold">Rekomendasi AI: {loan.ai_recommendation}</span>
                      {loan.prob_default && (
                          <span className="text-xs text-neutral-500">
                              (Probabilitas gagal bayar: {(loan.prob_default * 100).toFixed(1)}%)
                          </span>
                      )}
                  </div>
                  <p className="text-xs text-neutral-600 mt-1">*Keputusan akhir tetap di tangan admin.</p>
              </div>
          )}

          {/* Aksi */}
          {loan.status === 'PENDING' ? (
            <div className="border-t pt-4">
              {!showRejectForm ? (
                <div className="flex flex-col space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      type="number"
                      label="Jumlah Disetujui"
                      value={approvedAmount}
                      onChange={(e) => setApprovedAmount(e.target.value)}
                      placeholder="Rp"
                    />
                    <Input
                      type="number"
                      label="Tenor (bulan)"
                      value={approvedTenor}
                      onChange={(e) => setApprovedTenor(e.target.value)}
                      placeholder="Bulan"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                    <Button
                      variant="danger"
                      onClick={() => setShowRejectForm(true)}
                      disabled={actionLoading}
                      icon={XCircleIcon}
                    >
                      Tolak
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleApprove}
                      loading={actionLoading}
                      icon={CheckCircleIcon}
                    >
                      Setujui
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Input
                    label="Alasan Penolakan"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Contoh: pendapatan tidak mencukupi"
                    autoFocus
                  />
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setShowRejectForm(false)}>Batal</Button>
                    <Button variant="danger" onClick={handleRejectSubmit} loading={actionLoading}>
                      Konfirmasi Tolak
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className={`p-3 rounded-lg text-center text-sm font-medium ${loan.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {loan.status === 'APPROVED' ? '✓ Disetujui' : '✗ Ditolak'}
              {loan.rejection_reason && <div className="text-xs mt-1 font-normal">Alasan: {loan.rejection_reason}</div>}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-error py-8">Data tidak ditemukan</div>
      )}
    </Modal>
  );
};

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-2">
    <Icon className="h-4 w-4 text-neutral-400 mt-0.5 flex-shrink-0" />
    <div>
      <div className="text-xs text-neutral-500 uppercase tracking-wide">{label}</div>
      <div className="font-medium text-neutral-800 break-words">{value || '-'}</div>
    </div>
  </div>
);

export default LoanReviewModal;