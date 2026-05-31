// backend/src/utils/csvExporter.js
export const exportToCSV = (data, columns) => {
  if (!data || data.length === 0) return '';

  const escapeValue = (value) => {
    if (value === undefined || value === null) return '';
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const header = columns.join(',');
  const rows = data.map(row => {
    return columns.map(col => escapeValue(row[col])).join(',');
  }).join('\n');

  return `${header}\n${rows}`;
};