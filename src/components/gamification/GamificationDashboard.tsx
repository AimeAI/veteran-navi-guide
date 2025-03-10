import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Award, Star, Users, Target, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import VeteranBadges from '@/components/VeteranBadges';
import { VeteranBadge, BadgeType } from "@/types/badges";
import { useUser } from '@/context/UserContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { determineEarnedBadges } from '@/utils/badges/badgeEarningLogic';

const mockLeaderboard = [
  { id: '1', name: 'John Doe', points: 850, avatarUrl: '', rank: 1 },
  { id: '2', name: 'Jane Smith', points: 720, avatarUrl: '', rank: 2 },
  { id: '3', name: 'Robert Johnson', points: 685, avatarUrl: '', rank: 3 },
  { id: '4', name: 'Emily Wilson', points: 650, avatarUrl: '', rank: 4 },
  { id: '5', name: 'Michael Brown', points: 610, avatarUrl: '', rank: 5 },
];

export interface UserStats {
  points: number;
  rank: number;
  totalUsers: number;
  level: number;
  nextLevelPoints: number;
  completedChallenges: number;
  totalChallenges: number;
  badgesEarned: number;
  totalBadges: number;
}

export default function GamificationDashboard() {
  const { user } = useUser();
  
  const { data: userStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['userStats', user?.email],
    queryFn: async () => {
      return {
        points: 625,
        rank: 4,
        totalUsers: 145,
        level: 5,
        nextLevelPoints: 750,
        completedChallenges: 8,
        totalChallenges: 12,
        badgesEarned: 6,
        totalBadges: 15
      } as UserStats;
    },
    enabled: !!user?.email,
  });
  
  const { data: earnedBadges, isLoading: isLoadingBadges } = useQuery({
    queryKey: ['earnedBadges', user?.email],
    queryFn: async () => {
      return determineEarnedBadges(
        user,
        Array(3).fill({}), // Mock applied jobs
        5, // Mock forum posts
        true, // Mock interview prep
        true, // Mock resume uploaded
        12, // Mock connections
        true // Mock verified skills
      );
    },
    enabled: !!user?.email,
  });
  
  const isLoading = isLoadingStats || isLoadingBadges;
  
  if (isLoading) {
    return <div className="p-4">Loading gamification data...</div>;
  }
  
  if (!userStats) {
    return <div className="p-4">Unable to load gamification data</div>;
  }
  
  const levelProgress = Math.min(
    Math.round((userStats.points / userStats.nextLevelPoints) * 100),
    100
  );
  
  const challengeProgress = Math.round(
    (userStats.completedChallenges / userStats.totalChallenges) * 100
  );
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-amber-500" />
            Your Veteran Career Journey
          </CardTitle>
          <CardDescription>
            Track your progress, earn rewards, and advance your career
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center justify-center p-4 bg-amber-50 rounded-md border border-amber-100">
              <div className="text-3xl font-bold text-amber-600">{userStats.points}</div>
              <div className="text-sm text-amber-800 mt-1">Total Points</div>
            </div>
            
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">Level {userStats.level}</div>
                <div className="text-xs text-muted-foreground">{userStats.points}/{userStats.nextLevelPoints} points</div>
              </div>
              <Progress value={levelProgress} className="h-2" />
              <div className="text-xs text-center mt-1">
                {userStats.nextLevelPoints - userStats.points} points to Level {userStats.level + 1}
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-md border border-blue-100">
              <div className="text-2xl font-bold text-blue-600">#{userStats.rank}</div>
              <div className="text-sm text-blue-800 mt-1">Rank {userStats.rank} of {userStats.totalUsers}</div>
            </div>
          </div>
          
          <div className="mt-6 flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium flex items-center">
                <Target className="h-4 w-4 mr-1 text-purple-500" />
                Career Challenges
              </div>
              <div className="text-xs text-muted-foreground">
                {userStats.completedChallenges}/{userStats.totalChallenges} completed
              </div>
            </div>
            <Progress value={challengeProgress} className="h-2" indicatorClassName="bg-purple-500" />
          </div>
        </CardContent>
      </Card>
      
      {earnedBadges && (
        <VeteranBadges earnedBadges={earnedBadges} showAvailable={true} />
      )}
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-500" />
            Veterans Leaderboard
          </CardTitle>
          <CardDescription>
            Top veterans based on platform activity and achievements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockLeaderboard.map((leader, index) => (
              <div 
                key={leader.id} 
                className={`flex items-center justify-between p-3 rounded-md ${
                  leader.id === '1' ? 'bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200' :
                  index < 3 ? 'bg-gray-50 border border-gray-100' : ''
                }`}
              >
                <div className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-4 ${
                    index === 0 ? 'bg-amber-100 text-amber-700' :
                    index === 1 ? 'bg-gray-100 text-gray-700' :
                    index === 2 ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'
                  }`}>
                    {index + 1}
                  </div>
                  
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={leader.avatarUrl} alt={leader.name} />
                    <AvatarFallback className="bg-muted">{leader.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="font-medium">{leader.name}</div>
                    <div className="text-xs text-muted-foreground">Veteran</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="flex items-center mr-2">
                    <Zap className="h-4 w-4 text-amber-500 mr-1" />
                    <span className="font-semibold">{leader.points}</span>
                  </div>
                  {index === 0 && <Trophy className="h-5 w-5 text-amber-500" />}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
