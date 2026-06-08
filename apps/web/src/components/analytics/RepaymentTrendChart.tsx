'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '@/lib/format';

interface DataPoint {
  date: string;
  actual?: number;
  projected?: number;
}

interface RepaymentTrendChartProps {
  data: DataPoint[];
  height?: number;
}

export function RepaymentTrendChart({ data, height = 300 }: RepaymentTrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Repayment Trends</h3>
        <div className="flex items-center justify-center" style={{ height }}>
          <p className="text-sm text-gray-400">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Repayment Trends</h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#6b7280' }}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#6b7280' }}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
            tickFormatter={(v) => `KSh ${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            formatter={(value: number) => [formatCurrency(value), 'Amount']}
            contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line
            type="monotone"
            dataKey="actual"
            name="Actual Repayments"
            stroke="#059669"
            strokeWidth={2}
            dot={{ fill: '#059669', r: 3 }}
            activeDot={{ r: 5 }}
          />
          {data[0]?.projected !== undefined && (
            <Line
              type="monotone"
              dataKey="projected"
              name="Projected"
              stroke="#2563eb"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
