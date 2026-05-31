import React, { useId } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const Select = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Pilih',
  error,
  required = false,
  disabled = false,
  className = '',
}) => {
  const id = useId();

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-medium text-neutral-600 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full appearance-none rounded-lg border px-3 py-1.5 text-sm
            transition-all duration-150
            focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
            disabled:bg-neutral-100 disabled:cursor-not-allowed
            ${error ? 'border-red-500 bg-red-50' : 'border-neutral-300 bg-white'}
          `}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Select;