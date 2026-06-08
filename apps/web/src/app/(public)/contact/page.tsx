'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, Mail, MapPin, Phone } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>
        <p className="text-lg text-gray-600 mb-12">
          Have questions or need help? We would love to hear from you.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">Message Sent!</h3>
                <p className="text-sm text-green-600">
                  Thank you for reaching out. We will get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none resize-none"
                  />
                </div>
                <button type="submit" className="flex items-center gap-2 bg-brand-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-700">
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </form>
            )}
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-brand-50 rounded-lg">
                <Mail className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Email</h3>
                <p className="text-sm text-gray-600">hello@fundabiz.com</p>
                <p className="text-sm text-gray-600">support@fundabiz.com</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-brand-50 rounded-lg">
                <Phone className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Phone</h3>
                <p className="text-sm text-gray-600">+254 700 123 456</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-brand-50 rounded-lg">
                <MapPin className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Office</h3>
                <p className="text-sm text-gray-600">Nairobi, Kenya</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
