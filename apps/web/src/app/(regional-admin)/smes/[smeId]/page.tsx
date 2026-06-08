'use client';

import { useParams } from 'next/navigation';
import { StatCard } from '@/components/shared/StatCard';
import { LoanHealthCard } from '@/components/loan/LoanHealthCard';
import { RepaymentScheduleTable } from '@/components/loan/RepaymentScheduleTable';
import { ArrowLeft, Building2, Phone, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function SMEDetailPage() {
  const params = useParams();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/smes" className="p-2 rounded-lg hover:bg-gray-100"><ArrowLeft className="w-5 h-5 text-gray-500" /></Link>
        <div><h1 className="text-2xl font-bold text-gray-900">SME Profile</h1><p className="text-sm text-gray-500">SME ID: {params.smeId}</p></div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-brand-50 rounded-xl"><Building2 className="w-8 h-8 text-brand-600" /></div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">Green Valley Supplies</h2>
            <p className="text-sm text-gray-500">Owned by John Kamau</p>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
              <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> john@greenvalley.com</span>
              <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> +254 712 345 678</span>
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Kisumu County</span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <LoanHealthCard health="on_track" totalRepaid={125000} totalDue={250000} nextPaymentDate="2024-04-15" nextPaymentAmount={12500} />
        <RepaymentScheduleTable schedule={[
          { id: '1', dueDate: '2024-04-15', amount: 12500, principal: 11000, interest: 1500, status: 'pending' },
          { id: '2', dueDate: '2024-03-15', amount: 12500, principal: 11000, interest: 1500, status: 'paid' },
          { id: '3', dueDate: '2024-02-15', amount: 12500, principal: 11000, interest: 1500, status: 'paid' },
        ]} />
      </div>
    </div>
  );
}
