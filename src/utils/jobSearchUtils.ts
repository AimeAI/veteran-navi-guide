
import { Job } from '@/context/JobContext';
import { JobCache } from '@/utils/jobCache';
import { JobSearchParams } from '@/hooks/useJobSearch';
import { getNOCCodesForSkill, searchJobBankJobs } from '@/utils/jobBankApi';

/**
 * Creates a cache key based on search parameters
 */
export const createCacheKey = (params: JobSearchParams, page: number): string => {
  return `${params.country || 'canada'}:${params.keywords || ''}:${params.location || ''}:${params.radius || 50}:${params.jobType || ''}:${params.industry || ''}:${page}`;
};

/**
 * Converts military skills to NOC code keywords
 */
export const convertMilitarySkillsToKeywords = (militarySkills?: string[]): string => {
  if (!militarySkills || militarySkills.length === 0) return '';
  
  // Get all NOC codes for the selected military skills
  const nocCodes: string[] = [];
  militarySkills.forEach(skill => {
    const codes = getNOCCodesForSkill(skill);
    nocCodes.push(...codes);
  });
  
  // Return as a comma-separated string
  return nocCodes.join(',');
};

/**
 * Process search parameters for job search
 */
export const processSearchParams = (params: JobSearchParams): JobSearchParams => {
  const processedParams = { ...params };
  
  // Process military skills in keywords if present
  if (processedParams.keywords && processedParams.keywords.includes("skill:")) {
    // Extract skill names from format "skill:leadership,skill:logistics"
    const skillMatches = processedParams.keywords.match(/skill:([a-z]+)/g) || [];
    const skills = skillMatches.map(s => s.replace('skill:', ''));
    
    // Convert to NOC codes
    const skillKeywords = convertMilitarySkillsToKeywords(skills);
    
    // Remove skill: prefixes from keywords
    const cleanKeywords = processedParams.keywords.replace(/skill:[a-z]+,?/g, '').trim();
    
    // Use both the cleaned keywords and NOC codes
    processedParams.keywords = cleanKeywords ? 
      `${cleanKeywords} ${skillKeywords}` : skillKeywords;
  }
  
  return processedParams;
};

/**
 * Fetch jobs based on search parameters
 */
export const fetchJobsFromAPI = async (
  params: JobSearchParams, 
  currentPage: number
): Promise<{
  jobs: Job[];
  totalPages: number;
  totalJobs: number;
} | null> => {
  try {
    console.log("Searching for jobs");
    const jobBankParams = {
      keywords: params.keywords,
      location: params.location,
      distance: params.radius,
      page: currentPage,
    };
    
    const jobBankResults = await searchJobBankJobs(jobBankParams);
    
    // If we got results, return them
    if (jobBankResults.jobs && jobBankResults.jobs.length > 0) {
      console.log(`Found ${jobBankResults.jobs.length} jobs`);
      return {
        jobs: jobBankResults.jobs,
        totalPages: jobBankResults.totalPages,
        totalJobs: jobBankResults.totalJobs
      };
    }
    
    return null;
  } catch (searchError) {
    console.error("Error fetching jobs:", searchError);
    throw searchError;
  }
};

/**
 * Handle job search with caching
 */
export const performJobSearch = async (
  params: JobSearchParams, 
  currentPage: number, 
  setIsLoading: (loading: boolean) => void,
  setError: (error: Error | null) => void,
  setJobs: (jobs: Job[]) => void,
  setTotalPages: (pages: number) => void,
  setTotalJobs: (total: number) => void
): Promise<void> => {
  setIsLoading(true);
  setError(null);
  
  try {
    // Process search parameters
    const processedParams = processSearchParams(params);
    
    console.log("Fetching jobs with params:", processedParams);
    
    // Check cache first
    const cacheKey = createCacheKey(processedParams, currentPage);
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
    
    // Fetch jobs from API
    const jobResults = await fetchJobsFromAPI(processedParams, currentPage);
    
    // If we got results, use them
    if (jobResults) {
      setJobs(jobResults.jobs);
      setTotalPages(jobResults.totalPages);
      setTotalJobs(jobResults.totalJobs);
      
      // Cache the results
      JobCache.saveSearchResults(cacheKey, {
        jobs: jobResults.jobs,
        totalPages: jobResults.totalPages,
        totalJobs: jobResults.totalJobs
      });
    } else {
      // No results
      setJobs([]);
      setTotalPages(0);
      setTotalJobs(0);
    }
  } catch (err) {
    console.error('Error in job fetch flow:', err);
    setError(err instanceof Error ? err : new Error('Failed to fetch jobs'));
  } finally {
    setIsLoading(false);
  }
};
