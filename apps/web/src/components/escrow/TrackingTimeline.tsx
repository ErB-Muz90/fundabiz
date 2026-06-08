'use client';

import { clsx } from 'clsx';
import { Check, Circle } from 'lucide-react';

interface TimelineStep {
  label: string;
  description: string;
  date?: string;
}

interface TrackingTimelineProps {
  steps: TimelineStep[];
  currentStep: number;
}

export function TrackingTimeline({ steps, currentStep }: TrackingTimelineProps) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
      <div className="space-y-6">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isPending = index > currentStep;

          return (
            <div key={index} className="relative flex items-start gap-4">
              <div className="relative z-10">
                <div
                  className={clsx(
                    'w-8 h-8 rounded-full flex items-center justify-center transition-all',
                    isCompleted ? 'bg-brand-600' :
                    isCurrent ? 'bg-brand-600 ring-4 ring-brand-100' :
                    'bg-gray-200'
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <Circle className={clsx('w-3 h-3', isCurrent ? 'text-white' : 'text-gray-400')} />
                  )}
                </div>
              </div>
              <div className="flex-1 pt-1">
                <p className={clsx(
                  'text-sm font-semibold',
                  isCompleted ? 'text-gray-900' :
                  isCurrent ? 'text-brand-700' :
                  'text-gray-400'
                )}>
                  {step.label}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
                {step.date && (
                  <p className="text-xs text-gray-400 mt-0.5">{step.date}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
