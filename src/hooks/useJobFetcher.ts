
import { useCallback } from 'react';
import { Job } from '@/types/job';
import { JobCache } from '@/utils/jobCache';
import { searchJobBankJobs } from '@/utils/jobBankApi';
import { convertMilitarySkillsToKeywords, getCacheKey, matchSkillsWithJobRequirements } from '@/utils/jobSearchUtils';

export const useJobFetcher = () => {
  const fetchJobs = useCallback(async (
    params: {
      keywords?: string;
      location?: string;
      radius?: number;
      remote?: boolean;
      skills?: string[];
      page: number;
      country?: "us" | "canada";
    }, 
    setJobs: (jobs: Job[]) => void,
    setTotalPages: (pages: number) => void,
    setTotalJobs: (total: number) => void,
    setError: (error: Error | null) => void,
    setIsLoading: (loading: boolean) => void
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let searchParams = { ...params };
      
      if (searchParams.keywords && searchParams.keywords.includes("skill:")) {
        const skillMatches = searchParams.keywords.match(/skill:([a-z]+)/g) || [];
        const skills = skillMatches.map(s => s.replace('skill:', ''));
        
        const skillKeywords = convertMilitarySkillsToKeywords(skills);
        
        const cleanKeywords = searchParams.keywords.replace(/skill:[a-z]+,?/g, '').trim();
        
        searchParams.keywords = cleanKeywords ? 
          `${cleanKeywords} ${skillKeywords}` : skillKeywords;
      }
      
      console.log("Fetching jobs with params:", searchParams);
      
      const cacheKey = getCacheKey(searchParams, searchParams.page);
      const cachedResults = JobCache.getSearchResults(cacheKey);
      
      if (cachedResults) {
        console.log("Using cached job results");
        setJobs(cachedResults.jobs);
        setTotalPages(cachedResults.totalPages);
        setTotalJobs(cachedResults.totalJobs);
        setIsLoading(false);
        return;
      }
      
      setError(null);
      
      try {
        console.log("Searching for jobs");
        const jobBankParams = {
          keywords: searchParams.keywords,
          location: searchParams.location,
          distance: searchParams.radius,
          page: searchParams.page,
          skills: searchParams.skills,
        };
        
        const jobBankResults = await searchJobBankJobs(jobBankParams);
        
        if (jobBankResults.jobs && jobBankResults.jobs.length > 0) {
          console.log(`Found ${jobBankResults.jobs.length} jobs`);
          
          if (searchParams.skills && searchParams.skills.length > 0) {
            jobBankResults.jobs = jobBankResults.jobs.map(job => 
              matchSkillsWithJobRequirements(job, searchParams.skills)
            );
          }
          
          setJobs(jobBankResults.jobs);
          setTotalPages(jobBankResults.totalPages);
          setTotalJobs(jobBankResults.totalJobs);
          
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
  }, []);

  return { fetchJobs };
};
