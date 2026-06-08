'use client';

import { useRouter } from 'next/navigation';
import { DataTable, Column } from '@/components/shared/DataTable';
import { Badge } from '@/components/shared/Badge';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';

interface Admin {
  id: string;
  name: string;
  email: string;
  county: string;
  status: string;
  lastActive: string;
}

const admins: Admin[] = [
  { id: '1', name: 'Grace Ochieng', email: 'grace.ochieng@fundabiz.com', county: 'Nairobi', status: 'active', lastActive: '2024-03-15' },
  { id: '2', name: 'James Kiprop', email: 'james.kiprop@fundabiz.com', county: 'Kiambu', status: 'active', lastActive: '2024-03-14' },
  { id: '3', name: 'Sarah Wanjiku', email: 'sarah.wanjiku@fundabiz.com', county: 'Mombasa', status: 'active', lastActive: '2024-03-13' },
  { id: '4', name: 'Peter Kamau', email: 'peter.kamau@fundabiz.com', county: 'Kisumu', status: 'inactive', lastActive: '2024-02-28' },
  { id: '5', name: 'Mary Akinyi', email: 'mary.akinyi@fundabiz.com', county: 'Nakuru', status: 'active', lastActive: '2024-03-15' },
];

export default function AdminsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const columns: Column<Admin>[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'county', label: 'County', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (admin) => (
        <Badge variant={admin.status === 'active' ? 'success' : 'warning'}>{admin.status}</Badge>
      ),
    },
    { key: 'lastActive', label: 'Last Active', sortable: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Regional Admins</h1>
          <p className="text-sm text-gray-500 mt-1">Manage county-level administrators</p>
        </div>
        <button
          onClick={() => router.push('/admins/create')}
          className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-700"
        >
          <Plus className="w-4 h-4" /> Add Admin
        </button>
      </div>
      <DataTable
        columns={columns}
        data={admins}
        keyExtractor={(a) => a.id}
        onRowClick={(admin) => router.push(`/admins/${admin.id}`)}
      />
    </div>
  );
}
