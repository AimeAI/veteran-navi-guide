
import { useState, useEffect, useCallback } from 'react';
import { Job } from '../types/job';
import { JobSearchParams } from '@/types/jobSearch';
import { jobSearchService } from '@/services/jobSearchService';
import { toast } from 'sonner';

export function useJobSearch(initialParams: JobSearchParams) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(initialParams.page || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [searchParams, setSearchParams] = useState<JobSearchParams>(initialParams);
  
  const fetchJobs = useCallback(async (params: JobSearchParams = searchParams) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { jobs: fetchedJobs, totalPages: pages, totalJobs: total } = 
        await jobSearchService.searchJobsWithFallback(
          params,
          params.page || currentPage,
          params.pageSize || 10
        );
      
      setJobs(fetchedJobs);
      setTotalPages(pages);
      setTotalJobs(total);
      
    } catch (err) {
      console.error('Error in useJobSearch:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch jobs'));
      toast.error('Failed to load jobs. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [searchParams, currentPage]);
  
  // Function to refresh jobs with current parameters
  const refreshJobs = useCallback(async () => {
    return fetchJobs();
  }, [fetchJobs]);
  
  // Function to set page and refresh
  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
    fetchJobs({ ...searchParams, page });
  }, [searchParams, fetchJobs]);
  
  // Initial fetch on mount
  useEffect(() => {
    fetchJobs(initialParams);
  }, [initialParams, fetchJobs]);
  
  return {
    jobs,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalJobs,
    setPage,
    refreshJobs
  };
}
