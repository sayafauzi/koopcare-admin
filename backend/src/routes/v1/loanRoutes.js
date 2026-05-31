import { Router } from 'express';
import { getLoans, getLoanDetail, approveLoan, rejectLoan, createLoan } from '../../controllers/loanController.js';
import authMiddleware from '../../middlewares/authMiddleware.js';

const router = Router();
// router.use(authMiddleware);

router.get('/', getLoans);
router.get('/:id', getLoanDetail);
router.post('/', createLoan);
router.post('/:id/approve', approveLoan);
router.post('/:id/reject', rejectLoan);

export default router;