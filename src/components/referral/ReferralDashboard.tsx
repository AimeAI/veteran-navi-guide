
import React from 'react';
import { Users, Award, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useReferralStats } from '@/hooks/useReferralStats';

interface ReferralDashboardProps {
  userId: string;
}

const ReferralDashboard: React.FC<ReferralDashboardProps> = ({ userId }) => {
  const { stats } = useReferralStats(userId);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-4 border rounded-lg bg-card">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Total Referrals</h3>
          </div>
          <p className="text-2xl font-bold mt-2">{stats?.totalReferrals || 0}</p>
        </div>
        
        <div className="p-4 border rounded-lg bg-card">
          <div className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Successful Referrals</h3>
          </div>
          <p className="text-2xl font-bold mt-2">{stats?.successfulReferrals || 0}</p>
        </div>
        
        <div className="p-4 border rounded-lg bg-card">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Rewards Earned</h3>
          </div>
          <p className="text-2xl font-bold mt-2">{stats?.rewardsEarned || 0}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Progress to Next Reward</h3>
        <Progress value={stats?.progressToNextReward || 0} className="h-2" />
        <p className="text-sm text-muted-foreground">
          {stats?.remainingForNextReward || 1} more successful referral(s) needed for next reward
        </p>
      </div>

      {stats?.recentReferrals && stats.recentReferrals.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Recent Referrals</h3>
          <div className="space-y-2">
            {stats.recentReferrals.map((referral, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{referral.email}</p>
                  <p className="text-sm text-muted-foreground">
                    {referral.status === 'pending' ? 'Pending' : 'Joined'}
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">
                  {new Date(referral.date).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-muted-foreground">No referrals yet</p>
      )}
    </div>
  );
};

export default ReferralDashboard;
