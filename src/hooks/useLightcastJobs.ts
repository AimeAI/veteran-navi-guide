import { useState, useEffect, useCallback } from 'react';
import { Job } from '@/context/JobContext';
import { searchLightcastJobs, LightcastSearchParams } from '@/utils/lightcastApi';
import { toast } from 'sonner';
import { searchJobs as searchMockJobs } from '@/data/jobs';
import { militarySkillsToNOCMapping, getNOCCodesForSkill } from '@/utils/jobBankApi';

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
    country: searchParams.country || "canada" // Default to Canada for Job Bank API
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
      
      return fallbackJobs;
    } catch (err) {
      console.error('Error fetching fallback jobs:', err);
      setJobs([]);
      setError(new Error('Failed to load jobs. Please try again later.'));
      return [];
    }
  }, [currentSearchParams, usingFallbackData, convertMilitarySkillsToKeywords]);

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let params: LightcastSearchParams = {
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
      
      // Try to use the Job Bank API first (particularly for Canadian jobs)
      try {
        const result = await searchLightcastJobs(params);
        console.log("Received job results:", result);
        
        // Check if we got any jobs back
        if (result.jobs.length === 0) {
          console.log("No jobs found, using fallback data");
          await fetchFallbackJobs();
          toast.info("No jobs found in the selected region. Showing sample job data.");
          return;
        }
        
        setJobs(result.jobs);
        setTotalPages(result.totalPages);
        setTotalJobs(result.totalJobs);
        
        // If we were using fallback data before but API now works, update state
        if (usingFallbackData) {
          setUsingFallbackData(false);
          toast.success("Connected to job search API successfully!");
        }
      } catch (apiError) {
        console.error("All job APIs failed:", apiError);
        // If all APIs fail, fall back to mock data
        await fetchFallbackJobs();
        toast.info("Unable to connect to job search APIs. Showing sample job data instead.");
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
  }, [currentPage, currentSearchParams, fetchFallbackJobs, usingFallbackData, convertMilitarySkillsToKeywords]);

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
