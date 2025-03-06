
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatsCardGroup from '@/components/StatsCardGroup';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RefreshCw, UserCheck, FileCheck, MessageSquare } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import UserManagement from '@/components/admin/UserManagement';
import JobModeration from '@/components/admin/JobModeration';
import ForumModeration from '@/components/admin/ForumModeration';
import { Separator } from '@/components/ui/separator';

// Mock admin data fetching function (to be replaced with Supabase queries)
const fetchAdminStats = async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In a real app, this would fetch from Supabase
  return {
    users: {
      total: 2547,
      veterans: 1865,
      employers: 682,
      dailyActive: 432,
      monthlyActive: 1753
    },
    jobs: {
      active: 389,
      pending: 47,
      total: 2156
    },
    applications: {
      total: 8924,
      thisMonth: 1245,
      thisWeek: 342
    },
    forum: {
      topics: 326,
      posts: 4583,
      reports: 18,
      activeUsers: 754
    }
  };
};

const AdminDashboard = () => {
  const { user } = useUser();
  
  // Fetch admin data
  const { 
    data: adminStats, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['adminStats'],
    queryFn: fetchAdminStats,
    // In a real app, disable the query if the user isn't an admin
    enabled: !!user, 
  });

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <section>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold text-gray-800">Overview</h2>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch()} 
            disabled={isLoading}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {isError ? (
          <Card className="bg-red-50 border-red-200 mb-6">
            <CardContent className="pt-6">
              <p className="text-red-600">Error loading admin statistics: {error?.message || 'Please try again'}</p>
            </CardContent>
          </Card>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <StatsCardGroup
            stats={{
              users: adminStats?.users.total || 0,
              jobs: adminStats?.jobs.active || 0,
              applications: adminStats?.applications.total || 0,
              forum: adminStats?.forum.posts || 0
            }}
          />
        )}

        {!isLoading && adminStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">User Statistics</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Veterans:</span>
                    <span className="font-medium">{adminStats.users.veterans}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Employers:</span>
                    <span className="font-medium">{adminStats.users.employers}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Daily Active:</span>
                    <span className="font-medium">{adminStats.users.dailyActive}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Monthly Active:</span>
                    <span className="font-medium">{adminStats.users.monthlyActive}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Job Statistics</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Active Jobs:</span>
                    <span className="font-medium">{adminStats.jobs.active}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Pending Approval:</span>
                    <span className="font-medium">{adminStats.jobs.pending}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Total Posted:</span>
                    <span className="font-medium">{adminStats.jobs.total}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Forum Statistics</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Topics:</span>
                    <span className="font-medium">{adminStats.forum.topics}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Posts:</span>
                    <span className="font-medium">{adminStats.forum.posts}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Reported Content:</span>
                    <span className="font-medium">{adminStats.forum.reports}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Active Users:</span>
                    <span className="font-medium">{adminStats.forum.activeUsers}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </section>

      <Separator />
      
      {/* Admin Tabs */}
      <section>
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="w-full justify-start mb-4">
            <TabsTrigger value="users" className="flex gap-2">
              <UserCheck className="h-4 w-4" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex gap-2">
              <FileCheck className="h-4 w-4" />
              Job Moderation
            </TabsTrigger>
            <TabsTrigger value="forum" className="flex gap-2">
              <MessageSquare className="h-4 w-4" />
              Forum Moderation
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="pt-4">
            <UserManagement isLoading={isLoading} />
          </TabsContent>
          
          <TabsContent value="jobs" className="pt-4">
            <JobModeration isLoading={isLoading} />
          </TabsContent>
          
          <TabsContent value="forum" className="pt-4">
            <ForumModeration isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default AdminDashboard;
