'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

const KENYA_COUNTIES = ['Nairobi', 'Kiambu', 'Machakos', 'Kajiado', 'Mombasa', 'Kisumu', 'Nakuru', 'Meru', 'Uasin Gishu', 'Kilifi', 'Nyeri', 'Kirinyaga', 'Muranga', 'Nyandarua', 'Laikipia', 'Narok', 'Bomet', 'Kericho', 'Kakamega', 'Bungoma', 'Busia', 'Siaya', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira', 'Embu', 'Tharaka-Nithi', 'Isiolo', 'Marsabit', 'Garissa', 'Wajir', 'Mandera', 'Tana River', 'Lamu', 'Kwale', 'Taita-Taveta', 'Makueni', 'Kitui', 'Vihiga', 'Nandi', 'Elgeyo-Marakwet', 'Trans-Nzoia', 'West Pokot', 'Turkana', 'Samburu', 'Baringo'];

export default function CreateAdminPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', county: '', phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // API call would go here
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/admins');
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admins" className="p-2 rounded-lg hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Create Regional Admin</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required minLength={8} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">County</label>
            <select value={formData.county} onChange={(e) => setFormData({ ...formData, county: e.target.value })} required className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none">
              <option value="">Select county</option>
              {KENYA_COUNTIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Link href="/admins" className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</Link>
          <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 disabled:opacity-50">
            <Save className="w-4 h-4" /> {isSubmitting ? 'Creating...' : 'Create Admin'}
          </button>
        </div>
      </form>
    </div>
  );
}
