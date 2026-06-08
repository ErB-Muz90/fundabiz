'use client';

import { useState } from 'react';
import { RegionalAdminSidebar } from '@/components/layout/RegionalAdminSidebar';
import { Header } from '@/components/layout/Header';
import { RoleGuard } from '@/components/layout/RoleGuard';
import { Role } from '@/lib/rbac';

export default function RegionalAdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <RoleGuard roles={[Role.REGIONAL_ADMIN]}>
      <div className="min-h-screen bg-gray-50">
        <RegionalAdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="lg:pl-64">
          <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
          <main className="p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </RoleGuard>
  );
}
