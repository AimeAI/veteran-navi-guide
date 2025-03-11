
import { useState, useEffect, useCallback, useRef } from 'react';
import { Job } from '@/types/job';
import { JobCache } from '@/utils/jobCache';
import { toast } from 'sonner';
import { useJobFetcher } from './useJobFetcher';
import { JobSearchParams, JobSearchResults } from '@/types/jobSearch';

export type { JobSearchParams, JobSearchResults };

/**
 * Enhanced hook for job search functionality with sorting and improved caching.
 * @param searchParams - Parameters for job search
 * @returns Search results and utility functions
 */
export const useJobSearch = (searchParams: JobSearchParams): JobSearchResults => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(searchParams.page || 1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);
  const isInitialMount = useRef(true);
  
  const [currentSearchParams, setCurrentSearchParams] = useState<JobSearchParams>({
    ...searchParams,
    country: searchParams.country || "canada",
    skills: searchParams.skills || [],
    sortBy: searchParams.sortBy || "relevant",
  });
  
  const { fetchJobs } = useJobFetcher();

  // Update search params when they change
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
      salaryRange: searchParams.salaryRange,
      sortBy: searchParams.sortBy,
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
    searchParams.salaryRange,
    searchParams.sortBy,
  ]);

  /**
   * Sort jobs based on sortBy parameter
   * @param jobList - List of jobs to sort
   * @param sortByParam - Sort parameter
   * @returns Sorted job list
   */
  const sortJobs = useCallback((jobList: Job[], sortByParam: string = 'relevant'): Job[] => {
    // Create a copy of the jobs array to avoid mutating the original
    let sortedJobs = [...jobList];
    
    switch (sortByParam) {
      case 'date':
        // Sort by newest first
        sortedJobs.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB.getTime() - dateA.getTime();
        });
        break;
        
      case 'salary-high':
        // Sort by salary high to low
        sortedJobs.sort((a, b) => {
          const salaryRankA = getSalaryRank(a.salaryRange);
          const salaryRankB = getSalaryRank(b.salaryRange);
          return salaryRankB - salaryRankA;
        });
        break;
        
      case 'salary-low':
        // Sort by salary low to high
        sortedJobs.sort((a, b) => {
          const salaryRankA = getSalaryRank(a.salaryRange);
          const salaryRankB = getSalaryRank(b.salaryRange);
          return salaryRankA - salaryRankB;
        });
        break;
        
      case 'skills':
        // Sort by number of matching skills
        sortedJobs.sort((a, b) => {
          const skillsA = a.matchingSkills?.length || 0;
          const skillsB = b.matchingSkills?.length || 0;
          return skillsB - skillsA;
        });
        break;
        
      case 'relevant':
      default:
        // By default, use a balanced approach that considers multiple factors
        sortedJobs.sort((a, b) => {
          // Consider date (newer jobs rank higher)
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          const dateScore = (dateB.getTime() - dateA.getTime()) / (1000 * 60 * 60 * 24); // Difference in days
          
          // Consider skills match
          const skillsA = a.matchingSkills?.length || 0;
          const skillsB = b.matchingSkills?.length || 0;
          
          // Combine factors into a relevance score
          const scoreA = skillsA * 10 - dateScore * 0.5;
          const scoreB = skillsB * 10 - dateScore * 0.5;
          
          return scoreB - scoreA;
        });
        break;
    }
    
    return sortedJobs;
  }, []);

  /**
   * Get numerical rank for salary range for sorting
   * @param salaryRange - Salary range string
   * @returns Numerical rank
   */
  const getSalaryRank = (salaryRange?: string): number => {
    switch (salaryRange) {
      case 'range1': return 1; // Under $30k
      case 'range2': return 2; // $30k - $50k
      case 'range3': return 3; // $50k - $75k
      case 'range4': return 4; // $75k - $100k
      case 'range5': return 5; // $100k+
      default: return 0;
    }
  };

  const executeJobSearch = useCallback(async () => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      // Don't show loading state on initial mount as it causes UI flicker
      if (JobCache.hasCachedResults()) {
        setIsLoading(false);
      }
    } else {
      setIsLoading(true);
    }
    
    try {
      await fetchJobs({
        ...currentSearchParams,
        page: currentPage,
      }, (fetchedJobs) => {
        // Sort jobs client-side if needed
        const sortedJobs = sortJobs(fetchedJobs, currentSearchParams.sortBy);
        setJobs(sortedJobs);
      }, setTotalPages, setTotalJobs, setError, setIsLoading);
    } catch (error) {
      console.error("Error executing job search:", error);
      toast.error("Failed to load jobs. Please try again.");
      setIsLoading(false);
    }
  }, [currentPage, currentSearchParams, fetchJobs, sortJobs]);

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

import { getCacheKey } from '@/utils/jobSearchUtils';
