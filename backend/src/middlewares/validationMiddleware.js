import { body, param, validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validateRejectKyc = [
  param('id').isInt().withMessage('ID harus angka'),
  body('notes').optional().isString().trim(),
  validate
];