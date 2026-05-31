// frontend/src/features/cashier/components/TransactionForm.jsx
import React, { useState, useMemo } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import { formatCurrency } from '../../../utils/formatters';
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  CreditCardIcon, 
  BanknotesIcon, 
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';

const transactionTypes = [
  { value: 'SETORAN_WAJIB', label: 'Setoran Tabungan Wajib', icon: ArrowUpIcon, color: 'green' },
  { value: 'TARIK_TUNAI', label: 'Tarik Tunai', icon: ArrowDownIcon, color: 'red' },
  { value: 'BAYAR_ANGSURAN', label: 'Bayar Angsuran', icon: CreditCardIcon, color: 'blue' },
  { value: 'TOP_UP', label: 'Top Up Saldo', icon: BanknotesIcon, color: 'emerald' },
  { value: 'PENARIKAN_SALDO', label: 'Penarikan Saldo', icon: ArrowDownIcon, color: 'orange' },
];

const TransactionForm = ({ member, onSubmit, loading }) => {
  const [type, setType] = useState('SETORAN_WAJIB');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const currentType = transactionTypes.find(t => t.value === type);
  const isDebit = useMemo(() => ['TARIK_TUNAI', 'BAYAR_ANGSURAN', 'PENARIKAN_SALDO'].includes(type), [type]);
  const exceedsBalance = isDebit && member && (parseInt(amount) > member.balance);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!member) return alert('Pilih anggota terlebih dahulu');
    if (!amount || amount <= 0) return alert('Nominal harus diisi');
    if (exceedsBalance) return alert('Saldo tidak mencukupi');
    
    const result = await onSubmit({ member_id: member.id, type, amount: parseInt(amount), description: note });
    if (result.success) {
      setAmount('');
      setNote('');
      alert(result.message);
    } else {
      alert(result.message);
    }
  };

  const isSubmitDisabled = !member || loading || !amount || amount <= 0 || exceedsBalance;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Header dengan informasi anggota */}
      <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200">
        <div>
          <p className="text-xs text-neutral-500 uppercase">Anggota</p>
          <p className="font-medium text-neutral-800">{member.full_name}</p>
          <p className="text-xs text-neutral-500">NIK: {member.nik}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-neutral-500 uppercase">Saldo saat ini</p>
          <p className="text-xl font-bold text-primary-700">{formatCurrency(member.balance)}</p>
        </div>
      </div>

      {/* Jenis transaksi */}
      <Select
        label="Jenis Transaksi"
        options={transactionTypes.map(t => ({ value: t.value, label: t.label }))}
        value={type}
        onChange={(e) => setType(e.target.value)}
      />

      {/* Jumlah */}
      <div>
        <Input
          type="number"
          label="Jumlah (Rupiah)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Rp 0"
        />
        {isDebit && amount && member && (
          <div className={`mt-1 text-xs flex items-center gap-1 ${exceedsBalance ? 'text-red-600' : 'text-green-600'}`}>
            {exceedsBalance ? (
              <ExclamationTriangleIcon className="h-3 w-3" />
            ) : (
              <ArrowDownIcon className="h-3 w-3" />
            )}
            {exceedsBalance 
              ? `Saldo tidak mencukupi (butuh ${formatCurrency(amount)})`
              : `Sisa saldo setelah transaksi: ${formatCurrency(member.balance - amount)}`}
          </div>
        )}
      </div>

      {/* Catatan */}
      <Input
        label="Catatan (opsional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Referensi / keterangan"
      />

      {/* Ringkasan */}
      <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
        <div className="flex justify-between items-center">
          <span className="text-sm text-neutral-600">Total</span>
          <span className="text-xl font-bold text-primary-700">
            {formatCurrency(amount)}
          </span>
        </div>
      </div>

      {/* Tombol submit */}
      <Button
        type="submit"
        fullWidth
        loading={loading}
        disabled={isSubmitDisabled}
        icon={currentType?.icon}
        className="py-2.5"
      >
        {isDebit ? 'Proses Penarikan' : 'Proses Setoran'}
      </Button>
    </form>
  );
};

export default TransactionForm;