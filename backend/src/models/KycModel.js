import pool from '../config/database.js';

export const findAll = async (limit, offset, status = null) => {
  let query = `
    SELECT k.id, k.full_name, k.nik, k.phone, k.registration_date, k.status,
           k.ktp_photo_url, k.selfie_photo_url, k.notes, k.reviewed_at,
           m.id as member_id
    FROM kyc_submissions k
    JOIN members m ON k.member_id = m.id
  `;
  const params = [];
  if (status && status !== 'ALL') {
    query += ' WHERE k.status = ?';
    params.push(status);
  }
  query += ' ORDER BY k.registration_date DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);
  const [rows] = await pool.query(query, params);
  
  const countQuery = status && status !== 'ALL'
    ? 'SELECT COUNT(*) as total FROM kyc_submissions WHERE status = ?'
    : 'SELECT COUNT(*) as total FROM kyc_submissions';
  const countParams = status && status !== 'ALL' ? [status] : [];
  const [countRows] = await pool.query(countQuery, countParams);
  
  return { data: rows, total: countRows[0].total };
};

export const findById = async (id) => {
  const [rows] = await pool.query(`
    SELECT k.*, m.email
    FROM kyc_submissions k
    JOIN members m ON k.member_id = m.id
    WHERE k.id = ?
  `, [id]);
  return rows[0];
};

export const findByMemberId = async (memberId) => {
    const [rows] = await pool.query('SELECT * FROM kyc_submissions WHERE member_id = ? ORDER BY created_at DESC LIMIT 1', [memberId]);
    return rows[0];
};

export const findPendingByMemberId = async (memberId) => {
    const [rows] = await pool.query(
        'SELECT * FROM kyc_submissions WHERE member_id = ? AND status = "PENDING"',
        [memberId]
    );
    return rows[0];
};

export const create = async (data) => {
  const { member_id, full_name, nik, phone, status, ktp_photo_url, selfie_photo_url } = data;
  const [result] = await pool.query(
    `INSERT INTO kyc_submissions (member_id, full_name, nik, phone, status, ktp_photo_url, selfie_photo_url)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [member_id, full_name, nik, phone, status, ktp_photo_url, selfie_photo_url]
  );
  return result.insertId;
};

export const updateStatus = async (id, status, reviewedBy, notes = null) => {
  await pool.query(`
    UPDATE kyc_submissions
    SET status = ?, reviewed_by = ?, reviewed_at = NOW(), notes = ?
    WHERE id = ?
  `, [status, reviewedBy, notes, id]);
};

export const findExistingApprovedByNik = async (nik, excludeId) => {
  const [rows] = await pool.query(
    'SELECT id FROM kyc_submissions WHERE nik = ? AND status = "APPROVED" AND id != ?',
    [nik, excludeId]
  );
  return rows[0];
};