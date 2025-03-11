
import { useCallback } from 'react';
import { Job } from '@/types/job';
import { JobCache } from '@/utils/jobCache';
import { searchJobBankJobs } from '@/utils/jobBankApi';
import { convertMilitarySkillsToKeywords, getCacheKey, matchSkillsWithJobRequirements } from '@/utils/jobSearchUtils';
import { JobSearchParams } from '@/types/jobSearch';

/**
 * Hook for fetching job data with advanced filtering and caching
 */
export const useJobFetcher = () => {
  /**
   * Fetch jobs with the provided search parameters
   * @param params - Search parameters
   * @param setJobs - Function to set the job results
   * @param setTotalPages - Function to set total pages
   * @param setTotalJobs - Function to set total jobs count
   * @param setError - Function to set error state
   * @param setIsLoading - Function to set loading state
   */
  const fetchJobs = useCallback(async (
    params: JobSearchParams & { page: number }, 
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
      
      // Process military skill keywords
      if (searchParams.keywords && searchParams.keywords.includes("skill:")) {
        const skillMatches = searchParams.keywords.match(/skill:([a-z]+)/g) || [];
        const skills = skillMatches.map(s => s.replace('skill:', ''));
        
        const skillKeywords = convertMilitarySkillsToKeywords(skills);
        
        const cleanKeywords = searchParams.keywords.replace(/skill:[a-z]+,?/g, '').trim();
        
        searchParams.keywords = cleanKeywords ? 
          `${cleanKeywords} ${skillKeywords}` : skillKeywords;
      }
      
      console.log("Fetching jobs with params:", searchParams);
      
      // Check cache first unless refreshing
      const cacheKey = getCacheKey(searchParams, searchParams.page);
      const cachedResults = JobCache.getSearchResults(cacheKey);
      
      if (cachedResults && !params.refresh) {
        console.log("Using cached job results");
        setJobs(cachedResults.jobs);
        setTotalPages(cachedResults.totalPages);
        setTotalJobs(cachedResults.totalJobs);
        setIsLoading(false);
        return;
      }
      
      try {
        console.log("Searching for jobs with new parameters");
        const jobBankParams = {
          keywords: searchParams.keywords,
          location: searchParams.location,
          distance: searchParams.radius,
          page: searchParams.page,
          skills: searchParams.skills,
          jobType: searchParams.jobType,
          industry: searchParams.industry,
          experienceLevel: searchParams.experienceLevel,
          educationLevel: searchParams.educationLevel,
          salaryRange: searchParams.salaryRange,
        };
        
        const jobBankResults = await searchJobBankJobs(jobBankParams);
        
        if (jobBankResults.jobs && jobBankResults.jobs.length > 0) {
          console.log(`Found ${jobBankResults.jobs.length} jobs`);
          
          // Apply filters to search results
          let filteredJobs = jobBankResults.jobs;
          
          // Filter by job type if specified
          if (searchParams.jobType) {
            filteredJobs = filteredJobs.filter(job => 
              job.jobType.toLowerCase() === searchParams.jobType?.toLowerCase()
            );
          }
          
          // Filter by industry if specified
          if (searchParams.industry) {
            filteredJobs = filteredJobs.filter(job => 
              job.industry.toLowerCase() === searchParams.industry?.toLowerCase()
            );
          }
          
          // Filter by experience level if specified
          if (searchParams.experienceLevel) {
            filteredJobs = filteredJobs.filter(job => 
              job.experienceLevel.toLowerCase() === searchParams.experienceLevel?.toLowerCase()
            );
          }
          
          // Filter by education level if specified
          if (searchParams.educationLevel) {
            filteredJobs = filteredJobs.filter(job => 
              job.educationLevel.toLowerCase() === searchParams.educationLevel?.toLowerCase()
            );
          }
          
          // Filter by salary range if specified
          if (searchParams.salaryRange) {
            filteredJobs = filteredJobs.filter(job => 
              job.salaryRange === searchParams.salaryRange
            );
          }
          
          // Match skills with job requirements if skills are specified
          if (searchParams.skills && searchParams.skills.length > 0) {
            filteredJobs = filteredJobs.map(job => 
              matchSkillsWithJobRequirements(job, searchParams.skills)
            ).filter(job => job !== null) as Job[];
          }
          
          // Update counts based on filtered results
          const filteredTotalJobs = filteredJobs.length > 0 
            ? Math.max(filteredJobs.length, jobBankResults.totalJobs / 2) 
            : 0;
          
          const filteredTotalPages = Math.ceil(filteredTotalJobs / 10);
          
          setJobs(filteredJobs);
          setTotalPages(filteredTotalPages || jobBankResults.totalPages);
          setTotalJobs(filteredTotalJobs || jobBankResults.totalJobs);
          
          // Cache the search results
          JobCache.saveSearchResults(cacheKey, {
            jobs: filteredJobs,
            totalPages: filteredTotalPages || jobBankResults.totalPages,
            totalJobs: filteredTotalJobs || jobBankResults.totalJobs
          });
          
          setIsLoading(false);
          return;
        } else {
          console.log("No jobs found, returning empty results");
          setJobs([]);
          setTotalPages(0);
          setTotalJobs(0);
          setIsLoading(false);
        }
      } catch (searchError) {
        console.error("Error fetching jobs:", searchError);
        throw searchError;
      }
    } catch (err) {
      console.error('Error in job fetch flow:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch jobs'));
      setIsLoading(false);
    }
  }, []);

  return { fetchJobs };
};
