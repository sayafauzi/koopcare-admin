-- backend/seed.sql
USE koopcare_db;

-- Hapus data lama jika perlu (opsional)
-- TRUNCATE TABLE members;

-- Masukkan data contoh members
INSERT INTO members (full_name, nik, phone, pin, status) VALUES
('Ahmad Fauzi', '3201234567890123', '+628123456789', '$2a$10$hashedpin123', 'ACTIVE'),
('Siti Nurhaliza', '3209876543210987', '+628123456780', '$2a$10$hashedpin456', 'ACTIVE'),
('Budi Santoso', '3205555555555555', '+628123456781', '$2a$10$hashedpin789', 'INACTIVE');

-- Masukkan data contoh kyc_submissions
INSERT INTO kyc_submissions (member_id, full_name, nik, phone, status, ktp_photo_url, selfie_photo_url, notes, reviewed_by, reviewed_at) VALUES
(1, 'Ahmad Fauzi', '3201234567890129', '+628123456789', 'APPROVED', 'https://placehold.co/400x300?text=KTP_Ahmad', 'https://placehold.co/400x300?text=Selfie_Ahmad', 'Dokumen lengkap', 1, NOW()),
(2, 'Siti Nurhaliza', '3209876543210989', '+628123456780', 'APPROVED', 'https://placehold.co/400x300?text=KTP_Siti', 'https://placehold.co/400x300?text=Selfie_Siti', 'Verifikasi lapangan OK', 1, NOW()),
(3, 'Budi Santoso', '3205555555555559', '+628123456781', 'REJECTED', 'https://placehold.co/400x300?text=KTP_Budi', 'https://placehold.co/400x300?text=Selfie_Budi', 'Foto KTP blur', 2, NOW()),
(1, 'Ahmad Fauzi (duplikat)', '3201234567890124', '+628123456782', 'PENDING', 'https://placehold.co/400x300?text=KTP_Fauzi2', 'https://placehold.co/400x300?text=Selfie_Fauzi2', NULL, NULL, NULL),
(2, 'Siti Nurhaliza (kedua)', '3209876543210988', '+628123456783', 'PENDING', 'https://placehold.co/400x300?text=KTP_Siti2', 'https://placehold.co/400x300?text=Selfie_Siti2', NULL, NULL, NULL),
(3, 'Budi Santoso (kedua)', '3205555555555556', '+628123456784', 'PENDING', 'https://placehold.co/400x300?text=KTP_Budi2', 'https://placehold.co/400x300?text=Selfie_Budi2', NULL, NULL, NULL),
(1, 'Ahmad Fauzi (ketiga)', '3201234567890125', '+628123456785', 'REJECTED', 'https://placehold.co/400x300?text=KTP_Fauzi3', 'https://placehold.co/400x300?text=Selfie_Fauzi3', 'NIK tidak sesuai', 2, NOW()),
(2, 'Siti Nurhaliza (ketiga)', '3209876543210980', '+628123456786', 'APPROVED', 'https://placehold.co/400x300?text=KTP_Siti3', 'https://placehold.co/400x300?text=Selfie_Siti3', 'Lengkap', 1, NOW()),
(3, 'Budi Santoso (ketiga)', '3205555555555557', '+628123456787', 'PENDING', 'https://placehold.co/400x300?text=KTP_Budi3', 'https://placehold.co/400x300?text=Selfie_Budi3', NULL, NULL, NULL),
(1, 'Ahmad Fauzi (keempat)', '3201234567890126', '+628123456788', 'PENDING', 'https://placehold.co/400x300?text=KTP_Fauzi4', 'https://placehold.co/400x300?text=Selfie_Fauzi4', NULL, NULL, NULL);

-- Masukkan data contoh loans
INSERT INTO loans (member_id, request_number, amount, tenor, type, status, ai_score, ai_recommendation, prob_default, risk_level, max_approved_amount)
VALUES
    (2, 'LOAN001', 5000000, 6, 'MURABAHAH', 'PENDING', 87, 'LAYAK', 0.13, 'low', 4000000),
    (3, 'LOAN002', 2000000, 3, 'QARDHUL_HASAN', 'PENDING', 65, 'TIDAK_LAYAK', 0.45, 'medium', 1000000),
    (4, 'LOAN003', 7500000, 12, 'MURABAHAH', 'PENDING', 92, 'LAYAK', 0.08, 'low', 6000000);

-- Masukkan data transactions
INSERT IGNORE INTO transactions (member_id, type, amount, description, created_at) VALUES
(1, 'SETORAN_WAJIB', 500000, 'Setoran awal', NOW()),
(2, 'TOP_UP', 200000, 'Top up via transfer', NOW());

-- Masukkan data auth sementara
INSERT INTO members (full_name, nik, phone, email, pin, role) 
VALUES ('Admin Utama', '1234567890123456', '+628123456789', 'admin@koopcare.com', '$2a$12$xVaRA7RGOb.9O6Kk5HJNb.f7G7hJga5Di.aNjCeyOi5.eQmoDBEQu', 'admin')
ON DUPLICATE KEY UPDATE pin = VALUES(pin);


INSERT INTO invite_codes (code, created_by, valid_until, max_uses, used_count, status) VALUES ('KOD-ABC123', 1, DATE_ADD(NOW(), INTERVAL 30 DAY), 1, 0, 'active');