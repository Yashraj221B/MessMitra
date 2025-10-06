import type { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

export default function Card({
  children,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  className = '',
  ...props
}: CardProps) {
  const baseStyles = 'bg-white rounded-2xl transition-all';
  
  const variantStyles = {
    default: 'shadow-xl border border-slate-100',
    elevated: 'shadow-2xl',
    outlined: 'border-2 border-slate-200 shadow-sm',
  };

  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-8',
    lg: 'p-10',
  };

  const hoverStyles = hoverable ? 'hover:shadow-2xl hover:-translate-y-1 cursor-pointer' : '';

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
