CREATE TABLE IF NOT EXISTS members (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Primary key',
    full_name VARCHAR(100) NOT NULL COMMENT 'Nama lengkap',
    nik VARCHAR(16) UNIQUE NOT NULL COMMENT 'NIK 16 digit',
    phone VARCHAR(15) NOT NULL COMMENT 'Nomor WhatsApp/telepon',
    email VARCHAR(100) NULL COMMENT 'Email (opsional)',
    pin VARCHAR(255) NOT NULL COMMENT 'PIN hashed (bcrypt)',
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE' COMMENT 'Status anggota',
    balance BIGINT DEFAULT 0 COMMENT 'Saldo simpanan (Rupiah)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Waktu pendaftaran',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Waktu update terakhir',
    INDEX idx_nik (nik),
    INDEX idx_phone (phone),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Data anggota dan admin';