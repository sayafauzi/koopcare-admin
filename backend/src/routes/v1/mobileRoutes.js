import { Router } from 'express';
import mobileAuth from '../../middlewares/mobileAuth.js';
import * as mobileController from '../../controllers/mobileController.js';
import { uploadKyc } from '../../config/cloudinary.js';
import {
  createTopup,
  getTopupStatus,
  createInstallmentPayment,
  getInstallmentPaymentStatus,
} from '../../controllers/paymentController.js';

const router = Router();

// Public (tanpa auth)
router.post('/register', mobileController.registerMember);
router.post('/otp/request', mobileController.requestOtp);
router.post('/otp/verify', mobileController.verifyOtp);
router.post('/login', mobileController.mobileLogin);
router.post('/reset-pin', mobileController.mobileResetPin);

// Protected (perlu auth)
router.use(mobileAuth);
router.get('/profile', mobileController.getProfile);
router.put('/profile', mobileController.updateProfile);

// KYC submit: multipart/form-data dengan field ktp_photo dan selfie_photo
router.post(
    '/kyc/submit',
    uploadKyc.fields([
        { name: 'ktp_photo', maxCount: 1 },
        { name: 'selfie_photo', maxCount: 1 },
    ]),
    mobileController.submitKyc
);

router.get('/kyc/status', mobileController.getKycStatus);
router.get('/loans', mobileController.getMemberLoans);
router.post('/loans/apply', mobileController.applyLoan);
router.get('/loans/:id', mobileController.getLoanDetailMember);
router.get('/transactions', mobileController.getMemberTransactions);
router.get('/notifications', mobileController.getNotifications);
router.get('/notifications/unread-count', mobileController.getUnreadNotificationCount);
router.patch('/notifications/:id/read', mobileController.markNotificationRead);
router.patch('/notifications/read-all', mobileController.markAllNotificationsRead);
router.post('/topup', mobileController.createTopup);
router.get('/topup/:order_id/status', mobileController.getTopupStatus);
router.get('/loans/:id/installments', mobileController.getLoanInstallments);
router.post('/loans/:loanId/installments/:installmentId/pay-balance', mobileController.payInstallmentFromBalance);
router.post('/loans/:loanId/installments/:installmentId/pay-midtrans',createInstallmentPayment);
router.get('/loans/:loanId/installments/:installmentId/payment-status',getInstallmentPaymentStatus);
router.post('/transfer', mobileController.executeTransfer);

export default router;