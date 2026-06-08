'use client';

import { MapPin } from 'lucide-react';

interface GpsLocationMapProps {
  latitude: number;
  longitude: number;
  businessName?: string;
  height?: number;
}

export function GpsLocationMap({ latitude, longitude, businessName, height = 300 }: GpsLocationMapProps) {
  const mapSrc = `https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-brand-600" />
          <span className="text-sm font-medium text-gray-700">
            {businessName || 'GPS Location'}
          </span>
          <span className="text-xs text-gray-400">
            {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </span>
        </div>
      </div>
      <div style={{ height }}>
        <iframe
          src={mapSrc}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Business Location"
        />
      </div>
    </div>
  );
}
