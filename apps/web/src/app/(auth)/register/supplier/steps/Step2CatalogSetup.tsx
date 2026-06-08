'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface CatalogItem {
  name: string;
  category: string;
  price: string;
  description: string;
}

export default function Step2CatalogSetup({ onCatalogChange }: { onCatalogChange: (items: CatalogItem[]) => void }) {
  const [items, setItems] = useState<CatalogItem[]>([
    { name: '', category: '', price: '', description: '' },
  ]);

  const updateItem = (index: number, key: keyof CatalogItem, value: string) => {
    const updated = items.map((item, i) => (i === index ? { ...item, [key]: value } : item));
    setItems(updated);
    onCatalogChange(updated);
  };

  const addItem = () => {
    const updated = [...items, { name: '', category: '', price: '', description: '' }];
    setItems(updated);
    onCatalogChange(updated);
  };

  const removeItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
    onCatalogChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Catalog Setup</h3>
        <button type="button" onClick={addItem} className="flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>
      <p className="text-sm text-gray-500">Add at least one product to get started.</p>
      {items.map((item, index) => (
        <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Product #{index + 1}</span>
            {items.length > 1 && (
              <button type="button" onClick={() => removeItem(index)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Product Name</label>
              <input type="text" value={item.name} onChange={(e) => updateItem(index, 'name', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
              <select value={item.category} onChange={(e) => updateItem(index, 'category', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none">
                <option value="">Select</option>
                <option value="raw_materials">Raw Materials</option>
                <option value="finished_goods">Finished Goods</option>
                <option value="equipment">Equipment</option>
                <option value="services">Services</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Unit Price (KSh)</label>
              <input type="number" value={item.price} onChange={(e) => updateItem(index, 'price', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" min={0} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
              <input type="text" value={item.description} onChange={(e) => updateItem(index, 'description', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
