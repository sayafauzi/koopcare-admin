// backend/src/controllers/cashierController.js
import * as transactionService from '../services/transactionService.js';

export const createTransaction = async (req, res, next) => {
  try {
    const { member_id, type, amount, description, reference_id } = req.body;
    if (!member_id) throw new Error('Anggota harus dipilih');
    if (!type) throw new Error('Jenis transaksi harus dipilih');
    if (!amount || amount <= 0) throw new Error('Nominal harus > 0');
    
    const cashier_id = req.user?.id || null;
    const transactionId = await transactionService.recordTransaction({
      member_id, type, amount, description, reference_id, cashier_id
    });
    res.json({ success: true, message: 'Transaksi berhasil', transactionId });
  } catch (err) {
    next(err);
  }
};

export const getTodayTransactions = async (req, res, next) => {
  try {
    const cashier_id = req.user?.id || null;
    const transactions = await transactionService.getDailyTransactions(cashier_id);
    res.json({ success: true, data: transactions });
  } catch (err) {
    next(err);
  }
};