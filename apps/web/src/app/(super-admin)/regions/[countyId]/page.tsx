'use client';

import { useParams } from 'next/navigation';
import { StatCard } from '@/components/shared/StatCard';
import { KenyaCountyHeatmap } from '@/components/analytics/KenyaCountyHeatmap';
import { RepaymentTrendChart } from '@/components/analytics/RepaymentTrendChart';
import { DisbursementBarChart } from '@/components/analytics/DisbursementBarChart';
import { CountyLeaderboard } from '@/components/analytics/CountyLeaderboard';
import { Landmark, Users, TrendingUp, DollarSign, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CountyDetailPage() {
  const params = useParams();
  const countyName = decodeURIComponent(params.countyId as string).replace(/-/g, ' ');

  const countyNameCapitalized = countyName.charAt(0).toUpperCase() + countyName.slice(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/regions" className="p-2 rounded-lg hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{countyNameCapitalized} County</h1>
          <p className="text-sm text-gray-500 mt-1">County performance dashboard</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Loans" value="KSh 2.1M" icon={<Landmark className="w-6 h-6" />} trend="up" trendValue="+8.3%" />
        <StatCard title="Active SMEs" value="156" icon={<Users className="w-6 h-6" />} trend="up" trendValue="+12 this month" />
        <StatCard title="Repayment Rate" value="93.5%" icon={<TrendingUp className="w-6 h-6" />} trend="up" trendValue="+1.2%" />
        <StatCard title="Avg Loan Size" value="KSh 45,000" icon={<DollarSign className="w-6 h-6" />} trend="flat" trendValue="Stable" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <RepaymentTrendChart
          data={[
            { date: 'Jan', actual: 180000, projected: 175000 },
            { date: 'Feb', actual: 195000, projected: 180000 },
            { date: 'Mar', actual: 210000, projected: 200000 },
            { date: 'Apr', actual: 205000, projected: 210000 },
            { date: 'May', actual: 225000, projected: 215000 },
            { date: 'Jun', actual: 240000, projected: 230000 },
          ]}
        />
        <DisbursementBarChart
          data={[
            { name: 'Nairobi', amount: 4800000 },
            { name: 'Kiambu', amount: 2100000 },
            { name: 'Nakuru', amount: 1200000 },
            { name: 'Mombasa', amount: 1900000 },
            { name: 'Kisumu', amount: 1500000 },
            { name: 'Meru', amount: 900000 },
          ]}
        />
      </div>

      <CountyLeaderboard
        entries={[
          { rank: 1, countyId: 'nairobi', countyName: 'Nairobi', loansDisbursed: 342, repaymentRate: 96.1, smeCount: 342, totalVolume: 4800000 },
          { rank: 2, countyId: 'kiambu', countyName: 'Kiambu', loansDisbursed: 156, repaymentRate: 93.5, smeCount: 156, totalVolume: 2100000 },
          { rank: 3, countyId: 'mombasa', countyName: 'Mombasa', loansDisbursed: 134, repaymentRate: 94.8, smeCount: 134, totalVolume: 1900000 },
          { rank: 4, countyId: 'kisumu', countyName: 'Kisumu', loansDisbursed: 98, repaymentRate: 91.2, smeCount: 98, totalVolume: 1500000 },
          { rank: 5, countyId: 'nakuru', countyName: 'Nakuru', loansDisbursed: 87, repaymentRate: 89.4, smeCount: 87, totalVolume: 1200000 },
        ]}
      />
    </div>
  );
}
