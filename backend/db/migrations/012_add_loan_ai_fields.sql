-- ============================================================================
-- Migration: 012_add_loan_ai_fields
-- Deskripsi: Menambah kolom untuk perhitungan AI di loans
-- ============================================================================

USE koopcare_db;
SET @dbname = DATABASE();
SET @tablename = 'loans';

-- amt_annuity (angsuran per bulan)
SET @columnname = 'amt_annuity';
SELECT COUNT(*) INTO @col_exists FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = @columnname;
SET @sql = IF(@col_exists = 0, 
    CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' DECIMAL(15,2) NULL'),
    'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- amt_goods_price
SET @columnname = 'amt_goods_price';
SELECT COUNT(*) INTO @col_exists FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = @columnname;
SET @sql = IF(@col_exists = 0, 
    CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' DECIMAL(15,2) NULL'),
    'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;