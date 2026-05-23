import pool from '../config/database.js';

export const findByMemberId = async (memberId) => {
    const [rows] = await pool.query('SELECT * FROM notifications WHERE member_id = ? ORDER BY created_at DESC', [memberId]);
    return rows;
};

export const markAsRead = async (id, memberId) => {
    await pool.query('UPDATE notifications SET is_read = TRUE WHERE id = ? AND member_id = ?', [id, memberId]);
};

export const create = async (memberId, title, message) => {
    const [result] = await pool.query('INSERT INTO notifications (member_id, title, message) VALUES (?, ?, ?)', [memberId, title, message]);
    return result.insertId;
};