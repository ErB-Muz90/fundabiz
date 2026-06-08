'use client';

import { useState } from 'react';
import { Save, Settings } from 'lucide-react';

export default function SettingsPage() {
  const [config, setConfig] = useState({
    platformName: 'FundaBiz',
    supportEmail: 'support@fundabiz.com',
    maxLoanAmount: '500000',
    interestRate: '5.0',
    repaymentPercentage: '15',
    kycRequired: true,
    autoApproveThreshold: '50',
    mpesaCallbackUrl: 'https://api.fundabiz.com/webhooks/mpesa',
    escrowFee: '1.0',
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="w-6 h-6 text-gray-400" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Configure global platform parameters</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">General</h3>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label>
            <input type="text" value={config.platformName} onChange={(e) => setConfig({ ...config, platformName: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
            <input type="email" value={config.supportEmail} onChange={(e) => setConfig({ ...config, supportEmail: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
          </div>

          <div className="col-span-2 mt-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Loan Configuration</h3>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Loan Amount (KSh)</label>
            <input type="number" value={config.maxLoanAmount} onChange={(e) => setConfig({ ...config, maxLoanAmount: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
            <input type="number" step="0.1" value={config.interestRate} onChange={(e) => setConfig({ ...config, interestRate: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Repayment % of Sales</label>
            <input type="number" value={config.repaymentPercentage} onChange={(e) => setConfig({ ...config, repaymentPercentage: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Auto-approve Risk Score Below</label>
            <input type="number" value={config.autoApproveThreshold} onChange={(e) => setConfig({ ...config, autoApproveThreshold: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
          </div>

          <div className="col-span-2 mt-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Escrow & Fees</h3>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Escrow Fee (%)</label>
            <input type="number" step="0.1" value={config.escrowFee} onChange={(e) => setConfig({ ...config, escrowFee: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">M-Pesa Callback URL</label>
            <input type="url" value={config.mpesaCallbackUrl} onChange={(e) => setConfig({ ...config, mpesaCallbackUrl: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
          </div>

          <div className="col-span-2 mt-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">KYC Settings</h3>
          </div>
          <div className="col-span-2 flex items-center gap-3">
            <input type="checkbox" checked={config.kycRequired} onChange={(e) => setConfig({ ...config, kycRequired: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
            <span className="text-sm text-gray-700">Require KYC verification before enabling transactions</span>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button onClick={handleSave} className="flex items-center gap-2 bg-brand-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-700">
            <Save className="w-4 h-4" /> {saved ? 'Saved!' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
