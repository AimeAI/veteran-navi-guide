
import { useState, useEffect, useCallback } from 'react';
import { Job } from '@/context/JobContext';
import { searchJobBankJobs, getNOCCodesForSkill } from '@/utils/jobBankApi';
import { JobCache } from '@/utils/jobCache';
import { toast } from 'sonner';

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

  // Create a cache key based on search parameters
  const getCacheKey = useCallback((params: JobSearchParams, page: number): string => {
    return `${params.country || 'canada'}:${params.keywords || ''}:${params.location || ''}:${params.radius || 50}:${params.jobType || ''}:${params.industry || ''}:${page}`;
  }, []);

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
      country: searchParams.country,
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

  // Enhanced function to handle military skills to NOC code conversion
  const convertMilitarySkillsToKeywords = useCallback((militarySkills?: string[]): string => {
    if (!militarySkills || militarySkills.length === 0) return '';
    
    // Get all NOC codes for the selected military skills
    const nocCodes: string[] = [];
    militarySkills.forEach(skill => {
      const codes = getNOCCodesForSkill(skill);
      nocCodes.push(...codes);
    });
    
    // Return as a comma-separated string
    return nocCodes.join(',');
  }, []);

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let params: JobSearchParams = {
        ...currentSearchParams,
        page: currentPage,
      };
      
      // Process military skills in keywords if present
      if (params.keywords && params.keywords.includes("skill:")) {
        // Extract skill names from format "skill:leadership,skill:logistics"
        const skillMatches = params.keywords.match(/skill:([a-z]+)/g) || [];
        const skills = skillMatches.map(s => s.replace('skill:', ''));
        
        // Convert to NOC codes
        const skillKeywords = convertMilitarySkillsToKeywords(skills);
        
        // Remove skill: prefixes from keywords
        const cleanKeywords = params.keywords.replace(/skill:[a-z]+,?/g, '').trim();
        
        // Use both the cleaned keywords and NOC codes
        params.keywords = cleanKeywords ? 
          `${cleanKeywords} ${skillKeywords}` : skillKeywords;
      }
      
      console.log("Fetching jobs with params:", params);
      
      // Check cache first
      const cacheKey = getCacheKey(params, currentPage);
      const cachedResults = JobCache.getSearchResults(cacheKey);
      
      if (cachedResults) {
        console.log("Using cached job results");
        setJobs(cachedResults.jobs);
        setTotalPages(cachedResults.totalPages);
        setTotalJobs(cachedResults.totalJobs);
        setIsLoading(false);
        return;
      }
      
      // Clear any previous errors
      setError(null);
      
      try {
        console.log("Searching for jobs");
        const jobBankParams = {
          keywords: params.keywords,
          location: params.location,
          distance: params.radius,
          page: currentPage,
        };
        
        const jobBankResults = await searchJobBankJobs(jobBankParams);
        
        // If we got results, use them
        if (jobBankResults.jobs && jobBankResults.jobs.length > 0) {
          console.log(`Found ${jobBankResults.jobs.length} jobs`);
          setJobs(jobBankResults.jobs);
          setTotalPages(jobBankResults.totalPages);
          setTotalJobs(jobBankResults.totalJobs);
          
          // Cache the results
          JobCache.saveSearchResults(cacheKey, jobBankResults);
          
          setIsLoading(false);
          return;
        }
      } catch (searchError) {
        console.error("Error fetching jobs:", searchError);
        throw searchError;
      }
    } catch (err) {
      console.error('Error in job fetch flow:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch jobs'));
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, currentSearchParams, convertMilitarySkillsToKeywords, getCacheKey]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const setPage = (page: number) => {
    setCurrentPage(page);
  };

  const refreshJobs = async (): Promise<void> => {
    // Clear the cache for the current search
    const cacheKey = getCacheKey(currentSearchParams, currentPage);
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
