'use client';

import { useRouter } from 'next/navigation';
import { EscrowOrderCard } from '@/components/escrow/EscrowOrderCard';

const orders = [
  { id: '1', orderNumber: 'ORD-2024-089', amount: 45000, status: 'pending', escrowStatus: 'hold', supplierName: 'Green Valley Supplies', supplierId: 's1', createdAt: '2024-03-15' },
  { id: '2', orderNumber: 'ORD-2024-056', amount: 32000, status: 'pending', escrowStatus: 'pending', supplierName: 'Lake View Traders', supplierId: 's2', createdAt: '2024-03-14' },
  { id: '3', orderNumber: 'ORD-2024-034', amount: 28000, status: 'completed', escrowStatus: 'completed', supplierName: 'Victoria Enterprises', supplierId: 's3', createdAt: '2024-03-10' },
];

export default function SupplierOrdersPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Orders</h1><p className="text-sm text-gray-500 mt-1">Manage incoming orders</p></div>
      <div className="space-y-3">
        {orders.map((order) => (
          <EscrowOrderCard key={order.id} {...order} onView={() => router.push(`/orders/${order.id}`)} />
        ))}
      </div>
    </div>
  );
}
