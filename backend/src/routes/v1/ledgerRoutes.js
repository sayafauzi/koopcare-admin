import { Router } from 'express';
import { getLedger, exportLedgerCSV } from '../../controllers/ledgerController.js';
import authMiddleware from '../../middlewares/authMiddleware.js';

const router = Router();
// router.use(authMiddleware);

router.get('/', getLedger);
router.get('/export', exportLedgerCSV);

export default router;