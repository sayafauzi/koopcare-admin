import { Router } from 'express';
import {
    getInviteCodes,
    getInviteCodeDetail,
    createInviteCode,
    revokeInviteCode,
    extendInviteCodeValidity
} from '../../controllers/inviteCodeController.js';
import authMiddleware from '../../middlewares/authMiddleware.js';
import { adminOnly } from '../../middlewares/roleMiddleware.js';

const router = Router();
router.use(authMiddleware, adminOnly);

router.get('/invite-codes', getInviteCodes);
router.get('/invite-codes/:id', getInviteCodeDetail);
router.post('/invite-codes', createInviteCode);
router.patch('/invite-codes/:id/revoke', revokeInviteCode);
router.patch('/invite-codes/:id/extend', extendInviteCodeValidity);

export default router;