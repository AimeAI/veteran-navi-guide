
import { memoizeWithExpiry } from './performanceUtils';

export const generateReferralLink = (userId: string): string => {
  // In a real app, this would generate a unique, secure referral code
  const baseUrl = window.location.origin;
  return `${baseUrl}/signup?ref=${encodeURIComponent(userId)}`;
};

export interface ReferralStats {
  totalReferrals: number;
  successfulReferrals: number;
  rewardsEarned: number;
  progressToNextReward: number;
  remainingForNextReward: number;
  recentReferrals: Array<{
    email: string;
    status: 'pending' | 'completed';
    date: string;
  }>;
}

// Memoized function to prevent unnecessary API calls
export const fetchReferralStats = memoizeWithExpiry(
  async (userId: string): Promise<ReferralStats> => {
    // In a real app, this would make an API call to fetch real stats
    // For now, return mock data
    return {
      totalReferrals: 5,
      successfulReferrals: 3,
      rewardsEarned: 2,
      progressToNextReward: 60,
      remainingForNextReward: 2,
      recentReferrals: [
        {
          email: "friend@example.com",
          status: "completed",
          date: new Date().toISOString()
        }
      ]
    };
  },
  (userId) => `referral-stats-${userId}`,
  5 * 60 * 1000 // Cache for 5 minutes
);
