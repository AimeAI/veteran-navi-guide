import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Briefcase, Star, MessageSquare, Award, BarChart2 } from 'lucide-react';
import GamificationDashboard from '@/components/gamification/GamificationDashboard';
import GameActivityCard from '@/components/gamification/GameActivityCard';
import GamificationRewards from '@/components/gamification/GamificationRewards';

// Mock data for activities
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
  }
];

// Mock data for rewards
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
  }
];

export default function VeteranDashboard() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">
            <BarChart2 className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="jobs">
            <Briefcase className="mr-2 h-4 w-4" />
            My Jobs
          </TabsTrigger>
          <TabsTrigger value="achievements">
            <Award className="mr-2 h-4 w-4" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="messages">
            <MessageSquare className="mr-2 h-4 w-4" />
            Messages
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Dashboard Overview</h2>
            {/* Dashboard overview content would go here */}
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">Welcome to Your Veteran Dashboard</h3>
              <p className="text-muted-foreground">Track your job applications, manage your profile, and more</p>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="jobs">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">My Jobs</h2>
            {/* My Jobs content would go here */}
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">Track Your Job Applications</h3>
              <p className="text-muted-foreground">View and manage your submitted applications</p>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="achievements">
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
        </TabsContent>
        
        <TabsContent value="messages">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Messages</h2>
            {/* Messages content would go here */}
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">Your Messages</h3>
              <p className="text-muted-foreground">Connect with employers and career advisors</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
