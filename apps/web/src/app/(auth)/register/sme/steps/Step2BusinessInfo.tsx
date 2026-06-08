'use client';

const KENYA_COUNTIES = [
  'Nairobi', 'Kiambu', 'Machakos', 'Kajiado', 'Muranga', 'Nyandarua', 'Nyeri', 'Kirinyaga',
  'Embu', 'Meru', 'Tharaka-Nithi', 'Isiolo', 'Marsabit', 'Mandera', 'Wajir', 'Garissa',
  'Tana River', 'Lamu', 'Kilifi', 'Mombasa', 'Kwale', 'Taita-Taveta', 'Makueni', 'Kitui',
  'Kisumu', 'Siaya', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira', 'Busia', 'Bungoma',
  'Kakamega', 'Vihiga', 'Nandi', 'Uasin Gishu', 'Elgeyo-Marakwet', 'Trans-Nzoia',
  'West Pokot', 'Turkana', 'Samburu', 'Laikipia', 'Nakuru', 'Narok', 'Bomet', 'Kericho', 'Baringo',
];

export default function Step2BusinessInfo({ formData, onChange }: { formData: Record<string, string>; onChange: (key: string, value: string) => void }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Business Information</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
        <input type="text" value={formData.businessName || ''} onChange={(e) => onChange('businessName', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
        <select value={formData.businessType || ''} onChange={(e) => onChange('businessType', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" required>
          <option value="">Select type</option>
          <option value="retail">Retail</option>
          <option value="wholesale">Wholesale</option>
          <option value="manufacturing">Manufacturing</option>
          <option value="services">Services</option>
          <option value="agriculture">Agriculture</option>
          <option value="technology">Technology</option>
          <option value="hospitality">Hospitality</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">County</label>
        <select value={formData.county || ''} onChange={(e) => onChange('county', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" required>
          <option value="">Select county</option>
          {KENYA_COUNTIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Business Registration Number</label>
        <input type="text" value={formData.regNumber || ''} onChange={(e) => onChange('regNumber', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Years in Operation</label>
        <input type="number" value={formData.yearsInOperation || ''} onChange={(e) => onChange('yearsInOperation', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" min={0} />
      </div>
    </div>
  );
}
