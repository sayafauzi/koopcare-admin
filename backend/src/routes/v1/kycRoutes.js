import { Router } from 'express';
import { getKycList, getKycDetail, approveKyc, rejectKyc } from '../../controllers/kycController.js';
import authMiddleware from '../../middlewares/authMiddleware.js';

const router = Router();
// router.use(authMiddleware);

router.get('/', getKycList);
router.get('/:id', getKycDetail);
router.post('/:id/approve', approveKyc);
router.post('/:id/reject', rejectKyc);

export default router;