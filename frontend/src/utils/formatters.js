// frontend/src/utils/formatters.js
export const formatCurrency = (amount) => {
  // Konversi ke number dengan aman
  let numericAmount = 0;
  if (amount !== undefined && amount !== null) {
    numericAmount = Number(amount);
    if (isNaN(numericAmount)) numericAmount = 0;
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericAmount);
};

export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID');
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleString('id-ID');
};

export const formatPhoneToWaLink = (phone) => {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
};
