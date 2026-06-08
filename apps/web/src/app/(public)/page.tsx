'use client';

import Link from 'next/link';
import { ArrowRight, Shield, TrendingUp, Users, Handshake } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-brand-600">FundaBiz</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight">
            Empowering Kenyan{' '}
            <span className="text-brand-600">SMEs</span> with Smart Finance
          </h1>
          <p className="mt-6 text-lg text-gray-600 leading-relaxed">
            Escrow-protected orders, AI-powered KYC verification, and revenue-based loan repayment
            designed for Kenyan small businesses and suppliers.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-xl text-base font-semibold hover:bg-brand-700 transition-colors"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/about"
              className="flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-xl text-base font-semibold hover:bg-gray-50 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why FundaBiz?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-brand-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Escrow Protection</h3>
              <p className="text-sm text-gray-600">Funds held securely until delivery is confirmed. Trust between buyers and suppliers guaranteed.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Revenue-Based Loans</h3>
              <p className="text-sm text-gray-600">Repayments are a percentage of your daily sales. Pay more when business is good, less when it is slow.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified Network</h3>
              <p className="text-sm text-gray-600">All SMEs and suppliers go through thorough KYC verification. Know who you are doing business with.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-4">
                <Handshake className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">B2B Marketplace</h3>
              <p className="text-sm text-gray-600">Connect with verified suppliers and SMEs across all 47 Kenyan counties.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to grow your business?</h2>
          <p className="text-lg text-gray-600 mb-8">Join thousands of Kenyan SMEs and suppliers using FundaBiz.</p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-brand-600 text-white px-8 py-3 rounded-xl text-base font-semibold hover:bg-brand-700 transition-colors"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} FundaBiz. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
