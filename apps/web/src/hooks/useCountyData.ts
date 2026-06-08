'use client';

import { useState, useCallback } from 'react';
import apiClient from '@/lib/api-client';

interface CountyMetric {
  countyId: string;
  countyName: string;
  loanVolume: number;
  repaymentRate: number;
  activeSmes: number;
  totalDisbursed: number;
  totalRepaid: number;
  defaultRate: number;
}

interface CountyLeaderboardEntry {
  rank: number;
  countyId: string;
  countyName: string;
  loansDisbursed: number;
  repaymentRate: number;
  smeCount: number;
  totalVolume: number;
}

interface UseCountyDataReturn {
  countyData: CountyMetric[];
  leaderboard: CountyLeaderboardEntry[];
  isLoading: boolean;
  error: string | null;
  fetchCountyData: () => Promise<void>;
  fetchCountyDetail: (countyId: string) => Promise<CountyMetric>;
}

export function useCountyData(): UseCountyDataReturn {
  const [countyData, setCountyData] = useState<CountyMetric[]>([]);
  const [leaderboard, setLeaderboard] = useState<CountyLeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCountyData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/analytics/counties');
      setCountyData(response.data.counties);
      setLeaderboard(response.data.leaderboard);
    } catch {
      setError('Failed to fetch county data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCountyDetail = useCallback(async (countyId: string): Promise<CountyMetric> => {
    const response = await apiClient.get(`/analytics/counties/${countyId}`);
    return response.data;
  }, []);

  return { countyData, leaderboard, isLoading, error, fetchCountyData, fetchCountyDetail };
}
