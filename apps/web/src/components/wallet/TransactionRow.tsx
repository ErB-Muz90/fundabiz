'use client';

import { clsx } from 'clsx';
import { ArrowUpRight, ArrowDownLeft, Wallet, Landmark, RefreshCw, Shield } from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/lib/format';
import { Badge } from '@/components/shared/Badge';

interface TransactionRowProps {
  type: string;
  description: string;
  amount: number;
  direction: 'in' | 'out';
  status: string;
  createdAt: string;
}

const typeIcons: Record<string, React.ElementType> = {
  payment: ArrowUpRight,
  disbursement: Landmark,
  repayment: ArrowDownLeft,
  transfer: RefreshCw,
  escrow_release: Shield,
  escrow_hold: Shield,
  withdrawal: ArrowUpRight,
  deposit: ArrowDownLeft,
};

export function TransactionRow({ type, description, amount, direction, status, createdAt }: TransactionRowProps) {
  const Icon = typeIcons[type] || Wallet;
  const isInflow = direction === 'in';
  const isPending = status === 'pending';

  return (
    <div className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className={clsx(
        'p-2 rounded-lg',
        isInflow ? 'bg-green-50' : 'bg-red-50'
      )}>
        <Icon className={clsx(
          'w-4 h-4',
          isInflow ? 'text-green-600' : 'text-red-600'
        )} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{description}</p>
        <p className="text-xs text-gray-500">{formatDateTime(createdAt)}</p>
      </div>
      <div className="text-right">
        <p className={clsx(
          'text-sm font-semibold',
          isInflow ? 'text-green-600' : 'text-red-600',
          isPending && 'opacity-50'
        )}>
          {isInflow ? '+' : '-'}{formatCurrency(amount)}
        </p>
        {isPending && <Badge variant="warning" size="sm">Pending</Badge>}
      </div>
    </div>
  );
}
