import { create } from 'zustand';
import apiClient from '@/lib/api-client';
import { formatCurrency } from '@/lib/format';

interface Transaction {
  id: string;
  type: 'payment' | 'disbursement' | 'repayment' | 'transfer' | 'escrow_release' | 'escrow_hold' | 'withdrawal' | 'deposit';
  description: string;
  amount: number;
  direction: 'in' | 'out';
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

interface WalletState {
  balance: number;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  fetchBalance: () => Promise<void>;
  fetchTransactions: (page?: number, limit?: number) => Promise<void>;
}

export const useWalletStore = create<WalletState>((set) => ({
  balance: 0,
  transactions: [],
  isLoading: false,
  error: null,
  fetchBalance: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/wallet/balance');
      set({ balance: response.data.balance, isLoading: false });
    } catch {
      set({ error: 'Failed to fetch balance', isLoading: false });
    }
  },
  fetchTransactions: async (page = 1, limit = 20) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/wallet/transactions', {
        params: { page, limit },
      });
      set({ transactions: response.data.transactions, isLoading: false });
    } catch {
      set({ error: 'Failed to fetch transactions', isLoading: false });
    }
  },
}));
