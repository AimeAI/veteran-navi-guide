
import { useCallback, useEffect } from 'react';
import { useJobSearchState } from './job-search/useJobSearchState';
import { useJobSearchCache } from './job-search/useJobSearchCache';
import { useJobSearchFetch } from './job-search/useJobSearchFetch';
import { useJobSearchPrefetch } from './job-search/useJobSearchPrefetch';
import { JobSearchParams, JobSearchResults } from './job-search/types';
import { toast } from 'sonner';

export type { JobSearchParams, JobSearchResults } from './job-search/types';

export const useJobSearch = (searchParams: JobSearchParams): JobSearchResults => {
  const {
    jobs,
    setJobs,
    isLoading,
    setIsLoading,
    error,
    setError,
    currentPage,
    setPage,
    totalPages,
    setTotalPages,
    totalJobs,
    setTotalJobs,
    searchParams: currentSearchParams,
    setSearchParams,
    updateResults
  } = useJobSearchState(searchParams);

  const { getCacheKey, getFromCache, saveToCache, clearCache } = useJobSearchCache();
  const { fetchJobs } = useJobSearchFetch();
  
  // Prefetching setup
  useJobSearchPrefetch(currentPage, totalPages, currentSearchParams);

  const loadJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params = {
        ...currentSearchParams,
        page: currentPage,
      };
      
      console.log("Fetching jobs with params:", params);
      
      // Check cache first
      const cachedResults = getFromCache(params, currentPage);
      
      if (cachedResults) {
        updateResults(cachedResults);
        return;
      }
      
      // If not in cache, fetch from API
      const jobResults = await fetchJobs(params);
      
      if (jobResults.jobs.length > 0) {
        updateResults(jobResults);
        
        // Save to cache
        saveToCache(params, currentPage, jobResults);
      } else {
        throw new Error('No jobs found matching your criteria');
      }
    } catch (err) {
      console.error('Error in job fetch flow:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch jobs'));
      setIsLoading(false);
    }
  }, [currentPage, currentSearchParams, fetchJobs, getFromCache, saveToCache, updateResults]);

  // Fetch jobs when dependencies change
  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  // Function to refresh jobs by clearing cache and fetching again
  const refreshJobs = useCallback(async (): Promise<void> => {
    clearCache(currentSearchParams, currentPage);
    
    const refreshedParams = {
      ...currentSearchParams,
      refresh: true
    };
    
    setSearchParams(refreshedParams);
    setIsLoading(true);
    
    try {
      await loadJobs();
      toast.success('Job listings refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh job listings');
    }
  }, [clearCache, currentSearchParams, currentPage, setSearchParams, loadJobs]);

  return {
    jobs,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalJobs,
    setPage,
    refreshJobs,
  };
};
