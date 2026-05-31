import React from 'react';

const Input = ({ label, type = 'text', value, onChange, error, placeholder, required = false, className = '' }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && <label className="block text-sm font-medium text-neutral-700 mb-1">{label} {required && <span className="text-error">*</span>}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${error ? 'border-error' : 'border-neutral-300'}`}
      />
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
};
export default Input;