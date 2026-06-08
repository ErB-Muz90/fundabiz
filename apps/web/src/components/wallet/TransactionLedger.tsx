'use client';

import { useState } from 'react';
import { TransactionRow } from './TransactionRow';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
import { ChevronLeft, ChevronRight, Filter, Calendar } from 'lucide-react';
import { clsx } from 'clsx';

interface Transaction {
  id: string;
  type: string;
  description: string;
  amount: number;
  direction: 'in' | 'out';
  status: string;
  createdAt: string;
}

interface TransactionLedgerProps {
  transactions: Transaction[];
  isLoading?: boolean;
  pageSize?: number;
}

export function TransactionLedger({ transactions, isLoading, pageSize = 15 }: TransactionLedgerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('all');

  const filtered = transactions.filter((tx) => {
    if (filterType !== 'all' && tx.type !== filterType) return false;
    if (filterDate === 'today') {
      const today = new Date().toDateString();
      if (new Date(tx.createdAt).toDateString() !== today) return false;
    }
    if (filterDate === 'week') {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      if (new Date(tx.createdAt) < weekAgo) return false;
    }
    if (filterDate === 'month') {
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      if (new Date(tx.createdAt) < monthAgo) return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (isLoading) {
    return <LoadingSkeleton variant="table" count={5} />;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
            className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white"
          >
            <option value="all">All Types</option>
            <option value="payment">Payments</option>
            <option value="disbursement">Disbursements</option>
            <option value="repayment">Repayments</option>
            <option value="transfer">Transfers</option>
            <option value="escrow_release">Escrow Releases</option>
            <option value="escrow_hold">Escrow Holds</option>
            <option value="withdrawal">Withdrawals</option>
            <option value="deposit">Deposits</option>
          </select>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-gray-400" />
            <select
              value={filterDate}
              onChange={(e) => { setFilterDate(e.target.value); setCurrentPage(1); }}
              className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      {paginated.length === 0 ? (
        <div className="py-12 text-center text-gray-500 text-sm">No transactions found</div>
      ) : (
        <div className="divide-y divide-gray-100">
          {paginated.map((tx) => (
            <TransactionRow key={tx.id} {...tx} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-500">
            Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const start = Math.max(1, currentPage - 2);
              const page = start + i;
              if (page > totalPages) return null;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={clsx(
                    'px-3 py-1 text-sm rounded',
                    currentPage === page ? 'bg-brand-600 text-white' : 'hover:bg-gray-200 text-gray-600'
                  )}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
