'use client';

import { clsx } from 'clsx';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  steps: { title: string; description?: string }[];
  currentStep: number;
  className?: string;
}

export function StepIndicator({ steps, currentStep, className }: StepIndicatorProps) {
  return (
    <div className={clsx('flex items-center', className)}>
      {steps.map((step, index) => (
        <div key={index} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div
              className={clsx(
                'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all',
                index < currentStep
                  ? 'bg-brand-600 text-white'
                  : index === currentStep
                  ? 'bg-brand-600 text-white ring-4 ring-brand-100'
                  : 'bg-gray-200 text-gray-500'
              )}
            >
              {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
            </div>
            <p
              className={clsx(
                'mt-2 text-xs font-medium text-center',
                index <= currentStep ? 'text-gray-900' : 'text-gray-400'
              )}
            >
              {step.title}
            </p>
          </div>
          {index < steps.length - 1 && (
            <div
              className={clsx(
                'flex-1 h-0.5 mx-4 mt-[-1.5rem]',
                index < currentStep ? 'bg-brand-600' : 'bg-gray-200'
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
