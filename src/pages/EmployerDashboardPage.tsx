
import React, { Suspense } from 'react';
import EmployerDashboard from '@/components/EmployerDashboard';
import { Building, PlusCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';

const EmployerDashboardPage = () => {
  // You would fetch any employer-specific data here if needed
  const { refetch, isRefetching } = useQuery({
    queryKey: ['employerProfile'],
    queryFn: async () => {
      // This would be replaced with actual Supabase fetch code
      console.log('Fetching employer profile data...');
      return {};
    },
    enabled: false, // This query doesn't run automatically
  });

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <main className="flex-grow container mx-auto px-4 py-12 sm:px-6 lg:px-8" id="main-content">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Building className="h-6 w-6 text-primary mr-3" aria-hidden="true" />
              <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleRefresh} 
                disabled={isRefetching}
                className="mr-2"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
                {isRefetching ? 'Refreshing...' : 'Refresh Data'}
              </Button>
              
              <Button asChild className="whitespace-nowrap">
                <Link to="/employer/post-job">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Post New Job
                </Link>
              </Button>
            </div>
          </div>
          
          <section 
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8"
            aria-labelledby="dashboard-heading"
          >
            <h2 id="dashboard-heading" className="sr-only">Employer Dashboard Content</h2>
            <Suspense fallback={<DashboardFallback />}>
              <EmployerDashboard />
            </Suspense>
          </section>
        </div>
      </main>
      
      <footer className="bg-gray-50 border-t border-gray-200 mt-auto" role="contentinfo">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2023 VeteranJobBoard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Fallback UI while the dashboard is loading
const DashboardFallback = () => {
  return (
    <div className="w-full space-y-8">
      <div className="mb-6">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-80" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="w-full">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-12 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div>
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {Array.from({ length: 5 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <Skeleton className="h-6 w-6 mx-auto mb-2" />
                <Skeleton className="h-6 w-12 mx-auto mb-2" />
                <Skeleton className="h-4 w-16 mx-auto" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <Skeleton className="h-6 w-48 mb-4" />
      
      <div className="flex flex-wrap gap-2 mb-6">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
      
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-4">
          <div className="flex items-start gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-5 w-40 mb-2" />
              <Skeleton className="h-4 w-60 mb-2" />
              <Skeleton className="h-6 w-20" />
            </div>
            <div>
              <Skeleton className="h-8 w-24 mb-2" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmployerDashboardPage;
