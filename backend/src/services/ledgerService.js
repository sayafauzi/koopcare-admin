import * as transactionModel from '../models/TransactionModel.js';

export const getTransactions = async (page, limit, filters) => {
  const offset = (page - 1) * limit;
  return await transactionModel.findAllWithFilters(filters, limit, offset);
};

export const getSummary = async (filters) => {
  return await transactionModel.getInflowOutflow(filters);
};