
import { useState, useEffect, useCallback } from 'react';
import { Job } from '@/types/job';
import { JobSearchParams, JobSearchResults } from '@/types/jobSearch';
import { debounce } from '@/utils/performanceUtils';
import { jobSearchService } from '@/services/jobSearchService';

/**
 * Custom hook for searching jobs with caching and performance optimization
 */
export function useJobSearch(initialParams: JobSearchParams): JobSearchResults {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(initialParams.page || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [pageSize, setPageSize] = useState(initialParams.pageSize || 20);
  const [searchParams, setSearchParams] = useState<JobSearchParams>(initialParams);

  // Memoized function to set the current page
  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
    setSearchParams(prev => ({ ...prev, page }));
  }, []);

  // Update page size with debounce to prevent multiple renders
  const setPageSizeWithDebounce = useCallback(
    debounce((size: number) => {
      setPageSize(size);
      setSearchParams(prev => ({ ...prev, pageSize: size, page: 1 }));
      setCurrentPage(1);
    }, 300),
    []
  );

  // Memoized function to refresh jobs
  const refreshJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await jobSearchService.searchJobsWithFallback(
        searchParams,
        currentPage,
        pageSize
      );
      
      setJobs(result.jobs);
      setTotalPages(result.totalPages);
      setTotalJobs(result.totalJobs);
    } catch (err) {
      console.error('Error searching jobs:', err);
      setError(err instanceof Error ? err : new Error('Failed to search jobs'));
    } finally {
      setIsLoading(false);
    }
  }, [searchParams, currentPage, pageSize]);

  // Fetch jobs when search parameters change
  useEffect(() => {
    refreshJobs();
  }, [
    searchParams.keywords,
    searchParams.location,
    searchParams.jobType,
    searchParams.country,
    searchParams.experienceLevel,
    searchParams.educationLevel,
    searchParams.remote,
    searchParams.radius,
    searchParams.industry,
    searchParams.sortBy,
    currentPage,
    pageSize,
    refreshJobs
  ]);

  return {
    jobs,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalJobs,
    pageSize,
    setPage,
    setPageSize: setPageSizeWithDebounce,
    refreshJobs
  };
}
