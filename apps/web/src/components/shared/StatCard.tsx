'use client';

import { clsx } from 'clsx';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'flat';
  trendValue?: string;
  className?: string;
  onClick?: () => void;
}

export function StatCard({ title, value, icon, trend, trendValue, className, onClick }: StatCardProps) {
  const trendIcon = {
    up: <TrendingUp className="w-4 h-4 text-green-500" />,
    down: <TrendingDown className="w-4 h-4 text-red-500" />,
    flat: <Minus className="w-4 h-4 text-gray-400" />,
  };

  const trendColor = {
    up: 'text-green-600',
    down: 'text-red-600',
    flat: 'text-gray-500',
  };

  return (
    <div
      className={clsx(
        'bg-white rounded-xl border border-gray-200 p-6 shadow-sm transition-all hover:shadow-md',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && trendValue && (
            <div className="flex items-center gap-1 mt-1">
              {trendIcon[trend]}
              <span className={clsx('text-sm font-medium', trendColor[trend])}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-3 rounded-lg bg-brand-50 text-brand-600">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
