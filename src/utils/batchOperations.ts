
/**
 * Utility for performing batch operations to reduce database load
 */

// Batches multiple operations into a single operation that runs at most once every `delay` ms
export function debounce<T extends (...args: any[]) => any>(
  func: T, 
  delay: number = 300
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return function(...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Groups multiple operations into batches to reduce database queries
export class BatchProcessor<T> {
  private batchSize: number;
  private maxWaitTime: number;
  private processFn: (items: T[]) => Promise<void>;
  private queue: T[] = [];
  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  constructor(
    processFn: (items: T[]) => Promise<void>,
    batchSize: number = 10,
    maxWaitTime: number = 2000
  ) {
    this.processFn = processFn;
    this.batchSize = batchSize;
    this.maxWaitTime = maxWaitTime;
  }
  
  public add(item: T): void {
    this.queue.push(item);
    
    if (this.queue.length >= this.batchSize) {
      this.processQueue();
    } else if (!this.timeoutId) {
      // Start the timer if this is the first item in a new batch
      this.timeoutId = setTimeout(() => this.processQueue(), this.maxWaitTime);
    }
  }
  
  private async processQueue(): Promise<void> {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    
    if (this.queue.length === 0) return;
    
    const itemsToProcess = [...this.queue];
    this.queue = [];
    
    try {
      await this.processFn(itemsToProcess);
    } catch (error) {
      console.error('Error processing batch:', error);
      // On error, add items back to the queue for retry
      this.queue = [...itemsToProcess, ...this.queue];
      this.timeoutId = setTimeout(() => this.processQueue(), this.maxWaitTime);
    }
  }
  
  public flush(): Promise<void> {
    return this.processQueue();
  }
}

// Cache implementation to reduce duplicate queries
export class QueryCache<K, V> {
  private cache = new Map<string, { value: V, timestamp: number }>();
  private ttl: number;
  
  constructor(ttlMs: number = 60000) { // Default TTL: 1 minute
    this.ttl = ttlMs;
  }
  
  private getKey(key: K): string {
    return typeof key === 'string' ? key : JSON.stringify(key);
  }
  
  public get(key: K): V | undefined {
    const cacheKey = this.getKey(key);
    const item = this.cache.get(cacheKey);
    
    if (!item) return undefined;
    
    const now = Date.now();
    if (now - item.timestamp > this.ttl) {
      this.cache.delete(cacheKey);
      return undefined;
    }
    
    return item.value;
  }
  
  public set(key: K, value: V): void {
    const cacheKey = this.getKey(key);
    this.cache.set(cacheKey, { value, timestamp: Date.now() });
  }
  
  public clear(): void {
    this.cache.clear();
  }
  
  public prune(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > this.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Class for API rate limiting to prevent overloading
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private timeWindowMs: number;
  
  constructor(maxRequests: number = 50, timeWindowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.timeWindowMs = timeWindowMs;
    
    // Set up automatic cleanup every minute
    setInterval(() => this.cleanup(), 60000);
  }
  
  public isRateLimited(identifier: string): boolean {
    const now = Date.now();
    
    // Get or initialize the requests array for this identifier
    if (!this.requests.has(identifier)) {
      this.requests.set(identifier, []);
    }
    
    const requestTimes = this.requests.get(identifier)!;
    
    // Filter out expired timestamps
    const validRequests = requestTimes.filter(time => now - time < this.timeWindowMs);
    this.requests.set(identifier, validRequests);
    
    // Check if rate limit is exceeded
    if (validRequests.length >= this.maxRequests) {
      return true;
    }
    
    // Add current timestamp and return false (not rate limited)
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    return false;
  }
  
  public getRemainingRequests(identifier: string): number {
    if (!this.requests.has(identifier)) return this.maxRequests;
    
    const now = Date.now();
    const requestTimes = this.requests.get(identifier)!;
    const validRequests = requestTimes.filter(time => now - time < this.timeWindowMs);
    
    return Math.max(0, this.maxRequests - validRequests.length);
  }
  
  private cleanup(): void {
    const now = Date.now();
    for (const [identifier, times] of this.requests.entries()) {
      const validTimes = times.filter(time => now - time < this.timeWindowMs);
      
      if (validTimes.length === 0) {
        this.requests.delete(identifier);
      } else {
        this.requests.set(identifier, validTimes);
      }
    }
  }
}

// Pagination utility for API responses
export class PaginatedResponse<T> {
  private items: T[];
  private pageSize: number;
  private totalItems: number;
  
  constructor(items: T[], pageSize: number = 10, totalItems?: number) {
    this.items = items;
    this.pageSize = pageSize;
    this.totalItems = totalItems ?? items.length;
  }
  
  public getPage(page: number = 1): { 
    data: T[]; 
    pagination: { 
      currentPage: number; 
      totalPages: number; 
      totalItems: number; 
      pageSize: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    } 
  } {
    const startIndex = (page - 1) * this.pageSize;
    const paginatedItems = this.items.slice(startIndex, startIndex + this.pageSize);
    const totalPages = Math.ceil(this.totalItems / this.pageSize);
    
    return {
      data: paginatedItems,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: this.totalItems,
        pageSize: this.pageSize,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    };
  }
}
