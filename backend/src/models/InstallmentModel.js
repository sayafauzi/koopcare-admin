import pool from '../config/database.js';

/// Generates the full schedule for an approved loan. Idempotent: if the loan
/// already has installments, does nothing (INSERT IGNORE on the unique key).
export const generateForLoan = async ({ loanId, amount, tenor, startDate }) => {
  if (!tenor || tenor <= 0 || !amount || amount <= 0) return;

  const totalAmount = Math.round(Number(amount));
  const baseMonthly = Math.round(totalAmount / tenor);
  const base = startDate ? new Date(startDate) : new Date();

  const values = [];
  const placeholders = [];
  for (let n = 1; n <= tenor; n++) {
    const due = new Date(base);
    due.setDate(due.getDate() + 30 * n); // 30-day cadence, matching the UI
    const dueStr = due.toISOString().slice(0, 10); // YYYY-MM-DD
    
    // Adjust the last installment to ensure the sum equals the exact loan amount
    const installmentAmount = n === tenor
      ? totalAmount - (baseMonthly * (tenor - 1))
      : baseMonthly;

    placeholders.push('(?, ?, ?, ?)');
    values.push(loanId, n, installmentAmount, dueStr);
  }

  await pool.query(
    `INSERT IGNORE INTO loan_installments (loan_id, installment_number, amount, due_date)
     VALUES ${placeholders.join(', ')}`,
    values
  );
};

export const findByLoanId = async (loanId) => {
  const [rows] = await pool.query(
    'SELECT * FROM loan_installments WHERE loan_id = ? ORDER BY installment_number ASC',
    [loanId]
  );
  return rows;
};

export const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM loan_installments WHERE id = ?', [id]);
  return rows[0];
};

/// The next unpaid installment for a loan (lowest number still PENDING).
export const findNextUnpaid = async (loanId) => {
  const [rows] = await pool.query(
    `SELECT * FROM loan_installments
     WHERE loan_id = ? AND status = 'PENDING'
     ORDER BY installment_number ASC LIMIT 1`,
    [loanId]
  );
  return rows[0];
};

export const markPaid = async (id, transactionId, conn = pool) => {
  await conn.query(
    `UPDATE loan_installments SET status = 'PAID', paid_at = NOW(), transaction_id = ?
     WHERE id = ?`,
    [transactionId, id]
  );
};