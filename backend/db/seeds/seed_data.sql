-- ============================================================================
-- SEEDER DATABASE KOOPCARE (Hanya Admin Utama)
-- ============================================================================
USE koopcare_db;

-- ============================================================================
-- 1. MEMBERS (Admin Utama)
-- ============================================================================

-- Admin Utama (PIN: 123456)
INSERT IGNORE INTO members (id, full_name, nik, phone, email, pin, status, role, monthly_income, tenure_months, existing_loan_balance, has_collateral, code_gender, birth_date, education, family_status, occupation, own_car, own_realty, children_count, family_members, employed_days, last_phone_change_days)
VALUES (1, 'Admin Utama', '1234567890123456', '08123456789', 'admin@koopcare.com',
        '$2a$12$xVaRA7RGOb.9O6Kk5HJNb.f7G7hJga5Di.aNjCeyOi5.eQmoDBEQu',
        'ACTIVE', 'admin', 0, 0, 0, FALSE, 'M', NULL, NULL, NULL, NULL, FALSE, FALSE, 0, 1, -1825, -180);

-- ============================================================================
-- 2. KODE UNDANGAN UNTUK ADMIN BARU
-- ============================================================================
INSERT IGNORE INTO invite_codes (code, created_by, valid_until, max_uses, used_count, status)
VALUES ('KOD-ABC123', 1, DATE_ADD(NOW(), INTERVAL 30 DAY), 1, 0, 'active');

SELECT 'Seeder selesai. Jumlah anggota: ' AS Info, COUNT(*) FROM members
UNION
SELECT 'Jumlah kode undangan: ', COUNT(*) FROM invite_codes;