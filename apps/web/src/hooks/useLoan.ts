'use client';

import { useState, useCallback } from 'react';
import apiClient from '@/lib/api-client';

interface Loan {
  id: string;
  amount: number;
  disbursedAmount: number;
  interestRate: number;
  tenureMonths: number;
  status: 'active' | 'completed' | 'defaulted' | 'pending';
  purpose: string;
  createdAt: string;
  nextRepaymentDate?: string;
  nextRepaymentAmount?: number;
  totalRepaid: number;
  totalDue: number;
  health: 'on_track' | 'at_risk' | 'defaulted';
}

interface RepaymentSchedule {
  id: string;
  dueDate: string;
  amount: number;
  principal: number;
  interest: number;
  status: 'pending' | 'paid' | 'overdue' | 'partial';
  paidAmount?: number;
  paidAt?: string;
}

interface RepaymentLog {
  id: string;
  amount: number;
  method: 'mpesa' | 'wallet' | 'deduction';
  reference: string;
  status: string;
  createdAt: string;
}

interface UseLoanReturn {
  loan: Loan | null;
  schedule: RepaymentSchedule[];
  repaymentLog: RepaymentLog[];
  isLoading: boolean;
  error: string | null;
  fetchLoan: () => Promise<void>;
}

export function useLoan(): UseLoanReturn {
  const [loan, setLoan] = useState<Loan | null>(null);
  const [schedule, setSchedule] = useState<RepaymentSchedule[]>([]);
  const [repaymentLog, setRepaymentLog] = useState<RepaymentLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLoan = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [loanRes, scheduleRes, logRes] = await Promise.all([
        apiClient.get('/loans/active'),
        apiClient.get('/loans/schedule'),
        apiClient.get('/loans/repayment-log'),
      ]);
      setLoan(loanRes.data.loan);
      setSchedule(scheduleRes.data.schedule);
      setRepaymentLog(logRes.data.logs);
    } catch {
      setError('Failed to fetch loan data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { loan, schedule, repaymentLog, isLoading, error, fetchLoan };
}
