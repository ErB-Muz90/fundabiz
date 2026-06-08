'use client';

import { clsx } from 'clsx';
import { Lock, Unlock, Check } from 'lucide-react';
import { formatCurrency } from '@/lib/format';

interface Tranche {
  id: string;
  name: string;
  amount: number;
  status: 'locked' | 'disbursed' | 'unlocked';
  condition?: string;
  disbursedAt?: string;
}

interface TrancheProgressCardProps {
  tranches: Tranche[];
}

const statusConfig = {
  locked: { icon: Lock, bg: 'bg-gray-100', text: 'text-gray-400', border: 'border-gray-200', label: 'Locked' },
  unlocked: { icon: Unlock, bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-200', label: 'Unlocked' },
  disbursed: { icon: Check, bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200', label: 'Disbursed' },
};

export function TrancheProgressCard({ tranches }: TrancheProgressCardProps) {
  const disbursedCount = tranches.filter((t) => t.status === 'disbursed').length;
  const totalCount = tranches.length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Tranche Progress</h3>
        <span className="text-xs text-gray-500">{disbursedCount}/{totalCount} disbursed</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-brand-600 h-2 rounded-full transition-all"
          style={{ width: `${(disbursedCount / totalCount) * 100}%` }}
        />
      </div>

      <div className="space-y-3">
        {tranches.map((tranche, index) => {
          const config = statusConfig[tranche.status];
          const Icon = config.icon;

          return (
            <div
              key={tranche.id}
              className={clsx('flex items-center gap-3 p-3 rounded-lg border', config.border, config.bg)}
            >
              <div className={clsx('p-1.5 rounded-full', config.text)}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={clsx('text-sm font-medium', config.text)}>{tranche.name}</p>
                  <p className={clsx('text-sm font-semibold', config.text)}>{formatCurrency(tranche.amount)}</p>
                </div>
                {tranche.condition && (
                  <p className="text-xs text-gray-500 mt-0.5">{tranche.condition}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
