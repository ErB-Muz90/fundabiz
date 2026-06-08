'use client';

import { useState } from 'react';
import { clsx } from 'clsx';
import { Shield, MapPin, Key } from 'lucide-react';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

interface ConfirmDeliveryModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (method: 'gps' | 'code', value: string) => void;
  orderNumber: string;
  amount: number;
  isLoading?: boolean;
}

export function ConfirmDeliveryModal({
  open,
  onClose,
  onConfirm,
  orderNumber,
  amount,
  isLoading,
}: ConfirmDeliveryModalProps) {
  const [confirmMethod, setConfirmMethod] = useState<'gps' | 'code'>('code');
  const [deliveryCode, setDeliveryCode] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirm = () => {
    if (confirmMethod === 'gps') {
      if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = `${position.coords.latitude},${position.coords.longitude}`;
          onConfirm('gps', coords);
        },
        () => {
          alert('Unable to retrieve your location');
        }
      );
    } else {
      if (!deliveryCode.trim()) return;
      setShowConfirm(true);
    }
  };

  return (
    <>
      <div
        className={clsx(
          'fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4',
          open ? 'visible opacity-100' : 'invisible opacity-0'
        )}
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-50">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Confirm Delivery</h3>
              <p className="text-sm text-gray-500">Order {orderNumber}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmMethod('code')}
                className={clsx(
                  'flex-1 p-3 rounded-lg border text-left transition-colors',
                  confirmMethod === 'code'
                    ? 'border-brand-500 bg-brand-50'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <Key className={clsx('w-5 h-5 mb-1', confirmMethod === 'code' ? 'text-brand-600' : 'text-gray-400')} />
                <p className="text-sm font-medium text-gray-700">Delivery Code</p>
                <p className="text-xs text-gray-500">Enter the code from the supplier</p>
              </button>
              <button
                onClick={() => setConfirmMethod('gps')}
                className={clsx(
                  'flex-1 p-3 rounded-lg border text-left transition-colors',
                  confirmMethod === 'gps'
                    ? 'border-brand-500 bg-brand-50'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <MapPin className={clsx('w-5 h-5 mb-1', confirmMethod === 'gps' ? 'text-brand-600' : 'text-gray-400')} />
                <p className="text-sm font-medium text-gray-700">GPS Location</p>
                <p className="text-xs text-gray-500">Use your current location</p>
              </button>
            </div>

            {confirmMethod === 'code' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Code</label>
                <input
                  type="text"
                  value={deliveryCode}
                  onChange={(e) => setDeliveryCode(e.target.value)}
                  placeholder="Enter the delivery confirmation code"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                />
              </div>
            )}

            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Order Total</span>
              <span className="text-sm font-bold text-gray-900">KSh {amount.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading || (confirmMethod === 'code' && !deliveryCode.trim())}
              className="px-4 py-2.5 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 disabled:opacity-50"
            >
              {isLoading ? 'Confirming...' : 'Confirm Delivery'}
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={showConfirm}
        title="Release Escrow Funds"
        message={`Are you sure you want to confirm delivery for order ${orderNumber}? This will release KSh ${amount.toLocaleString()} from escrow to the supplier.`}
        onConfirm={() => { onConfirm('code', deliveryCode); setShowConfirm(false); }}
        onCancel={() => setShowConfirm(false)}
        confirmLabel="Release Funds"
        variant="warning"
        isLoading={isLoading}
      />
    </>
  );
}
