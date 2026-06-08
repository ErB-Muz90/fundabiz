'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MultiStepForm } from '@/components/registration/MultiStepForm';
import Step1BusinessDetails from './steps/Step1BusinessDetails';
import Step2CatalogSetup from './steps/Step2CatalogSetup';
import Step3BankingInfo from './steps/Step3BankingInfo';
import apiClient from '@/lib/api-client';

const steps = [
  { title: 'Business Details', description: 'Company info' },
  { title: 'Catalog', description: 'Product list' },
  { title: 'Banking', description: 'Payment info' },
];

export default function SupplierRegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const updateField = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await apiClient.post('/auth/register/supplier', {
        ...formData,
        role: 'SUPPLIER',
      });
      router.push('/login?registered=supplier');
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
        onNext={() => setCurrentStep((s) => Math.min(s + 1, steps.length - 1))}
        onBack={() => setCurrentStep((s) => Math.max(s - 1, 0))}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      >
        {currentStep === 0 && <Step1BusinessDetails formData={formData} onChange={updateField} />}
        {currentStep === 1 && <Step2CatalogSetup onCatalogChange={(items) => setFormData((prev) => ({ ...prev, catalog: JSON.stringify(items) }))} />}
        {currentStep === 2 && <Step3BankingInfo formData={formData} onChange={updateField} />}
      </MultiStepForm>
    </div>
  );
}
