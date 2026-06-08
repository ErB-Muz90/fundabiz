'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, TrendingUp, TrendingDown } from 'lucide-react';
import { clsx } from 'clsx';

const counties = [
  { id: 'nairobi', name: 'Nairobi', smes: 342, loans: 4.2, repayment: 96.1, trend: 'up' as const },
  { id: 'kiambu', name: 'Kiambu', smes: 156, loans: 2.1, repayment: 93.5, trend: 'up' as const },
  { id: 'kisumu', name: 'Kisumu', smes: 98, loans: 1.5, repayment: 91.2, trend: 'up' as const },
  { id: 'mombasa', name: 'Mombasa', smes: 134, loans: 1.9, repayment: 94.8, trend: 'up' as const },
  { id: 'nakuru', name: 'Nakuru', smes: 87, loans: 1.2, repayment: 89.4, trend: 'down' as const },
  { id: 'meru', name: 'Meru', smes: 65, loans: 0.9, repayment: 92.0, trend: 'up' as const },
  { id: 'machakos', name: 'Machakos', smes: 52, loans: 0.7, repayment: 88.3, trend: 'down' as const },
  { id: 'eldoret', name: 'Uasin Gishu', smes: 71, loans: 1.0, repayment: 90.5, trend: 'up' as const },
];

export default function RegionsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filtered = counties.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Regions</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all 47 Kenyan counties</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search county..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none w-64"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">County</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Active SMEs</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Loans (M)</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Repayment Rate</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((county) => (
              <tr
                key={county.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => router.push(`/regions/${county.id}`)}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{county.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-sm text-gray-700">{county.smes}</td>
                <td className="px-4 py-3 text-right text-sm text-gray-700">KSh {county.loans}M</td>
                <td className="px-4 py-3 text-right text-sm font-medium">
                  <span className={clsx(county.repayment >= 90 ? 'text-green-600' : 'text-yellow-600')}>
                    {county.repayment}%
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {county.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-500 inline" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 inline" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
