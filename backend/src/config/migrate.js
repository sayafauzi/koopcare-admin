import mysql from 'mysql2/promise';

async function columnExists(conn, table, column) {
  const [rows] = await conn.query(
    `SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [table, column]
  );
  return rows[0].cnt > 0;
}

async function indexExists(conn, table, indexName) {
  const [rows] = await conn.query(
    `SELECT COUNT(*) AS cnt FROM information_schema.STATISTICS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND INDEX_NAME = ?`,
    [table, indexName]
  );
  return rows[0].cnt > 0;
}

async function fkExists(conn, table, constraintName) {
  const [rows] = await conn.query(
    `SELECT COUNT(*) AS cnt FROM information_schema.TABLE_CONSTRAINTS
     WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = ? AND CONSTRAINT_NAME = ?`,
    [table, constraintName]
  );
  return rows[0].cnt > 0;
}

async function addCol(conn, table, column, definition) {
  if (!(await columnExists(conn, table, column))) {
    await conn.query(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}

async function addIdx(conn, table, indexName, definition) {
  if (!(await indexExists(conn, table, indexName))) {
    await conn.query(`ALTER TABLE ${table} ADD INDEX ${indexName} ${definition}`);
  }
}

export async function runMigrations() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      filename VARCHAR(255) UNIQUE NOT NULL,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const [executed] = await connection.query('SELECT filename FROM _migrations');
  const done = new Set(executed.map(r => r.filename));

  // 001 - members
  if (!done.has('001')) {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        nik VARCHAR(16) UNIQUE NOT NULL,
        phone VARCHAR(15) NOT NULL,
        email VARCHAR(100) NULL,
        pin VARCHAR(255) NOT NULL,
        status ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
        balance BIGINT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_nik (nik), INDEX idx_phone (phone), INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    await connection.query(`INSERT INTO _migrations (filename) VALUES ('001')`);
  }

  // 002 - kyc_submissions
  if (!done.has('002')) {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS kyc_submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        member_id INT NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        nik VARCHAR(16) NOT NULL,
        phone VARCHAR(15) NOT NULL,
        registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status ENUM('PENDING','APPROVED','REJECTED') DEFAULT 'PENDING',
        ktp_photo_url VARCHAR(255) NULL,
        selfie_photo_url VARCHAR(255) NULL,
        notes TEXT NULL,
        reviewed_by INT NULL,
        reviewed_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
        INDEX idx_nik (nik), INDEX idx_status (status), INDEX idx_member (member_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    await connection.query(`INSERT INTO _migrations (filename) VALUES ('002')`);
  }

  // 003 - loans
  if (!done.has('003')) {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS loans (
        id INT AUTO_INCREMENT PRIMARY KEY,
        member_id INT NOT NULL,
        request_number VARCHAR(20) UNIQUE NOT NULL,
        amount DECIMAL(15,2) NOT NULL,
        tenor INT NOT NULL,
        purpose TEXT NULL,
        type ENUM('MURABAHAH','QARDHUL_HASAN') DEFAULT 'MURABAHAH',
        status ENUM('PENDING','APPROVED','REJECTED','ACTIVE','PAID_OFF','DEFAULTED') DEFAULT 'PENDING',
        ai_score INT DEFAULT 0,
        max_approved_amount DECIMAL(15,2) NULL,
        approved_amount DECIMAL(15,2) NULL,
        approved_tenor INT NULL,
        rejection_reason TEXT NULL,
        reviewed_by INT NULL,
        reviewed_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
        INDEX idx_status (status), INDEX idx_member (member_id), INDEX idx_request_number (request_number)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    await connection.query(`INSERT INTO _migrations (filename) VALUES ('003')`);
  }

  // 004 - transactions
  if (!done.has('004')) {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        member_id INT NOT NULL,
        type ENUM('SETORAN_WAJIB','TARIK_TUNAI','BAYAR_ANGSURAN','TOP_UP','PENARIKAN_SALDO') NOT NULL,
        amount DECIMAL(15,2) NOT NULL,
        description TEXT NULL,
        reference_id VARCHAR(50) NULL,
        cashier_id INT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
        INDEX idx_member (member_id), INDEX idx_created (created_at), INDEX idx_type (type)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    await connection.query(`INSERT INTO _migrations (filename) VALUES ('004')`);
  }

  // 005 - role column
  if (!done.has('005')) {
    await addCol(connection, 'members', 'role', `ENUM('admin','member') DEFAULT 'member'`);
    await connection.query(`UPDATE members SET role = 'admin' WHERE id = 1`);
    await connection.query(`INSERT INTO _migrations (filename) VALUES ('005')`);
  }

  // 006 - invite_codes
  if (!done.has('006')) {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS invite_codes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(20) UNIQUE NOT NULL,
        created_by INT NOT NULL,
        valid_until DATE NOT NULL,
        max_uses INT DEFAULT 1,
        used_count INT DEFAULT 0,
        status ENUM('active','expired') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES members(id) ON DELETE CASCADE,
        INDEX idx_code (code), INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    await connection.query(`INSERT INTO _migrations (filename) VALUES ('006')`);
  }

  // 007 - created_by
  if (!done.has('007')) {
    await addCol(connection, 'members', 'created_by', 'INT NULL');
    if (!(await fkExists(connection, 'members', 'fk_member_creator'))) {
      await connection.query(
        `ALTER TABLE members ADD CONSTRAINT fk_member_creator FOREIGN KEY (created_by) REFERENCES members(id) ON DELETE SET NULL`
      );
    }
    await connection.query(`INSERT INTO _migrations (filename) VALUES ('007')`);
  }

  // 008 - indexes
  if (!done.has('008')) {
    await addIdx(connection, 'transactions', 'idx_created_date', '(created_at)');
    await addIdx(connection, 'members', 'idx_role_status', '(role, status)');
    await addIdx(connection, 'invite_codes', 'idx_status_expiry', '(status, valid_until)');
    await connection.query(`INSERT INTO _migrations (filename) VALUES ('008')`);
  }

  // 009 - AI features
  if (!done.has('009')) {
    await addCol(connection, 'members', 'monthly_income', 'DECIMAL(15,2) DEFAULT 0');
    await addCol(connection, 'members', 'tenure_months', 'INT DEFAULT 0');
    await addCol(connection, 'members', 'existing_loan_balance', 'DECIMAL(15,2) DEFAULT 0');
    await addCol(connection, 'members', 'has_collateral', 'BOOLEAN DEFAULT FALSE');
    await addCol(connection, 'loans', 'ai_recommendation', `ENUM('LAYAK','TIDAK_LAYAK') NULL`);
    await addCol(connection, 'loans', 'prob_default', 'DECIMAL(5,4) NULL');
    await addCol(connection, 'loans', 'risk_level', 'VARCHAR(20) NULL');
    await connection.query(`INSERT INTO _migrations (filename) VALUES ('009')`);
  }

  // 010 - AI loans (idempotent, kolom sudah dicek)
  if (!done.has('010')) {
    await addCol(connection, 'loans', 'ai_recommendation', `ENUM('LAYAK','TIDAK_LAYAK') NULL`);
    await addCol(connection, 'loans', 'prob_default', 'DECIMAL(5,4) NULL');
    await addCol(connection, 'loans', 'risk_level', 'VARCHAR(20) NULL');
    await connection.query(`INSERT INTO _migrations (filename) VALUES ('010')`);
  }

  // 011 - AI personal fields
  if (!done.has('011')) {
    await addCol(connection, 'members', 'code_gender', `ENUM('M','F') DEFAULT 'M'`);
    await addCol(connection, 'members', 'birth_date', 'DATE NULL');
    await addCol(connection, 'members', 'education', `VARCHAR(50) DEFAULT 'Secondary / secondary special'`);
    await addCol(connection, 'members', 'family_status', `VARCHAR(30) DEFAULT 'Married'`);
    await addCol(connection, 'members', 'income_type', `VARCHAR(50) DEFAULT 'Working'`);
    await addCol(connection, 'members', 'occupation', `VARCHAR(50) DEFAULT 'Laborers'`);
    await addCol(connection, 'members', 'own_car', 'BOOLEAN DEFAULT FALSE');
    await addCol(connection, 'members', 'own_realty', 'BOOLEAN DEFAULT TRUE');
    await addCol(connection, 'members', 'children_count', 'INT DEFAULT 0');
    await addCol(connection, 'members', 'family_members', 'INT DEFAULT 2');
    await addCol(connection, 'members', 'employed_days', 'INT DEFAULT -1825');
    await addCol(connection, 'members', 'last_phone_change_days', 'INT DEFAULT -180');
    await connection.query(`INSERT INTO _migrations (filename) VALUES ('011')`);
  }

  // 012 - loan AI fields
  if (!done.has('012')) {
    await addCol(connection, 'loans', 'amt_annuity', 'DECIMAL(15,2) NULL');
    await addCol(connection, 'loans', 'amt_goods_price', 'DECIMAL(15,2) NULL');
    await connection.query(`INSERT INTO _migrations (filename) VALUES ('012')`);
  }

  // 013 - notifications
  if (!done.has('013')) {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        member_id INT NOT NULL,
        title VARCHAR(100) NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
        INDEX idx_member (member_id), INDEX idx_read (is_read)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    await connection.query(`INSERT INTO _migrations (filename) VALUES ('013')`);
  }
  
    // 014 - pending_topups
  if (!done.has('014')) {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS pending_topups (
        id INT AUTO_INCREMENT PRIMARY KEY,
        member_id INT NOT NULL,
        order_id VARCHAR(50) UNIQUE NOT NULL,
        amount DECIMAL(15,2) NOT NULL,
        status ENUM('PENDING','SETTLED','FAILED','EXPIRED') DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
        INDEX idx_order (order_id), INDEX idx_member (member_id), INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    await connection.query(`INSERT INTO _migrations (filename) VALUES ('014')`);
  }

  // 015 - loan_installments
  if (!done.has('015')) {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS loan_installments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        loan_id INT NOT NULL,
        installment_number INT NOT NULL,
        amount DECIMAL(15,2) NOT NULL,
        due_date DATE NOT NULL,
        status ENUM('PENDING','PAID') DEFAULT 'PENDING',
        paid_at TIMESTAMP NULL,
        transaction_id INT NULL COMMENT 'ledger transaction that paid this',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uniq_loan_installment (loan_id, installment_number),
        FOREIGN KEY (loan_id) REFERENCES loans(id) ON DELETE CASCADE,
        INDEX idx_loan (loan_id), INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    await connection.query(`INSERT INTO _migrations (filename) VALUES ('015')`);
  }

   // 016 - pending_installment_payments
  if (!done.has('016')) {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS pending_installment_payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        member_id INT NOT NULL,
        loan_id INT NOT NULL,
        installment_id INT NOT NULL,
        order_id VARCHAR(60) UNIQUE NOT NULL,
        amount DECIMAL(15,2) NOT NULL,
        status ENUM('PENDING','SETTLED','FAILED','EXPIRED') DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
        FOREIGN KEY (installment_id) REFERENCES loan_installments(id) ON DELETE CASCADE,
        INDEX idx_order (order_id), INDEX idx_installment (installment_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    await connection.query(`INSERT INTO _migrations (filename) VALUES ('016')`);
  }

  // 017 - alter ai_recommendation ENUM to support PERLU_DIPERTIMBANGKAN
  if (!done.has('017')) {
    await connection.query(`
      ALTER TABLE loans 
      MODIFY COLUMN ai_recommendation ENUM('LAYAK', 'TIDAK_LAYAK', 'PERLU_DIPERTIMBANGKAN') NULL
    `);
    await connection.query(`INSERT INTO _migrations (filename) VALUES ('017')`);
  }

  // 018 - add vehicle_type and property_type to members table
  if (!done.has('018')) {
    await addCol(connection, 'members', 'vehicle_type', `VARCHAR(50) NULL`);
    await addCol(connection, 'members', 'property_type', `VARCHAR(50) NULL`);
    await connection.query(`INSERT INTO _migrations (filename) VALUES ('018')`);
  }
  
  // 019 - add TRANSFER to transactions type ENUM
  if (!done.has('019')) {
    await connection.query(`
      ALTER TABLE transactions 
      MODIFY COLUMN type ENUM('SETORAN_WAJIB','TARIK_TUNAI','BAYAR_ANGSURAN','TOP_UP','PENARIKAN_SALDO','TRANSFER') NOT NULL
    `);
    await connection.query(`INSERT INTO _migrations (filename) VALUES ('019')`);
  }

  await connection.end();
}
