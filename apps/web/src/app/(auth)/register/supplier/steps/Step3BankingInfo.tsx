'use client';

export default function Step3BankingInfo({ formData, onChange }: { formData: Record<string, string>; onChange: (key: string, value: string) => void }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Banking Information</h3>
      <p className="text-sm text-gray-500">Provide your bank details for escrow payouts.</p>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
        <input type="text" value={formData.bankName || ''} onChange={(e) => onChange('bankName', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
        <input type="text" value={formData.accountNumber || ''} onChange={(e) => onChange('accountNumber', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Branch Code</label>
        <input type="text" value={formData.branchCode || ''} onChange={(e) => onChange('branchCode', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">M-Pesa Business Number</label>
        <input type="tel" value={formData.mpesaNumber || ''} onChange={(e) => onChange('mpesaNumber', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
      </div>
    </div>
  );
}
