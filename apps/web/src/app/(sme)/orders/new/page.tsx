'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

const suppliers = [
  { id: 's1', name: 'Western Wholesalers', products: ['Maize Flour', 'Cooking Oil', 'Sugar'] },
  { id: 's2', name: 'Lake Basin Supplies', products: ['Rice', 'Beans', 'Salt'] },
  { id: 's3', name: 'Victoria Distributors', products: ['Soap', 'Detergent', 'Candles'] },
];

export default function NewOrderPage() {
  const router = useRouter();
  const [step, setStep] = useState<'select' | 'items' | 'review'>('select');
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [items, setItems] = useState<{ product: string; quantity: number; price: number }[]>([]);

  const addItem = () => setItems([...items, { product: '', quantity: 1, price: 0 }]);

  const updateItem = (index: number, key: string, value: string | number) => {
    setItems(items.map((item, i) => i === index ? { ...item, [key]: value } : item));
  };

  const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/orders" className="p-2 rounded-lg hover:bg-gray-100"><ArrowLeft className="w-5 h-5 text-gray-500" /></Link>
        <div><h1 className="text-2xl font-bold text-gray-900">New Escrow Order</h1></div>
      </div>

      {step === 'select' && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-700">Select Supplier</h2>
          {suppliers.map((s) => (
            <button
              key={s.id}
              onClick={() => { setSelectedSupplier(s.id); setStep('items'); }}
              className="w-full text-left p-4 bg-white rounded-xl border border-gray-200 hover:border-brand-300 transition-colors"
            >
              <p className="font-medium text-gray-900">{s.name}</p>
              <p className="text-sm text-gray-500">{s.products.join(', ')}</p>
            </button>
          ))}
        </div>
      )}

      {step === 'items' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700">Order Items</h2>
            <button onClick={addItem} className="text-sm text-brand-600 hover:underline">+ Add Item</button>
          </div>
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Product</label>
                <input type="text" value={item.product} onChange={(e) => updateItem(index, 'product', e.target.value)} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Qty</label>
                <input type="number" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm" min={1} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Price (KSh)</label>
                <input type="number" value={item.price} onChange={(e) => updateItem(index, 'price', parseInt(e.target.value) || 0)} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm" min={0} />
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No items added yet</p>}
          {items.length > 0 && (
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="text-sm font-medium text-gray-700">Total:</span>
              <span className="text-lg font-bold text-gray-900">KSh {total.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between">
            <button onClick={() => setStep('select')} className="text-sm text-gray-500 hover:text-gray-700">Back</button>
            <button onClick={() => setStep('review')} disabled={items.length === 0 || total === 0} className="bg-brand-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50">
              Review Order
            </button>
          </div>
        </div>
      )}

      {step === 'review' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">Review Order</h2>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Supplier: <span className="font-medium text-gray-900">{suppliers.find(s => s.id === selectedSupplier)?.name}</span></p>
          </div>
          {items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span>{item.product} x{item.quantity}</span>
              <span className="font-medium">KSh {(item.quantity * item.price).toLocaleString()}</span>
            </div>
          ))}
          <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>KSh {total.toLocaleString()}</span>
          </div>
          <p className="text-xs text-gray-400">Funds will be held in escrow until delivery is confirmed.</p>
          <div className="flex justify-between">
            <button onClick={() => setStep('items')} className="text-sm text-gray-500 hover:text-gray-700">Back</button>
            <button onClick={() => alert('Order placed successfully!')} className="flex items-center gap-2 bg-brand-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-700">
              <ShoppingCart className="w-4 h-4" /> Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
