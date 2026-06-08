'use client';

import { useState } from 'react';
import { Package, Plus, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/shared/Badge';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  status: string;
}

const initialProducts: Product[] = [
  { id: '1', name: 'Maize Flour - 50kg', category: 'Grains', price: 2500, unit: 'bag', status: 'active' },
  { id: '2', name: 'Cooking Oil - 5L', category: 'Oils', price: 1200, unit: 'bottle', status: 'active' },
  { id: '3', name: 'Sugar - 1kg', category: 'Provisions', price: 180, unit: 'kg', status: 'active' },
  { id: '4', name: 'Rice - 5kg', category: 'Grains', price: 750, unit: 'bag', status: 'inactive' },
];

export default function SupplierCatalogPage() {
  const [products, setProducts] = useState(initialProducts);
  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', category: '', price: '', unit: '' });

  const addProduct = () => {
    if (!newProduct.name || !newProduct.price) return;
    setProducts([...products, { id: Date.now().toString(), ...newProduct, price: parseInt(newProduct.price) || 0, status: 'active' }]);
    setNewProduct({ name: '', category: '', price: '', unit: '' });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Catalog</h1><p className="text-sm text-gray-500 mt-1">Manage your products and services</p></div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-700">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">New Product</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input type="text" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none">
                <option value="">Select</option>
                <option value="Grains">Grains</option>
                <option value="Oils">Oils</option>
                <option value="Provisions">Provisions</option>
                <option value="Beverages">Beverages</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <input type="text" value={newProduct.unit} onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })} placeholder="kg, bag, bottle" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (KSh)</label>
              <input type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" min={0} />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancel</button>
            <button onClick={addProduct} className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700">Save Product</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Price</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{p.category}</td>
                <td className="px-4 py-3 text-right text-sm font-medium">KSh {p.price.toLocaleString()}/{p.unit}</td>
                <td className="px-4 py-3 text-center"><Badge variant={p.status === 'active' ? 'success' : 'warning'} size="sm">{p.status}</Badge></td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1 hover:bg-gray-100 rounded"><Edit className="w-4 h-4 text-gray-400" /></button>
                    <button className="p-1 hover:bg-gray-100 rounded"><Trash2 className="w-4 h-4 text-red-400" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
