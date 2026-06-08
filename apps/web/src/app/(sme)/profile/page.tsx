'use client';

import { Badge } from '@/components/shared/Badge';
import { User, Building2, Mail, Phone, MapPin, Shield, CheckCircle, AlertCircle } from 'lucide-react';

export default function SMEProfilePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Profile</h1><p className="text-sm text-gray-500 mt-1">Your business profile and KYC status</p></div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start gap-4">
          <div className="p-4 bg-brand-50 rounded-xl">
            <Building2 className="w-8 h-8 text-brand-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">Green Valley Supplies</h2>
            <p className="text-sm text-gray-500">Owned by John Kamau</p>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
              <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> john@greenvalley.com</span>
              <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> +254 712 345 678</span>
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Kisumu County</span>
            </div>
          </div>
          <Badge variant="success">KYC Verified</Badge>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2"><Shield className="w-4 h-4" /> KYC Status</h3>
        <div className="space-y-3">
          {[
            { label: 'National ID', status: 'verified' as const },
            { label: 'Business Registration', status: 'verified' as const },
            { label: 'KRA PIN', status: 'verified' as const },
            { label: 'GPS Location', status: 'verified' as const },
            { label: 'Phone Verification', status: 'verified' as const },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">{item.label}</span>
              <Badge variant="success" size="sm">Verified</Badge>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Business Details</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-500">Business Type</span><p className="font-medium text-gray-900">Wholesale</p></div>
          <div><span className="text-gray-500">Registration #</span><p className="font-medium text-gray-900">BN/2024/12345</p></div>
          <div><span className="text-gray-500">Years in Operation</span><p className="font-medium text-gray-900">5 years</p></div>
          <div><span className="text-gray-500">Monthly Revenue</span><p className="font-medium text-gray-900">KSh 180,000</p></div>
        </div>
      </div>
    </div>
  );
}
