
/**
 * Advanced caching utilities for optimizing data fetching and storage
 */

// Cache storage with configurable options
interface CacheOptions {
  maxSize: number;
  defaultTTL: number; // in milliseconds
}

interface CacheEntry<T> {
  value: T;
  expiry: number;
  lastAccessed: number;
  size: number;
}

export class AdvancedCache<T> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private options: CacheOptions;
  private currentSize: number = 0;

  constructor(options: Partial<CacheOptions> = {}) {
    this.options = {
      maxSize: options.maxSize || 100,
      defaultTTL: options.defaultTTL || 5 * 60 * 1000, // 5 minutes default
    };
  }

  /**
   * Set a value in the cache with optional expiry time
   */
  set(key: string, value: T, ttl?: number, size = 1): void {
    this.ensureCapacity(size);
    
    const expiry = Date.now() + (ttl || this.options.defaultTTL);
    this.cache.set(key, {
      value,
      expiry,
      lastAccessed: Date.now(),
      size
    });
    
    this.currentSize += size;
    console.log(`Cache: Set ${key}, current size: ${this.currentSize}`);
  }

  /**
   * Get a value from the cache
   * Returns the value if found and not expired, otherwise returns undefined
   */
  get<R = T>(key: string): R | undefined {
    const entry = this.cache.get(key);
    
    if (!entry) {
      console.log(`Cache: Miss for ${key}`);
      return undefined;
    }
    
    if (entry.expiry < Date.now()) {
      console.log(`Cache: Expired entry for ${key}`);
      this.delete(key);
      return undefined;
    }
    
    // Update last accessed time
    entry.lastAccessed = Date.now();
    console.log(`Cache: Hit for ${key}`);
    return entry.value as unknown as R;
  }

  /**
   * Delete a value from the cache
   */
  delete(key: string): boolean {
    const entry = this.cache.get(key);
    if (entry) {
      this.currentSize -= entry.size;
      this.cache.delete(key);
      console.log(`Cache: Deleted ${key}, current size: ${this.currentSize}`);
      return true;
    }
    return false;
  }

  /**
   * Clear all values from the cache
   */
  clear(): void {
    this.cache.clear();
    this.currentSize = 0;
    console.log('Cache: Cleared all entries');
  }

  /**
   * Get the number of entries in the cache
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Ensure the cache has enough capacity for a new entry
   * If not, remove the least recently used entries
   */
  private ensureCapacity(newEntrySize: number): void {
    if (newEntrySize > this.options.maxSize) {
      console.warn(`Cache: Entry size ${newEntrySize} exceeds max cache size ${this.options.maxSize}`);
      return;
    }
    
    while (this.currentSize + newEntrySize > this.options.maxSize && this.cache.size > 0) {
      this.removeLRU();
    }
  }

  /**
   * Remove the least recently used entry from the cache
   */
  private removeLRU(): void {
    let oldest: [string, CacheEntry<T>] | null = null;
    
    for (const entry of this.cache.entries()) {
      if (!oldest || entry[1].lastAccessed < oldest[1].lastAccessed) {
        oldest = entry;
      }
    }
    
    if (oldest) {
      this.delete(oldest[0]);
    }
  }
}

// Application cache instances
export const jobSearchCache = new AdvancedCache<any>({ maxSize: 50, defaultTTL: 15 * 60 * 1000 });
export const profileCache = new AdvancedCache<any>({ maxSize: 20, defaultTTL: 30 * 60 * 1000 });
export const resourceCache = new AdvancedCache<any>({ maxSize: 30, defaultTTL: 60 * 60 * 1000 });

// Memoized fetch function with advanced caching
export const cachedFetch = async <T>(
  url: string,
  options: RequestInit = {},
  cacheKey?: string,
  ttl?: number
): Promise<T> => {
  // Generate cache key if not provided
  const key = cacheKey || `fetch:${url}:${JSON.stringify(options)}`;
  
  // Check cache first
  const cachedResponse = jobSearchCache.get<T>(key);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    // Measure fetch performance
    const startTime = performance.now();
    const response = await fetch(url, options);
    const endTime = performance.now();
    
    console.log(`Fetch ${url} completed in ${(endTime - startTime).toFixed(2)}ms`);
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    
    const data = await response.json();
    
    // Calculate approximate size of the response (simplified)
    const sizeEstimate = Math.ceil(JSON.stringify(data).length / 1024);
    
    // Store in cache
    jobSearchCache.set(key, data, ttl, sizeEstimate);
    
    return data as T;
  } catch (error) {
    console.error('Cached fetch error:', error);
    throw error;
  }
};

// Image preloading utility
export const preloadImages = (imageSrcs: string[]): void => {
  imageSrcs.forEach(src => {
    if (!src) return;
    const img = new Image();
    img.src = src;
  });
};

// Resource prefetching utility
export const prefetchResource = (url: string): void => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  document.head.appendChild(link);
};
