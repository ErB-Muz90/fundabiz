'use client';

import { useRouter } from 'next/navigation';
import { DataTable, Column } from '@/components/shared/DataTable';
import { Badge } from '@/components/shared/Badge';
import { Plus } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  phone: string;
  email: string;
  smesManaged: number;
  status: string;
  lastActive: string;
}

const agents: Agent[] = [
  { id: '1', name: 'Kevin Otieno', phone: '+254 712 345 678', email: 'kevin.otieno@fundabiz.com', smesManaged: 23, status: 'active', lastActive: '2024-03-15' },
  { id: '2', name: 'Jane Adhiambo', phone: '+254 723 456 789', email: 'jane.adhiambo@fundabiz.com', smesManaged: 18, status: 'active', lastActive: '2024-03-14' },
  { id: '3', name: 'David Mwangi', phone: '+254 734 567 890', email: 'david.mwangi@fundabiz.com', smesManaged: 15, status: 'inactive', lastActive: '2024-02-20' },
];

export default function AgentsPage() {
  const router = useRouter();

  const columns: Column<Agent>[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'smesManaged', label: 'SMEs Managed', sortable: true },
    { key: 'status', label: 'Status', render: (a) => <Badge variant={a.status === 'active' ? 'success' : 'warning'}>{a.status}</Badge> },
    { key: 'lastActive', label: 'Last Active' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Field Agents</h1>
          <p className="text-sm text-gray-500 mt-1">Manage field agents in your county</p>
        </div>
        <button onClick={() => router.push('/agents/create')} className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-700">
          <Plus className="w-4 h-4" /> Add Agent
        </button>
      </div>
      <DataTable columns={columns} data={agents} keyExtractor={(a) => a.id} />
    </div>
  );
}
