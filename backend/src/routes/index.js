import { Router } from 'express';
import authRoutes from './v1/authRoutes.js';
import memberRoutes from './v1/memberRoutes.js';
import kycRoutes from './v1/kycRoutes.js';
import loanRoutes from './v1/loanRoutes.js';
import cashierRoutes from './v1/cashierRoutes.js';
import ledgerRoutes from './v1/ledgerRoutes.js';
import dashboardRoutes from './v1/dashboardRoutes.js';
import adminRoutes from './v1/adminRoutes.js';
import publicRoutes from './v1/publicRoutes.js';
import mobileRoutes from './v1/mobileRoutes.js';

const router = Router();
router.use('/public', publicRoutes);
router.use('/admin', adminRoutes);
router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/members', memberRoutes);
router.use('/kyc', kycRoutes);
router.use('/loans', loanRoutes);
router.use('/cashier', cashierRoutes);
router.use('/ledger', ledgerRoutes);
router.use('/mobile', mobileRoutes);

export default router;