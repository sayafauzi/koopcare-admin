USE koopcare_db;

-- 1. Tambah kolom created_by jika belum ada
SET @dbname = DATABASE();
SET @tablename = 'members';
SET @columnname = 'created_by';

SELECT COUNT(*) INTO @col_exists 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = @dbname 
  AND TABLE_NAME = @tablename 
  AND COLUMN_NAME = @columnname;

SET @sql = IF(@col_exists = 0, 
    CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' INT NULL COMMENT "ID anggota yang mendaftarkan"'),
    'SELECT 1');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 2. Tambah foreign key jika belum ada
SET @constraint_name = 'fk_member_creator';

SELECT COUNT(*) INTO @fk_exists 
FROM information_schema.TABLE_CONSTRAINTS 
WHERE CONSTRAINT_SCHEMA = @dbname 
  AND TABLE_NAME = @tablename 
  AND CONSTRAINT_NAME = @constraint_name;

SET @sql_fk = IF(@fk_exists = 0,
    CONCAT('ALTER TABLE ', @tablename, ' ADD CONSTRAINT ', @constraint_name, 
           ' FOREIGN KEY (created_by) REFERENCES members(id) ON DELETE SET NULL'),
    'SELECT 1');

PREPARE stmt_fk FROM @sql_fk;
EXECUTE stmt_fk;
DEALLOCATE PREPARE stmt_fk;