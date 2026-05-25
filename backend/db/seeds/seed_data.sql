-- ============================================================================
-- SEEDER DATABASE KOOPCARE (Dengan Data untuk AI)
-- ============================================================================
USE koopcare_db;

-- ============================================================================
-- 1. MEMBERS (Anggota contoh & Admin Utama) + data AI
-- ============================================================================

-- Admin Utama (PIN: 123456)
INSERT IGNORE INTO members (id, full_name, nik, phone, email, pin, status, role, monthly_income, tenure_months, existing_loan_balance, has_collateral, code_gender, birth_date, education, family_status, occupation, own_car, own_realty, children_count, family_members, employed_days, last_phone_change_days)
VALUES (1, 'Admin Utama', '1234567890123456', '+628123456789', 'admin@koopcare.com',
        '$2a$12$xVaRA7RGOb.9O6Kk5HJNb.f7G7hJga5Di.aNjCeyOi5.eQmoDBEQu',
        'ACTIVE', 'admin', 0, 0, 0, FALSE, 'M', NULL, NULL, NULL, NULL, FALSE, FALSE, 0, 1, -1825, -180);

-- Anggota contoh (PIN dummy, tidak untuk login)
INSERT IGNORE INTO members (id, full_name, nik, phone, pin, status, role, balance, monthly_income, tenure_months, existing_loan_balance, has_collateral, code_gender, birth_date, education, family_status, occupation, own_car, own_realty, children_count, family_members, employed_days, last_phone_change_days)
VALUES
    (2, 'Ahmad Fauzi', '3201234567890123', '+628123456789', '$2a$12$dummy', 'ACTIVE', 'member', 1500000, 7500000, 14, 0, TRUE, 'M', '1990-05-15', 'Bachelor', 'Married', 'Professional', 1, 1, 1, 3, -3650, -200),
    (3, 'Siti Nurhaliza', '3209876543210987', '+628123456780', '$2a$12$dummy', 'ACTIVE', 'member', 800000, 3500000, 6, 0, FALSE, 'F', '1995-08-20', 'Secondary / secondary special', 'Single', 'Laborers', 0, 1, 0, 2, -1825, -90),
    (4, 'Budi Santoso', '3205555555555555', '+628123456781', '$2a$12$dummy', 'INACTIVE', 'member', 0, 0, 0, 0, FALSE, 'M', NULL, NULL, NULL, NULL, FALSE, FALSE, 0, 1, -1825, -180),
    (5, 'Ahmad Fauzi (nama-sama)', '3201234567890124', '+628123456782', '$2a$12$dummy', 'INACTIVE', 'member', 0, 0, 0, 0, FALSE, 'M', NULL, NULL, NULL, NULL, FALSE, FALSE, 0, 1, -1825, -180),
    (6, 'Reza', '3201234567890125', '+628123456783', '$2a$12$dummy', 'INACTIVE', 'member', 0, 0, 0, 0, FALSE, 'M', NULL, NULL, NULL, NULL, FALSE, FALSE, 0, 1, -1825, -180);

-- ============================================================================
-- 2. KODE UNDANGAN UNTUK ADMIN BARU
-- ============================================================================
INSERT IGNORE INTO invite_codes (code, created_by, valid_until, max_uses, used_count, status)
VALUES ('KOD-ABC123', 1, DATE_ADD(NOW(), INTERVAL 30 DAY), 1, 0, 'active');

