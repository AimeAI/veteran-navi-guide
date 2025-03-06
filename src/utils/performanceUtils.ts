
/**
 * Performance utility functions for optimizing application performance
 */

// A simple performance monitor that measures execution time
export const measurePerformance = (
  name: string, 
  fn: (...args: any[]) => any, 
  ...args: any[]
): any => {
  const start = performance.now();
  try {
    return fn(...args);
  } finally {
    const end = performance.now();
    console.log(`⚡️ ${name} executed in ${(end - start).toFixed(2)}ms`);
  }
};

// Cache results of expensive operations with optional expiration
const cache: Record<string, { value: any; expiry: number }> = {};

export const memoizeWithExpiry = <T>(
  fn: (...args: any[]) => T,
  keyFn: (...args: any[]) => string = (...args) => JSON.stringify(args),
  expiryMs = 5 * 60 * 1000 // 5 minutes default
): ((...args: any[]) => T) => {
  return (...args: any[]): T => {
    const key = keyFn(...args);
    const now = Date.now();
    
    if (key in cache && cache[key].expiry > now) {
      console.log(`🔍 Cache hit for ${key}`);
      return cache[key].value;
    }
    
    console.log(`🔍 Cache miss for ${key}`);
    const result = fn(...args);
    cache[key] = {
      value: result,
      expiry: now + expiryMs
    };
    
    return result;
  };
};

// Debounce function to limit how often a function is called
export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return function(this: any, ...args: Parameters<T>): void {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
};

// Throttle function to limit the rate at which a function is executed
export const throttle = <T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false;
  
  return function(this: any, ...args: Parameters<T>): void {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Apply optimized image loading to an img element
export const optimizeImageLoading = (imgElement: HTMLImageElement): void => {
  // Set loading attribute to lazy
  imgElement.loading = 'lazy';
  
  // Add decoded callback for timing
  imgElement.decode().then(() => {
    console.log(`🖼️ Image decoded: ${imgElement.src}`);
  }).catch(err => {
    console.error(`Image decode error for ${imgElement.src}:`, err);
  });
};

// Enhanced version of fetch with timeout and caching
export const enhancedFetch = async (
  url: string,
  options: RequestInit = {},
  cacheTime = 5 * 60 * 1000, // 5 minutes
  timeout = 8000 // 8 seconds
): Promise<Response> => {
  const cacheKey = `fetch:${url}:${JSON.stringify(options)}`;
  const cachedResponse = sessionStorage.getItem(cacheKey);
  
  if (cachedResponse) {
    const { data, expiry } = JSON.parse(cachedResponse);
    if (expiry > Date.now()) {
      console.log(`📦 Using cached response for ${url}`);
      return new Response(new Blob([JSON.stringify(data)]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    console.log(`📦 Cache expired for ${url}`);
    sessionStorage.removeItem(cacheKey);
  }

  // Create an AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const fetchStart = performance.now();
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    const fetchEnd = performance.now();
    console.log(`⚡️ Fetch ${url} completed in ${(fetchEnd - fetchStart).toFixed(2)}ms`);
    
    if (response.ok) {
      // Clone the response before consuming it
      const clone = response.clone();
      const data = await clone.json();
      
      // Cache the successful response
      sessionStorage.setItem(cacheKey, JSON.stringify({
        data,
        expiry: Date.now() + cacheTime
      }));
    }
    
    return response;
  } catch (err) {
    if (err.name === 'AbortError') {
      console.error(`⏱️ Fetch timeout for ${url}`);
      throw new Error(`Request timed out after ${timeout}ms`);
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
};
