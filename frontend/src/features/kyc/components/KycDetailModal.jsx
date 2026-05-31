// frontend/src/features/kyc/components/KycDetailModal.jsx
import React, { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/ui/Spinner';
import Input from '../../../components/ui/Input';
import { fetchKycDetail, approveKyc, rejectKyc } from '../../../services/kycService';
import {
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
  IdentificationIcon,
  PhoneIcon,
  CalendarIcon,
  PhotoIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const KycDetailModal = ({ isOpen, onClose, submissionId, onRefresh }) => {
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectNotes, setRejectNotes] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (isOpen && submissionId) {
      setLoading(true);
      fetchKycDetail(submissionId)
        .then((res) => setSubmission(res.data))
        .catch((err) => alert(err.response?.data?.error || 'Gagal mengambil detail'))
        .finally(() => setLoading(false));
    }
  }, [isOpen, submissionId]);

  const handleApprove = async () => {
    if (!window.confirm('Setujui pengajuan KYC? Anggota akan diaktifkan.')) return;
    setActionLoading(true);
    try {
      await approveKyc(submissionId);
      alert('KYC disetujui');
      onRefresh?.();
      onClose();
    } catch (err) {
      alert(err.response?.data?.error || 'Approve gagal');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectNotes.trim()) {
      alert('Harap isi alasan penolakan');
      return;
    }
    setActionLoading(true);
    try {
      await rejectKyc(submissionId, rejectNotes);
      alert('KYC ditolak');
      onRefresh?.();
      onClose();
    } catch (err) {
      alert(err.response?.data?.error || 'Reject gagal');
    } finally {
      setActionLoading(false);
    }
  };

  // Preview gambar modal
  const ImagePreviewModal = () =>
    previewImage && (
      <div
        className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4"
        onClick={() => setPreviewImage(null)}
      >
        <div className="relative max-w-3xl max-h-full">
          <img
            src={previewImage}
            alt="Preview"
            className="max-w-full max-h-full rounded-lg shadow-2xl"
          />
          <button
            className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-70 transition"
            onClick={() => setPreviewImage(null)}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    );

  if (!isOpen) return null;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={
          <div className="flex items-center justify-between w-full">
            <span className="flex items-center gap-2">
              <ShieldCheckIcon className="h-5 w-5 text-primary-700" />
              Verifikasi KYC
            </span>
            {submission && (
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  submission.status === 'APPROVED'
                    ? 'bg-green-100 text-green-700'
                    : submission.status === 'REJECTED'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {submission.status === 'APPROVED'
                  ? 'Disetujui'
                  : submission.status === 'REJECTED'
                  ? 'Ditolak'
                  : 'Menunggu'}
              </span>
            )}
          </div>
        }
        showConfirm={false}
        size="lg"
      >
        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : submission ? (
          <div className="space-y-6">
            {/* Informasi Ringkas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <InfoItem icon={UserIcon} label="Nama" value={submission.full_name} />
              <InfoItem icon={IdentificationIcon} label="NIK" value={submission.nik} />
              <InfoItem icon={PhoneIcon} label="WhatsApp" value={submission.phone} />
              <InfoItem
                icon={CalendarIcon}
                label="Daftar"
                value={new Date(submission.registration_date).toLocaleDateString('id-ID')}
              />
            </div>

            {/* Dokumen Foto */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-700 mb-2 flex items-center gap-1">
                <PhotoIcon className="h-4 w-4" /> Dokumen
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PhotoCard
                  label="e-KTP"
                  url={submission.ktp_photo_url}
                  onPreview={setPreviewImage}
                />
                <PhotoCard
                  label="Selfie dengan KTP"
                  url={submission.selfie_photo_url}
                  onPreview={setPreviewImage}
                />
              </div>
            </div>

            {/* Checklist – pendek dengan ikon */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <div className="flex items-center gap-2 text-green-800 font-semibold text-sm mb-2">
                <CheckCircleIcon className="h-4 w-4" /> Verifikasi Manual
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-green-700">
                <li className="flex items-center gap-1">✓ NIK sesuai foto</li>
                <li className="flex items-center gap-1">✓ Nama cocok</li>
                <li className="flex items-center gap-1">✓ Wajah sama dengan KTP</li>
                <li className="flex items-center gap-1">✓ Dokumen jelas</li>
              </ul>
            </div>

            {/* Aksi */}
            {submission.status === 'PENDING' && (
              <div className="flex justify-end pt-2">
                {!showRejectForm ? (
                  <div className="flex gap-3">
                    <Button
                      variant="danger"
                      onClick={() => setShowRejectForm(true)}
                      disabled={actionLoading}
                    >
                      <XCircleIcon className="h-4 w-4 mr-1" /> Tolak
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleApprove}
                      loading={actionLoading}
                    >
                      <CheckCircleIcon className="h-4 w-4 mr-1" /> Setujui
                    </Button>
                  </div>
                ) : (
                  <div className="w-full space-y-3">
                    <Input
                      label="Alasan Penolakan"
                      value={rejectNotes}
                      onChange={(e) => setRejectNotes(e.target.value)}
                      placeholder="Foto blur, nama tidak sesuai, dll."
                      autoFocus
                    />
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setShowRejectForm(false)}>
                        Batal
                      </Button>
                      <Button variant="danger" onClick={handleReject} loading={actionLoading}>
                        Konfirmasi Tolak
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Status akhir jika sudah diputuskan */}
            {submission.status !== 'PENDING' && (
              <div
                className={`p-3 rounded-lg text-center text-sm font-medium ${
                  submission.status === 'APPROVED'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {submission.status === 'APPROVED' ? (
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircleIcon className="h-5 w-5" /> Disetujui
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <XCircleIcon className="h-5 w-5" /> Ditolak
                  </div>
                )}
                {submission.notes && (
                  <div className="text-xs mt-1 font-normal">Catatan: {submission.notes}</div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-error py-8">Data tidak ditemukan</div>
        )}
      </Modal>
      <ImagePreviewModal />
    </>
  );
};

// Komponen untuk baris informasi dengan ikon
const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-2">
    <Icon className="h-4 w-4 text-neutral-400 mt-0.5 flex-shrink-0" />
    <div className="flex-1">
      <div className="text-xs text-neutral-500 uppercase tracking-wide">{label}</div>
      <div className="font-medium text-neutral-800 break-words">{value || '-'}</div>
    </div>
  </div>
);

// Komponen kartu foto dengan preview
const PhotoCard = ({ label, url, onPreview }) => (
  <div className="border rounded-lg overflow-hidden bg-neutral-50 shadow-sm">
    <div className="text-xs font-medium bg-neutral-100 px-3 py-1.5 text-neutral-600">
      {label}
    </div>
    {url ? (
      <img
        src={url}
        alt={label}
        className="w-full h-36 object-cover cursor-pointer hover:opacity-90 transition"
        onClick={() => onPreview(url)}
      />
    ) : (
      <div className="h-36 flex items-center justify-center text-neutral-400 text-sm">
        Tidak ada foto
      </div>
    )}
  </div>
);

export default KycDetailModal;