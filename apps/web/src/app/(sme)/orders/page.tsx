'use client';

import { useRouter } from 'next/navigation';
import { EscrowOrderCard } from '@/components/escrow/EscrowOrderCard';
import { Plus } from 'lucide-react';

const orders = [
  { id: '1', orderNumber: 'ORD-2024-089', amount: 45000, status: 'active', escrowStatus: 'hold', supplierName: 'Western Wholesalers', supplierId: 's1', createdAt: '2024-03-15' },
  { id: '2', orderNumber: 'ORD-2024-056', amount: 32000, status: 'completed', escrowStatus: 'completed', supplierName: 'Lake Basin Supplies', supplierId: 's2', createdAt: '2024-03-10' },
  { id: '3', orderNumber: 'ORD-2024-034', amount: 28000, status: 'shipped', escrowStatus: 'hold', supplierName: 'Victoria Distributors', supplierId: 's3', createdAt: '2024-03-05' },
];

export default function SMEOrdersPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Orders</h1><p className="text-sm text-gray-500 mt-1">Track and manage your orders</p></div>
        <button onClick={() => router.push('/orders/new')} className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-700">
          <Plus className="w-4 h-4" /> New Order
        </button>
      </div>
      <div className="space-y-3">
        {orders.map((order) => (
          <EscrowOrderCard key={order.id} {...order} onView={() => router.push(`/orders/${order.id}`)} />
        ))}
      </div>
    </div>
  );
}
