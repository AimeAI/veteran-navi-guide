
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import JobList from '@/components/JobList';
import { useJobSearch } from '@/hooks/useJobSearch';
import type { JobSearchParams } from '@/types/jobSearch';
import { Card, CardContent } from '@/components/ui/card';
import { JobCache } from '@/utils/jobCache';
import JobBoardHeader from '@/components/job-board/JobBoardHeader';
import JobSearchForm from '@/components/job-board/JobSearchForm';

const JobBoardPage: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchParams, setSearchParams] = useState<JobSearchParams>({
    keywords: '',
    location: '',
    radius: 25,
    page: 1,
  });

  const { 
    jobs, 
    isLoading, 
    error, 
    currentPage, 
    totalPages, 
    totalJobs, 
    setPage,
    refreshJobs
  } = useJobSearch(searchParams);

  const handleSearch = (params: JobSearchParams) => {
    setSearchParams({
      ...searchParams,
      ...params,
      page: 1, // Reset to first page on new search
    });
    toast.info("Searching for jobs...");
  };

  const handleRefreshJobs = async () => {
    setIsRefreshing(true);
    try {
      JobCache.clearCache();
      toast.info("Cleared job search cache");
      await refreshJobs();
      toast.success("Job results refreshed with latest listings");
    } catch (error) {
      console.error('Error refreshing jobs:', error);
      toast.error("Failed to refresh job results");
    } finally {
      setIsRefreshing(false);
    }
  };
  
  useEffect(() => {
    const hasInitialData = sessionStorage.getItem('hasInitialJobData');
    if (!hasInitialData) {
      toast.info("Loading initial job listings...");
      refreshJobs().then(() => {
        sessionStorage.setItem('hasInitialJobData', 'true');
        toast.success("Job listings loaded successfully");
      });
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Card className="mb-8">
            <JobBoardHeader 
              isRefreshing={isRefreshing} 
              isLoading={isLoading} 
              onRefresh={handleRefreshJobs} 
            />
            <JobSearchForm 
              onSearch={handleSearch} 
              initialFilters={{
                keywords: searchParams.keywords || '',
                location: searchParams.location || '',
                radius: searchParams.radius || 25,
              }}
            />
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <JobList
                jobs={jobs}
                isLoading={isLoading}
                error={error}
                currentPage={currentPage}
                totalPages={totalPages}
                totalJobs={totalJobs}
                onPageChange={setPage}
                country="canada"
                onRefresh={refreshJobs}
              />
            </CardContent>
          </Card>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2023 VeteranJobBoard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default JobBoardPage;
