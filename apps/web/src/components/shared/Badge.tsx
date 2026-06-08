'use client';

import { clsx } from 'clsx';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md';
}

const variantStyles: Record<string, string> = {
  default: 'bg-gray-100 text-gray-800 border-gray-200',
  success: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  danger: 'bg-red-100 text-red-800 border-red-200',
  info: 'bg-blue-100 text-blue-800 border-blue-200',
};

export function Badge({ variant = 'default', children, className, size = 'md' }: BadgeProps) {
  const sizeStyles = size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border font-medium',
        sizeStyles,
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
