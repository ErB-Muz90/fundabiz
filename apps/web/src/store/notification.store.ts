import { create } from 'zustand';
import apiClient from '@/lib/api-client';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
  link?: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (notification: Notification) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get('/notifications');
      const notifications: Notification[] = response.data.notifications;
      set({
        notifications,
        unreadCount: notifications.filter((n) => !n.isRead).length,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },
  markAsRead: async (id) => {
    try {
      await apiClient.patch(`/notifications/${id}/read`);
      const notifications = get().notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      );
      set({
        notifications,
        unreadCount: notifications.filter((n) => !n.isRead).length,
      });
    } catch {
      // silent
    }
  },
  markAllAsRead: async () => {
    try {
      await apiClient.patch('/notifications/read-all');
      const notifications = get().notifications.map((n) => ({ ...n, isRead: true }));
      set({ notifications, unreadCount: 0 });
    } catch {
      // silent
    }
  },
  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },
}));
