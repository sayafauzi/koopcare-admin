import React, { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { forgotPin, resetPin } from '../../../services/authService';

const ForgotPinModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState('request'); // 'request', 'reset'
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!identifier) return setError('Nomor WhatsApp/Email wajib diisi');
    setLoading(true);
    setError('');
    try {
      await forgotPin(identifier);
      setSuccessMsg('Kode OTP telah dikirim. Cek console backend untuk melihat OTP (simulasi).');
      setStep('reset');
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal mengirim OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPin = async (e) => {
    e.preventDefault();
    if (!otp || !newPin || !confirmPin) return setError('Semua field harus diisi');
    if (newPin !== confirmPin) return setError('PIN baru tidak cocok');
    if (!/^\d{6}$/.test(newPin)) return setError('PIN harus 6 digit angka');
    setLoading(true);
    setError('');
    try {
      await resetPin(identifier, otp, newPin);
      alert('PIN berhasil direset. Silakan login dengan PIN baru.');
      onClose();
      setStep('request');
      setIdentifier('');
      setOtp('');
      setNewPin('');
      setConfirmPin('');
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal reset PIN');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lupa PIN" showConfirm={false}>
      {step === 'request' && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <Input
            label="Nomor WhatsApp atau Email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="+628123456789 atau email@example.com"
            required
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {successMsg && <p className="text-green-600 text-sm">{successMsg}</p>}
          <Button type="submit" fullWidth loading={loading}>Kirim OTP</Button>
          <Button variant="outline" fullWidth onClick={onClose}>Batal</Button>
        </form>
      )}
      {step === 'reset' && (
        <form onSubmit={handleResetPin} className="space-y-4">
          <Input
            label="Kode OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="6 digit kode"
            required
          />
          <Input
            label="PIN Baru (6 digit)"
            type="password"
            value={newPin}
            onChange={(e) => setNewPin(e.target.value)}
            placeholder="6 digit angka"
            required
          />
          <Input
            label="Konfirmasi PIN Baru"
            type="password"
            value={confirmPin}
            onChange={(e) => setConfirmPin(e.target.value)}
            placeholder="Ulangi PIN baru"
            required
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <Button type="submit" fullWidth loading={loading}>Reset PIN</Button>
          <Button variant="outline" fullWidth onClick={onClose}>Batal</Button>
        </form>
      )}
    </Modal>
  );
};

export default ForgotPinModal;