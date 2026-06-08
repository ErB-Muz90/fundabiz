'use client';

import { DataTable, Column } from '@/components/shared/DataTable';
import { Badge } from '@/components/shared/Badge';
import { DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Disbursement {
  id: string;
  smeName: string;
  loanAmount: number;
  disbursedAmount: number;
  status: string;
  tranche: number;
  date: string;
}

const disbursements: Disbursement[] = [
  { id: '1', smeName: 'Green Valley Supplies', loanAmount: 250000, disbursedAmount: 125000, status: 'partial', tranche: 1, date: '2024-03-01' },
  { id: '2', smeName: 'Victoria Enterprises', loanAmount: 180000, disbursedAmount: 180000, status: 'completed', tranche: 2, date: '2024-02-15' },
  { id: '3', smeName: 'Lake View Traders', loanAmount: 300000, disbursedAmount: 0, status: 'pending', tranche: 0, date: '2024-03-20' },
];

export default function DisbursementsPage() {
  const router = useRouter();

  const columns: Column<Disbursement>[] = [
    { key: 'smeName', label: 'SME', sortable: true },
    { key: 'loanAmount', label: 'Loan Amount', render: (d) => <span className="font-medium">KSh {d.loanAmount.toLocaleString()}</span> },
    { key: 'disbursedAmount', label: 'Disbursed', render: (d) => `KSh ${d.disbursedAmount.toLocaleString()}` },
    { key: 'status', label: 'Status', render: (d) => <Badge variant={d.status === 'completed' ? 'success' : d.status === 'partial' ? 'warning' : 'info'}>{d.status}</Badge> },
    { key: 'tranche', label: 'Tranche', render: (d) => d.tranche > 0 ? `${d.tranche}/3` : '-' },
    { key: 'date', label: 'Date', sortable: true },
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Disbursements</h1><p className="text-sm text-gray-500 mt-1">Manage loan disbursements and tranches</p></div>
      <DataTable columns={columns} data={disbursements} keyExtractor={(d) => d.id} onRowClick={(d) => router.push(`/disbursements/${d.id}`)} />
    </div>
  );
}
