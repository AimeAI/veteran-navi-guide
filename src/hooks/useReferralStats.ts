
import { useState, useEffect } from 'react';
import { ReferralStats, fetchReferralStats } from '@/utils/referralUtils';

export const useReferralStats = (userId: string) => {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchReferralStats(userId);
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load referral stats'));
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, [userId]);

  return { stats, isLoading, error };
};
