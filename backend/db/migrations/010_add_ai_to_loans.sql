-- 010_add_ai_to_loans.sql (safe version)
USE koopcare_db;
SET @dbname = DATABASE();
SET @tablename = 'loans';

-- Cek dan tambah ai_recommendation jika belum ada
SET @columnname = 'ai_recommendation';
SELECT COUNT(*) INTO @col_exists FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = @columnname;
SET @sql = IF(@col_exists = 0, 
    CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' ENUM("LAYAK","TIDAK_LAYAK") NULL'),
    'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Cek dan tambah prob_default
SET @columnname = 'prob_default';
SELECT COUNT(*) INTO @col_exists FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = @columnname;
SET @sql = IF(@col_exists = 0, 
    CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' DECIMAL(5,4) NULL'),
    'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Cek dan tambah risk_level
SET @columnname = 'risk_level';
SELECT COUNT(*) INTO @col_exists FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = @columnname;
SET @sql = IF(@col_exists = 0, 
    CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' VARCHAR(20) NULL'),
    'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;