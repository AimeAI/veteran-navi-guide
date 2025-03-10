
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Sparkles, Star, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type Reward = {
  id: string;
  title: string;
  description: string;
  requiredPoints: number;
  isUnlocked: boolean;
  isClaimed: boolean;
  image?: string;
};

interface GamificationRewardsProps {
  userPoints: number;
  rewards: Reward[];
  className?: string;
}

export default function GamificationRewards({ userPoints, rewards, className }: GamificationRewardsProps) {
  const handleClaimReward = (rewardId: string) => {
    // In production, this would call a Supabase function to claim the reward
    console.log("Claiming reward:", rewardId);
    toast.success("Reward claimed successfully!");
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Gift className="h-5 w-5 mr-2 text-pink-500" />
          Veteran Rewards
        </CardTitle>
        <CardDescription>
          Unlock exclusive benefits by earning points
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {rewards.map((reward) => {
            const progress = Math.min(Math.round((userPoints / reward.requiredPoints) * 100), 100);
            const isAvailable = userPoints >= reward.requiredPoints;
            
            return (
              <div 
                key={reward.id} 
                className={`border rounded-md overflow-hidden ${
                  reward.isUnlocked 
                    ? 'border-green-200 bg-green-50' 
                    : isAvailable 
                      ? 'border-blue-200 bg-blue-50' 
                      : 'border-gray-200'
                }`}
              >
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium flex items-center">
                        {reward.title}
                        {reward.isUnlocked && (
                          <Badge className="ml-2 bg-green-100 text-green-800 border-green-200">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Unlocked
                          </Badge>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{reward.description}</p>
                    </div>
                    
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-amber-500 mr-1" />
                      <span className="font-semibold">{reward.requiredPoints}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-xs text-muted-foreground">
                        {userPoints} / {reward.requiredPoints} points
                      </div>
                      {!isAvailable && (
                        <div className="text-xs text-blue-600 font-medium">
                          {reward.requiredPoints - userPoints} points needed
                        </div>
                      )}
                    </div>
                    <Progress value={progress} className="h-2" indicatorClassName={
                      reward.isUnlocked ? "bg-green-500" : isAvailable ? "bg-blue-500" : undefined
                    } />
                  </div>
                  
                  <div className="mt-4">
                    {reward.isUnlocked && reward.isClaimed ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Claimed
                      </Badge>
                    ) : isAvailable ? (
                      <Button
                        size="sm"
                        onClick={() => handleClaimReward(reward.id)}
                        disabled={reward.isClaimed}
                        variant={reward.isUnlocked ? "default" : "outline"}
                        className={reward.isUnlocked ? "bg-green-600 hover:bg-green-700" : ""}
                      >
                        {reward.isUnlocked ? "Claim Reward" : "Unlock Reward"}
                      </Button>
                    ) : (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Keep earning points to unlock
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
