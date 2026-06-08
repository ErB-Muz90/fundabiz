'use client';

import { useState, useCallback } from 'react';
import apiClient from '@/lib/api-client';

interface Order {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplierName: string;
  amount: number;
  status: string;
  escrowStatus: string;
  items: OrderItem[];
  createdAt: string;
  deliveryDate?: string;
  trackingCode?: string;
}

interface OrderItem {
  id: string;
  product: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface UseOrdersReturn {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  createOrder: (data: CreateOrderInput) => Promise<Order>;
  confirmDelivery: (orderId: string, deliveryCode?: string) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
}

interface CreateOrderInput {
  supplierId: string;
  items: { product: string; quantity: number; unitPrice: number }[];
  deliveryDate?: string;
  notes?: string;
}

export function useOrders(): UseOrdersReturn {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/orders');
      setOrders(response.data.orders);
    } catch {
      setError('Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createOrder = useCallback(async (data: CreateOrderInput): Promise<Order> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/orders', data);
      setOrders((prev) => [response.data.order, ...prev]);
      return response.data.order;
    } catch {
      setError('Failed to create order');
      throw new Error('Failed to create order');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const confirmDelivery = useCallback(async (orderId: string, deliveryCode?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.post(`/orders/${orderId}/confirm-delivery`, { delivery_code: deliveryCode });
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: 'delivered', escrowStatus: 'completed' } : o
        )
      );
    } catch {
      setError('Failed to confirm delivery');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cancelOrder = useCallback(async (orderId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.post(`/orders/${orderId}/cancel`);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: 'cancelled' } : o))
      );
    } catch {
      setError('Failed to cancel order');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { orders, isLoading, error, fetchOrders, createOrder, confirmDelivery, cancelOrder };
}
