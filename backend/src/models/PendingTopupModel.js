import pool from '../config/database.js';

export const create = async ({ member_id, order_id, amount }) => {
  const [result] = await pool.query(
    'INSERT INTO pending_topups (member_id, order_id, amount) VALUES (?, ?, ?)',
    [member_id, order_id, amount]
  );
  return result.insertId;
};

export const findByOrderId = async (order_id) => {
  const [rows] = await pool.query('SELECT * FROM pending_topups WHERE order_id = ?', [order_id]);
  return rows[0];
};

export const updateStatus = async (order_id, status) => {
  await pool.query('UPDATE pending_topups SET status = ? WHERE order_id = ?', [status, order_id]);
};

export const findByMemberId = async (member_id) => {
  const [rows] = await pool.query(
    'SELECT * FROM pending_topups WHERE member_id = ? ORDER BY created_at DESC',
    [member_id]
  );
  return rows;
};