'use client';

import { WalletBalanceCard } from '@/components/wallet/WalletBalanceCard';
import { TransactionLedger } from '@/components/wallet/TransactionLedger';
import { StatCard } from '@/components/shared/StatCard';
import { ArrowLeftRight, DollarSign } from 'lucide-react';

const transactions = [
  { id: '1', type: 'escrow_release', description: 'Escrow Release - ORD-2024-089', amount: 45000, direction: 'in' as const, status: 'completed', createdAt: '2024-03-15T10:30:00Z' },
  { id: '2', type: 'withdrawal', description: 'Bank Transfer - Withdrawal', amount: 100000, direction: 'out' as const, status: 'completed', createdAt: '2024-03-14T14:00:00Z' },
  { id: '3', type: 'escrow_release', description: 'Escrow Release - ORD-2024-056', amount: 32000, direction: 'in' as const, status: 'completed', createdAt: '2024-03-10T09:15:00Z' },
];

export default function SupplierWalletPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Wallet</h1><p className="text-sm text-gray-500 mt-1">Manage your earnings</p></div>
        <button className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-700">
          <DollarSign className="w-4 h-4" /> Withdraw
        </button>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <WalletBalanceCard balance={340000} />
          <div className="mt-4 space-y-2">
            <StatCard title="Total Withdrawn" value="KSh 1.2M" icon={<ArrowLeftRight className="w-6 h-6" />} />
          </div>
        </div>
        <div className="lg:col-span-2">
          <TransactionLedger transactions={transactions} />
        </div>
      </div>
    </div>
  );
}
