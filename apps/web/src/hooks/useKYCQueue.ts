'use client';

import { useState, useCallback } from 'react';
import apiClient from '@/lib/api-client';

interface KYCApplication {
  id: string;
  userId: string;
  userName: string;
  businessName: string;
  businessType: string;
  county: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  riskScore: number;
  documents: KYCDocument[];
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

interface KYCDocument {
  id: string;
  type: string;
  url: string;
  status: 'verified' | 'pending' | 'rejected';
}

interface UseKYCQueueReturn {
  applications: KYCApplication[];
  isLoading: boolean;
  error: string | null;
  fetchApplications: (filters?: Record<string, string>) => Promise<void>;
  approve: (applicationId: string, notes?: string) => Promise<void>;
  reject: (applicationId: string, reason: string) => Promise<void>;
  flag: (applicationId: string, reason: string) => Promise<void>;
}

export function useKYCQueue(): UseKYCQueueReturn {
  const [applications, setApplications] = useState<KYCApplication[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async (filters?: Record<string, string>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/kyc/applications', { params: filters });
      setApplications(response.data.applications);
    } catch {
      setError('Failed to fetch KYC applications');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const approve = useCallback(async (applicationId: string, notes?: string) => {
    setIsLoading(true);
    try {
      await apiClient.post(`/kyc/${applicationId}/approve`, { notes });
      setApplications((prev) =>
        prev.map((a) => (a.id === applicationId ? { ...a, status: 'approved' } : a))
      );
    } catch {
      setError('Failed to approve application');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reject = useCallback(async (applicationId: string, reason: string) => {
    setIsLoading(true);
    try {
      await apiClient.post(`/kyc/${applicationId}/reject`, { reason });
      setApplications((prev) =>
        prev.map((a) => (a.id === applicationId ? { ...a, status: 'rejected' } : a))
      );
    } catch {
      setError('Failed to reject application');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const flag = useCallback(async (applicationId: string, reason: string) => {
    setIsLoading(true);
    try {
      await apiClient.post(`/kyc/${applicationId}/flag`, { reason });
      setApplications((prev) =>
        prev.map((a) => (a.id === applicationId ? { ...a, status: 'flagged' } : a))
      );
    } catch {
      setError('Failed to flag application');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { applications, isLoading, error, fetchApplications, approve, reject, flag };
}