-- ============================================================================
-- 3. KYC SUBMISSIONS (Pengajuan verifikasi)
-- ============================================================================
INSERT IGNORE INTO kyc_submissions (member_id, full_name, nik, phone, status, ktp_photo_url, selfie_photo_url, notes, reviewed_by, reviewed_at)
VALUES
    (2, 'Ahmad Fauzi', '3201234567890123', '+628123456789', 'APPROVED',
     'https://placehold.co/400x300?text=KTP_Ahmad', 'https://placehold.co/400x300?text=Selfie_Ahmad',
     'Dokumen lengkap', 1, NOW()),
    (3, 'Siti Nurhaliza', '3209876543210987', '+628123456780', 'APPROVED',
     'https://placehold.co/400x300?text=KTP_Siti', 'https://placehold.co/400x300?text=Selfie_Siti',
     'Verifikasi OK', 1, NOW()),
    (4, 'Budi Santoso', '3205555555555555', '+628123456781', 'REJECTED',
     'https://placehold.co/400x300?text=KTP_Budi', 'https://placehold.co/400x300?text=Selfie_Budi',
     'Foto KTP blur', 1, NOW()),
    (5, 'Ahmad Fauzi (nama-sama)', '3201234567890124', '+628123456782', 'PENDING', 
     'https://placehold.co/400x300?text=KTP_Fauzi2', 'https://placehold.co/400x300?text=Selfie_Fauzi2', 
      NULL, 1, NULL),
    (6, 'Reza', '3201234567890125', '+628123456783', 'PENDING', 
     'https://placehold.co/400x300?text=KTP_Reza', 'https://placehold.co/400x300?text=Selfie_Reza', 
      NULL, 1, NULL);

-- ============================================================================
-- 4. LOANS (Pengajuan pinjaman contoh) + data rekomendasi AI
-- ============================================================================
INSERT IGNORE INTO loans (member_id, request_number, amount, tenor, type, status, ai_score, ai_recommendation, prob_default, risk_level, max_approved_amount)
VALUES
    (2, 'LOAN001', 5000000, 6, 'MURABAHAH', 'PENDING', 87, 'LAYAK', 0.13, 'low', 4000000),
    (3, 'LOAN002', 2000000, 3, 'QARDHUL_HASAN', 'PENDING', 65, 'TIDAK_LAYAK', 0.45, 'medium', 1000000),
    (4, 'LOAN003', 7500000, 12, 'MURABAHAH', 'PENDING', 92, 'LAYAK', 0.08, 'low', 6000000);

-- ============================================================================
-- 5. TRANSACTIONS (Riwayat transaksi contoh)
-- ============================================================================
INSERT IGNORE INTO transactions (member_id, type, amount, description, created_at)
VALUES
    (2, 'SETORAN_WAJIB', 500000, 'Setoran awal', NOW() - INTERVAL 2 DAY),
    (2, 'TARIK_TUNAI', 200000, 'Penarikan tunai', NOW() - INTERVAL 1 DAY),
    (3, 'TOP_UP', 100000, 'Top up saldo', NOW()),
    (4, 'BAYAR_ANGSURAN', 250000, 'Bayar angsuran', NOW());

-- ============================================================================
-- 6. UPDATE SALDO ANGGOTA BERDASARKAN TRANSAKSI (konsistensi)
-- ============================================================================
UPDATE members m
SET balance = (
    SELECT COALESCE(SUM(CASE WHEN type IN ('SETORAN_WAJIB', 'TOP_UP') THEN amount ELSE 0 END) -
                    SUM(CASE WHEN type IN ('TARIK_TUNAI', 'BAYAR_ANGSURAN', 'PENARIKAN_SALDO') THEN amount ELSE 0 END), 0)
    FROM transactions t
    WHERE t.member_id = m.id
)
WHERE m.id IN (2,3,4);

-- ============================================================================
-- 7. VERIFIKASI
-- ============================================================================
SELECT 'Seeder selesai. Jumlah anggota: ' AS Info, COUNT(*) FROM members
UNION
SELECT 'Jumlah kode undangan: ', COUNT(*) FROM invite_codes
UNION
SELECT 'Jumlah KYC: ', COUNT(*) FROM kyc_submissions
UNION
SELECT 'Jumlah pinjaman: ', COUNT(*) FROM loans
UNION
SELECT 'Jumlah transaksi: ', COUNT(*) FROM transactions;