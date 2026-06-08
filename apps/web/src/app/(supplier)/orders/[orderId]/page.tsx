'use client';

import { useParams, useRouter } from 'next/navigation';
import { EscrowBadge } from '@/components/escrow/EscrowBadge';
import { ArrowLeft, MapPin, Truck, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { formatCurrency } from '@/lib/format';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';

export default function SupplierOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [isAccepted, setIsAccepted] = useState(false);
  const [isDispatched, setIsDispatched] = useState(false);
  const [gpsCoords, setGpsCoords] = useState('');

  const captureGps = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setGpsCoords(`${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`),
        () => alert('Unable to retrieve GPS location')
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/orders" className="p-2 rounded-lg hover:bg-gray-100"><ArrowLeft className="w-5 h-5 text-gray-500" /></Link>
        <div><h1 className="text-2xl font-bold text-gray-900">Order {params.orderId?.toString().slice(0, 8)}</h1></div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500">Buyer: <span className="font-medium text-gray-900">Green Valley Supplies</span></p>
            <p className="text-lg font-bold text-gray-900 mt-2">{formatCurrency(45000)}</p>
          </div>
          <EscrowBadge status={isDispatched ? 'released' : 'hold'} />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Order Items</h3>
          <div className="flex justify-between text-sm"><span>Maize Flour 50kg x 10</span><span>KSh 25,000</span></div>
          <div className="flex justify-between text-sm"><span>Cooking Oil 5L x 20</span><span>KSh 20,000</span></div>
          <div className="border-t pt-2 flex justify-between font-bold"><span>Total</span><span>KSh 45,000</span></div>
        </div>

        <div className="space-y-4">
          {!isAccepted && (
            <button onClick={() => setIsAccepted(true)} className="flex items-center justify-center gap-2 w-full bg-brand-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-brand-700">
              <CheckCircle className="w-4 h-4" /> Accept Order
            </button>
          )}
          {isAccepted && !isDispatched && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <h3 className="text-sm font-semibold text-gray-900">Dispatch with GPS Proof</h3>
              <button onClick={captureGps} className="flex items-center gap-2 w-full p-3 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                <MapPin className="w-4 h-4 text-brand-600" /> Capture GPS Location
              </button>
              {gpsCoords && (
                <div className="p-3 bg-green-50 rounded-lg text-sm">
                  <span className="text-green-700">GPS captured: {gpsCoords}</span>
                </div>
              )}
              <button
                onClick={() => setIsDispatched(true)}
                disabled={!gpsCoords}
                className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                <Truck className="w-4 h-4" /> Confirm Dispatch
              </button>
            </div>
          )}
          {isDispatched && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-green-700">Order Dispatched</p>
              <p className="text-xs text-green-600 mt-1">Awaiting delivery confirmation from buyer</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
