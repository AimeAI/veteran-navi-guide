import { supabase } from "@/integrations/supabase/client";
import { QueryCache } from './batchOperations';

// Global API rate limiter instance
const globalRateLimiter = new QueryCache<string, number>(60000); // 1 minute cache

/**
 * Generic API response cache to reduce duplicate network requests
 * 
 * @param cacheKey - Unique identifier for this request
 * @param fetchFn - Function that performs the actual API request
 * @param ttlMs - Time-to-live in milliseconds for the cached response
 * @returns The cached or freshly fetched response
 */
export async function cachedFetch<T>(
  cacheKey: string,
  fetchFn: () => Promise<T>,
  ttlMs: number = 5 * 60 * 1000 // Default 5 minutes cache
): Promise<T> {
  // Check if we have this item in sessionStorage cache
  const cachedData = sessionStorage.getItem(cacheKey);
  
  if (cachedData) {
    try {
      const parsed = JSON.parse(cachedData);
      if (parsed.expiry > Date.now()) {
        console.log(`🔍 Cache hit for ${cacheKey}`);
        return parsed.data as T;
      }
      console.log(`🔍 Cache expired for ${cacheKey}`);
      sessionStorage.removeItem(cacheKey);
    } catch (error) {
      console.error('Error parsing cached data:', error);
      sessionStorage.removeItem(cacheKey);
    }
  }
  
  // If not in cache or expired, fetch fresh data
  console.log(`🔍 Cache miss for ${cacheKey}, fetching fresh data`);
  const data = await fetchFn();
  
  // Cache the new result
  try {
    sessionStorage.setItem(cacheKey, JSON.stringify({
      data,
      expiry: Date.now() + ttlMs
    }));
  } catch (e) {
    // Handle potential QuotaExceededError
    console.warn('Failed to cache response, possibly due to storage limits:', e);
    
    // Clean up older cache entries if we hit storage limits
    try {
      const keys = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith('cache:')) {
          keys.push(key);
        }
      }
      
      if (keys.length > 10) { // If we have more than 10, remove the oldest ones
        // Sort by expiry time
        keys.sort((a, b) => {
          const aData = JSON.parse(sessionStorage.getItem(a) || '{}');
          const bData = JSON.parse(sessionStorage.getItem(b) || '{}');
          return (aData.expiry || 0) - (bData.expiry || 0);
        });
        
        // Remove the oldest 20% of entries
        const toRemove = Math.max(1, Math.floor(keys.length * 0.2));
        for (let i = 0; i < toRemove; i++) {
          sessionStorage.removeItem(keys[i]);
        }
        
        // Try to cache again
        sessionStorage.setItem(cacheKey, JSON.stringify({
          data,
          expiry: Date.now() + ttlMs
        }));
      }
    } catch (e2) {
      console.error('Failed to manage cache storage:', e2);
    }
  }
  
  return data;
}

/**
 * Helper for making paginated Supabase queries
 * @param tableName - Supabase table to query
 * @param queryFn - Function that takes a Supabase query and returns the modified query
 * @param page - Page number to fetch (1-based index)
 * @param pageSize - Number of items per page
 * @param cacheKey - Optional cache key prefix
 * @returns Paginated data and pagination information
 */
export async function paginatedQuery<T>(
  tableName: string,
  queryFn: (query: any) => any,
  page: number = 1,
  pageSize: number = 20,
  cacheKey?: string
): Promise<{
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }
}> {
  const fetchData = async () => {
    // First, get the total count
    const countQuery = supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
      
    // Apply the query modifications
    const modifiedCountQuery = queryFn(countQuery);
    const { count, error: countError } = await modifiedCountQuery;
    
    if (countError) {
      console.error('Error getting count for paginated query:', countError);
      throw countError;
    }
    
    const totalItems = count || 0;
    const totalPages = Math.ceil(totalItems / pageSize);
    
    // Skip logic
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    // Now get the actual data with range
    const dataQuery = supabase
      .from(tableName)
      .select('*')
      .range(from, to);
      
    // Apply the query modifications
    const modifiedDataQuery = queryFn(dataQuery);
    const { data, error: dataError } = await modifiedDataQuery;
    
    if (dataError) {
      console.error('Error executing paginated query:', dataError);
      throw dataError;
    }
    
    return {
      data: data || [],
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        pageSize,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    };
  };
  
  // If a cache key is provided, use cached fetch
  if (cacheKey) {
    const fullCacheKey = `cache:${cacheKey}:page${page}:size${pageSize}`;
    return cachedFetch(fullCacheKey, fetchData);
  }
  
  // Otherwise just fetch the data directly
  return fetchData();
}

/**
 * Clear all cached API responses in session storage
 */
export function clearApiCache(): void {
  const keysToRemove = [];
  
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key && key.startsWith('cache:')) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => sessionStorage.removeItem(key));
  console.log(`Cleared ${keysToRemove.length} cached API responses`);
}

/**
 * Get performance metrics for API calls
 */
export function getApiPerformanceMetrics(): {
  cacheHitRate: number;
  averageResponseTime: number;
} {
  // Implementation would track metrics over time
  // Simple placeholder implementation
  return {
    cacheHitRate: 0.75, // 75% cache hit rate
    averageResponseTime: 120 // 120ms average response time
  };
}
