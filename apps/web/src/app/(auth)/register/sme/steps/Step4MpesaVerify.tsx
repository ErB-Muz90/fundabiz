'use client';

import { MpesaVerifyInput } from '@/components/registration/MpesaVerifyInput';

export default function Step4MpesaVerify({ phoneNumber, onPhoneChange, onVerify, isVerifying }: {
  phoneNumber: string;
  onPhoneChange: (phone: string) => void;
  onVerify: () => void;
  isVerifying: boolean;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Verify Your Phone</h3>
      <p className="text-sm text-gray-500">We need to verify your M-Pesa number to process transactions.</p>
      <MpesaVerifyInput
        phoneNumber={phoneNumber}
        onPhoneChange={onPhoneChange}
        onVerify={onVerify}
        isVerifying={isVerifying}
      />
    </div>
  );
}
