
import { useState, useEffect, useCallback } from 'react';
import { Job } from '@/context/JobContext';
import { JobCache } from '@/utils/jobCache';
import { toast } from 'sonner';
import { 
  createCacheKey,
  processSearchParams,
  performJobSearch
} from '@/utils/jobSearchUtils';

export interface JobSearchParams {
  keywords?: string;
  location?: string;
  radius?: number;
  remote?: boolean;
  jobType?: string;
  industry?: string;
  experienceLevel?: string;
  educationLevel?: string;
  country?: "us" | "canada";
  page?: number;
  refresh?: boolean;
}

export interface JobSearchResults {
  jobs: Job[];
  isLoading: boolean;
  error: Error | null;
  currentPage: number;
  totalPages: number;
  totalJobs: number;
  setPage: (page: number) => void;
  refreshJobs: () => Promise<void>;
}

export const useJobSearch = (searchParams: JobSearchParams): JobSearchResults => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(searchParams.page || 1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);
  const [currentSearchParams, setCurrentSearchParams] = useState<JobSearchParams>({
    ...searchParams,
    country: searchParams.country || "canada" // Default to Canada for consistency
  });

  // Update searchParams when external params change
  useEffect(() => {
    setCurrentSearchParams(prevParams => ({
      ...prevParams,
      keywords: searchParams.keywords,
      location: searchParams.location,
      radius: searchParams.radius,
      jobType: searchParams.jobType,
      industry: searchParams.industry,
      experienceLevel: searchParams.experienceLevel,
      educationLevel: searchParams.educationLevel,
      remote: searchParams.remote,
      country: searchParams.country || "canada",
    }));
  }, [
    searchParams.keywords, 
    searchParams.location, 
    searchParams.radius, 
    searchParams.jobType,
    searchParams.industry,
    searchParams.experienceLevel,
    searchParams.educationLevel,
    searchParams.remote,
    searchParams.country
  ]);

  const fetchJobs = useCallback(async () => {
    try {
      await performJobSearch(
        currentSearchParams,
        currentPage,
        setIsLoading,
        setError,
        setJobs,
        setTotalPages,
        setTotalJobs
      );
    } catch (err) {
      console.error('Error in job search:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch jobs'));
      setIsLoading(false);
    }
  }, [currentPage, currentSearchParams]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const setPage = (page: number) => {
    setCurrentPage(page);
  };

  const refreshJobs = async (): Promise<void> => {
    // Clear the cache for the current search
    const cacheKey = createCacheKey(currentSearchParams, currentPage);
    JobCache.clearSearchResult(cacheKey);
    
    // Set forceRefresh to trigger a fresh fetch
    const refreshedParams = {
      ...currentSearchParams,
      refresh: true
    };
    
    setCurrentSearchParams(refreshedParams);
    
    // Re-fetch jobs
    setIsLoading(true);
    await fetchJobs();
  };

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
