import { Router } from 'express';
import { validateInviteCode, useInviteCode } from '../../controllers/inviteCodeController.js';

const router = Router();

/**
 * GET /api/v1/public/invite-codes/validate/:code
 * Digunakan mobile untuk mengecek apakah kode valid dan masih aktif.
 * Response: { success, valid, message, record }
 */
router.get('/invite-codes/validate/:code', validateInviteCode);

/**
 * POST /api/v1/public/invite-codes/use/:code
 * Digunakan setelah registrasi berhasil untuk menandai bahwa kode sudah digunakan.
 * Response: { success, message, data }
 */
router.post('/invite-codes/use/:code', useInviteCode);

export default router;