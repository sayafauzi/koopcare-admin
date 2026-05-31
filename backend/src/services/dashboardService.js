import pool from '../config/database.js';

export const getDashboardStats = async () => {
  const [assetRows] = await pool.query('SELECT COALESCE(SUM(balance), 0) as total_assets FROM members WHERE status = "ACTIVE"');
  const [loanRows] = await pool.query('SELECT COALESCE(SUM(approved_amount), 0) as total_active_loans FROM loans WHERE status = "ACTIVE"');
  const [memberRows] = await pool.query('SELECT COUNT(*) as active_members FROM members WHERE status = "ACTIVE"');
  const [delinquentRows] = await pool.query('SELECT COUNT(DISTINCT member_id) as delinquent_members FROM loans WHERE status = "DEFAULTED"');
  const [growthRows] = await pool.query(`
    SELECT 
      (SELECT COUNT(*) FROM members WHERE MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE())) as this_month,
      (SELECT COUNT(*) FROM members WHERE MONTH(created_at) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) AND YEAR(created_at) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))) as last_month
  `);
  const thisMonth = growthRows[0]?.this_month || 0;
  const lastMonth = growthRows[0]?.last_month || 1;
  const monthlyGrowth = ((thisMonth - lastMonth) / lastMonth) * 100;
  const [newMemberRows] = await pool.query('SELECT COUNT(*) as new_members FROM members WHERE MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE())');
  const [savingsRows] = await pool.query('SELECT COALESCE(SUM(balance), 0) as total_savings FROM members WHERE status = "ACTIVE"');
  return {
    totalAssets: assetRows[0].total_assets,
    activeLoans: loanRows[0].total_active_loans,
    activeMembers: memberRows[0].active_members,
    delinquentMembers: delinquentRows[0].delinquent_members,
    monthlyGrowth: parseFloat(monthlyGrowth.toFixed(2)),
    newMembersThisMonth: newMemberRows[0].new_members,
    totalSavings: savingsRows[0].total_savings,
  };
};

export const getRecentLoans = async (limit = 5) => {
  const [rows] = await pool.query(`
    SELECT l.id, l.request_number, m.full_name as member_name, l.amount, l.status, l.created_at
    FROM loans l
    JOIN members m ON l.member_id = m.id
    ORDER BY l.created_at DESC
    LIMIT ?
  `, [limit]);
  return rows;
};

export const getWeeklyActivity = async () => {
  const [rows] = await pool.query(`
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as total_transactions,
      SUM(CASE WHEN type IN ('SETORAN_WAJIB', 'TOP_UP') THEN amount ELSE 0 END) as inflow,
      SUM(CASE WHEN type IN ('TARIK_TUNAI', 'BAYAR_ANGSURAN', 'PENARIKAN_SALDO') THEN amount ELSE 0 END) as outflow
    FROM transactions
    WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `);
  const labels = [];
  const inflows = [];
  const outflows = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().slice(0,10);
    labels.push(dateStr.slice(5));
    const found = rows.find(r => r.date.toISOString().slice(0,10) === dateStr);
    inflows.push(found ? Number(found.inflow) : 0);
    outflows.push(found ? Number(found.outflow) : 0);
  }
  return { labels, inflows, outflows };
};

export const getActivityByPeriod = async (period) => {
  let interval = '';
  let groupFormat = '';
  let dateFormat = '';
  let limit = 0;

  switch (period) {
    case 'Minggu ini':
      interval = 'INTERVAL 6 DAY';
      groupFormat = '%Y-%m-%d';
      dateFormat = '%d %b';
      limit = 7;
      break;
    case 'Bulan ini':
      interval = 'INTERVAL 29 DAY';
      groupFormat = '%Y-%m-%d';
      dateFormat = '%d %b';
      limit = 30;
      break;
    case 'Tahun ini':
      interval = 'INTERVAL 11 MONTH';
      groupFormat = '%Y-%m';
      dateFormat = '%b %Y';
      limit = 12;
      break;
    default:
      interval = 'INTERVAL 6 DAY';
      groupFormat = '%Y-%m-%d';
      dateFormat = '%d %b';
      limit = 7;
  }

  const query = `
    SELECT 
      DATE_FORMAT(created_at, '${groupFormat}') as period_key,
      DATE_FORMAT(created_at, '${dateFormat}') as period_label,
      SUM(CASE WHEN type IN ('SETORAN_WAJIB', 'TOP_UP') THEN amount ELSE 0 END) as inflow,
      SUM(CASE WHEN type IN ('TARIK_TUNAI', 'BAYAR_ANGSURAN', 'PENARIKAN_SALDO') THEN amount ELSE 0 END) as outflow
    FROM transactions
    WHERE created_at >= DATE_SUB(CURDATE(), ${interval})
    GROUP BY period_key
    ORDER BY period_key ASC
  `;

  const [rows] = await pool.query(query);
  return generatePeriodSeries(period, rows, limit);
};

function generatePeriodSeries(period, data, limit) {
  const labels = [];
  const inflows = [];
  const outflows = [];
  const now = new Date();

  if (period === 'Minggu ini' || period === 'Bulan ini') {
    for (let i = limit - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      const key = date.toISOString().slice(0, 10);
      const label = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      labels.push(label);
      const found = data.find(d => d.period_key === key);
      inflows.push(found ? Number(found.inflow) : 0);
      outflows.push(found ? Number(found.outflow) : 0);
    }
  } else if (period === 'Tahun ini') {
    for (let i = limit - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
      labels.push(label);
      const found = data.find(d => d.period_key === key);
      inflows.push(found ? Number(found.inflow) : 0);
      outflows.push(found ? Number(found.outflow) : 0);
    }
  }
  return { labels, inflows, outflows };
}