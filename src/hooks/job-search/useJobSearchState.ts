
import { useState, useEffect, useCallback } from 'react';
import { JobSearchParams } from './types';

export const useJobSearchState = (initialParams: JobSearchParams) => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(initialParams.page || 1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);
  const [searchParams, setSearchParams] = useState<JobSearchParams>({
    ...initialParams,
    country: initialParams.country || "canada",
    skills: initialParams.skills || [],
  });

  // Update search parameters when props change
  useEffect(() => {
    setSearchParams(prevParams => ({
      ...prevParams,
      keywords: initialParams.keywords,
      location: initialParams.location,
      radius: initialParams.radius,
      jobType: initialParams.jobType,
      industry: initialParams.industry,
      experienceLevel: initialParams.experienceLevel,
      educationLevel: initialParams.educationLevel,
      remote: initialParams.remote,
      country: initialParams.country,
      skills: initialParams.skills,
    }));
  }, [
    initialParams.keywords, 
    initialParams.location, 
    initialParams.radius, 
    initialParams.jobType,
    initialParams.industry,
    initialParams.experienceLevel,
    initialParams.educationLevel,
    initialParams.remote,
    initialParams.country,
    initialParams.skills,
  ]);

  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const updateResults = useCallback((results: {
    jobs: any[];
    totalPages: number;
    totalJobs: number;
  }) => {
    setJobs(results.jobs);
    setTotalPages(results.totalPages);
    setTotalJobs(results.totalJobs);
    setIsLoading(false);
  }, []);

  return {
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
    searchParams,
    setSearchParams,
    updateResults
  };
};
