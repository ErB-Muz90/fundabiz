'use client';

import { useState, useCallback } from 'react';
import apiClient from '@/lib/api-client';

interface FraudFlag {
  id: string;
  entityId: string;
  entityType: 'user' | 'application' | 'transaction';
  entityName: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved';
  description: string;
  flaggedBy: string;
  flaggedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

interface UseFraudAlertsReturn {
  flags: FraudFlag[];
  isLoading: boolean;
  error: string | null;
  fetchFlags: (filters?: Record<string, string>) => Promise<void>;
  resolveFlag: (flagId: string, resolution: string) => Promise<void>;
  updateStatus: (flagId: string, status: 'investigating' | 'resolved') => Promise<void>;
}

export function useFraudAlerts(): UseFraudAlertsReturn {
  const [flags, setFlags] = useState<FraudFlag[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFlags = useCallback(async (filters?: Record<string, string>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/fraud/flags', { params: filters });
      setFlags(response.data.flags);
    } catch {
      setError('Failed to fetch fraud flags');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resolveFlag = useCallback(async (flagId: string, resolution: string) => {
    setIsLoading(true);
    try {
      await apiClient.post(`/fraud/${flagId}/resolve`, { resolution });
      setFlags((prev) =>
        prev.map((f) =>
          f.id === flagId ? { ...f, status: 'resolved' as const, resolvedAt: new Date().toISOString() } : f
        )
      );
    } catch {
      setError('Failed to resolve flag');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateStatus = useCallback(async (flagId: string, status: 'investigating' | 'resolved') => {
    try {
      await apiClient.patch(`/fraud/${flagId}/status`, { status });
      setFlags((prev) =>
        prev.map((f) => (f.id === flagId ? { ...f, status } : f))
      );
    } catch {
      setError('Failed to update status');
    }
  }, []);

  return { flags, isLoading, error, fetchFlags, resolveFlag, updateStatus };
}
