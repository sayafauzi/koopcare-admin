// backend/src/models/MemberModel.js
import pool from '../config/database.js';

export const findAll = async (limit, offset, search = '', role = null) => {
  let query = 'SELECT id, full_name, nik, phone, status, balance, role, created_at FROM members';
  const params = [];
  const conditions = [];

  if (search) {
    conditions.push('(full_name LIKE ? OR nik LIKE ? OR phone LIKE ?)');
    const like = `%${search}%`;
    params.push(like, like, like);
  }
  if (role && role !== 'ALL') {
    conditions.push('role = ?');
    params.push(role);
  }

  if (conditions.length) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);
  const [rows] = await pool.query(query, params);

  // Hitung total dengan filter yang sama
  let countQuery = 'SELECT COUNT(*) as total FROM members';
  if (conditions.length) {
    countQuery += ' WHERE ' + conditions.join(' AND ');
  }
  const [countRows] = await pool.query(countQuery, params.slice(0, -2)); // hapus limit & offset
  return { data: rows, total: countRows[0].total };
};


export const findById = async (id) => {
  const [rows] = await pool.query('SELECT id, full_name, nik, phone, status, balance FROM members WHERE id = ?', [id]);
  return rows[0];
};

export const update = async (id, data) => {
    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
        fields.push(`${key} = ?`);
        values.push(value);
    }
    values.push(id);
    await pool.query(`UPDATE members SET ${fields.join(', ')} WHERE id = ?`, values);
};

export const updatePin = async (id, hashedPin) => {
  await pool.query('UPDATE members SET pin = ? WHERE id = ?', [hashedPin, id]);
};

export const updateStatus = async (id, status) => {
  await pool.query('UPDATE members SET status = ? WHERE id = ?', [status, id]);
};

export const countByStatus = async (status) => {
  const [rows] = await pool.query('SELECT COUNT(*) as count FROM members WHERE status = ?', [status]);
  return rows[0].count;
};

export const findByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM members WHERE email = ?', [email]);
  return rows[0];
};

export const findByPhone = async (phone) => {
  const [rows] = await pool.query('SELECT * FROM members WHERE phone = ?', [phone]);
  return rows[0];
};

export const findByNIK = async (nik) => {
  const [rows] = await pool.query('SELECT * FROM members WHERE nik = ?', [nik]);
  return rows[0];
};

export const createMember = async (memberData) => {
  const {
    fullName, nik, phone, email, pin, status, role,
    monthly_income, tenure_months, existing_loan_balance, has_collateral,
    code_gender, birth_date, education, family_status, occupation,
    own_car, own_realty, children_count, family_members,
    employed_days, last_phone_change_days
  } = memberData;

  const [result] = await pool.query(
    `INSERT INTO members (
      full_name, nik, phone, email, pin, status, role,
      monthly_income, tenure_months, existing_loan_balance, has_collateral,
      code_gender, birth_date, education, family_status, occupation,
      own_car, own_realty, children_count, family_members,
      employed_days, last_phone_change_days
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      fullName, nik, phone, email, pin, status, role || 'member',
      monthly_income || 0, tenure_months || 0, existing_loan_balance || 0, has_collateral || false,
      code_gender || 'M', birth_date || null, education || 'Secondary / secondary special',
      family_status || 'Single', occupation || 'Laborers',
      own_car || false, own_realty || false, children_count || 0, family_members || 1,
      employed_days || -1825, last_phone_change_days || -180
    ]
  );
  return result.insertId;
};

