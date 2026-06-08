'use client';

import { clsx } from 'clsx';

interface EscrowBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const statusStyles: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  hold: 'bg-blue-100 text-blue-700 border-blue-200',
  released: 'bg-green-100 text-green-700 border-green-200',
  disputed: 'bg-red-100 text-red-700 border-red-200',
  completed: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-gray-100 text-gray-500 border-gray-200',
};

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  hold: 'In Escrow',
  released: 'Released',
  disputed: 'Disputed',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export function EscrowBadge({ status, size = 'md' }: EscrowBadgeProps) {
  const normalized = status.toLowerCase();
  const style = statusStyles[normalized] || statusStyles.pending;
  const label = statusLabels[normalized] || status;

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border font-medium',
        size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
        style
      )}
    >
      {label}
    </span>
  );
}
