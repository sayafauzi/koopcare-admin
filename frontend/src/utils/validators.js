export const isValidNIK = (nik) => /^\d{16}$/.test(nik);
export const isValidPhone = (phone) => /^(\+62|0)[0-9]{9,13}$/.test(phone);
export const isValidNominal = (amount) => { const num = Number(amount); return !isNaN(num) && num > 0 && Number.isInteger(num); };