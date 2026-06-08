'use client';

export default function Step1PersonalInfo({ formData, onChange }: { formData: Record<string, string>; onChange: (key: string, value: string) => void }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input type="text" value={formData.firstName || ''} onChange={(e) => onChange('firstName', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input type="text" value={formData.lastName || ''} onChange={(e) => onChange('lastName', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" required />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
        <input type="email" value={formData.email || ''} onChange={(e) => onChange('email', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
        <input type="tel" value={formData.phone || ''} onChange={(e) => onChange('phone', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input type="password" value={formData.password || ''} onChange={(e) => onChange('password', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" required minLength={8} />
      </div>
    </div>
  );
}
