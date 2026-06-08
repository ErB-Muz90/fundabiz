'use client';

import { clsx } from 'clsx';

interface LoadingSkeletonProps {
  variant?: 'text' | 'card' | 'table' | 'circle';
  count?: number;
  height?: number;
  className?: string;
}

export function LoadingSkeleton({ variant = 'text', count = 1, height, className }: LoadingSkeletonProps) {
  const items = Array.from({ length: count });

  if (variant === 'card') {
    return (
      <div className={clsx('grid gap-4', className)}>
        {items.map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
            <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className={clsx('bg-white rounded-xl border border-gray-200 overflow-hidden', className)}>
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
        </div>
        {items.map((_, i) => (
          <div key={i} className="p-4 border-b border-gray-100 last:border-0">
            <div className="flex gap-4">
              <div className="h-4 bg-gray-200 rounded flex-1 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'circle') {
    return (
      <div className={clsx('flex gap-2', className)}>
        {items.map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 rounded-full animate-pulse"
            style={{ width: height || 40, height: height || 40 }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={clsx('space-y-2', className)}>
      {items.map((_, i) => (
        <div
          key={i}
          className="bg-gray-200 rounded animate-pulse"
          style={{ height: height || 16, width: `${Math.floor(Math.random() * 40 + 60)}%` }}
        />
      ))}
    </div>
  );
}
