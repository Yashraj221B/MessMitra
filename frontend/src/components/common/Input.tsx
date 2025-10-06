import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: LucideIcon;
  variant?: 'default' | 'primary' | 'blue';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon: Icon, variant = 'default', className = '', ...props }, ref) => {
    const variantStyles = {
      default: 'focus:ring-primary-500',
      primary: 'focus:ring-primary-500',
      blue: 'focus:ring-blue-500',
    };

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={props.id} className="block text-sm font-medium text-slate-700 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <input
            ref={ref}
            className={`w-full ${Icon ? 'pl-10' : ''} px-4 py-3 border-2 ${
              error ? 'border-red-500 focus:ring-red-500' : 'border-slate-200'
            } rounded-xl focus:ring-2 ${variantStyles[variant]} focus:border-${variantStyles[variant].includes('primary') ? 'primary' : 'blue'}-500 outline-none transition-all bg-white text-slate-800 ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-xs text-slate-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
