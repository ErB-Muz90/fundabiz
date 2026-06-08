'use client';

import Link from 'next/link';
import { Building2, Truck } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Create your account</h2>
      <p className="text-sm text-gray-500 mb-6">Choose your account type to get started</p>

      <div className="space-y-4">
        <Link
          href="/register/sme"
          className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-brand-300 hover:bg-brand-50/50 transition-all group"
        >
          <div className="p-3 bg-brand-50 rounded-xl group-hover:bg-brand-100">
            <Building2 className="w-6 h-6 text-brand-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">I am an SME</h3>
            <p className="text-sm text-gray-500">Register your business to access financing and order supplies</p>
          </div>
        </Link>

        <Link
          href="/register/supplier"
          className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
        >
          <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100">
            <Truck className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">I am a Supplier</h3>
            <p className="text-sm text-gray-500">List your products and get orders from verified SMEs</p>
          </div>
        </Link>
      </div>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link href="/login" className="text-brand-600 font-medium hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
