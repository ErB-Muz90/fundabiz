'use client';

import { StatCard } from '@/components/shared/StatCard';
import { ShoppingCart, ShieldCheck, Wallet, TrendingUp } from 'lucide-react';

export default function SupplierOverviewPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Dashboard</h1><p className="text-sm text-gray-500 mt-1">Welcome back, Western Wholesalers!</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Pending Orders" value="5" icon={<ShoppingCart className="w-6 h-6" />} trend="up" trendValue="+2 today" />
        <StatCard title="In Escrow" value="KSh 125,000" icon={<ShieldCheck className="w-6 h-6" />} />
        <StatCard title="Wallet Balance" value="KSh 340,000" icon={<Wallet className="w-6 h-6" />} trend="up" trendValue="+KSh 45K this week" />
        <StatCard title="Monthly Sales" value="KSh 180K" icon={<TrendingUp className="w-6 h-6" />} trend="up" trendValue="+12.5%" />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {['ORD-2024-089', 'ORD-2024-056', 'ORD-2024-034'].map((order) => (
              <div key={order} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">{order}</span>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">In Escrow</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full text-left p-3 bg-blue-50 rounded-lg text-sm font-medium text-blue-700 hover:bg-blue-100">View Pending Orders</button>
            <button className="w-full text-left p-3 bg-green-50 rounded-lg text-sm font-medium text-green-700 hover:bg-green-100">Update Catalog</button>
            <button className="w-full text-left p-3 bg-amber-50 rounded-lg text-sm font-medium text-amber-700 hover:bg-amber-100">Withdraw Funds</button>
          </div>
        </div>
      </div>
    </div>
  );
}
