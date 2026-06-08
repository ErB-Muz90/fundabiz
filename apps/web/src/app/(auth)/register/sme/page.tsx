'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MultiStepForm } from '@/components/registration/MultiStepForm';
import Step1PersonalInfo from './steps/Step1PersonalInfo';
import Step2BusinessInfo from './steps/Step2BusinessInfo';
import Step3DocumentUpload from './steps/Step3DocumentUpload';
import Step4MpesaVerify from './steps/Step4MpesaVerify';
import apiClient from '@/lib/api-client';

const steps = [
  { title: 'Personal Info', description: 'Your details' },
  { title: 'Business', description: 'Business info' },
  { title: 'Documents', description: 'Upload docs' },
  { title: 'Verify', description: 'M-Pesa verify' },
];

export default function SMERegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [documents, setDocuments] = useState<File[]>([]);

  const updateField = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await apiClient.post('/auth/register/sme', {
        ...formData,
        role: 'SME_OWNER',
      });
      router.push('/login?registered=sme');
    } catch {
      alert('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <MultiStepForm
        steps={steps}
        currentStep={currentStep}
        onNext={handleNext}
        onBack={handleBack}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      >
        {currentStep === 0 && <Step1PersonalInfo formData={formData} onChange={updateField} />}
        {currentStep === 1 && <Step2BusinessInfo formData={formData} onChange={updateField} />}
        {currentStep === 2 && <Step3DocumentUpload onUpload={setDocuments} />}
        {currentStep === 3 && (
          <Step4MpesaVerify
            phoneNumber={formData.phone || ''}
            onPhoneChange={(p) => updateField('phone', p)}
            onVerify={() => {}}
            isVerifying={false}
          />
        )}
      </MultiStepForm>
    </div>
  );
}
