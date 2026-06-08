'use client';

import { clsx } from 'clsx';
import { formatCompactNumber, formatPercentage } from '@/lib/format';
import { Trophy, TrendingUp, TrendingDown } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  countyId: string;
  countyName: string;
  loansDisbursed: number;
  repaymentRate: number;
  smeCount: number;
  totalVolume: number;
}

interface CountyLeaderboardProps {
  entries: LeaderboardEntry[];
  isLoading?: boolean;
}

export function CountyLeaderboard({ entries }: CountyLeaderboardProps) {
  if (!entries || entries.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">County Leaderboard</h3>
        <p className="text-sm text-gray-400 text-center py-8">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900">County Leaderboard</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase w-12">Rank</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">County</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Disbursed</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Repayment</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">SMEs</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Volume</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {entries.map((entry) => (
              <tr key={entry.countyId} className={clsx(entry.rank <= 3 && 'bg-yellow-50/50')}>
                <td className="px-4 py-3">
                  {entry.rank <= 3 ? (
                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-yellow-100">
                      <Trophy className={clsx(
                        'w-3.5 h-3.5',
                        entry.rank === 1 ? 'text-yellow-500' :
                        entry.rank === 2 ? 'text-gray-400' :
                        'text-amber-600'
                      )} />
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500 font-medium">#{entry.rank}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-gray-900">{entry.countyName}</p>
                </td>
                <td className="px-4 py-3 text-right text-sm text-gray-700">{formatCompactNumber(entry.loansDisbursed)}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {entry.repaymentRate >= 90 ? (
                      <TrendingUp className="w-3 h-3 text-green-500" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-500" />
                    )}
                    <span className={clsx(
                      'text-sm font-medium',
                      entry.repaymentRate >= 90 ? 'text-green-600' :
                      entry.repaymentRate >= 70 ? 'text-yellow-600' :
                      'text-red-600'
                    )}>
                      {formatPercentage(entry.repaymentRate)}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-sm text-gray-700">{formatCompactNumber(entry.smeCount)}</td>
                <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                  KSh {(entry.totalVolume / 1000).toFixed(0)}K
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
