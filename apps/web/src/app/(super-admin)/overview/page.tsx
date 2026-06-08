'use client';

import { StatCard } from '@/components/shared/StatCard';
import { Landmark, Users, TrendingUp, ShieldAlert } from 'lucide-react';

export default function SuperAdminOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">National Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Kenya-wide FundaBiz performance metrics</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Loans Disbursed"
          value="KSh 12.5M"
          icon={<Landmark className="w-6 h-6" />}
          trend="up"
          trendValue="+12.5% from last month"
        />
        <StatCard
          title="Repayment Rate"
          value="94.2%"
          icon={<TrendingUp className="w-6 h-6" />}
          trend="up"
          trendValue="+2.1%"
        />
        <StatCard
          title="Active SMEs"
          value="1,247"
          icon={<Users className="w-6 h-6" />}
          trend="up"
          trendValue="+48 this week"
        />
        <StatCard
          title="Fraud Cases"
          value="3"
          icon={<ShieldAlert className="w-6 h-6" />}
          trend="down"
          trendValue="-2 from last week"
        />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-brand-50 rounded-lg hover:bg-brand-100 transition-colors">
              <p className="text-sm font-medium text-brand-700">Review Pending KYC Applications</p>
              <p className="text-xs text-brand-500">24 applications awaiting review</p>
            </button>
            <button className="w-full text-left p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors">
              <p className="text-sm font-medium text-amber-700">View Fraud Alerts</p>
              <p className="text-xs text-amber-500">3 open cases requiring attention</p>
            </button>
            <button className="w-full text-left p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <p className="text-sm font-medium text-blue-700">Regional Performance Report</p>
              <p className="text-xs text-blue-500">Download monthly analytics report</p>
            </button>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-green-700">API Gateway</span>
              <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">Operational</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-green-700">M-Pesa Integration</span>
              <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">Operational</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-green-700">Database</span>
              <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">Operational</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
