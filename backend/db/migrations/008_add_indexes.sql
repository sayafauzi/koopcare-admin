USE koopcare_db;

-- 1. Indeks untuk transactions: created_at (bukan DATE(created_at))
SET @dbname = DATABASE();
SET @tablename = 'transactions';
SET @indexname = 'idx_created_date';

SELECT COUNT(*) INTO @idx_exists 
FROM information_schema.STATISTICS 
WHERE TABLE_SCHEMA = @dbname 
  AND TABLE_NAME = @tablename 
  AND INDEX_NAME = @indexname;

SET @sql = IF(@idx_exists = 0, 
    CONCAT('ALTER TABLE ', @tablename, ' ADD INDEX ', @indexname, ' (created_at)'),
    'SELECT 1');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 2. Indeks untuk members: (role, status)
SET @tablename = 'members';
SET @indexname = 'idx_role_status';

SELECT COUNT(*) INTO @idx_exists 
FROM information_schema.STATISTICS 
WHERE TABLE_SCHEMA = @dbname 
  AND TABLE_NAME = @tablename 
  AND INDEX_NAME = @indexname;

SET @sql = IF(@idx_exists = 0, 
    CONCAT('ALTER TABLE ', @tablename, ' ADD INDEX ', @indexname, ' (role, status)'),
    'SELECT 1');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 3. Indeks untuk invite_codes: (status, valid_until)
SET @tablename = 'invite_codes';
SET @indexname = 'idx_status_expiry';

SELECT COUNT(*) INTO @idx_exists 
FROM information_schema.STATISTICS 
WHERE TABLE_SCHEMA = @dbname 
  AND TABLE_NAME = @tablename 
  AND INDEX_NAME = @indexname;

SET @sql = IF(@idx_exists = 0, 
    CONCAT('ALTER TABLE ', @tablename, ' ADD INDEX ', @indexname, ' (status, valid_until)'),
    'SELECT 1');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;