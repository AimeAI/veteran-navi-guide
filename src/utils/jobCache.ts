
import { Job } from '@/types/job';

interface CachedSearchResult {
  jobs: Job[];
  totalPages: number;
  totalJobs: number;
  timestamp: number;
}

/**
 * JobCache - Utility for caching job search results to improve performance
 */
export class JobCache {
  private static cache: Map<string, CachedSearchResult> = new Map();
  private static TTL_MS = 5 * 60 * 1000; // 5 minutes cache TTL
  private static MAX_CACHE_SIZE = 10; // Maximum number of cached search results
  
  /**
   * Get cached search results by cache key
   * @param key - Cache key
   * @returns Cached search result or null if not found or expired
   */
  public static getSearchResults(key: string): {
    jobs: Job[];
    totalPages: number;
    totalJobs: number;
  } | null {
    const cachedResult = this.cache.get(key);
    
    // Return null if no cached result or if cache has expired
    if (!cachedResult || Date.now() - cachedResult.timestamp > this.TTL_MS) {
      if (cachedResult) {
        // Remove expired cache entry
        this.cache.delete(key);
      }
      return null;
    }
    
    return {
      jobs: cachedResult.jobs,
      totalPages: cachedResult.totalPages,
      totalJobs: cachedResult.totalJobs,
    };
  }
  
  /**
   * Save search results to cache
   * @param key - Cache key
   * @param results - Search results to cache
   */
  public static saveSearchResults(
    key: string, 
    results: {
      jobs: Job[];
      totalPages: number;
      totalJobs: number;
    }
  ): void {
    // Ensure we don't exceed the maximum cache size
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      // Find the oldest cache entry to remove
      let oldestKey: string | null = null;
      let oldestTimestamp = Date.now();
      
      this.cache.forEach((value, cacheKey) => {
        if (value.timestamp < oldestTimestamp) {
          oldestTimestamp = value.timestamp;
          oldestKey = cacheKey;
        }
      });
      
      // Remove the oldest entry
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }
    
    // Save the new search results with a timestamp
    this.cache.set(key, {
      ...results,
      timestamp: Date.now(),
    });
    
    console.log(`Cached search results for key: ${key}`);
  }
  
  /**
   * Clear a specific search result from cache
   * @param key - Cache key to clear
   */
  public static clearSearchResult(key: string): void {
    this.cache.delete(key);
    console.log(`Cleared cache for key: ${key}`);
  }
  
  /**
   * Clear the entire cache
   */
  public static clearCache(): void {
    this.cache.clear();
    console.log('Cleared all cached job search results');
  }
  
  /**
   * Check if there are any cached results
   * @returns True if cache has entries
   */
  public static hasCachedResults(): boolean {
    return this.cache.size > 0;
  }
  
  /**
   * Get the number of cached entries
   * @returns Number of cached entries
   */
  public static getCacheSize(): number {
    return this.cache.size;
  }
}
