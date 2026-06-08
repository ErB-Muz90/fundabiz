'use client';

import { WalletBalanceCard } from '@/components/wallet/WalletBalanceCard';
import { TransactionLedger } from '@/components/wallet/TransactionLedger';
import { B2BTransferModal } from '@/components/wallet/B2BTransferModal';
import { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';

export default function SMEWalletPage() {
  const [showTransfer, setShowTransfer] = useState(false);

  const transactions = [
    { id: '1', type: 'payment', description: 'Order #ORD-2024-089 - Escrow Hold', amount: 45000, direction: 'out' as const, status: 'completed', createdAt: '2024-03-15T10:30:00Z' },
    { id: '2', type: 'repayment', description: 'Loan Repayment (15% of sales)', amount: 12500, direction: 'out' as const, status: 'completed', createdAt: '2024-03-14T14:00:00Z' },
    { id: '3', type: 'deposit', description: 'Customer Payment - Order #1234', amount: 85000, direction: 'in' as const, status: 'completed', createdAt: '2024-03-13T09:15:00Z' },
    { id: '4', type: 'escrow_release', description: 'Escrow Release - Order #ORD-2024-056', amount: 32000, direction: 'in' as const, status: 'completed', createdAt: '2024-03-12T16:45:00Z' },
    { id: '5', type: 'disbursement', description: 'Loan Disbursement - Tranche 1', amount: 125000, direction: 'in' as const, status: 'completed', createdAt: '2024-03-01T08:00:00Z' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Wallet</h1><p className="text-sm text-gray-500 mt-1">Manage your funds</p></div>
        <button onClick={() => setShowTransfer(true)} className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-700">
          <ArrowLeftRight className="w-4 h-4" /> B2B Transfer
        </button>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <WalletBalanceCard balance={125000} />
        </div>
        <div className="lg:col-span-2">
          <TransactionLedger transactions={transactions} />
        </div>
      </div>
      <B2BTransferModal open={showTransfer} onClose={() => setShowTransfer(false)} onTransfer={async () => {}} balance={125000} />
    </div>
  );
}
