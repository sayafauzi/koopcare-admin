import { Router } from 'express';
import { midtransNotification } from '../../controllers/paymentController.js';

const router = Router();
router.post('/midtrans/notification', midtransNotification);
export default router;