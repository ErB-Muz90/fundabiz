'use client';

import { EscrowOrderCard } from '@/components/escrow/EscrowOrderCard';
import { StatCard } from '@/components/shared/StatCard';
import { ShieldCheck, DollarSign, Clock, CheckCircle } from 'lucide-react';

const escrowOrders = [
  { id: '1', orderNumber: 'ORD-2024-089', amount: 45000, status: 'active', escrowStatus: 'hold', supplierName: 'Green Valley Supplies', supplierId: 's1', createdAt: '2024-03-15' },
  { id: '2', orderNumber: 'ORD-2024-056', amount: 32000, status: 'completed', escrowStatus: 'released', supplierName: 'Lake View Traders', supplierId: 's2', createdAt: '2024-03-10' },
  { id: '3', orderNumber: 'ORD-2024-034', amount: 28000, status: 'completed', escrowStatus: 'completed', supplierName: 'Victoria Enterprises', supplierId: 's3', createdAt: '2024-03-05' },
];

export default function SupplierEscrowPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Escrow</h1><p className="text-sm text-gray-500 mt-1">Track escrow funds and releases</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="In Escrow" value="KSh 125,000" icon={<ShieldCheck className="w-6 h-6" />} />
        <StatCard title="Released This Month" value="KSh 340,000" icon={<DollarSign className="w-6 h-6" />} trend="up" trendValue="+12.5%" />
        <StatCard title="Pending Release" value="3" icon={<Clock className="w-6 h-6" />} />
        <StatCard title="Completed" value="12" icon={<CheckCircle className="w-6 h-6" />} />
      </div>
      <div className="space-y-3">
        {escrowOrders.map((order) => (
          <EscrowOrderCard key={order.id} {...order} />
        ))}
      </div>
    </div>
  );
}
