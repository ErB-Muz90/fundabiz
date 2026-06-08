'use client';

import { useParams } from 'next/navigation';
import { TrackingTimeline } from '@/components/escrow/TrackingTimeline';
import { ConfirmDeliveryModal } from '@/components/escrow/ConfirmDeliveryModal';
import { EscrowBadge } from '@/components/escrow/EscrowBadge';
import { ArrowLeft, Truck, Calendar, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function SMEOrderDetailPage() {
  const params = useParams();
  const [showConfirm, setShowConfirm] = useState(false);
  const [delivered, setDelivered] = useState(false);

  const steps = [
    { label: 'Order Created', description: 'Order placed and funds held in escrow', date: '2024-03-15' },
    { label: 'Accepted by Supplier', description: 'Supplier has accepted the order', date: '2024-03-15' },
    { label: 'Dispatched', description: 'Supplier has dispatched the goods', date: '2024-03-16' },
    { label: 'Delivered', description: 'Goods have been delivered', date: delivered ? '2024-03-18' : undefined },
    { label: 'Completed', description: 'Escrow funds released to supplier', date: undefined },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/orders" className="p-2 rounded-lg hover:bg-gray-100"><ArrowLeft className="w-5 h-5 text-gray-500" /></Link>
        <div><h1 className="text-2xl font-bold text-gray-900">Order {params.orderId?.toString().slice(0, 8)}</h1></div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2"><Truck className="w-4 h-4 text-gray-400" /><span className="text-sm text-gray-600">Western Wholesalers</span></div>
            <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400" /><span className="text-sm text-gray-600">Ordered Mar 15, 2024</span></div>
            <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-gray-400" /><span className="text-lg font-bold text-gray-900">KSh 45,000</span></div>
          </div>
          <EscrowBadge status="hold" />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Tracking</h3>
            <TrackingTimeline steps={steps} currentStep={delivered ? 4 : 3} />
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Order Items</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span>Maize Flour 50kg x 10</span><span>KSh 25,000</span></div>
              <div className="flex justify-between text-sm"><span>Cooking Oil 5L x 20</span><span>KSh 20,000</span></div>
              <div className="border-t pt-2 flex justify-between font-bold"><span>Total</span><span>KSh 45,000</span></div>
            </div>
          </div>
          {!delivered && (
            <button onClick={() => setShowConfirm(true)} className="w-full bg-brand-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-brand-700">
              Confirm Delivery
            </button>
          )}
          {delivered && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <p className="text-sm font-medium text-green-700">Delivery Confirmed</p>
              <p className="text-xs text-green-600 mt-1">Funds released to supplier</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmDeliveryModal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={(method, value) => { setDelivered(true); setShowConfirm(false); }}
        orderNumber={params.orderId as string}
        amount={45000}
      />
    </div>
  );
}
