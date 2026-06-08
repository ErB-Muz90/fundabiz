'use client';

import { Search, MapPin, Star } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/shared/Badge';

const supplierList = [
  { id: 's1', name: 'Western Wholesalers', county: 'Kisumu', products: 24, rating: 4.8, verified: true },
  { id: 's2', name: 'Lake Basin Supplies', county: 'Siaya', products: 12, rating: 4.5, verified: true },
  { id: 's3', name: 'Victoria Distributors', county: 'Kisumu', products: 18, rating: 4.2, verified: true },
  { id: 's4', name: 'Highland General Supplies', county: 'Nandi', products: 8, rating: 3.9, verified: false },
];

export default function SMESuppliersPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filtered = supplierList.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Suppliers</h1><p className="text-sm text-gray-500 mt-1">Browse verified suppliers</p></div>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Search suppliers..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((s) => (
          <div key={s.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push(`/orders/new?supplier=${s.id}`)}>
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-gray-900">{s.name}</h3>
              {s.verified && <Badge variant="success" size="sm">Verified</Badge>}
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
              <MapPin className="w-3 h-3" /> {s.county}
            </div>
            <div className="flex items-center justify-between mt-3 text-sm">
              <span className="text-gray-500">{s.products} products</span>
              <span className="flex items-center gap-1 text-yellow-600"><Star className="w-3 h-3 fill-current" /> {s.rating}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
