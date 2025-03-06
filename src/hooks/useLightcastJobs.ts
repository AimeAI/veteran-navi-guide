
import { useState, useEffect, useCallback } from 'react';
import { Job } from '@/context/JobContext';
import { searchLightcastJobs, LightcastSearchParams } from '@/utils/lightcastApi';

export type { LightcastSearchParams } from '@/utils/lightcastApi';

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

export const useLightcastJobs = (searchParams: LightcastSearchParams): JobSearchResults => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(searchParams.page || 1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);
  const [currentSearchParams, setCurrentSearchParams] = useState<LightcastSearchParams>(searchParams);

  // Update searchParams when external params change
  useEffect(() => {
    setCurrentSearchParams(prevParams => ({
      ...prevParams,
      keywords: searchParams.keywords,
      location: searchParams.location,
      radius: searchParams.radius,
      job_type: searchParams.job_type,
      industry: searchParams.industry,
      experience_level: searchParams.experience_level,
      education_level: searchParams.education_level,
      remote_type: searchParams.remote_type,
    }));
  }, [
    searchParams.keywords, 
    searchParams.location, 
    searchParams.radius, 
    searchParams.job_type,
    searchParams.industry,
    searchParams.experience_level,
    searchParams.education_level,
    searchParams.remote_type
  ]);

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params: LightcastSearchParams = {
        ...currentSearchParams,
        page: currentPage,
      };
      
      console.log("Fetching jobs with params:", params);
      const result = await searchLightcastJobs(params);
      console.log("Received job results:", result);
      
      setJobs(result.jobs);
      setTotalPages(result.totalPages);
      setTotalJobs(result.totalJobs);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch jobs'));
      setJobs([]);
    } finally {
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
    return fetchJobs();
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
