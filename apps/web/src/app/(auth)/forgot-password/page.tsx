'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      {submitted ? (
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Check Your Email</h2>
          <p className="text-sm text-gray-500 mb-6">
            We have sent a password reset link to <strong className="text-gray-700">{email}</strong>
          </p>
          <Link href="/login" className="text-sm text-brand-600 hover:underline">
            Back to login
          </Link>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Reset Password</h2>
          <p className="text-sm text-gray-500 mb-6">Enter your email and we will send you a reset link.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="w-full py-2.5 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 disabled:opacity-50">
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-500">
            <Link href="/login" className="flex items-center justify-center gap-1 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4" /> Back to login
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
