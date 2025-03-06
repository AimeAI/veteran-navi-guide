
// Follow the Supabase Edge Function deployment instructions:
// https://supabase.com/docs/guides/functions

import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import * as cheerio from 'https://esm.sh/cheerio@1.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

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
    if (params.page) queryParams.append('page', params.page.toString());
    
    // Add fixed sort parameter
    queryParams.append('sort', 'D');
    
    const baseUrl = 'https://www.jobbank.gc.ca/jobsearch/';
    const url = `${baseUrl}?${queryParams.toString()}`;
    
    console.log('Fetching job data from:', url);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; JobSearchBot/1.0)',
        'Accept': 'text/html',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Job Bank API returned status: ${response.status}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Extract job listings
    const jobs = [];
    const jobResults = $('#result').find('.results-jobs article');
    
    jobResults.each((i, elem) => {
      const title = $(elem).find('.noctitle').text().trim();
      const company = $(elem).find('.business').text().trim();
      const location = $(elem).find('.location').text().trim();
      const datePosted = $(elem).find('.date').text().trim();
      const salary = $(elem).find('.salary').text().trim();
      const jobIdElement = $(elem).find('a[data-did]');
      const jobId = jobIdElement.attr('data-did') || `jobbank-${Date.now()}-${i}`;
      const jobUrl = jobIdElement.attr('href') 
        ? `https://www.jobbank.gc.ca${jobIdElement.attr('href')}` 
        : undefined;
      const description = $(elem).find('.summary').text().trim();
      
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
    const totalJobs = totalJobsMatch ? parseInt(totalJobsMatch[1], 10) : jobs.length;
    
    const currentPage = params.page || 1;
    const totalPages = Math.ceil(totalJobs / 25); // Job Bank shows 25 jobs per page
    
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
    const source = url.searchParams.get('source') || 'jobbank';
    
    // Parse query parameters
    const keywords = url.searchParams.get('keywords') || '';
    const location = url.searchParams.get('location') || '';
    const distance = parseInt(url.searchParams.get('distance') || '50', 10);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    
    // Create a cache key
    const cacheKey = `${source}:${keywords}:${location}:${distance}:${page}`;
    
    // Check if we have cached results
    if (resultsCache.has(cacheKey)) {
      console.log('Returning cached results for:', cacheKey);
      return new Response(JSON.stringify(resultsCache.get(cacheKey)), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }
    
    let results;
    
    if (source === 'jobbank') {
      results = await searchJobBankCanada({
        keywords,
        location,
        distance,
        page,
      });
    } else {
      throw new Error(`Unsupported source: ${source}`);
    }
    
    // Cache the results (with a reasonable limit)
    if (resultsCache.size > 100) {
      // Clear oldest entries if cache gets too large
      const oldestKey = resultsCache.keys().next().value;
      resultsCache.delete(oldestKey);
    }
    resultsCache.set(cacheKey, results);
    
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
