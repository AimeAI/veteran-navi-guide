
// Follow the Supabase Edge Function deployment instructions:
// https://supabase.com/docs/guides/functions

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import * as cheerio from 'https://esm.sh/cheerio@1.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function searchJobBankCanada(params: {
  keywords?: string;
  location?: string;
  distance?: number;
  page?: number;
}) {
  try {
    console.log('Searching Job Bank Canada with params:', params);
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    if (params.keywords) queryParams.append('searchstring', params.keywords);
    if (params.location) queryParams.append('location', params.location);
    if (params.distance) queryParams.append('distance', params.distance.toString());
    if (params.page && params.page > 1) queryParams.append('page', params.page.toString());
    
    // Add fixed sort parameter
    queryParams.append('sort', 'D');
    
    const baseUrl = 'https://www.jobbank.gc.ca/jobsearch/';
    const url = `${baseUrl}?${queryParams.toString()}`;
    
    console.log('Fetching job data from:', url);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Job Bank API returned status: ${response.status}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Extract job listings
    const jobs = [];
    const jobResults = $('.results-jobs article');
    
    console.log(`Found ${jobResults.length} job results`);
    
    jobResults.each((i, elem) => {
      const jobElement = $(elem);
      const title = jobElement.find('.noctitle').text().trim();
      const company = jobElement.find('.business').text().trim();
      const location = jobElement.find('.location').text().trim();
      const datePosted = jobElement.find('.date').text().trim();
      const salary = jobElement.find('.salary').text().trim();
      const jobIdElement = jobElement.find('a[data-did]');
      const jobId = jobIdElement.attr('data-did') || `jobbank-${Date.now()}-${i}`;
      const jobUrl = jobIdElement.attr('href') 
        ? `https://www.jobbank.gc.ca${jobIdElement.attr('href')}` 
        : undefined;
      const description = jobElement.find('.summary').text().trim();
      
      jobs.push({
        id: jobId,
        title,
        company,
        location,
        description,
        date: datePosted,
        url: jobUrl,
        source: 'jobbank',
        salary_range: salary,
        remote: location.toLowerCase().includes('remote'),
        job_type: 'fulltime', // Default
        category: 'other', // Default
        industry: '',
        experience_level: '',
        education_level: '',
      });
    });
    
    // Extract pagination info
    const totalJobsText = $('.results-jobs header').text();
    const totalJobsMatch = totalJobsText.match(/(\d+)\s+jobs/i);
    let totalJobs = totalJobsMatch ? parseInt(totalJobsMatch[1], 10) : jobs.length;
    
    if (isNaN(totalJobs) || totalJobs === 0) {
      totalJobs = jobs.length;
    }
    
    const currentPage = params.page || 1;
    const totalPages = Math.max(1, Math.ceil(totalJobs / 25)); // Job Bank shows 25 jobs per page
    
    console.log(`Returning ${jobs.length} jobs, total: ${totalJobs}, pages: ${totalPages}`);
    
    return {
      jobs,
      totalJobs,
      currentPage,
      totalPages,
    };
  } catch (error) {
    console.error('Error searching Job Bank Canada:', error);
    throw error;
  }
}

// Cache the results to reduce API calls and improve performance
const resultsCache = new Map();
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes in milliseconds

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    const url = new URL(req.url);
    
    // Parse query parameters
    const keywords = url.searchParams.get('keywords') || '';
    const location = url.searchParams.get('location') || '';
    const distance = parseInt(url.searchParams.get('distance') || '50', 10);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    
    // Create a cache key
    const cacheKey = `${keywords}:${location}:${distance}:${page}`;
    
    // Check if we have cached results that haven't expired
    const cachedResult = resultsCache.get(cacheKey);
    if (cachedResult && (Date.now() - cachedResult.timestamp < CACHE_EXPIRY)) {
      console.log('Returning cached results for:', cacheKey);
      return new Response(JSON.stringify(cachedResult.data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }
    
    // If not in cache or expired, fetch new data
    const results = await searchJobBankCanada({
      keywords,
      location,
      distance,
      page,
    });
    
    // Cache the results with timestamp
    if (resultsCache.size > 100) {
      // Clear oldest entries if cache gets too large
      const oldestKey = resultsCache.keys().next().value;
      resultsCache.delete(oldestKey);
    }
    
    resultsCache.set(cacheKey, {
      data: results,
      timestamp: Date.now()
    });
    
    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in job search proxy:', error);
    
    return new Response(JSON.stringify({
      error: error.message,
      jobs: [],
      totalJobs: 0,
      totalPages: 0,
      currentPage: 1,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
