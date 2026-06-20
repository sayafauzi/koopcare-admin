// frontend/src/features/loans/components/LoanReviewModal.jsx
import React, { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Spinner from '../../../components/ui/Spinner';
import { fetchLoanDetail } from '../../../services/loanService';
import { formatCurrency, formatPhoneToWaLink } from '../../../utils/formatters';
import { UserIcon, BriefcaseIcon, CalendarIcon, CurrencyDollarIcon, CheckCircleIcon, XCircleIcon, ChatBubbleLeftRightIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

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
            <div className="flex items-start gap-2">
              <UserIcon className="h-4 w-4 text-neutral-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-xs text-neutral-500 uppercase tracking-wide">Anggota</div>
                <div className="font-medium text-neutral-800 break-words flex items-center gap-2">
                  {loan.member_name}
                  <a
                    href={`https://wa.me/${formatPhoneToWaLink(loan.phone)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-800"
                    title="Chat via WhatsApp"
                  >
                    <ChatBubbleLeftRightIcon className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
            <InfoItem icon={BriefcaseIcon} label="Pekerjaan" value={loan.occupation || '-'} />
            <InfoItem icon={CalendarIcon} label="Lama Anggota" value={loan.tenure_months ? `${loan.tenure_months} bulan` : '-'} />
            <InfoItem icon={CurrencyDollarIcon} label="Jumlah Pinjaman" value={formatCurrency(loan.amount)} />
          </div>

          {/* Rekomendasi AI */}
          {loan.ai_recommendation && (
              <div className={`p-3 rounded-lg border ${
                  loan.ai_recommendation === 'LAYAK' 
                      ? 'bg-green-50 border-green-200 text-green-800' 
                      : loan.ai_recommendation === 'PERLU_DIPERTIMBANGKAN'
                          ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                          : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                  <div className="flex items-center gap-2">
                      {loan.ai_recommendation === 'LAYAK' ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      ) : loan.ai_recommendation === 'PERLU_DIPERTIMBANGKAN' ? (
                          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
                      ) : (
                          <XCircleIcon className="h-5 w-5 text-red-600" />
                      )}
                      <span className="font-semibold">Rekomendasi AI: {loan.ai_recommendation.replace(/_/g, ' ')}</span>
                      {loan.prob_default !== undefined && loan.prob_default !== null && (
                          <span className="text-xs opacity-80">
                              (Probabilitas gagal bayar: {(loan.prob_default * 100).toFixed(1)}%)
                          </span>
                      )}
                  </div>
                  {loan.max_approved_amount !== undefined && loan.max_approved_amount !== null && (
                      <div className="text-xs font-semibold mt-1">
                          Limit Maksimum Rekomendasi AI: {formatCurrency(loan.max_approved_amount)}
                      </div>
                  )}
                  <p className="text-xs opacity-75 mt-1">*Keputusan akhir tetap di tangan admin.</p>
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
            <div className={`p-3 rounded-lg text-center text-sm font-medium ${['APPROVED', 'ACTIVE', 'PAID_OFF', 'DEFAULTED'].includes(loan.status) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {['APPROVED', 'ACTIVE', 'PAID_OFF', 'DEFAULTED'].includes(loan.status) ? (
                <>
                  ✓ Disetujui
                  {loan.status === 'ACTIVE' && <span className="ml-1.5 text-xs opacity-90">(Aktif)</span>}
                  {loan.status === 'PAID_OFF' && <span className="ml-1.5 text-xs opacity-90">(Lunas)</span>}
                  {loan.status === 'DEFAULTED' && <span className="ml-1.5 text-xs opacity-90">(Gagal Bayar)</span>}
                </>
              ) : (
                <>✗ Ditolak</>
              )}
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