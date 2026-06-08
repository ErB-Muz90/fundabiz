'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';
import { Bell, LogOut, Menu, ChevronDown, User } from 'lucide-react';
import { clsx } from 'clsx';
import { useNotificationStore } from '@/store/notification.store';
import { getRoleBadgeVariant, getRoleName } from '@/lib/rbac';
import { Badge } from '@/components/shared/Badge';

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { data: session } = useSession();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead } = useNotificationStore();

  const user = session?.user as Record<string, unknown> | undefined;
  const role = user?.role as string | undefined;
  const name = user?.name as string || user?.email as string || 'User';

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>

        <div className="hidden lg:block" />

        <div className="flex items-center gap-3">
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 rounded-lg hover:bg-gray-100"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <button onClick={markAllAsRead} className="text-xs text-brand-600 hover:underline">
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8">No notifications</p>
                  ) : (
                    notifications.slice(0, 10).map((notif) => (
                      <button
                        key={notif.id}
                        onClick={() => markAsRead(notif.id)}
                        className={clsx(
                          'w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0',
                          !notif.isRead && 'bg-brand-50/50'
                        )}
                      >
                        <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{notif.message}</p>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100"
            >
              <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
                <User className="w-4 h-4 text-brand-600" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">{name}</p>
                {role && (
                  <Badge variant={getRoleBadgeVariant(role as any) as any} size="sm">
                    {getRoleName(role as any)}
                  </Badge>
                )}
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email as string}</p>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
