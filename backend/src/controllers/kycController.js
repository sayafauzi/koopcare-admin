import * as kycService from '../services/kycService.js';
import * as notificationModel from '../models/NotificationModel.js';

export const getKycList = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || 'PENDING';
    const { data, total } = await kycService.getAllKyc(page, limit, status);
    res.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getKycDetail = async (req, res, next) => {
  try {
    const submission = await kycService.getKycDetail(req.params.id);
    res.json({ success: true, data: submission });
  } catch (err) {
    next(err);
  }
};

// export const approveKyc = async (req, res, next) => {
//   try {
//     // Jika req.user tidak ada, gunakan ID admin default (misal 1)
//     const reviewerId = req.user?.id || 1;
//     await kycService.approveKycSubmission(req.params.id, reviewerId);
//     res.json({ success: true, message: 'KYC disetujui' });
//   } catch (err) {
//     next(err);
//   }
// };

// export const rejectKyc = async (req, res, next) => {
//   try {
//     const { notes } = req.body;
//     const reviewerId = req.user?.id || 1; // fallback
//     await kycService.rejectKycSubmission(req.params.id, reviewerId, notes);
//     res.json({ success: true, message: 'KYC ditolak' });
//   } catch (err) {
//     next(err);
//   }
// };

export const approveKyc = async (req, res, next) => {
    try {
        const reviewerId = req.user?.id || 1;
        const submission = await kycService.getKycDetail(req.params.id); // ambil member_id
        await kycService.approveKycSubmission(req.params.id, reviewerId);
        // Kirim notifikasi ke anggota
        await notificationModel.create(submission.member_id, 'KYC Disetujui', 'Pengajuan KYC Anda telah disetujui. Sekarang Anda dapat mengajukan pinjaman.');
        res.json({ success: true, message: 'KYC disetujui' });
    } catch (err) { next(err); }
};

export const rejectKyc = async (req, res, next) => {
    try {
        const { notes } = req.body;
        const reviewerId = req.user?.id || 1;
        const submission = await kycService.getKycDetail(req.params.id);
        await kycService.rejectKycSubmission(req.params.id, reviewerId, notes);
        await notificationModel.create(submission.member_id, 'KYC Ditolak', `Pengajuan KYC ditolak. Alasan: ${notes || 'Tidak memenuhi syarat'}`);
        res.json({ success: true, message: 'KYC ditolak' });
    } catch (err) { next(err); }
};