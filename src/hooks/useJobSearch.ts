
import { useState, useEffect, useCallback } from 'react';
import { Job } from '@/context/JobContext';
import { searchJobBankJobs, getNOCCodesForSkill } from '@/utils/jobBankApi';
import { JobCache } from '@/utils/jobCache';
import { AdvancedCache, jobSearchCache } from '@/utils/cacheUtils';
import { toast } from 'sonner';
import { measurePerformance } from '@/utils/performanceUtils';

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
  skills?: string[];
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
    country: searchParams.country || "canada",
    skills: searchParams.skills || [],
  });

  // Generate a cache key based on search parameters
  const getCacheKey = useCallback((params: JobSearchParams, page: number): string => {
    const skillsKey = params.skills && params.skills.length > 0 
      ? params.skills.sort().join(',') 
      : '';
    
    return `${params.country || 'canada'}:${params.keywords || ''}:${params.location || ''}:${params.radius || 50}:${params.jobType || ''}:${params.industry || ''}:${skillsKey}:${page}`;
  }, []);

  // Update search parameters when props change
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
  ]);

  const convertMilitarySkillsToKeywords = useCallback((militarySkills?: string[]): string => {
    if (!militarySkills || militarySkills.length === 0) return '';
    
    const nocCodes: string[] = [];
    militarySkills.forEach(skill => {
      const codes = getNOCCodesForSkill(skill);
      nocCodes.push(...codes);
    });
    
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
      
      if (params.keywords && params.keywords.includes("skill:")) {
        const skillMatches = params.keywords.match(/skill:([a-z]+)/g) || [];
        const skills = skillMatches.map(s => s.replace('skill:', ''));
        
        const skillKeywords = convertMilitarySkillsToKeywords(skills);
        
        const cleanKeywords = params.keywords.replace(/skill:[a-z]+,?/g, '').trim();
        
        params.keywords = cleanKeywords ? 
          `${cleanKeywords} ${skillKeywords}` : skillKeywords;
      }
      
      console.log("Fetching jobs with params:", params);
      
      const cacheKey = getCacheKey(params, currentPage);
      
      // First try the enhanced cache
      const cachedResults = jobSearchCache.get<{
        jobs: Job[],
        totalPages: number,
        totalJobs: number
      }>(cacheKey);
      
      if (cachedResults) {
        console.log("Using cached job results from enhanced cache");
        setJobs(cachedResults.jobs);
        setTotalPages(cachedResults.totalPages);
        setTotalJobs(cachedResults.totalJobs);
        setIsLoading(false);
        return;
      }
      
      // Fall back to the legacy cache
      const legacyCachedResults = JobCache.getSearchResults(cacheKey);
      
      if (legacyCachedResults) {
        console.log("Using cached job results from legacy cache");
        setJobs(legacyCachedResults.jobs);
        setTotalPages(legacyCachedResults.totalPages);
        setTotalJobs(legacyCachedResults.totalJobs);
        setIsLoading(false);
        
        // Store in the enhanced cache for future
        jobSearchCache.set(cacheKey, legacyCachedResults);
        return;
      }
      
      setError(null);
      
      try {
        console.log("Searching for jobs - no cache hit");
        const jobBankParams = {
          keywords: params.keywords,
          location: params.location,
          distance: params.radius,
          page: currentPage,
          skills: params.skills,
        };
        
        // Measure the performance of the job search API call
        const jobBankResults = await measurePerformance(
          'Job Bank API Search',
          searchJobBankJobs,
          jobBankParams
        );
        
        if (jobBankResults.jobs && jobBankResults.jobs.length > 0) {
          console.log(`Found ${jobBankResults.jobs.length} jobs`);
          
          if (params.skills && params.skills.length > 0) {
            jobBankResults.jobs = jobBankResults.jobs.map(job => {
              const skills = params.skills || [];
              const matchingSkills = job.requiredSkills.filter(jobSkill =>
                skills.some(searchSkill => 
                  jobSkill.toLowerCase().includes(searchSkill.toLowerCase()) ||
                  searchSkill.toLowerCase().includes(jobSkill.toLowerCase())
                )
              );
              
              if (matchingSkills.length > 0) {
                return {
                  ...job,
                  matchingSkills,
                  matchScore: Math.round((matchingSkills.length / job.requiredSkills.length) * 100)
                };
              }
              return job;
            });
          }
          
          setJobs(jobBankResults.jobs);
          setTotalPages(jobBankResults.totalPages);
          setTotalJobs(jobBankResults.totalJobs);
          
          // Store in both caches for backward compatibility
          JobCache.saveSearchResults(cacheKey, jobBankResults);
          jobSearchCache.set(cacheKey, jobBankResults, 15 * 60 * 1000); // 15 minutes TTL
          
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

  // Fetch jobs when dependencies change
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const setPage = (page: number) => {
    setCurrentPage(page);
  };

  const refreshJobs = async (): Promise<void> => {
    const cacheKey = getCacheKey(currentSearchParams, currentPage);
    
    // Clear from both caches
    JobCache.clearSearchResult(cacheKey);
    jobSearchCache.delete(cacheKey);
    
    const refreshedParams = {
      ...currentSearchParams,
      refresh: true
    };
    
    setCurrentSearchParams(refreshedParams);
    
    setIsLoading(true);
    await fetchJobs();
  };

  // Prefetch next page if we're getting close to the end of the current page
  useEffect(() => {
    if (currentPage < totalPages) {
      const prefetchNextPage = async () => {
        const nextPageParams = {
          ...currentSearchParams,
          page: currentPage + 1
        };
        
        const nextPageCacheKey = getCacheKey(nextPageParams, currentPage + 1);
        
        // Only prefetch if not already in cache
        if (!jobSearchCache.get(nextPageCacheKey) && !JobCache.getSearchResults(nextPageCacheKey)) {
          // Don't block the UI or set loading state for prefetching
          try {
            console.log(`Prefetching job data for page ${currentPage + 1}`);
            const jobBankParams = {
              keywords: nextPageParams.keywords,
              location: nextPageParams.location,
              distance: nextPageParams.radius,
              page: currentPage + 1,
              skills: nextPageParams.skills,
            };
            
            const jobBankResults = await searchJobBankJobs(jobBankParams);
            
            if (jobBankResults.jobs && jobBankResults.jobs.length > 0) {
              // Store in both caches
              JobCache.saveSearchResults(nextPageCacheKey, jobBankResults);
              jobSearchCache.set(nextPageCacheKey, jobBankResults, 15 * 60 * 1000);
              console.log(`Prefetched ${jobBankResults.jobs.length} jobs for page ${currentPage + 1}`);
            }
          } catch (error) {
            console.error('Error prefetching next page jobs:', error);
          }
        }
      };
      
      // Set a small delay to make sure we don't interfere with current page fetching
      const timer = setTimeout(() => {
        prefetchNextPage();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [currentPage, totalPages, currentSearchParams, getCacheKey]);

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
