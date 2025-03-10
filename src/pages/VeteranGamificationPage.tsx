
import React from 'react';
import { Card } from '@/components/ui/card';
import GamificationDashboard from '@/components/gamification/GamificationDashboard';
import GameActivityCard from '@/components/gamification/GameActivityCard';
import GamificationRewards from '@/components/gamification/GamificationRewards';

// Mock data
const recentActivities = [
  {
    id: '1',
    type: 'badge' as const,
    title: 'Profile Master Badge Earned',
    description: 'Completed your veteran profile with all required information',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    points: 50,
    badgeName: 'Profile Master'
  },
  {
    id: '2',
    type: 'points' as const,
    title: 'Job Application Submitted',
    description: 'Applied for Software Engineer position at Tech Corp',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    points: 25
  },
  {
    id: '3',
    type: 'challenge' as const,
    title: 'Weekly Challenge Completed',
    description: 'Applied to 3 jobs matching your skill set',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    points: 100
  },
  {
    id: '4',
    type: 'level' as const,
    title: 'Level Up!',
    description: 'Advanced to Level 5 in your veteran career journey',
    timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const availableRewards = [
  {
    id: '1',
    title: 'Resume Review',
    description: 'Get your resume reviewed by a career professional',
    requiredPoints: 500,
    isUnlocked: true,
    isClaimed: false
  },
  {
    id: '2',
    title: 'Mock Interview Session',
    description: '30-minute mock interview with feedback',
    requiredPoints: 750,
    isUnlocked: false,
    isClaimed: false
  },
  {
    id: '3',
    title: 'Featured Profile',
    description: 'Get your profile featured to top employers for 1 week',
    requiredPoints: 1000,
    isUnlocked: false,
    isClaimed: false
  },
  {
    id: '4',
    title: 'Career Coaching Call',
    description: '1-hour coaching call with a military transition expert',
    requiredPoints: 1500,
    isUnlocked: false,
    isClaimed: false
  }
];

export default function VeteranGamificationPage() {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Veteran Career Journey</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <GamificationDashboard />
          </Card>
        </div>
        
        <div className="space-y-6">
          <GameActivityCard activities={recentActivities} />
          <GamificationRewards 
            userPoints={625} 
            rewards={availableRewards} 
          />
        </div>
      </div>
    </div>
  );
}
