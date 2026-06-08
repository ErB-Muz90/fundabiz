import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { setAuthToken } from '../services/kyc.service';

export interface Agent {
  id: string;
  name: string;
  phone: string;
  email: string;
  token: string;
}

interface AuthState {
  agent: Agent | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  agent: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (phone: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { default: api } = await import('../services/kyc.service');
      const response = await api.post('/auth/login', { phone, password });
      const agent: Agent = response.data;

      await SecureStore.setItemAsync('auth_token', agent.token);
      await SecureStore.setItemAsync('agent_data', JSON.stringify(agent));

      setAuthToken(agent.token);
      set({ agent, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || 'Login failed';
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  logout: async () => {
    try {
      await SecureStore.deleteItemAsync('auth_token');
      await SecureStore.deleteItemAsync('agent_data');
    } catch {
      // ignore cleanup errors
    }
    setAuthToken(null);
    set({ agent: null, isAuthenticated: false });
  },

  restoreSession: async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      const agentData = await SecureStore.getItemAsync('agent_data');

      if (token && agentData) {
        const agent: Agent = JSON.parse(agentData);
        setAuthToken(agent.token);
        set({ agent, isAuthenticated: true });
      }
    } catch {
      await SecureStore.deleteItemAsync('auth_token');
      await SecureStore.deleteItemAsync('agent_data');
    }
  },
}));
