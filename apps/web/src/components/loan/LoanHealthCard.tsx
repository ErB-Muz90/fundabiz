'use client';

import { clsx } from 'clsx';
import { ProgressRing } from '@/components/shared/ProgressRing';
import { formatCurrency } from '@/lib/format';

interface LoanHealthCardProps {
  health: 'on_track' | 'at_risk' | 'defaulted';
  totalRepaid: number;
  totalDue: number;
  nextPaymentDate?: string;
  nextPaymentAmount?: number;
}

const healthConfig = {
  on_track: { label: 'On Track', color: '#059669', bg: 'bg-green-50 border-green-200', text: 'text-green-700', progressColor: '#059669' },
  at_risk: { label: 'At Risk', color: '#d97706', bg: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-700', progressColor: '#d97706' },
  defaulted: { label: 'Defaulted', color: '#dc2626', bg: 'bg-red-50 border-red-200', text: 'text-red-700', progressColor: '#dc2626' },
};

export function LoanHealthCard({ health, totalRepaid, totalDue, nextPaymentDate, nextPaymentAmount }: LoanHealthCardProps) {
  const config = healthConfig[health];
  const progress = totalDue > 0 ? Math.round((totalRepaid / totalDue) * 100) : 0;

  return (
    <div className={clsx('rounded-xl border p-6', config.bg)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">Loan Health</p>
          <p className={clsx('text-lg font-bold mt-1', config.text)}>{config.label}</p>
        </div>
        <ProgressRing progress={progress} size={80} strokeWidth={6} color={config.progressColor} label="Repaid" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500">Repaid</p>
          <p className="text-sm font-semibold text-gray-900">{formatCurrency(totalRepaid)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Total Due</p>
          <p className="text-sm font-semibold text-gray-900">{formatCurrency(totalDue)}</p>
        </div>
      </div>

      {nextPaymentDate && nextPaymentAmount && (
        <div className="mt-3 p-3 bg-white/60 rounded-lg">
          <p className="text-xs text-gray-500">Next Payment</p>
          <p className="text-sm font-semibold text-gray-900">{formatCurrency(nextPaymentAmount)}</p>
          <p className="text-xs text-gray-400">Due {nextPaymentDate}</p>
        </div>
      )}
    </div>
  );
}
