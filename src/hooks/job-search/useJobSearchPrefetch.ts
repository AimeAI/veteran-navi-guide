
import { useEffect } from 'react';
import { searchJobBankJobs } from '@/utils/jobBankApi';
import { JobSearchParams } from './types';
import { useJobSearchCache } from './useJobSearchCache';

export const useJobSearchPrefetch = (
  currentPage: number,
  totalPages: number,
  params: JobSearchParams
) => {
  const { getCacheKey, getFromCache, saveToCache } = useJobSearchCache();

  // Prefetch next page if we're getting close to the end of the current page
  useEffect(() => {
    if (currentPage < totalPages) {
      const prefetchNextPage = async () => {
        const nextPageParams = {
          ...params,
          page: currentPage + 1
        };
        
        const nextPageCacheKey = getCacheKey(nextPageParams, currentPage + 1);
        
        // Only prefetch if not already in cache
        if (!getFromCache(nextPageParams, currentPage + 1)) {
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
              // Store in cache
              saveToCache(nextPageParams, currentPage + 1, jobBankResults);
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
  }, [currentPage, totalPages, params, getCacheKey, getFromCache, saveToCache]);
};
