
/**
 * Simple in-memory cache for job search results
 */
export class JobCache {
  private static cache: Map<string, any> = new Map();
  private static MAX_CACHE_SIZE = 50;
  private static CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes
  
  /**
   * Save search results to cache
   */
  static saveSearchResults(key: string, results: any): void {
    // If cache is getting too large, remove oldest entries
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    
    this.cache.set(key, {
      timestamp: Date.now(),
      data: results
    });
  }
  
  /**
   * Get search results from cache if not expired
   */
  static getSearchResults(key: string): any {
    const cacheEntry = this.cache.get(key);
    
    if (!cacheEntry) {
      return null;
    }
    
    // Check if cache entry has expired
    if (Date.now() - cacheEntry.timestamp > this.CACHE_EXPIRY) {
      this.cache.delete(key);
      return null;
    }
    
    return cacheEntry.data;
  }
  
  /**
   * Clear all cache entries
   */
  static clearCache(): void {
    this.cache.clear();
  }
  
  /**
   * Clear a specific search result from cache
   */
  static clearSearchResult(key: string): void {
    this.cache.delete(key);
  }
}
