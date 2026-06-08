'use client';

import Link from 'next/link';
import { ArrowLeft, Shield, Target, Heart, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-brand-600">FundaBiz</span>
          </Link>
          <Link href="/" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">About FundaBiz</h1>
        <p className="text-lg text-gray-600 mb-12">
          FundaBiz is a digital financial platform built specifically for Kenyan SMEs and suppliers.
          We combine escrow-protected order management, AI-powered KYC verification,
          and revenue-based loan repayment to create a trusted B2B marketplace.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="p-6 bg-brand-50 rounded-xl">
            <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center mb-3">
              <Target className="w-5 h-5 text-brand-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Our Mission</h3>
            <p className="text-sm text-gray-600">
              To empower Kenyan small businesses with financial tools that foster trust, enable growth,
              and provide fair access to working capital through innovative technology.
            </p>
          </div>
          <div className="p-6 bg-blue-50 rounded-xl">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <Heart className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Our Values</h3>
            <p className="text-sm text-gray-600">
              Trust, transparency, and inclusivity. We believe in building a financial ecosystem
              that works for every Kenyan business, regardless of size or location.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="border border-gray-200 rounded-xl p-5">
            <Shield className="w-6 h-6 text-brand-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Escrow Orders</h3>
            <p className="text-sm text-gray-600">Funds held in escrow until delivery is confirmed by the buyer.</p>
          </div>
          <div className="border border-gray-200 rounded-xl p-5">
            <Users className="w-6 h-6 text-brand-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">KYC Verification</h3>
            <p className="text-sm text-gray-600">AI-powered identity and business verification for all users.</p>
          </div>
          <div className="border border-gray-200 rounded-xl p-5">
            <Target className="w-6 h-6 text-brand-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Smart Loans</h3>
            <p className="text-sm text-gray-600">Revenue-based repayment that adapts to your sales cycle.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
