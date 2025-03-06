
import { useState, useEffect, useCallback } from 'react';
import { Job } from '@/context/JobContext';
import { toast } from 'sonner';
import { searchJobs as searchMockJobs } from '@/data/jobs';
import { searchJobBankJobs, getNOCCodesForSkill } from '@/utils/jobBankApi';
import { JobCache } from '@/utils/jobCache';

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
  usingFallbackData: boolean;
}

export const useJobSearch = (searchParams: JobSearchParams): JobSearchResults => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(searchParams.page || 1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);
  const [usingFallbackData, setUsingFallbackData] = useState(false);
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
      
      if (!usingFallbackData) {
        setUsingFallbackData(true);
      }
      
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
      setJobs([]);
      setError(new Error('Failed to load jobs. Please try again later.'));
      return [];
    }
  }, [currentPage, currentSearchParams, usingFallbackData, convertMilitarySkillsToKeywords, getCacheKey]);

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
        setUsingFallbackData(false);
        setIsLoading(false);
        return;
      }
      
      // Try Job Bank API for Canadian jobs
      if (params.country === "canada" || !params.country) {
        try {
          console.log("Using Job Bank API (Canada)");
          const jobBankParams = {
            keywords: params.keywords,
            location: params.location,
            distance: params.radius,
            page: currentPage,
          };
          
          const jobBankResults = await searchJobBankJobs(jobBankParams);
          
          // If we got results, use them
          if (jobBankResults.jobs.length > 0) {
            console.log(`Found ${jobBankResults.jobs.length} jobs from Job Bank`);
            setJobs(jobBankResults.jobs);
            setTotalPages(jobBankResults.totalPages);
            setTotalJobs(jobBankResults.totalJobs);
            
            // Cache the results
            JobCache.saveSearchResults(cacheKey, jobBankResults);
            
            // If we were using fallback data before but API now works, update state
            if (usingFallbackData) {
              setUsingFallbackData(false);
              toast.success("Connected to Job Bank API successfully!");
            }
            
            setIsLoading(false);
            return;
          } else {
            throw new Error("No jobs found from Job Bank API");
          }
        } catch (jobBankError) {
          console.error("Job Bank API failed:", jobBankError);
          // Fall back to mock data
          await fetchFallbackJobs();
          toast.info("Unable to find jobs with current criteria. Showing sample job data instead.");
        }
      } else {
        // For non-Canadian jobs, use mock data
        await fetchFallbackJobs();
        toast.info("Job search for regions outside Canada currently uses sample data.");
      }
    } catch (err) {
      console.error('Error in job fetch flow:', err);
      const errorObj = err instanceof Error ? err : new Error('Failed to fetch jobs');
      
      // Fall back to mock data
      await fetchFallbackJobs();
      
      // Only display non-network errors in the UI
      if (!errorObj.message.includes('NetworkError') && 
          !errorObj.message.includes('CORS') && 
          !errorObj.message.includes('connectivity')) {
        setError(errorObj);
        toast.error("Error fetching jobs. Using sample data instead.");
      } else {
        toast.info("Using sample job data due to API connectivity issues");
      }
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, currentSearchParams, fetchFallbackJobs, usingFallbackData, convertMilitarySkillsToKeywords, getCacheKey]);

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
