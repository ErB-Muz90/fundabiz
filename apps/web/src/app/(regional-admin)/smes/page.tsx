'use client';

import { useRouter } from 'next/navigation';
import { DataTable, Column } from '@/components/shared/DataTable';
import { Badge } from '@/components/shared/Badge';

interface SME {
  id: string;
  businessName: string;
  ownerName: string;
  county: string;
  loanStatus: string;
  kycStatus: string;
  joinedDate: string;
}

const smes: SME[] = [
  { id: '1', businessName: 'Green Valley Supplies', ownerName: 'John Kamau', county: 'Kisumu', loanStatus: 'active', kycStatus: 'verified', joinedDate: '2024-01-15' },
  { id: '2', businessName: 'Lake View Traders', ownerName: 'Mary Akinyi', county: 'Kisumu', loanStatus: 'none', kycStatus: 'pending', joinedDate: '2024-02-20' },
  { id: '3', businessName: 'Victoria Enterprises', ownerName: 'Peter Ochieng', county: 'Siaya', loanStatus: 'active', kycStatus: 'verified', joinedDate: '2023-11-10' },
  { id: '4', businessName: 'Kisumu Fresh Produce', ownerName: 'Grace Atieno', county: 'Kisumu', loanStatus: 'completed', kycStatus: 'verified', joinedDate: '2023-09-05' },
];

export default function SMEsPage() {
  const router = useRouter();

  const columns: Column<SME>[] = [
    { key: 'businessName', label: 'Business', sortable: true },
    { key: 'ownerName', label: 'Owner', sortable: true },
    { key: 'county', label: 'County' },
    { key: 'loanStatus', label: 'Loan', render: (s) => <Badge variant={s.loanStatus === 'active' ? 'success' : s.loanStatus === 'none' ? 'info' : 'default'}>{s.loanStatus}</Badge> },
    { key: 'kycStatus', label: 'KYC', render: (s) => <Badge variant={s.kycStatus === 'verified' ? 'success' : 'warning'}>{s.kycStatus}</Badge> },
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">SMEs</h1><p className="text-sm text-gray-500 mt-1">Manage SMEs in your county</p></div>
      <DataTable columns={columns} data={smes} keyExtractor={(s) => s.id} onRowClick={(s) => router.push(`/smes/${s.id}`)} />
    </div>
  );
}
