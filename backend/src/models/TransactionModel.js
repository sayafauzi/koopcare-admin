// backend/src/models/TransactionModel.js
import pool from '../config/database.js';

export const create = async (transaction) => {
  const { member_id, type, amount, description, reference_id, cashier_id } = transaction;
  const [result] = await pool.query(
    `INSERT INTO transactions (member_id, type, amount, description, reference_id, cashier_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [member_id, type, amount, description || null, reference_id || null, cashier_id || null]
  );
  return result.insertId;
};

export const getTodayByCashier = async (cashierId = null) => {
  let query = `
    SELECT t.*, m.full_name as member_name
    FROM transactions t
    JOIN members m ON t.member_id = m.id
    WHERE DATE(t.created_at) = CURDATE()
  `;
  const params = [];
  if (cashierId) {
    query += ' AND t.cashier_id = ?';
    params.push(cashierId);
  }
  query += ' ORDER BY t.created_at DESC';
  const [rows] = await pool.query(query, params);
  return rows;
};

export const getByMember = async (memberId) => {
  const [rows] = await pool.query(
    `SELECT * FROM transactions WHERE member_id = ? ORDER BY created_at DESC`,
    [memberId]
  );
  return rows;
};

export const findByMemberId = async (memberId) => {
    const [rows] = await pool.query('SELECT * FROM transactions WHERE member_id = ? ORDER BY created_at DESC', [memberId]);
    return rows;
};

export const findAllWithFilters = async (filters, limit, offset) => {
  const { startDate, endDate, type, memberId } = filters;
  let query = `
    SELECT t.*, m.full_name as member_name
    FROM transactions t
    JOIN members m ON t.member_id = m.id
    WHERE 1=1
  `;
  const params = [];
  if (startDate) {
    query += ' AND DATE(t.created_at) >= ?';
    params.push(startDate);
  }
  if (endDate) {
    query += ' AND DATE(t.created_at) <= ?';
    params.push(endDate);
  }
  if (type) {
    query += ' AND t.type = ?';
    params.push(type);
  }
  if (memberId) {
    query += ' AND t.member_id = ?';
    params.push(memberId);
  }
  query += ' ORDER BY t.created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);
  const [rows] = await pool.query(query, params);

  let countQuery = 'SELECT COUNT(*) as total FROM transactions t WHERE 1=1';
  const countParams = [];
  if (startDate) {
    countQuery += ' AND DATE(t.created_at) >= ?';
    countParams.push(startDate);
  }
  if (endDate) {
    countQuery += ' AND DATE(t.created_at) <= ?';
    countParams.push(endDate);
  }
  if (type) {
    countQuery += ' AND t.type = ?';
    countParams.push(type);
  }
  if (memberId) {
    countQuery += ' AND t.member_id = ?';
    countParams.push(memberId);
  }
  const [countRows] = await pool.query(countQuery, countParams);
  return { data: rows, total: countRows[0].total };
};

export const getInflowOutflow = async (filters) => {
  const { startDate, endDate, type, memberId } = filters;
  let query = `
    SELECT 
      SUM(CASE WHEN t.type IN ('SETORAN_WAJIB', 'TOP_UP') THEN t.amount ELSE 0 END) as total_inflow,
      SUM(CASE WHEN t.type IN ('TARIK_TUNAI', 'BAYAR_ANGSURAN', 'PENARIKAN_SALDO') THEN t.amount ELSE 0 END) as total_outflow
    FROM transactions t
    WHERE 1=1
  `;
  const params = [];
  if (startDate) {
    query += ' AND DATE(t.created_at) >= ?';
    params.push(startDate);
  }
  if (endDate) {
    query += ' AND DATE(t.created_at) <= ?';
    params.push(endDate);
  }
  if (type) {
    query += ' AND t.type = ?';
    params.push(type);
  }
  if (memberId) {
    query += ' AND t.member_id = ?';
    params.push(memberId);
  }
  const [rows] = await pool.query(query, params);
  return { inflow: rows[0].total_inflow || 0, outflow: rows[0].total_outflow || 0 };
};