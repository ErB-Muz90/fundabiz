'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import {
  LayoutDashboard,
  UserCheck,
  Building2,
  Truck,
  ClipboardCheck,
  DollarSign,
  X,
} from 'lucide-react';

interface RegionalAdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const links = [
  { href: '/overview', label: 'Overview', icon: LayoutDashboard },
  { href: '/agents', label: 'Agents', icon: UserCheck },
  { href: '/smes', label: 'SMEs', icon: Building2 },
  { href: '/suppliers', label: 'Suppliers', icon: Truck },
  { href: '/kyc', label: 'KYC Queue', icon: ClipboardCheck },
  { href: '/disbursements', label: 'Disbursements', icon: DollarSign },
];

export function RegionalAdminSidebar({ isOpen, onClose }: RegionalAdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/overview') return pathname === '/overview';
    return pathname.startsWith(href);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={clsx(
          'fixed top-0 left-0 z-40 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <Link href="/overview" className="flex items-center gap-2">
            <span className="text-xl font-bold text-brand-600">FundaBiz</span>
            <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">Region</span>
          </Link>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 lg:hidden">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive(link.href)
                  ? 'bg-amber-50 text-amber-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <link.icon className={clsx(
                'w-5 h-5',
                isActive(link.href) ? 'text-amber-600' : 'text-gray-400'
              )} />
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
