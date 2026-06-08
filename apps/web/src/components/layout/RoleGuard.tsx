'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Role } from '@/lib/rbac';

interface RoleGuardProps {
  roles: Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGuard({ roles, children, fallback }: RoleGuardProps) {
  const { role, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    router.replace('/login');
    return null;
  }

  if (!role || !roles.includes(role)) {
    if (fallback) return <>{fallback}</>;
    router.replace('/login');
    return null;
  }

  return <>{children}</>;
}
