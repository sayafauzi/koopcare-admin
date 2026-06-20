// backend/src/models/LoanModel.js
import pool from '../config/database.js';

export const findAll = async (limit, offset, status = null) => {
  let query = `
    SELECT l.*, m.full_name as member_name, m.nik, m.phone
    FROM loans l
    JOIN members m ON l.member_id = m.id
  `;
  const params = [];
  if (status && status !== 'ALL') {
    if (status === 'APPROVED') {
      query += " WHERE l.status IN ('APPROVED', 'ACTIVE', 'PAID_OFF', 'DEFAULTED')";
    } else {
      query += ' WHERE l.status = ?';
      params.push(status);
    }
  }
  query += ' ORDER BY l.created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);
  const [rows] = await pool.query(query, params);

  let countQuery;
  const countParams = [];
  if (status && status !== 'ALL') {
    if (status === 'APPROVED') {
      countQuery = "SELECT COUNT(*) as total FROM loans WHERE status IN ('APPROVED', 'ACTIVE', 'PAID_OFF', 'DEFAULTED')";
    } else {
      countQuery = 'SELECT COUNT(*) as total FROM loans WHERE status = ?';
      countParams.push(status);
    }
  } else {
    countQuery = 'SELECT COUNT(*) as total FROM loans';
  }
  const [countRows] = await pool.query(countQuery, countParams);
  return { data: rows, total: countRows[0].total };
};

export const findById = async (id) => {
  const [rows] = await pool.query(`
    SELECT l.*, m.full_name as member_name, m.nik, m.phone, m.balance,
           (SELECT COUNT(*) FROM loans WHERE member_id = m.id AND status = 'ACTIVE') as active_loans,
           (SELECT COALESCE(SUM(amount), 0) FROM loan_installments WHERE loan_id = l.id AND status = 'PAID') as total_paid,
           (SELECT COALESCE(SUM(amount), 0) FROM loan_installments WHERE loan_id = l.id AND status = 'PENDING') as total_remaining
    FROM loans l
    JOIN members m ON l.member_id = m.id
    WHERE l.id = ?
  `, [id]);
  return rows[0];
};

export const findByMemberId = async (memberId) => {
    const [rows] = await pool.query(`
        SELECT l.*,
               (SELECT COALESCE(SUM(amount), 0) FROM loan_installments WHERE loan_id = l.id AND status = 'PAID') as total_paid,
               (SELECT COALESCE(SUM(amount), 0) FROM loan_installments WHERE loan_id = l.id AND status = 'PENDING') as total_remaining
        FROM loans l
        WHERE l.member_id = ?
        ORDER BY l.created_at DESC
    `, [memberId]);
    return rows;
};

export const updateStatus = async (id, status, reviewedBy, approvedAmount = null, approvedTenor = null, rejectionReason = null) => {
  const updates = { status, reviewed_by: reviewedBy, reviewed_at: new Date() };
  if (approvedAmount !== null) updates.approved_amount = approvedAmount;
  if (approvedTenor !== null) updates.approved_tenor = approvedTenor;
  if (rejectionReason !== null) updates.rejection_reason = rejectionReason;

  const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
  const values = [...Object.values(updates), id];
  await pool.query(`UPDATE loans SET ${fields} WHERE id = ?`, values);
};

export const create = async (loanData) => {
  const { member_id, request_number, amount, tenor, purpose, type, status = 'PENDING' } = loanData;
  const [result] = await pool.query(
    'INSERT INTO loans (member_id, request_number, amount, tenor, purpose, type, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [member_id, request_number, amount, tenor, purpose, type, status]
  );
  return result.insertId;
};

export const updateAIResult = async (id, aiData) => {
    const { ai_score, ai_recommendation, prob_default, risk_level, max_approved_amount } = aiData;
    await pool.query(`
        UPDATE loans
        SET ai_score = ?, ai_recommendation = ?, prob_default = ?, risk_level = ?, max_approved_amount = ?
        WHERE id = ?
    `, [ai_score, ai_recommendation, prob_default, risk_level, max_approved_amount, id]);
};