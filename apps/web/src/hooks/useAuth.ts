'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useAuthStore } from '@/store/auth.store';
import { Role } from '@/lib/rbac';
import { useEffect } from 'react';

interface LoginCredentials {
  email: string;
  password: string;
}

interface UseAuthReturn {
  user: ReturnType<typeof useAuthStore.getState>['user'];
  role: Role | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const { data: session, status } = useSession();
  const storeUser = useAuthStore((s) => s.user);
  const storeRole = useAuthStore((s) => s.role);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setUser = useAuthStore((s) => s.setUser);
  const logoutStore = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (session?.user) {
      const sessionUser = session.user as Record<string, unknown>;
      setUser({
        id: sessionUser.id as string,
        email: sessionUser.email as string,
        firstName: (sessionUser.firstName as string) || undefined,
        lastName: (sessionUser.lastName as string) || undefined,
        role: sessionUser.role as Role,
        countyId: sessionUser.countyId as string | undefined,
        avatarUrl: sessionUser.image as string | undefined,
      });
    }
  }, [session, setUser]);

  const login = async (credentials: LoginCredentials) => {
    const result = await signIn('credentials', {
      ...credentials,
      redirect: false,
    });
    if (result?.error) {
      throw new Error(result.error);
    }
  };

  const logout = async () => {
    logoutStore();
    await signOut({ redirect: true, callbackUrl: '/login' });
  };

  return {
    user: storeUser,
    role: storeRole,
    isAuthenticated: isAuthenticated || status === 'authenticated',
    isLoading: status === 'loading',
    login,
    logout,
  };
}
