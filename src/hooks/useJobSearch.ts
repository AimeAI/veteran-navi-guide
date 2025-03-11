
import { useState, useEffect, useCallback } from 'react';
import { Job } from '@/types/job';
import { JobCache } from '@/utils/jobCache';
import { toast } from 'sonner';
import { useJobFetcher } from './useJobFetcher';
import { JobSearchParams, JobSearchResults } from '@/types/jobSearch';

export const useJobSearch = (searchParams: JobSearchParams): JobSearchResults => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(searchParams.page || 1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);
  const [currentSearchParams, setCurrentSearchParams] = useState<JobSearchParams>({
    ...searchParams,
    country: searchParams.country || "canada",
    skills: searchParams.skills || [],
  });
  
  const { fetchJobs } = useJobFetcher();

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
      country: searchParams.country,
      skills: searchParams.skills,
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
    searchParams.country,
    searchParams.skills,
  ]);

  const executeJobSearch = useCallback(async () => {
    await fetchJobs({
      ...currentSearchParams,
      page: currentPage,
    }, setJobs, setTotalPages, setTotalJobs, setError, setIsLoading);
  }, [currentPage, currentSearchParams, fetchJobs]);

  useEffect(() => {
    executeJobSearch();
  }, [executeJobSearch]);

  const setPage = (page: number) => {
    setCurrentPage(page);
  };

  const refreshJobs = async (): Promise<void> => {
    const cacheKey = getCacheKey(currentSearchParams, currentPage);
    JobCache.clearSearchResult(cacheKey);
    
    const refreshedParams = {
      ...currentSearchParams,
      refresh: true
    };
    
    setCurrentSearchParams(refreshedParams);
    
    setIsLoading(true);
    await executeJobSearch();
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

// Import getCacheKey here to avoid circular dependency issues
import { getCacheKey } from '@/utils/jobSearchUtils';
