import { create } from 'zustand';
import { Role } from '@/lib/rbac';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  businessName?: string;
  role: Role;
  countyId?: string;
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  role: Role | null;
  login: (user: User, token: string, refreshToken: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string, refreshToken: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  role: null,
  login: (user, token, refreshToken) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('refresh_token', refreshToken);
    set({
      user,
      token,
      refreshToken,
      isAuthenticated: true,
      role: user.role,
    });
  },
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    set({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      role: null,
    });
  },
  setUser: (user) => set({ user, role: user.role }),
  setToken: (token, refreshToken) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('refresh_token', refreshToken);
    set({ token, refreshToken });
  },
}));
