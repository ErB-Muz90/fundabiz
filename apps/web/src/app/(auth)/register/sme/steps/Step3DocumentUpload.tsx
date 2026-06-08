'use client';

import { DocumentDropzone } from '@/components/registration/DocumentDropzone';

export default function Step3DocumentUpload({ onUpload }: { onUpload: (files: File[]) => void }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Document Upload</h3>
      <p className="text-sm text-gray-500">Upload the following documents for KYC verification</p>
      <DocumentDropzone
        onUpload={onUpload}
        label="National ID / Passport"
        maxFiles={1}
      />
      <DocumentDropzone
        onUpload={onUpload}
        label="Business Registration Certificate"
        maxFiles={1}
      />
      <DocumentDropzone
        onUpload={onUpload}
        label="KRA PIN Certificate"
        maxFiles={1}
      />
    </div>
  );
}
