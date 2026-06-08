'use client';

import { clsx } from 'clsx';
import { AlertTriangle, Shield, Search, User, CreditCard } from 'lucide-react';
import { Badge } from '@/components/shared/Badge';
import { formatDate, timeAgo } from '@/lib/format';

interface FraudCase {
  id: string;
  entityId: string;
  entityType: 'user' | 'application' | 'transaction';
  entityName: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved';
  description: string;
  flaggedBy: string;
  flaggedAt: string;
}

interface FraudRiskMatrixProps {
  cases: FraudCase[];
  onView?: (fraudCase: FraudCase) => void;
  onResolve?: (id: string) => void;
  isLoading?: boolean;
}

const severityColors = {
  low: { badge: 'info', bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700' },
  medium: { badge: 'warning', bg: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-700' },
  high: { badge: 'danger', bg: 'bg-orange-50 border-orange-200', text: 'text-orange-700' },
  critical: { badge: 'danger', bg: 'bg-red-50 border-red-200', text: 'text-red-700' },
};

const entityIcons = {
  user: User,
  application: Search,
  transaction: CreditCard,
};

export function FraudRiskMatrix({ cases, onView, isLoading }: FraudRiskMatrixProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!cases || cases.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <Shield className="w-12 h-12 mx-auto text-green-400 mb-3" />
        <h3 className="text-sm font-semibold text-gray-900">No Fraud Cases</h3>
        <p className="text-sm text-gray-500 mt-1">All clear - no suspicious activity detected</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {cases.map((fraudCase) => {
        const sevConfig = severityColors[fraudCase.severity];
        const EntityIcon = entityIcons[fraudCase.entityType];

        return (
          <div
            key={fraudCase.id}
            className={clsx(
              'bg-white rounded-xl border p-4 transition-shadow hover:shadow-md cursor-pointer',
              sevConfig.bg
            )}
            onClick={() => onView?.(fraudCase)}
          >
            <div className="flex items-start gap-3">
              <div className={clsx('p-2 rounded-lg', sevConfig.bg)}>
                <AlertTriangle className={clsx('w-5 h-5', sevConfig.text)} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{fraudCase.entityName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{fraudCase.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={sevConfig.badge as any} size="sm">
                      {fraudCase.severity}
                    </Badge>
                    <Badge
                      variant={
                        fraudCase.status === 'resolved' ? 'success' :
                        fraudCase.status === 'investigating' ? 'warning' : 'info'
                      }
                      size="sm"
                    >
                      {fraudCase.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <EntityIcon className="w-3 h-3" />
                    {fraudCase.entityType}
                  </span>
                  <span>Flagged by {fraudCase.flaggedBy}</span>
                  <span>{timeAgo(fraudCase.flaggedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
