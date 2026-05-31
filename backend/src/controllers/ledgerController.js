import * as ledgerService from '../services/ledgerService.js';
import { exportToCSV } from '../utils/csvExporter.js';

export const getLedger = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filters = {
      startDate: req.query.startDate || null,
      endDate: req.query.endDate || null,
      type: req.query.type || null,
      memberId: req.query.memberId || null,
    };
    const { data, total } = await ledgerService.getTransactions(page, limit, filters);
    const summary = await ledgerService.getSummary(filters);
    res.json({
      success: true,
      data,
      summary,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const exportLedgerCSV = async (req, res, next) => {
  try {
    const filters = {
      startDate: req.query.startDate || null,
      endDate: req.query.endDate || null,
      type: req.query.type || null,
      memberId: req.query.memberId || null,
    };
    // Ambil semua data tanpa batas (max 10000)
    const { data } = await ledgerService.getTransactions(1, 10000, filters);
    const csv = exportToCSV(data, [
      'created_at', 'type', 'amount', 'member_name', 'description', 'reference_id'
    ]);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=ledger.csv');
    res.send(csv);
  } catch (err) {
    next(err);
  }
};