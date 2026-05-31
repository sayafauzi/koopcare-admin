import * as dashboardService from '../services/dashboardService.js';

export const getDashboardData = async (req, res, next) => {
  try {
    const stats = await dashboardService.getDashboardStats();
    const recentLoans = await dashboardService.getRecentLoans(5);
    const activity = await dashboardService.getWeeklyActivity();
    res.json({ success: true, data: { stats, recentLoans, activity } });
  } catch (err) {
    next(err);
  }
};