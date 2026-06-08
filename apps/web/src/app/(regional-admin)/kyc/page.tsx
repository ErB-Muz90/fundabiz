'use client';

import { useRouter } from 'next/navigation';
import { DataTable, Column } from '@/components/shared/DataTable';
import { Badge } from '@/components/shared/Badge';
import { Search, Filter } from 'lucide-react';
import { useState } from 'react';

interface KYCApp {
  id: string;
  userName: string;
  businessName: string;
  county: string;
  status: string;
  riskScore: number;
  submittedAt: string;
}

const applications: KYCApp[] = [
  { id: '1', userName: 'John Kamau', businessName: 'Green Valley Supplies', county: 'Kisumu', status: 'pending', riskScore: 25, submittedAt: '2024-03-15' },
  { id: '2', userName: 'Mary Akinyi', businessName: 'Lake View Traders', county: 'Kisumu', status: 'pending', riskScore: 55, submittedAt: '2024-03-14' },
  { id: '3', userName: 'Peter Ochieng', businessName: 'Victoria Enterprises', county: 'Siaya', status: 'flagged', riskScore: 72, submittedAt: '2024-03-13' },
  { id: '4', userName: 'Grace Atieno', businessName: 'Kisumu Fresh Produce', county: 'Kisumu', status: 'approved', riskScore: 15, submittedAt: '2024-03-10' },
];

export default function KYCQueuePage() {
  const router = useRouter();

  const columns: Column<KYCApp>[] = [
    { key: 'userName', label: 'Name', sortable: true },
    { key: 'businessName', label: 'Business', sortable: true },
    { key: 'county', label: 'County' },
    { key: 'status', label: 'Status', render: (a) => <Badge variant={a.status === 'approved' ? 'success' : a.status === 'flagged' ? 'warning' : 'info'}>{a.status}</Badge> },
    { key: 'riskScore', label: 'Risk Score', render: (a) => <span className={a.riskScore > 50 ? 'text-red-600 font-medium' : a.riskScore > 30 ? 'text-yellow-600' : 'text-green-600'}>{a.riskScore}</span> },
    { key: 'submittedAt', label: 'Submitted', sortable: true },
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">KYC Queue</h1><p className="text-sm text-gray-500 mt-1">Review and verify KYC applications</p></div>
      <div className="flex items-center gap-3">
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option>All Statuses</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Flagged</option>
        </select>
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option>All Counties</option>
        </select>
      </div>
      <DataTable columns={columns} data={applications} keyExtractor={(a) => a.id} onRowClick={(a) => router.push(`/kyc/${a.id}`)} />
    </div>
  );
}
