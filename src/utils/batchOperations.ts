
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
