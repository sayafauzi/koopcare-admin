// frontend/src/components/ui/Button.jsx
import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon: Icon = null,
  className = '',
}) => {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-primary-700 text-white shadow-sm hover:bg-primary-800 active:bg-primary-900 focus:ring-primary-500',
    secondary:
      'bg-neutral-100 text-neutral-700 border border-neutral-300 hover:bg-neutral-200 active:bg-neutral-300 focus:ring-neutral-400',
    outline:
      'border border-primary-600 bg-transparent text-primary-700 hover:bg-primary-50 active:bg-primary-100 focus:ring-primary-500',
    danger:
      'bg-error text-white shadow-sm hover:bg-red-700 active:bg-red-800 focus:ring-red-500',
    ghost:
      'text-neutral-600 hover:bg-neutral-100 active:bg-neutral-200 focus:ring-neutral-300',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  const combinedClassName = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={combinedClassName}
    >
      {loading && (
        <svg
          className="h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {Icon && !loading && <Icon className="h-4 w-4" />}
      {children}
    </button>
  );
};

export default Button;