-- backend/init.sql
CREATE DATABASE IF NOT EXISTS koopcare_db;
USE koopcare_db;

-- Tabel members
CREATE TABLE IF NOT EXISTS members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    nik VARCHAR(16) UNIQUE NOT NULL,
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(100),
    pin VARCHAR(255) NOT NULL, -- hashed
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    balance BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nik (nik),
    INDEX idx_phone (phone),
    INDEX idx_status (status)
);

-- Tabel kyc_submissions
CREATE TABLE IF NOT EXISTS kyc_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    nik VARCHAR(16) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    ktp_photo_url VARCHAR(255),
    selfie_photo_url VARCHAR(255),
    notes TEXT,
    reviewed_by INT,
    reviewed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    INDEX idx_nik (nik),
    INDEX idx_status (status)
);

-- Tabel loans
CREATE TABLE IF NOT EXISTS loans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    request_number VARCHAR(20) UNIQUE NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    tenor INT NOT NULL COMMENT 'dalam bulan',
    purpose TEXT,
    type ENUM('MURABAHAH', 'QARDHUL_HASAN') DEFAULT 'MURABAHAH',
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'ACTIVE', 'PAID_OFF', 'DEFAULTED') DEFAULT 'PENDING',
    ai_score INT DEFAULT 0,
    max_approved_amount DECIMAL(15,2),
    approved_amount DECIMAL(15,2),
    approved_tenor INT,
    rejection_reason TEXT,
    reviewed_by INT,
    reviewed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_member (member_id)
);

-- Tabel transactions
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    type ENUM('SETORAN_WAJIB', 'TARIK_TUNAI', 'BAYAR_ANGSURAN', 'TOP_UP', 'PENARIKAN_SALDO') NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    description TEXT,
    reference_id VARCHAR(50),
    cashier_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    INDEX idx_member (member_id),
    INDEX idx_created (created_at)
);


ALTER TABLE transactions ADD INDEX idx_type (type);

ALTER TABLE members ADD COLUMN role ENUM('admin', 'member') DEFAULT 'member';
-- Jadikan admin pertama (misal user dengan id=1)
UPDATE members SET role = 'admin' WHERE id = 1;

CREATE TABLE IF NOT EXISTS invite_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    created_by INT,
    valid_until DATE NOT NULL,
    max_uses INT DEFAULT 1,
    used_count INT DEFAULT 0,
    status ENUM('active', 'expired') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES members(id) ON DELETE SET NULL,
    INDEX idx_code (code)
);

ALTER TABLE members ADD COLUMN created_by INT NULL;
ALTER TABLE members ADD FOREIGN KEY (created_by) REFERENCES members(id) ON DELETE SET NULL;
