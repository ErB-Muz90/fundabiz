'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import apiClient from '@/lib/api-client';

interface Transaction {
  id: string;
  type: string;
  description: string;
  amount: number;
  direction: 'in' | 'out';
  status: string;
  createdAt: string;
}

interface WalletData {
  balance: number;
  transactions: Transaction[];
}

interface UseWalletReturn {
  balance: number;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useWallet(pollInterval: number = 30000): UseWalletReturn {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [balanceRes, txRes] = await Promise.all([
        apiClient.get('/wallet/balance'),
        apiClient.get('/wallet/transactions', { params: { page: 1, limit: 20 } }),
      ]);
      setBalance(balanceRes.data.balance);
      setTransactions(txRes.data.transactions);
      setError(null);
    } catch {
      setError('Failed to fetch wallet data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    if (pollInterval > 0) {
      intervalRef.current = setInterval(fetchData, pollInterval);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchData, pollInterval]);

  return { balance, transactions, isLoading, error, refetch: fetchData };
}
