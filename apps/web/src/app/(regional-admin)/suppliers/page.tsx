'use client';

import { DataTable, Column } from '@/components/shared/DataTable';
import { Badge } from '@/components/shared/Badge';

interface Supplier {
  id: string;
  businessName: string;
  phone: string;
  county: string;
  status: string;
  products: number;
}

const suppliers: Supplier[] = [
  { id: '1', businessName: 'Western Wholesalers', phone: '+254 734 567 890', county: 'Kisumu', status: 'verified', products: 24 },
  { id: '2', businessName: 'Lake Basin Supplies', phone: '+254 745 678 901', county: 'Siaya', status: 'pending', products: 12 },
  { id: '3', businessName: 'Victoria Distributors', phone: '+254 756 789 012', county: 'Kisumu', status: 'verified', products: 18 },
];

export default function SuppliersPage() {
  const columns: Column<Supplier>[] = [
    { key: 'businessName', label: 'Business', sortable: true },
    { key: 'phone', label: 'Phone' },
    { key: 'county', label: 'County' },
    { key: 'status', label: 'Status', render: (s) => <Badge variant={s.status === 'verified' ? 'success' : 'warning'}>{s.status}</Badge> },
    { key: 'products', label: 'Products', sortable: true },
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Suppliers</h1><p className="text-sm text-gray-500 mt-1">Manage suppliers in your county</p></div>
      <DataTable columns={columns} data={suppliers} keyExtractor={(s) => s.id} />
    </div>
  );
}
