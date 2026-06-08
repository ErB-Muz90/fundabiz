'use client';

import { useState } from 'react';
import { Calculator, Percent } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/lib/format';

interface DeductionSimulatorProps {
  interestRate: number;
  repaymentPercentage: number;
  loanAmount: number;
}

export function DeductionSimulator({ interestRate, repaymentPercentage, loanAmount }: DeductionSimulatorProps) {
  const [saleAmount, setSaleAmount] = useState<number>(10000);
  const [showDetails, setShowDetails] = useState(false);

  const saleRepayment = saleAmount * (repaymentPercentage / 100);
  const interest = saleRepayment * (interestRate / 100);
  const principalRepayment = saleRepayment - interest;
  const remainingBalance = Math.max(0, loanAmount - principalRepayment);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-brand-600" />
        <h3 className="text-sm font-semibold text-gray-900">Deduction Simulator</h3>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        See how much would be deducted from a sale for loan repayment.
        Repayment rate: {formatPercentage(repaymentPercentage)} of sale.
      </p>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm text-gray-600">Sale Amount</label>
            <span className="text-sm font-semibold text-gray-900">{formatCurrency(saleAmount)}</span>
          </div>
          <input
            type="range"
            min={1000}
            max={500000}
            step={1000}
            value={saleAmount}
            onChange={(e) => setSaleAmount(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{formatCurrency(1000)}</span>
            <span>{formatCurrency(500000)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-brand-50 rounded-lg">
            <p className="text-xs text-brand-600">Repayment Deduction</p>
            <p className="text-lg font-bold text-brand-700">{formatCurrency(saleRepayment)}</p>
            <p className="text-xs text-brand-500">{formatPercentage(repaymentPercentage)} of sale</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-600">Remaining After Deduction</p>
            <p className="text-lg font-bold text-blue-700">{formatCurrency(saleAmount - saleRepayment)}</p>
            <p className="text-xs text-blue-500">Goes to your wallet</p>
          </div>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-brand-600 hover:underline"
        >
          {showDetails ? 'Hide' : 'Show'} breakdown
        </button>

        {showDetails && (
          <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Gross Repayment</span>
              <span className="font-medium">{formatCurrency(saleRepayment)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Interest ({formatPercentage(interestRate)})</span>
              <span className="font-medium text-red-600">-{formatCurrency(interest)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between text-sm">
              <span className="font-medium text-gray-700">Principal Repayment</span>
              <span className="font-medium text-green-600">{formatCurrency(principalRepayment)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Remaining Loan Balance</span>
              <span className="font-medium">{formatCurrency(remainingBalance)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
