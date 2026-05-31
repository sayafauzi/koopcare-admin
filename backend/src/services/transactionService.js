import * as transactionModel from '../models/TransactionModel.js';
import pool from '../config/database.js';

export const recordTransaction = async (transactionData) => {
  const { member_id, type, amount, description, reference_id, cashier_id } = transactionData;
  
  console.log('=== TRANSACTION DEBUG ===');
  console.log('Received type:', type);
  console.log('Amount:', amount);
  console.log('Member ID:', member_id);

  if (amount <= 0) throw new Error('Nominal harus lebih dari 0');

  // Definisikan tipe dengan eksplisit
  const CREDIT_TYPES = ['SETORAN_WAJIB', 'TOP_UP'];
  const DEBIT_TYPES = ['TARIK_TUNAI', 'BAYAR_ANGSURAN', 'PENARIKAN_SALDO'];

  const isCredit = CREDIT_TYPES.includes(type);
  const isDebit = DEBIT_TYPES.includes(type);

  console.log('isCredit:', isCredit);
  console.log('isDebit:', isDebit);

  if (!isCredit && !isDebit) {
    throw new Error(`Jenis transaksi tidak dikenal: ${type}`);
  }

  // Hanya cek saldo jika debit
  if (isDebit) {
    const [rows] = await pool.query('SELECT balance FROM members WHERE id = ?', [member_id]);
    const currentBalance = rows[0]?.balance ?? 0;
    console.log('Current balance:', currentBalance);
    if (currentBalance < amount) {
      throw new Error('Saldo tidak mencukupi');
    }
  } else {
    console.log('Transaksi kredit, tidak perlu cek saldo');
  }

  // Simpan transaksi
  const transactionId = await transactionModel.create({
    member_id, type, amount, description, reference_id, cashier_id
  });

  // Hitung perubahan saldo
  let balanceChange = 0;
  if (isCredit) balanceChange = amount;      // tambah
  else if (isDebit) balanceChange = -amount; // kurangi

  console.log('Balance change:', balanceChange);

  // Update saldo anggota
  const [updateResult] = await pool.query(
    'UPDATE members SET balance = balance + ? WHERE id = ?',
    [balanceChange, member_id]
  );
  console.log('Rows affected:', updateResult.affectedRows);

  // Ambil saldo baru untuk verifikasi
  const [newBalance] = await pool.query('SELECT balance FROM members WHERE id = ?', [member_id]);
  console.log('New balance:', newBalance[0]?.balance);
  console.log('========================\n');

  return transactionId;
};

export const getDailyTransactions = async (cashierId = null) => {
  return await transactionModel.getTodayByCashier(cashierId);
};