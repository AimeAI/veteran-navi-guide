
import React from 'react';
import ReferralDashboard from '@/components/referral/ReferralDashboard';
import ReferralShare from '@/components/referral/ReferralShare';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/context/UserContext';

const ReferralProgramPage = () => {
  const { user } = useUser();

  if (!user) {
    return <div>Please log in to access the referral program.</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Referral Program</h1>
      <Tabs defaultValue="share" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="share">Share & Earn</TabsTrigger>
          <TabsTrigger value="dashboard">Your Referrals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="share">
          <Card>
            <CardHeader>
              <CardTitle>Share with Friends</CardTitle>
              <CardDescription>
                Invite your friends and earn rewards for each successful referral
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReferralShare userId={user.email} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="dashboard">
          <Card>
            <CardHeader>
              <CardTitle>Referral Dashboard</CardTitle>
              <CardDescription>
                Track your referrals and rewards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReferralDashboard userId={user.email} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReferralProgramPage;
