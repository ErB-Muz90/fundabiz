'use client';

import { StatCard } from '@/components/shared/StatCard';
import { KenyaCountyHeatmap } from '@/components/analytics/KenyaCountyHeatmap';
import { Users, Building2, Truck, ClipboardCheck } from 'lucide-react';

export default function RegionalOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">County Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Kisumu County performance overview</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total SMEs" value="98" icon={<Building2 className="w-6 h-6" />} trend="up" trendValue="+5 this month" />
        <StatCard title="Field Agents" value="12" icon={<Users className="w-6 h-6" />} trend="up" trendValue="+2" />
        <StatCard title="Suppliers" value="34" icon={<Truck className="w-6 h-6" />} />
        <StatCard title="Pending KYC" value="8" icon={<ClipboardCheck className="w-6 h-6" />} trend="down" trendValue="Need review" />
      </div>
      <KenyaCountyHeatmap
        counties={[{ countyId: 'kisumu', countyName: 'Kisumu', value: 100, metric: 'Activity' }]}
        metricLabel="Activity"
      />
    </div>
  );
}
