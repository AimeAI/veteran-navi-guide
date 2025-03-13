
import { useState, useEffect, useCallback } from 'react';
import { Job } from '@/types/job';
import { JobSearchParams, JobSearchResults } from '@/types/jobSearch';
import { toast } from 'sonner';
import { JobCache } from '@/utils/jobCache';
import { debounce, measurePerformance } from '@/utils/performanceUtils';
import { supabase } from '@/integrations/supabase/client';
import { generateCacheKey } from '@/utils/performanceUtils';
import { lightcastSearchJobs } from '@/utils/lightcastApi';
import { fetchJobBankJobs } from '@/utils/jobBankApi';
import { fetchJobicyJobs } from '@/utils/jobicyRssParser';

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
    // Generate a cache key based on search parameters
    const cacheKey = generateCacheKey('jobSearch', {
      ...searchParams,
      page: currentPage,
      pageSize,
    });

    setIsLoading(true);
    setError(null);

    try {
      // Check if we have cached results first
      if (!searchParams.refresh) {
        const cachedResults = JobCache.getSearchResults(cacheKey);
        if (cachedResults) {
          setJobs(cachedResults.jobs);
          setTotalPages(cachedResults.totalPages);
          setTotalJobs(cachedResults.totalJobs);
          setIsLoading(false);
          return;
        }
      }

      // If no cached results, fetch new data
      const result = await measurePerformance('Job search query', async () => {
        // Dynamically determine which job source to use based on country
        let fetchedJobs: Job[] = [];
        let fetchedTotalPages = 1;
        let fetchedTotalJobs = 0;

        const { keywords, location, country, ...otherParams } = searchParams;

        // Common search params
        const params = {
          ...otherParams,
          page: currentPage,
          pageSize
        };

        if (country === 'us') {
          // Use Lightcast API for US jobs
          const lightcastResults = await lightcastSearchJobs(keywords, location, params);
          fetchedJobs = lightcastResults.jobs || [];
          fetchedTotalPages = lightcastResults.totalPages || 1;
          fetchedTotalJobs = lightcastResults.totalJobs || 0;
        } else if (country === 'canada') {
          // Use JobBank API for Canadian jobs
          const jobBankResults = await fetchJobBankJobs(keywords, location, params);
          fetchedJobs = jobBankResults.jobs || [];
          fetchedTotalPages = jobBankResults.totalPages || 1;
          fetchedTotalJobs = jobBankResults.totalJobs || 0;
        } else {
          // Fallback to Jobicy for other locations
          const jobicyResults = await fetchJobicyJobs(keywords, location, params);
          fetchedJobs = jobicyResults.jobs || [];
          fetchedTotalPages = jobicyResults.totalPages || 1;
          fetchedTotalJobs = jobicyResults.totalJobs || 0;
        }

        return {
          jobs: fetchedJobs,
          totalPages: fetchedTotalPages,
          totalJobs: fetchedTotalJobs
        };
      });

      // Update state with results
      setJobs(result.jobs);
      setTotalPages(result.totalPages);
      setTotalJobs(result.totalJobs);

      // Cache the results
      JobCache.saveSearchResults(cacheKey, {
        jobs: result.jobs,
        totalPages: result.totalPages,
        totalJobs: result.totalJobs
      });
    } catch (err) {
      console.error('Error searching jobs:', err);
      setError(err instanceof Error ? err : new Error('Failed to search jobs'));
      
      // Try to get results from Supabase as a fallback
      try {
        const { data, error, count } = await supabase
          .from('jobs')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false })
          .range((currentPage - 1) * pageSize, currentPage * pageSize - 1);

        if (!error && data) {
          setJobs(data as Job[]);
          setTotalJobs(count || 0);
          setTotalPages(Math.ceil((count || 0) / pageSize));
          toast.info('Using cached job results due to search API issues');
        }
      } catch (fallbackErr) {
        console.error('Fallback job search also failed:', fallbackErr);
      }
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
