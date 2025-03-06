
import { useState, useEffect, useCallback } from 'react';
import { Job } from '@/context/JobContext';
import { searchLightcastJobs, LightcastSearchParams } from '@/utils/lightcastApi';
import { toast } from 'sonner';
import { searchJobs as searchMockJobs } from '@/data/jobs';

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
  usingFallbackData: boolean;
}

export const useLightcastJobs = (searchParams: LightcastSearchParams): JobSearchResults => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(searchParams.page || 1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);
  const [usingFallbackData, setUsingFallbackData] = useState(false);
  const [currentSearchParams, setCurrentSearchParams] = useState<LightcastSearchParams>({
    ...searchParams,
    country: searchParams.country || "canada" // Default to Canada
  });

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
      country: searchParams.country,
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
    searchParams.country
  ]);

  const fetchFallbackJobs = useCallback(async () => {
    try {
      console.log("Using fallback mock data");
      
      const fallbackJobs = await searchMockJobs({
        keywords: currentSearchParams.keywords ? [currentSearchParams.keywords] : [],
        locations: currentSearchParams.location ? [currentSearchParams.location] : [],
        radius: currentSearchParams.radius,
        jobType: currentSearchParams.job_type,
        industry: currentSearchParams.industry,
        experienceLevel: currentSearchParams.experience_level,
        educationLevel: currentSearchParams.education_level,
        remote: currentSearchParams.remote_type === 'Full',
        country: currentSearchParams.country as "us" | "canada",
      });
      
      setJobs(fallbackJobs);
      // Set some reasonable defaults for pagination with mock data
      setTotalPages(1);
      setTotalJobs(fallbackJobs.length);
      
      if (!usingFallbackData) {
        setUsingFallbackData(true);
      }
    } catch (err) {
      console.error('Error fetching fallback jobs:', err);
      setJobs([]);
      setError(new Error('Failed to load jobs. Please try again later.'));
    }
  }, [currentSearchParams, usingFallbackData]);

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params: LightcastSearchParams = {
        ...currentSearchParams,
        page: currentPage,
      };
      
      console.log("Fetching jobs with params:", params);
      
      // First try the Lightcast API
      const result = await searchLightcastJobs(params);
      console.log("Received job results:", result);
      
      setJobs(result.jobs);
      setTotalPages(result.totalPages);
      setTotalJobs(result.totalJobs);
      
      // If we were using fallback data before but API now works, update state
      if (usingFallbackData) {
        setUsingFallbackData(false);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      const errorObj = err instanceof Error ? err : new Error('Failed to fetch jobs');
      
      // For network/CORS errors, fall back to mock data without showing error to user
      if (errorObj.message.includes('NetworkError') || errorObj.message.includes('CORS')) {
        await fetchFallbackJobs();
      } else {
        // For non-network errors, show the error
        setError(errorObj);
      }
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, currentSearchParams, fetchFallbackJobs, usingFallbackData]);

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
    usingFallbackData,
  };
};
