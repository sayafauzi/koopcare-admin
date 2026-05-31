export const validateNIK = (nik) => {
  if (!nik) return false;
  const nikStr = nik.toString();
  return /^\d{16}$/.test(nikStr);
};

export const validatePhone = (phone) => {
  if (!phone) return false;
  const phoneStr = phone.toString();
  // Format: +62xxxxxxxx atau 08xxxxxxxx
  return /^(\+62|0)[0-9]{9,13}$/.test(phoneStr);
};

export const validateNominal = (amount) => {
  const num = Number(amount);
  return !isNaN(num) && num > 0 && Number.isInteger(num);
};

export const validatePin = (pin) => {
  if (!pin) return false;
  const pinStr = pin.toString();
  return /^\d{6}$/.test(pinStr);
};

export const validateEmail = (email) => {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};