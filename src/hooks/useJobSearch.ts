
import { useState, useEffect, useCallback } from 'react';
import { Job } from '@/context/JobContext';
import { searchJobs as searchMockJobs } from '@/data/jobs';
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
    country: searchParams.country || "canada" // Default to Canada for Job Bank API
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
    
    // Return as a comma-separated string for the Job Bank API
    return nocCodes.join(',');
  }, []);

  const fetchFallbackJobs = useCallback(async () => {
    try {
      console.log("Using fallback mock data");
      
      // Enhanced to use military skills
      let skillKeywords = '';
      if (currentSearchParams.keywords && currentSearchParams.keywords.includes("skill:")) {
        // Extract skill names from format "skill:leadership,skill:logistics"
        const skillMatches = currentSearchParams.keywords.match(/skill:([a-z]+)/g) || [];
        const skills = skillMatches.map(s => s.replace('skill:', ''));
        
        // Convert to NOC codes as keywords
        skillKeywords = convertMilitarySkillsToKeywords(skills);
        
        // Remove skill: prefixes from keywords
        const cleanKeywords = currentSearchParams.keywords.replace(/skill:[a-z]+,?/g, '').trim();
        
        // Use the cleaned keywords
        currentSearchParams.keywords = cleanKeywords || skillKeywords;
      }
      
      const fallbackJobs = await searchMockJobs({
        keywords: currentSearchParams.keywords ? [currentSearchParams.keywords] : [],
        locations: currentSearchParams.location ? [currentSearchParams.location] : [],
        radius: currentSearchParams.radius,
        jobType: currentSearchParams.jobType,
        industry: currentSearchParams.industry,
        experienceLevel: currentSearchParams.experienceLevel,
        educationLevel: currentSearchParams.educationLevel,
        remote: currentSearchParams.remote,
        country: currentSearchParams.country as "us" | "canada",
      });
      
      setJobs(fallbackJobs);
      // Set some reasonable defaults for pagination with mock data
      setTotalPages(1);
      setTotalJobs(fallbackJobs.length);
      
      // Store fallback data in cache too
      const cacheKey = getCacheKey(currentSearchParams, currentPage);
      JobCache.saveSearchResults(cacheKey, {
        jobs: fallbackJobs,
        totalJobs: fallbackJobs.length,
        totalPages: 1,
        currentPage,
      });
    
      return fallbackJobs;
    } catch (err) {
      console.error('Error fetching fallback jobs:', err);
      // Still need jobs to display, use empty array as last resort
      setJobs([]);
      return [];
    }
  }, [currentPage, currentSearchParams, convertMilitarySkillsToKeywords, getCacheKey]);

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
        
        // Convert to NOC codes for Job Bank API
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
      
      // Try Job Bank API for Canadian jobs
      if (params.country === "canada" || !params.country) {
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
          } else {
            console.log("No jobs found, using fallback data");
            await fetchFallbackJobs();
          }
        } catch (jobBankError) {
          console.error("Error fetching jobs:", jobBankError);
          
          // Try fallback data and don't show error to user
          toast.error("Unable to connect to job search service. Showing available jobs.");
          await fetchFallbackJobs();
        }
      } else {
        // For non-Canadian jobs, use mock data
        await fetchFallbackJobs();
      }
    } catch (err) {
      console.error('Error in job fetch flow:', err);
      // Fall back to mock data silently
      await fetchFallbackJobs();
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, currentSearchParams, fetchFallbackJobs, convertMilitarySkillsToKeywords, getCacheKey]);

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
    
    // Set forceRefresh to trigger a fresh fetch at the API level
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
