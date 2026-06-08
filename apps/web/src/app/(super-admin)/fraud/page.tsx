'use client';

import { FraudRiskMatrix } from '@/components/analytics/FraudRiskMatrix';
import { StatCard } from '@/components/shared/StatCard';
import { ShieldAlert, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/shared/Badge';

const fraudCases = [
  { id: '1', entityId: 'u1', entityType: 'user' as const, entityName: 'John Kamau', severity: 'high' as const, status: 'open' as const, description: 'Suspicious login pattern from different IP addresses', flaggedBy: 'System', flaggedAt: '2024-03-15T10:30:00Z' },
  { id: '2', entityId: 'a1', entityType: 'application' as const, entityName: 'Green Valley Supplies Ltd', severity: 'critical' as const, status: 'investigating' as const, description: 'Fake business registration documents suspected', flaggedBy: 'Grace Ochieng', flaggedAt: '2024-03-14T14:20:00Z' },
  { id: '3', entityId: 't1', entityType: 'transaction' as const, entityName: 'KSh 500,000 Payment', severity: 'medium' as const, status: 'open' as const, description: 'Unusually large transaction for new account', flaggedBy: 'System', flaggedAt: '2024-03-13T09:15:00Z' },
  { id: '4', entityId: 'u2', entityType: 'user' as const, entityName: 'Mary Akinyi', severity: 'low' as const, status: 'resolved' as const, description: 'Multiple failed login attempts', flaggedBy: 'System', flaggedAt: '2024-03-12T16:45:00Z' },
  { id: '5', entityId: 'a2', entityType: 'application' as const, entityName: 'Coast Traders Inc', severity: 'high' as const, status: 'investigating' as const, description: 'GPS mismatch - business address differs from registered location', flaggedBy: 'James Kiprop', flaggedAt: '2024-03-11T11:00:00Z' },
  { id: '6', entityId: 't2', entityType: 'transaction' as const, entityName: 'Escrow Release - Order #ORD-2024-089', severity: 'medium' as const, status: 'open' as const, description: 'Early escrow release request before delivery confirmation', flaggedBy: 'System', flaggedAt: '2024-03-10T08:30:00Z' },
];

export default function FraudPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Fraud Management</h1>
        <p className="text-sm text-gray-500 mt-1">Monitor and investigate suspicious activity</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Open Cases" value="3" icon={<ShieldAlert className="w-6 h-6" />} trend="down" trendValue="-2 from last week" />
        <StatCard title="Under Investigation" value="2" icon={<Clock className="w-6 h-6" />} />
        <StatCard title="Resolved This Week" value="1" icon={<CheckCircle className="w-6 h-6" />} trend="up" trendValue="+1" />
        <StatCard title="Critical Alerts" value="1" icon={<AlertTriangle className="w-6 h-6" />} trend="up" trendValue="Needs attention" />
      </div>

      <div className="flex items-center gap-4">
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option>All Severities</option>
          <option>Critical</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option>All Statuses</option>
          <option>Open</option>
          <option>Investigating</option>
          <option>Resolved</option>
        </select>
      </div>

      <FraudRiskMatrix cases={fraudCases} />
    </div>
  );
}
