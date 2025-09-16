import { useState, useEffect } from 'react';
import { progressAPI, UserProgressData } from '@/lib/progressApi';

interface UseProgressAPIResult {
  data: UserProgressData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useProgressAPI(): UseProgressAPIResult {
  const [data, setData] = useState<UserProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      setError(null);
      const userId = progressAPI.getUserId();
      const response = await progressAPI.getUserProgress(userId);
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch progress');
      console.error('Failed to fetch progress:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchProgress,
  };
}
