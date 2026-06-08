'use client';

import { clsx } from 'clsx';
import { formatCurrency, formatDate } from '@/lib/format';
import { Badge } from '@/components/shared/Badge';

interface RepaymentScheduleItem {
  id: string;
  dueDate: string;
  amount: number;
  principal: number;
  interest: number;
  status: 'pending' | 'paid' | 'overdue' | 'partial';
  paidAmount?: number;
  paidAt?: string;
}

interface RepaymentScheduleTableProps {
  schedule: RepaymentScheduleItem[];
}

export function RepaymentScheduleTable({ schedule }: RepaymentScheduleTableProps) {
  const statusVariant = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'overdue': return 'danger';
      case 'partial': return 'warning';
      default: return 'info';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900">Repayment Schedule</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Due Date</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Total</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Principal</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Interest</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {schedule.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
                  No repayment schedule available
                </td>
              </tr>
            ) : (
              schedule.map((item) => (
                <tr key={item.id} className={clsx(item.status === 'overdue' && 'bg-red-50/50')}>
                  <td className="px-4 py-3 text-sm text-gray-700">{formatDate(item.dueDate)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">{formatCurrency(item.amount)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{formatCurrency(item.principal)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{formatCurrency(item.interest)}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={statusVariant(item.status)} size="sm">
                      {item.status === 'partial' && item.paidAmount
                        ? `Partial (${formatCurrency(item.paidAmount)})`
                        : item.status}
                    </Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
