CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL COMMENT 'ID anggota yang melakukan transaksi',
    type ENUM('SETORAN_WAJIB', 'TARIK_TUNAI', 'BAYAR_ANGSURAN', 'TOP_UP', 'PENARIKAN_SALDO') NOT NULL COMMENT 'Jenis transaksi',
    amount DECIMAL(15,2) NOT NULL COMMENT 'Nominal (selalu positif)',
    description TEXT NULL COMMENT 'Catatan/keterangan',
    reference_id VARCHAR(50) NULL COMMENT 'ID referensi (loan id, dll)',
    cashier_id INT NULL COMMENT 'ID admin/kasir yang memproses',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Waktu transaksi',
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    INDEX idx_member (member_id),
    INDEX idx_created (created_at),
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Riwayat transaksi keuangan';