'use client';

import { WalletBalanceCard } from '@/components/wallet/WalletBalanceCard';
import { LoanHealthCard } from '@/components/loan/LoanHealthCard';
import { StatCard } from '@/components/shared/StatCard';
import { ShoppingCart, Truck, TrendingUp } from 'lucide-react';

export default function SMEOverviewPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Dashboard</h1><p className="text-sm text-gray-500 mt-1">Welcome back, John!</p></div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WalletBalanceCard balance={125000} />
        </div>
        <LoanHealthCard health="on_track" totalRepaid={125000} totalDue={250000} nextPaymentDate="2024-04-15" nextPaymentAmount={12500} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Active Orders" value="3" icon={<ShoppingCart className="w-6 h-6" />} />
        <StatCard title="Verified Suppliers" value="24" icon={<Truck className="w-6 h-6" />} trend="up" trendValue="+3 new" />
        <StatCard title="Monthly Sales" value="KSh 180K" icon={<TrendingUp className="w-6 h-6" />} trend="up" trendValue="+12.5%" />
      </div>
    </div>
  );
}
