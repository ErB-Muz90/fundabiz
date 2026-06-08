'use client';

import { useState, useRef } from 'react';
import { clsx } from 'clsx';
import { formatCompactNumber, formatPercentage } from '@/lib/format';

interface CountyData {
  countyId: string;
  countyName: string;
  value: number;
  metric: string;
}

interface KenyaCountyHeatmapProps {
  counties: CountyData[];
  metricLabel: string;
  colorScale?: string[];
}

const KENYA_COUNTIES = [
  'Nairobi', 'Kiambu', 'Machakos', 'Kajiado', 'Muranga', 'Nyandarua', 'Nyeri', 'Kirinyaga',
  'Embu', 'Meru', 'Tharaka-Nithi', 'Isiolo', 'Marsabit', 'Mandera', 'Wajir', 'Garissa',
  'Tana River', 'Lamu', 'Kilifi', 'Mombasa', 'Kwale', 'Taita-Taveta', 'Makueni', 'Kitui',
  'Mwingi', 'Kitui Rural', 'Kisumu', 'Siaya', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira',
  'Busia', 'Bungoma', 'Kakamega', 'Vihiga', 'Nandi', 'Uasin Gishu', 'Elgeyo-Marakwet',
  'Trans-Nzoia', 'West Pokot', 'Turkana', 'Samburu', 'Laikipia', 'Nakuru', 'Narok', 'Bomet',
  'Kericho', 'Lugari', 'Baringo', 'Pokot South',
];

export function KenyaCountyHeatmap({ counties, metricLabel }: KenyaCountyHeatmapProps) {
  const [hoveredCounty, setHoveredCounty] = useState<CountyData | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  if (!counties || counties.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Kenya {metricLabel} by County</h3>
        <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
          <p>No county data available</p>
        </div>
      </div>
    );
  }

  const values = counties.map((c) => c.value);
  const maxValue = Math.max(...values, 1);

  const getIntensity = (value: number) => {
    const intensity = value / maxValue;
    if (intensity < 0.2) return 'bg-green-50 text-green-700';
    if (intensity < 0.4) return 'bg-green-100 text-green-700';
    if (intensity < 0.6) return 'bg-green-200 text-green-800';
    if (intensity < 0.8) return 'bg-green-300 text-green-800';
    return 'bg-green-400 text-green-900';
  };

  const countyMap = new Map(counties.map((c) => [c.countyName, c]));

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Kenya {metricLabel} by County</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Low</span>
          <div className="flex gap-0.5">
            {['bg-green-50', 'bg-green-100', 'bg-green-200', 'bg-green-300', 'bg-green-400'].map((c, i) => (
              <div key={i} className={`w-4 h-3 ${c} rounded`} />
            ))}
          </div>
          <span className="text-xs text-gray-400">High</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {KENYA_COUNTIES.map((countyName) => {
          const data = countyMap.get(countyName);
          const value = data?.value ?? 0;
          return (
            <div
              key={countyName}
              className={clsx(
                'px-2 py-1.5 rounded text-xs font-medium text-center cursor-default transition-colors',
                data ? getIntensity(value) : 'bg-gray-50 text-gray-400'
              )}
              title={data ? `${countyName}: ${metricLabel} ${value.toLocaleString()}` : countyName}
            >
              <span className="truncate block">{countyName}</span>
              {data && <span className="block text-[10px] opacity-75">{formatCompactNumber(value)}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
