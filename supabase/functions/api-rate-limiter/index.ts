
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// Cache for rate limiting
const requestTracking = new Map<string, number[]>();
const maxRequestsPerMinute = 60; // Maximum 60 requests per minute per IP
const timeWindowMs = 60 * 1000; // 1 minute

// Set up CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Clean up old requests periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamps] of requestTracking.entries()) {
    const filteredTimestamps = timestamps.filter(time => now - time < timeWindowMs);
    if (filteredTimestamps.length === 0) {
      requestTracking.delete(ip);
    } else {
      requestTracking.set(ip, filteredTimestamps);
    }
  }
}, 5 * 60 * 1000); // Clean up every 5 minutes

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    // Get client IP address
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown';
    
    // Check if client is rate limited
    const isRateLimited = checkRateLimit(clientIP);
    
    if (isRateLimited) {
      // Return 429 Too Many Requests
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          message: 'You have exceeded the rate limit. Please try again later.',
          retryAfter: 60, // Retry after 60 seconds
        }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Retry-After': '60',
          },
        }
      );
    }
    
    // Get request payload
    const { endpoint } = await req.json();
    
    // Track this request
    trackRequest(clientIP);
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Request allowed',
        endpoint,
        remainingRequests: getRemainingRequests(clientIP),
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': maxRequestsPerMinute.toString(),
          'X-RateLimit-Remaining': getRemainingRequests(clientIP).toString(),
          'X-RateLimit-Reset': Math.floor(Date.now() / 1000 + 60).toString(),
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in rate limiter:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

// Check if a client is rate limited
function checkRateLimit(clientIP: string): boolean {
  const now = Date.now();
  const requestTimes = requestTracking.get(clientIP) || [];
  
  // Filter out requests older than the time window
  const recentRequests = requestTimes.filter(time => now - time < timeWindowMs);
  
  return recentRequests.length >= maxRequestsPerMinute;
}

// Track a new request
function trackRequest(clientIP: string): void {
  const now = Date.now();
  const requestTimes = requestTracking.get(clientIP) || [];
  
  // Filter out old requests and add the new one
  const recentRequests = requestTimes
    .filter(time => now - time < timeWindowMs)
    .concat(now);
  
  requestTracking.set(clientIP, recentRequests);
}

// Get remaining requests for a client
function getRemainingRequests(clientIP: string): number {
  const now = Date.now();
  const requestTimes = requestTracking.get(clientIP) || [];
  
  // Filter out requests older than the time window
  const recentRequests = requestTimes.filter(time => now - time < timeWindowMs);
  
  return Math.max(0, maxRequestsPerMinute - recentRequests.length);
}
