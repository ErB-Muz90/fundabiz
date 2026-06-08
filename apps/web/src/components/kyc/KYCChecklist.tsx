'use client';

import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { clsx } from 'clsx';

interface ChecklistItem {
  id: string;
  label: string;
  status: 'verified' | 'pending' | 'rejected' | 'not_started';
}

interface KYCChecklistProps {
  items: ChecklistItem[];
  onItemToggle?: (id: string) => void;
}

export function KYCChecklist({ items, onItemToggle }: KYCChecklistProps) {
  const statusIcon = (status: ChecklistItem['status']) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
      default: return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Verification Checklist</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onItemToggle?.(item.id)}
            className={clsx(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
              onItemToggle ? 'hover:bg-gray-50 cursor-pointer' : 'cursor-default'
            )}
          >
            {statusIcon(item.status)}
            <span className={clsx(
              'text-sm',
              item.status === 'verified' ? 'text-green-700' :
              item.status === 'rejected' ? 'text-red-700' :
              item.status === 'pending' ? 'text-yellow-700' :
              'text-gray-500'
            )}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
