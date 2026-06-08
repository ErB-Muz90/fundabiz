'use client';

import { RepaymentTrendChart } from '@/components/analytics/RepaymentTrendChart';
import { DisbursementBarChart } from '@/components/analytics/DisbursementBarChart';
import { KenyaCountyHeatmap } from '@/components/analytics/KenyaCountyHeatmap';
import { CountyLeaderboard } from '@/components/analytics/CountyLeaderboard';
import { StatCard } from '@/components/shared/StatCard';
import { BarChart3, TrendingUp, DollarSign, Users } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">National performance insights and trends</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Platform Volume" value="KSh 12.5M" icon={<BarChart3 className="w-6 h-6" />} trend="up" trendValue="+15.3%" />
        <StatCard title="Average Repayment Rate" value="94.2%" icon={<TrendingUp className="w-6 h-6" />} trend="up" trendValue="+2.1%" />
        <StatCard title="Total Disbursed" value="KSh 8.7M" icon={<DollarSign className="w-6 h-6" />} trend="up" trendValue="+18.7%" />
        <StatCard title="Registered SMEs" value="1,247" icon={<Users className="w-6 h-6" />} trend="up" trendValue="+48 this week" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <RepaymentTrendChart
          data={[
            { date: 'Oct', actual: 850000, projected: 820000 },
            { date: 'Nov', actual: 920000, projected: 900000 },
            { date: 'Dec', actual: 780000, projected: 850000 },
            { date: 'Jan', actual: 950000, projected: 920000 },
            { date: 'Feb', actual: 1020000, projected: 980000 },
            { date: 'Mar', actual: 1150000, projected: 1050000 },
          ]}
        />
        <DisbursementBarChart
          data={[
            { name: 'Nairobi', amount: 4800000 },
            { name: 'Kiambu', amount: 2100000 },
            { name: 'Mombasa', amount: 1900000 },
            { name: 'Kisumu', amount: 1500000 },
            { name: 'Nakuru', amount: 1200000 },
            { name: 'Meru', amount: 900000 },
            { name: 'Machakos', amount: 750000 },
            { name: 'Uasin Gishu', amount: 1000000 },
          ]}
        />
      </div>

      <KenyaCountyHeatmap
        counties={[
          { countyId: 'nairobi', countyName: 'Nairobi', value: 4800000, metric: 'Loan Volume' },
          { countyId: 'kiambu', countyName: 'Kiambu', value: 2100000, metric: 'Loan Volume' },
          { countyId: 'mombasa', countyName: 'Mombasa', value: 1900000, metric: 'Loan Volume' },
          { countyId: 'kisumu', countyName: 'Kisumu', value: 1500000, metric: 'Loan Volume' },
          { countyId: 'nakuru', countyName: 'Nakuru', value: 1200000, metric: 'Loan Volume' },
        ]}
        metricLabel="Loan Volume"
      />

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
