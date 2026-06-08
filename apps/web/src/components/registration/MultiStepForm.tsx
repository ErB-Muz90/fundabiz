'use client';

import { clsx } from 'clsx';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface Step {
  title: string;
  description?: string;
}

interface MultiStepFormProps {
  steps: Step[];
  currentStep: number;
  onNext: () => void;
  onBack: () => void;
  onSubmit: () => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  isSubmitting?: boolean;
  children: React.ReactNode;
}

export function MultiStepForm({
  steps,
  currentStep,
  onNext,
  onBack,
  onSubmit,
  isFirstStep = currentStep === 0,
  isLastStep = currentStep === steps.length - 1,
  isSubmitting = false,
  children,
}: MultiStepFormProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-2 flex-1">
            <div className="flex items-center gap-2">
              <div
                className={clsx(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                  index < currentStep ? 'bg-brand-600 text-white' :
                  index === currentStep ? 'bg-brand-600 text-white ring-2 ring-brand-200' :
                  'bg-gray-200 text-gray-500'
                )}
              >
                {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <div className="hidden sm:block">
                <p className={clsx(
                  'text-sm font-medium',
                  index <= currentStep ? 'text-gray-900' : 'text-gray-400'
                )}>
                  {step.title}
                </p>
                {step.description && (
                  <p className="text-xs text-gray-500">{step.description}</p>
                )}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={clsx(
                'flex-1 h-0.5 mx-2',
                index < currentStep ? 'bg-brand-600' : 'bg-gray-200'
              )} />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
        {children}
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={isFirstStep || isSubmitting}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        {isLastStep ? (
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
            {!isSubmitting && <ArrowRight className="w-4 h-4" />}
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
