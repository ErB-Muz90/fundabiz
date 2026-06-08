'use client';

import { useParams } from 'next/navigation';
import { TrancheProgressCard } from '@/components/loan/TrancheProgressCard';
import { ArrowLeft, DollarSign, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { StatCard } from '@/components/shared/StatCard';

export default function LoanDisbursementDetailPage() {
  const params = useParams();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/disbursements" className="p-2 rounded-lg hover:bg-gray-100"><ArrowLeft className="w-5 h-5 text-gray-500" /></Link>
        <div><h1 className="text-2xl font-bold text-gray-900">Tranche Management</h1><p className="text-sm text-gray-500">Loan #{params.loanId?.toString().slice(0, 8)}</p></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <StatCard title="Total Loan" value="KSh 250,000" icon={<DollarSign className="w-6 h-6" />} />
        <StatCard title="Disbursed" value="KSh 125,000" icon={<CheckCircle className="w-6 h-6" />} />
        <StatCard title="Remaining" value="KSh 125,000" icon={<Clock className="w-6 h-6" />} />
      </div>
      <TrancheProgressCard tranches={[
        { id: 't1', name: 'Tranche 1 - Initial', amount: 125000, status: 'disbursed', condition: 'KYC Approval', disbursedAt: '2024-03-01' },
        { id: 't2', name: 'Tranche 2 - Growth', amount: 75000, status: 'unlocked', condition: '50% repayment of Tranche 1' },
        { id: 't3', name: 'Tranche 3 - Expansion', amount: 50000, status: 'locked', condition: '75% repayment overall' },
      ]} />
    </div>
  );
}
