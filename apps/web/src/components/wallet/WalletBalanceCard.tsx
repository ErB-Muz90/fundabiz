'use client';

import { useEffect, useState } from 'react';
import { Wallet, Eye, EyeOff } from 'lucide-react';
import { formatCurrency } from '@/lib/format';

interface WalletBalanceCardProps {
  balance: number;
  isLoading?: boolean;
}

export function WalletBalanceCard({ balance, isLoading }: WalletBalanceCardProps) {
  const [showBalance, setShowBalance] = useState(true);
  const [animatedBalance, setAnimatedBalance] = useState(0);

  useEffect(() => {
    if (balance === 0) return;
    const duration = 1000;
    const steps = 60;
    const increment = balance / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= balance) {
        setAnimatedBalance(balance);
        clearInterval(timer);
      } else {
        setAnimatedBalance(current);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [balance]);

  const displayBalance = showBalance ? animatedBalance : 0;

  return (
    <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl p-6 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            <span className="text-sm font-medium text-white/80">Wallet Balance</span>
          </div>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-1.5 rounded-lg hover:bg-white/10"
          >
            {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {isLoading ? (
          <div className="h-10 w-48 bg-white/20 rounded animate-pulse" />
        ) : (
          <p className="text-3xl font-bold tracking-tight">
            {showBalance ? formatCurrency(displayBalance) : 'KSh ••••••'}
          </p>
        )}

        <p className="text-sm text-white/60 mt-1">Available for transactions</p>
      </div>
    </div>
  );
}
