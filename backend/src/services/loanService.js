// backend/src/services/loanService.js
import * as loanModel from '../models/LoanModel.js';

export const getAllLoans = async (page, limit, status) => {
  const offset = (page - 1) * limit;
  const { data, total } = await loanModel.findAll(limit, offset, status);
  return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

export const getLoanDetail = async (id) => {
  const loan = await loanModel.findById(id);
  if (!loan) throw new Error('Pengajuan pinjaman tidak ditemukan');
  return loan;
};

export const approveLoan = async (id, reviewerId, approvedAmount, approvedTenor) => {
  const loan = await loanModel.findById(id);
  if (!loan) throw new Error('Pengajuan tidak ditemukan');
  if (loan.status !== 'PENDING') throw new Error('Pengajuan sudah diproses');
  await loanModel.updateStatus(id, 'APPROVED', reviewerId, approvedAmount, approvedTenor);
  return true;
};

export const rejectLoan = async (id, reviewerId, reason) => {
  const loan = await loanModel.findById(id);
  if (!loan) throw new Error('Pengajuan tidak ditemukan');
  if (loan.status !== 'PENDING') throw new Error('Pengajuan sudah diproses');
  await loanModel.updateStatus(id, 'REJECTED', reviewerId, null, null, reason);
  return true;
};