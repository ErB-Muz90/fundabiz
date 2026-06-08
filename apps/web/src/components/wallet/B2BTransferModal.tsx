'use client';

import { useState } from 'react';
import { ArrowLeftRight, Search, X } from 'lucide-react';
import { clsx } from 'clsx';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { formatCurrency } from '@/lib/format';

interface B2BTransferModalProps {
  open: boolean;
  onClose: () => void;
  onTransfer: (recipientPhone: string, amount: number, description: string) => Promise<void>;
  balance: number;
  isLoading?: boolean;
}

export function B2BTransferModal({ open, onClose, onTransfer, balance, isLoading }: B2BTransferModalProps) {
  const [recipientPhone, setRecipientPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const numericAmount = parseFloat(amount) || 0;
  const isValid = recipientPhone.length >= 10 && numericAmount > 0 && numericAmount <= balance;

  const handleSubmit = () => {
    setError(null);
    if (!isValid) return;
    if (numericAmount > balance) {
      setError('Insufficient balance');
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    try {
      await onTransfer(recipientPhone, numericAmount, description);
      setShowConfirm(false);
      onClose();
    } catch {
      setError('Transfer failed. Please try again.');
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-brand-50">
                <ArrowLeftRight className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">B2B Transfer</h3>
                <p className="text-xs text-gray-500">Send funds to another business</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Phone</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="254 7XX XXX XXX"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500">KSh</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  max={balance}
                  className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Available: {formatCurrency(balance)}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's this for?"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button onClick={onClose} className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isValid || isLoading}
              className="px-4 py-2.5 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Transfer'}
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={showConfirm}
        title="Confirm B2B Transfer"
        message={`You are about to transfer ${formatCurrency(numericAmount)} to ${recipientPhone}. This action cannot be undone.`}
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirm(false)}
        confirmLabel="Confirm Transfer"
        variant="warning"
        isLoading={isLoading}
      />
    </>
  );
}
