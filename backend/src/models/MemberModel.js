// backend/src/models/MemberModel.js
import pool from '../config/database.js';
import { normalizePhone } from '../utils/validators.js';

export const findAll = async (limit, offset, search = '', role = null) => {
  let query = 'SELECT id, full_name, nik, phone, status, balance, role, created_at FROM members';
  const params = [];
  const conditions = [];

  // Hanya tampilkan admin atau anggota yang pengajuan KYC-nya sudah disetujui (APPROVED) atau ditolak (REJECTED)
  conditions.push("(role = 'admin' OR id IN (SELECT member_id FROM kyc_submissions WHERE status IN ('APPROVED', 'REJECTED')))");

  if (search) {
    conditions.push('(full_name LIKE ? OR nik LIKE ? OR phone LIKE ?)');
    let phoneSearch = search;
    const cleanSearch = search.trim();
    if (/^[+0-9\s-]+$/.test(cleanSearch)) {
      const normalized = normalizePhone(cleanSearch);
      if (normalized) {
        phoneSearch = normalized;
      }
    }
    const like = `%${search}%`;
    const phoneLike = `%${phoneSearch}%`;
    params.push(like, like, phoneLike);
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
  const [rows] = await pool.query('SELECT * FROM members WHERE id = ?', [id]);
  if (rows[0]) {
    delete rows[0].pin;
  }
  return rows[0];
};

export const update = async (id, data) => {
    const fields = [];
    const values = [];
    for (let [key, value] of Object.entries(data)) {
        if (key === 'phone' && value) {
            value = normalizePhone(value);
        }
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
  const normalized = normalizePhone(phone);
  const [rows] = await pool.query('SELECT * FROM members WHERE phone = ?', [normalized]);
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
    code_gender, birth_date, education, family_status, income_type, occupation,
    own_car, own_realty, children_count, family_members,
    employed_days, last_phone_change_days,
    vehicle_type, property_type
  } = memberData;

  const normalizedPhone = normalizePhone(phone);

  const [result] = await pool.query(
    `INSERT INTO members (
      full_name, nik, phone, email, pin, status, role,
      monthly_income, tenure_months, existing_loan_balance, has_collateral,
      code_gender, birth_date, education, family_status, income_type, occupation,
      own_car, own_realty, children_count, family_members,
      employed_days, last_phone_change_days,
      vehicle_type, property_type
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      fullName, nik, normalizedPhone, email, pin, status, role || 'member',
      monthly_income || 0, tenure_months || 0, existing_loan_balance || 0, has_collateral || false,
      code_gender || null, birth_date || null, education || null,
      family_status || null, income_type || null, occupation || null,
      own_car || null, own_realty || null, children_count || null, family_members || null,
      employed_days || null, last_phone_change_days || null,
      vehicle_type || null, property_type || null
    ]
  );
  return result.insertId;
};

