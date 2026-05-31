import { Router } from 'express';
import { login, forgotPin, resetPin, registerAdmin } from '../../controllers/authController.js';

const router = Router();

router.post('/login', login);
router.post('/forgot-pin', forgotPin);
router.post('/reset-pin', resetPin);
router.post('/register-admin', registerAdmin); 

export default router;