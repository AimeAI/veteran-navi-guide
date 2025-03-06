
import { Job } from '@/context/JobContext';

// Define interface for cache entries
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number; // Expiry time in milliseconds
}

// Define cache interface
export class JobCache {
  private static readonly CACHE_KEY = 'job_search_cache';
  private static readonly DEFAULT_EXPIRY = 1000 * 60 * 60; // 1 hour

  /**
   * Save search results to local storage cache
   */
  static saveSearchResults(
    key: string,
    data: {
      jobs: Job[];
      totalJobs: number;
      totalPages: number;
      currentPage: number;
    },
    expiry = this.DEFAULT_EXPIRY
  ): void {
    try {
      const cache = this.getCache();
      
      cache[key] = {
        data,
        timestamp: Date.now(),
        expiry,
      };
      
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cache));
      console.log(`Cached search results for: ${key}`);
    } catch (error) {
      console.warn('Failed to cache search results:', error);
    }
  }

  /**
   * Get search results from cache
   */
  static getSearchResults(key: string): {
    jobs: Job[];
    totalJobs: number;
    totalPages: number;
    currentPage: number;
  } | null {
    try {
      const cache = this.getCache();
      const entry = cache[key];
      
      if (!entry) return null;
      
      // Check if entry has expired
      if (Date.now() > entry.timestamp + entry.expiry) {
        this.clearCacheEntry(key);
        return null;
      }
      
      return entry.data;
    } catch (error) {
      console.warn('Failed to retrieve search results from cache:', error);
      return null;
    }
  }

  /**
   * Clear a specific cache entry
   */
  static clearCacheEntry(key: string): void {
    try {
      const cache = this.getCache();
      delete cache[key];
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
      console.warn('Failed to clear cache entry:', error);
    }
  }

  /**
   * Clear all cached job search results
   */
  static clearCache(): void {
    try {
      localStorage.removeItem(this.CACHE_KEY);
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }

  /**
   * Get cache from local storage
   */
  private static getCache(): Record<string, CacheEntry<any>> {
    try {
      const cachedData = localStorage.getItem(this.CACHE_KEY);
      return cachedData ? JSON.parse(cachedData) : {};
    } catch (error) {
      console.warn('Failed to parse cache:', error);
      return {};
    }
  }
}
