import { Router } from 'express';
import { getTodayTransactions, createTransaction } from '../../controllers/cashierController.js';
import authMiddleware from '../../middlewares/authMiddleware.js';

const router = Router();
// router.use(authMiddleware);

router.get('/today', getTodayTransactions);
router.post('/', createTransaction);

export default router;