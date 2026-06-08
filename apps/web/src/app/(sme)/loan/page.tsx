'use client';

import { LoanHealthCard } from '@/components/loan/LoanHealthCard';
import { RepaymentScheduleTable } from '@/components/loan/RepaymentScheduleTable';
import { DeductionSimulator } from '@/components/loan/DeductionSimulator';
import { StatCard } from '@/components/shared/StatCard';
import { Landmark, DollarSign, TrendingUp, Calendar } from 'lucide-react';

export default function SMELoanPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">My Loan</h1><p className="text-sm text-gray-500 mt-1">Track and manage your loan</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Loan" value="KSh 250,000" icon={<Landmark className="w-6 h-6" />} />
        <StatCard title="Disbursed" value="KSh 125,000" icon={<DollarSign className="w-6 h-6" />} />
        <StatCard title="Repaid" value="KSh 37,500" icon={<TrendingUp className="w-6 h-6" />} trend="up" trendValue="30%" />
        <StatCard title="Next Payment" value="Apr 15, 2024" icon={<Calendar className="w-6 h-6" />} />
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RepaymentScheduleTable schedule={[
            { id: '1', dueDate: '2024-04-15', amount: 12500, principal: 11000, interest: 1500, status: 'pending' },
            { id: '2', dueDate: '2024-03-15', amount: 12500, principal: 11000, interest: 1500, status: 'paid' },
            { id: '3', dueDate: '2024-02-15', amount: 12500, principal: 11000, interest: 1500, status: 'paid' },
            { id: '4', dueDate: '2024-01-15', amount: 12500, principal: 11000, interest: 1500, status: 'paid' },
          ]} />
        </div>
        <div className="space-y-6">
          <LoanHealthCard health="on_track" totalRepaid={37500} totalDue={250000} nextPaymentDate="2024-04-15" nextPaymentAmount={12500} />
          <DeductionSimulator interestRate={12} repaymentPercentage={15} loanAmount={250000} />
        </div>
      </div>
    </div>
  );
}
