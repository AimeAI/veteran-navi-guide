
import { useCallback } from 'react';
import { JobCache } from '@/utils/jobCache';
import { jobSearchCache } from '@/utils/cacheUtils';
import { JobSearchParams, JobSearchCacheEntry } from './types';

export const useJobSearchCache = () => {
  // Generate a cache key based on search parameters
  const getCacheKey = useCallback((params: JobSearchParams, page: number): string => {
    const skillsKey = params.skills && params.skills.length > 0 
      ? params.skills.sort().join(',') 
      : '';
    
    return `${params.country || 'canada'}:${params.keywords || ''}:${params.location || ''}:${params.radius || 50}:${params.jobType || ''}:${params.industry || ''}:${skillsKey}:${page}`;
  }, []);

  const getFromCache = useCallback((params: JobSearchParams, page: number): JobSearchCacheEntry | null => {
    const cacheKey = getCacheKey(params, page);
    
    // First try the enhanced cache
    const cachedResults = jobSearchCache.get<JobSearchCacheEntry>(cacheKey);
    
    if (cachedResults) {
      console.log("Using cached job results from enhanced cache");
      return cachedResults;
    }
    
    // Fall back to the legacy cache
    const legacyCachedResults = JobCache.getSearchResults(cacheKey);
    
    if (legacyCachedResults) {
      console.log("Using cached job results from legacy cache");
      
      // Store in the enhanced cache for future
      jobSearchCache.set(cacheKey, legacyCachedResults);
      return legacyCachedResults;
    }
    
    return null;
  }, [getCacheKey]);

  const saveToCache = useCallback((params: JobSearchParams, page: number, data: JobSearchCacheEntry): void => {
    const cacheKey = getCacheKey(params, page);
    
    // Store in both caches for backward compatibility
    JobCache.saveSearchResults(cacheKey, data);
    jobSearchCache.set(cacheKey, data, 15 * 60 * 1000); // 15 minutes TTL
  }, [getCacheKey]);

  const clearCache = useCallback((params: JobSearchParams, page: number): void => {
    const cacheKey = getCacheKey(params, page);
    
    // Clear from both caches
    JobCache.clearSearchResult(cacheKey);
    jobSearchCache.delete(cacheKey);
  }, [getCacheKey]);

  return {
    getCacheKey,
    getFromCache,
    saveToCache,
    clearCache
  };
};
