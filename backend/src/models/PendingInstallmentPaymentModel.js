import pool from '../config/database.js';

export const create = async ({ member_id, loan_id, installment_id, order_id, amount }) => {
  const [result] = await pool.query(
    `INSERT INTO pending_installment_payments
       (member_id, loan_id, installment_id, order_id, amount)
     VALUES (?, ?, ?, ?, ?)`,
    [member_id, loan_id, installment_id, order_id, amount]
  );
  return result.insertId;
};

export const findByOrderId = async (order_id) => {
  const [rows] = await pool.query(
    'SELECT * FROM pending_installment_payments WHERE order_id = ?',
    [order_id]
  );
  return rows[0];
};

export const updateStatus = async (order_id, status, conn = pool) => {
  await conn.query(
    'UPDATE pending_installment_payments SET status = ? WHERE order_id = ?',
    [status, order_id]
  );
};

/// Latest pending payment row for a given installment (for Flutter polling).
export const findLatestByInstallment = async (installment_id) => {
  const [rows] = await pool.query(
    `SELECT * FROM pending_installment_payments
     WHERE installment_id = ? ORDER BY created_at DESC LIMIT 1`,
    [installment_id]
  );
  return rows[0];
};