'use client';

import { useState } from 'react';
import { SupplierSidebar } from '@/components/layout/SupplierSidebar';
import { Header } from '@/components/layout/Header';
import { RoleGuard } from '@/components/layout/RoleGuard';
import { Role } from '@/lib/rbac';

export default function SupplierLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <RoleGuard roles={[Role.SUPPLIER]}>
      <div className="min-h-screen bg-gray-50">
        <SupplierSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="lg:pl-64">
          <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
          <main className="p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </RoleGuard>
  );
}
