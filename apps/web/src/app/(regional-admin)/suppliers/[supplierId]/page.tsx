'use client';

import { useParams } from 'next/navigation';
import { ArrowLeft, Truck, Phone, Mail, MapPin, Package } from 'lucide-react';
import Link from 'next/link';
import { StatCard } from '@/components/shared/StatCard';

export default function SupplierDetailPage() {
  const params = useParams();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/suppliers" className="p-2 rounded-lg hover:bg-gray-100"><ArrowLeft className="w-5 h-5 text-gray-500" /></Link>
        <div><h1 className="text-2xl font-bold text-gray-900">Supplier Profile</h1><p className="text-sm text-gray-500">Supplier ID: {params.supplierId}</p></div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-50 rounded-xl"><Truck className="w-8 h-8 text-blue-600" /></div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Western Wholesalers</h2>
            <p className="text-sm text-gray-500">Verified Supplier</p>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
              <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> info@westernwholesalers.com</span>
              <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> +254 734 567 890</span>
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Kisumu County</span>
              <span className="flex items-center gap-1"><Package className="w-4 h-4" /> 24 Products</span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <StatCard title="Total Orders" value="156" />
        <StatCard title="Completed" value="142" trend="up" trendValue="91%" />
        <StatCard title="Escrow Balance" value="KSh 450K" />
      </div>
    </div>
  );
}
