SET @dbname = DATABASE();
SET @tablename = 'members';
SET @columnname = 'role';

SET @sql = IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = @columnname) = 0,
    CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN role ENUM(''admin'', ''member'') DEFAULT ''member'' COMMENT ''Role pengguna'''),
    'SELECT "Column role already exists"'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Update user id 1 menjadi admin (jika ada)
UPDATE members SET role = 'admin' WHERE id = 1;