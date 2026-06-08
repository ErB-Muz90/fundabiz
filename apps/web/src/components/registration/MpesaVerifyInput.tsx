'use client';

import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { Smartphone, Check } from 'lucide-react';

interface MpesaVerifyInputProps {
  phoneNumber: string;
  onPhoneChange: (phone: string) => void;
  onVerify: () => void;
  isVerifying: boolean;
  isVerified?: boolean;
  error?: string | null;
}

export function MpesaVerifyInput({
  phoneNumber,
  onPhoneChange,
  onVerify,
  isVerifying,
  isVerified = false,
  error,
}: MpesaVerifyInputProps) {
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  const handleVerify = () => {
    if (!canResend || isVerifying || isVerified) return;
    onVerify();
    setCountdown(60);
    setCanResend(false);
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.startsWith('254')) return digits;
    if (digits.startsWith('0')) return '254' + digits.slice(1);
    if (digits.startsWith('7')) return '254' + digits;
    return digits;
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">M-Pesa Phone Number</label>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Smartphone className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => onPhoneChange(formatPhone(e.target.value))}
            placeholder="254 7XX XXX XXX"
            disabled={isVerified}
            className={clsx(
              'w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none',
              isVerified ? 'bg-green-50 border-green-300 text-green-700' :
              error ? 'border-red-300 bg-red-50' : 'border-gray-300'
            )}
          />
        </div>
        <button
          type="button"
          onClick={handleVerify}
          disabled={!canResend || isVerifying || isVerified || phoneNumber.length < 10}
          className={clsx(
            'px-4 py-2.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap',
            isVerified
              ? 'bg-green-100 text-green-700'
              : 'bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {isVerified ? (
            <span className="flex items-center gap-1"><Check className="w-4 h-4" /> Verified</span>
          ) : isVerifying ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Verifying
            </span>
          ) : countdown > 0 ? (
            `Resend in ${countdown}s`
          ) : (
            'Verify'
          )}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <p className="text-xs text-gray-500">
        You will receive an STK push on your M-Pesa registered number to verify your identity.
      </p>
    </div>
  );
}
