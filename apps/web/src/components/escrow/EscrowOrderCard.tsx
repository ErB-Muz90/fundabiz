'use client';

import { clsx } from 'clsx';
import { Shield, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/format';

interface EscrowOrderCardProps {
  id: string;
  orderNumber: string;
  amount: number;
  status: string;
  escrowStatus: string;
  supplierName: string;
  supplierId: string;
  createdAt: string;
  onView?: () => void;
}

const statusConfig: Record<string, { color: string; bg: string; icon: React.ElementType; label: string }> = {
  pending: { color: 'text-yellow-600', bg: 'bg-yellow-50', icon: Clock, label: 'Pending' },
  accepted: { color: 'text-blue-600', bg: 'bg-blue-50', icon: Shield, label: 'Accepted' },
  dispatched: { color: 'text-purple-600', bg: 'bg-purple-50', icon: Truck, label: 'Dispatched' },
  delivered: { color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle, label: 'Delivered' },
  completed: { color: 'text-green-700', bg: 'bg-green-50', icon: CheckCircle, label: 'Completed' },
  cancelled: { color: 'text-red-600', bg: 'bg-red-50', icon: XCircle, label: 'Cancelled' },
  disputed: { color: 'text-red-600', bg: 'bg-red-50', icon: XCircle, label: 'Disputed' },
};

export function EscrowOrderCard({
  orderNumber,
  amount,
  status,
  escrowStatus,
  supplierName,
  createdAt,
  onView,
}: EscrowOrderCardProps) {
  const config = statusConfig[escrowStatus] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onView}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={clsx('p-2 rounded-lg', config.bg)}>
            <Icon className={clsx('w-5 h-5', config.color)} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{orderNumber}</p>
            <p className="text-xs text-gray-500 mt-0.5">{supplierName}</p>
            <p className="text-xs text-gray-400 mt-0.5">{createdAt}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-gray-900">{formatCurrency(amount)}</p>
          <span className={clsx('inline-block px-2 py-0.5 mt-1 text-xs font-medium rounded-full', config.bg, config.color)}>
            {config.label}
          </span>
        </div>
      </div>
    </div>
  );
}
