// backend/src/routes/v1/memberRoutes.js
import { Router } from 'express';
import { getMembers, getMemberById, resetMemberPin, toggleMemberStatus } from '../../controllers/memberController.js';
import authMiddleware from '../../middlewares/authMiddleware.js';

const router = Router();
// router.use(authMiddleware); 

router.get('/', getMembers);
router.get('/:id', getMemberById);
router.post('/:id/reset-pin', resetMemberPin);
router.patch('/:id/toggle-status', toggleMemberStatus);

export default router;