
import { useState, useEffect, useCallback } from 'react';
import { Job } from '@/context/JobContext';
import { searchLightcastJobs, LightcastSearchParams } from '@/utils/lightcastApi';
import { toast } from 'sonner';

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
  const [useFallbackData, setUseFallbackData] = useState(false);

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
      country: searchParams.country, // Add the country parameter
    }));
  }, [
    searchParams.keywords, 
    searchParams.location, 
    searchParams.radius, 
    searchParams.job_type,
    searchParams.industry,
    searchParams.experience_level,
    searchParams.education_level,
    searchParams.remote_type,
    searchParams.country // Track changes to country
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
      
      // If we've previously had an API error, use the fallback data
      if (useFallbackData) {
        console.log("Using fallback mock data due to previous API errors");
        const { searchJobs } = await import('@/data/jobs');
        const result = await searchJobs({
          keywords: params.keywords ? [params.keywords] : [],
          locations: params.location ? [params.location] : [],
          radius: params.radius,
          jobType: params.job_type,
          industry: params.industry,
          experienceLevel: params.experience_level,
          educationLevel: params.education_level,
          remote: params.remote_type === 'Full',
        });
        
        setJobs(result);
        // Set some reasonable defaults for pagination with mock data
        setTotalPages(1);
        setTotalJobs(result.length);
        return;
      }
      
      const result = await searchLightcastJobs(params);
      console.log("Received job results:", result);
      
      setJobs(result.jobs);
      setTotalPages(result.totalPages);
      setTotalJobs(result.totalJobs);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch jobs'));
      
      // Set flag to use fallback data on next attempt
      setUseFallbackData(true);
      toast.error("Could not connect to job API, using fallback data");
      
      // Immediately try to fetch using fallback data
      try {
        const { searchJobs } = await import('@/data/jobs');
        const fallbackJobs = await searchJobs({
          keywords: currentSearchParams.keywords ? [currentSearchParams.keywords] : [],
          locations: currentSearchParams.location ? [currentSearchParams.location] : [],
          radius: currentSearchParams.radius,
          jobType: currentSearchParams.job_type,
          industry: currentSearchParams.industry,
          experienceLevel: currentSearchParams.experience_level,
          educationLevel: currentSearchParams.education_level,
          remote: currentSearchParams.remote_type === 'Full',
        });
        
        setJobs(fallbackJobs);
        // Set some reasonable defaults for pagination with mock data
        setTotalPages(1);
        setTotalJobs(fallbackJobs.length);
      } catch (fallbackErr) {
        console.error('Error fetching fallback jobs:', fallbackErr);
        setJobs([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, currentSearchParams, useFallbackData]);

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
