'use client';

import { useParams, useRouter } from 'next/navigation';
import { KYCReviewPanel } from '@/components/kyc/KYCReviewPanel';
import { KYCChecklist } from '@/components/kyc/KYCChecklist';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function KYCReviewPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const application = {
    id: params.applicationId as string,
    userId: 'u1',
    userName: 'John Kamau',
    businessName: 'Green Valley Supplies',
    businessType: 'Wholesale',
    county: 'Kisumu',
    status: 'pending' as const,
    riskScore: 25,
    documents: [
      { id: 'd1', type: 'national_id', url: '#', status: 'verified' as const },
      { id: 'd2', type: 'business_reg', url: '#', status: 'pending' as const },
      { id: 'd3', type: 'kra_pin', url: '#', status: 'pending' as const },
    ],
    submittedAt: '2024-03-15T10:30:00Z',
  };

  const handleApprove = async (id: string) => { setIsLoading(true); setTimeout(() => { setIsLoading(false); router.push('/kyc'); }, 1500); };
  const handleReject = async (id: string) => { setIsLoading(true); setTimeout(() => { setIsLoading(false); router.push('/kyc'); }, 1500); };
  const handleFlag = async (id: string) => { setIsLoading(true); setTimeout(() => { setIsLoading(false); }, 1500); };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/kyc" className="p-2 rounded-lg hover:bg-gray-100"><ArrowLeft className="w-5 h-5 text-gray-500" /></Link>
        <div><h1 className="text-2xl font-bold text-gray-900">Review KYC Application</h1></div>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <KYCReviewPanel application={application} onApprove={handleApprove} onReject={handleReject} onFlag={handleFlag} isLoading={isLoading} />
        </div>
        <div>
          <KYCChecklist items={[
            { id: '1', label: 'National ID Verified', status: 'verified' },
            { id: '2', label: 'Business Registration Verified', status: 'pending' },
            { id: '3', label: 'KRA PIN Verified', status: 'pending' },
            { id: '4', label: 'GPS Location Matched', status: 'not_started' },
            { id: '5', label: 'Phone Number Verified', status: 'verified' },
            { id: '6', label: 'Face Match Completed', status: 'pending' },
          ]} />
        </div>
      </div>
    </div>
  );
}
