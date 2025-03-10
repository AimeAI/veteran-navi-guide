
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Briefcase, Users, CheckCircle, Clock, User, BarChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatsCardGroup from '@/components/StatsCardGroup';
import StatsCard from '@/components/StatsCard';
import ApplicationsTable from './ApplicationsTable';
import ApplicationStatusChart from './ApplicationStatusChart';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';
import { Application } from './ApplicationCard';

export default function EmployerDashboard() {
  const { user } = useUser();
  
  const { data: dashboardData, isLoading: isLoadingDashboard } = useQuery({
    queryKey: ['employerDashboard', user?.email],
    queryFn: async () => {
      // This would be replaced with actual Supabase fetch in production
      // For demo purposes, we'll use mock data
      
      // In a real implementation, fetch from Supabase:
      // const { data, error } = await supabase
      //   .from('applications')
      //   .select('*')
      //   .eq('employer_id', user?.id);
      
      return {
        totalJobs: 12,
        activeJobs: 8,
        totalApplications: 43,
        newApplications: 7,
        interviewsScheduled: 5,
        hired: 3,
        conversionRate: 7.5,
        averageTimeToHire: 14
      };
    },
    enabled: !!user?.email,
  });
  
  const { data: recentApplications, isLoading: isLoadingApplications } = useQuery({
    queryKey: ['recentApplications', user?.email],
    queryFn: async () => {
      // Mock data for recent applications - ensure status values match ApplicationStatus type
      return Array(5).fill(null).map((_, index) => ({
        id: `app-${index + 1}`,
        candidateName: `Candidate ${index + 1}`,
        jobTitle: `Position ${['Software Engineer', 'Project Manager', 'UI Designer', 'DevOps Engineer', 'QA Analyst'][index]}`,
        applicationDate: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        status: ['Under Review', 'Screening', 'Interview Scheduled', 'Offered', 'Hired'][index] as Application['status'],
        skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'AWS'].slice(0, 3 + (index % 3))
      })) as Application[];
    },
    enabled: !!user?.email,
  });
  
  const isLoading = isLoadingDashboard || isLoadingApplications;
  
  if (isLoading) {
    return <div className="p-8 text-center">Loading dashboard data...</div>;
  }
  
  return (
    <div className="space-y-6">
      {/* Dashboard summary stats */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Dashboard Overview</h2>
        <StatsCardGroup>
          <StatsCard 
            title="Active Jobs" 
            value={dashboardData?.activeJobs || 0} 
            icon={Briefcase}
            description={`of ${dashboardData?.totalJobs || 0} total jobs`}
          />
          <StatsCard 
            title="Total Applicants" 
            value={dashboardData?.totalApplications || 0} 
            icon={Users}
            trend={dashboardData?.newApplications ? { 
              value: Math.round((dashboardData.newApplications / dashboardData.totalApplications) * 100), 
              isPositive: true 
            } : undefined}
            description="applicants this month"
          />
          <StatsCard 
            title="Interviews Scheduled" 
            value={dashboardData?.interviewsScheduled || 0} 
            icon={Clock}
          />
          <StatsCard 
            title="Hired" 
            value={dashboardData?.hired || 0} 
            icon={CheckCircle}
            description="candidates this quarter"
          />
        </StatsCardGroup>
      </div>
      
      {/* Performance metrics */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.conversionRate || 0}%</div>
              <p className="text-xs text-muted-foreground">Applications to hires</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Time to Hire</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.averageTimeToHire || 0} days</div>
              <p className="text-xs text-muted-foreground">From application to offer</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Recent applications */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Applications</h2>
        <ApplicationsTable applications={recentApplications || []} />
      </div>
      
      {/* Application status distribution */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Application Status Distribution</h2>
        <Card>
          <CardContent className="pt-6">
            <ApplicationStatusChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
