CREATE TABLE IF NOT EXISTS invite_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL COMMENT 'Kode undangan (format KOD-XXXXXX)',
    created_by INT NOT NULL COMMENT 'ID admin pembuat kode',
    valid_until DATE NOT NULL COMMENT 'Tanggal kadaluarsa',
    max_uses INT DEFAULT 1 COMMENT 'Maksimal penggunaan',
    used_count INT DEFAULT 0 COMMENT 'Jumlah sudah digunakan',
    status ENUM('active', 'expired') DEFAULT 'active' COMMENT 'Status kode',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES members(id) ON DELETE CASCADE,
    INDEX idx_code (code),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Kode undangan pendaftaran admin';