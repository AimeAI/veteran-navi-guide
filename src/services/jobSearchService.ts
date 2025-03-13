
import { Job } from '@/types/job';
import { JobSearchParams } from '@/types/jobSearch';
import { JobCache } from '@/utils/jobCache';
import { generateCacheKey, measurePerformance } from '@/utils/performanceUtils';
import { searchLightcastJobs } from '@/utils/lightcastApi';
import { searchJobBankJobs } from '@/utils/jobBankApi';
import { fetchAndParseJobicyFeed } from '@/utils/jobicyRssParser';
import { fetchJobsFromSupabaseFallback } from '@/utils/jobSearchFallback';

/**
 * Service for searching jobs across multiple sources
 */
export const jobSearchService = {
  /**
   * Search for jobs using the appropriate API based on country and other params
   */
  async searchJobs(
    searchParams: JobSearchParams,
    currentPage: number,
    pageSize: number
  ): Promise<{
    jobs: Job[];
    totalPages: number;
    totalJobs: number;
  }> {
    // Generate a cache key based on search parameters
    const cacheKey = generateCacheKey('jobSearch', {
      ...searchParams,
      page: currentPage,
      pageSize,
    });

    // Check if we have cached results first
    if (!searchParams.refresh) {
      const cachedResults = JobCache.getSearchResults(cacheKey);
      if (cachedResults) {
        return cachedResults;
      }
    }

    // If no cached results, fetch new data
    return await measurePerformance('Job search query', async () => {
      // Dynamically determine which job source to use based on country
      let fetchedJobs: Job[] = [];
      let fetchedTotalPages = 1;
      let fetchedTotalJobs = 0;

      const { keywords, location, country, ...otherParams } = searchParams;

      // Common search params
      const params = {
        ...otherParams,
        page: currentPage,
        pageSize
      };

      if (country === 'us') {
        // Use Lightcast API for US jobs
        const lightcastResults = await searchLightcastJobs({
          keywords,
          location,
          ...params
        });
        fetchedJobs = lightcastResults.jobs || [];
        fetchedTotalPages = lightcastResults.totalPages || 1;
        fetchedTotalJobs = lightcastResults.totalJobs || 0;
      } else if (country === 'canada') {
        // Use JobBank API for Canadian jobs
        const jobBankResults = await searchJobBankJobs({
          keywords,
          location,
          distance: params.radius,
          page: params.page,
          sort: params.sortBy
        });
        fetchedJobs = jobBankResults.jobs || [];
        fetchedTotalPages = jobBankResults.totalPages || 1;
        fetchedTotalJobs = jobBankResults.totalJobs || 0;
      } else {
        // Fallback to Jobicy for other locations
        const jobs = await fetchAndParseJobicyFeed();
        // Filter jobs based on keywords and location if provided
        let filteredJobs = jobs;
        if (keywords) {
          const keywordsLower = keywords.toLowerCase();
          filteredJobs = filteredJobs.filter(job => 
            job.title.toLowerCase().includes(keywordsLower) || 
            job.description.toLowerCase().includes(keywordsLower)
          );
        }
        if (location) {
          const locationLower = location.toLowerCase();
          filteredJobs = filteredJobs.filter(job => 
            job.location.toLowerCase().includes(locationLower)
          );
        }
        
        // Paginate the results
        const startIdx = (currentPage - 1) * pageSize;
        const endIdx = startIdx + pageSize;
        const paginatedJobs = filteredJobs.slice(startIdx, endIdx);
        
        fetchedJobs = paginatedJobs;
        fetchedTotalJobs = filteredJobs.length;
        fetchedTotalPages = Math.ceil(filteredJobs.length / pageSize);
      }

      // Cache the results
      const result = {
        jobs: fetchedJobs,
        totalPages: fetchedTotalPages,
        totalJobs: fetchedTotalJobs
      };
      
      JobCache.saveSearchResults(cacheKey, result);
      
      return result;
    });
  },
  
  /**
   * Attempt to search for jobs with fallback options when primary sources fail
   */
  async searchJobsWithFallback(
    searchParams: JobSearchParams,
    currentPage: number,
    pageSize: number,
  ): Promise<{
    jobs: Job[];
    totalPages: number;
    totalJobs: number;
  }> {
    try {
      return await this.searchJobs(searchParams, currentPage, pageSize);
    } catch (error) {
      console.error('Error searching jobs:', error);
      
      // Try to get results from Supabase as a fallback
      const fallbackResult = await fetchJobsFromSupabaseFallback(currentPage, pageSize);
      
      if (fallbackResult) {
        return {
          jobs: fallbackResult.jobs,
          totalPages: Math.ceil(fallbackResult.totalCount / pageSize),
          totalJobs: fallbackResult.totalCount
        };
      }
      
      // If all else fails, return empty results
      return {
        jobs: [],
        totalPages: 1,
        totalJobs: 0
      };
    }
  }
};
