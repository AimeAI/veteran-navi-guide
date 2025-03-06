
import { Job } from "@/context/JobContext";

// Lightcast API credentials
const LIGHTCAST_CLIENT_ID = "41sty9h1mnp7l8q5";
const LIGHTCAST_SECRET = "7ie5tMCn";
const LIGHTCAST_SCOPE = "emsi_open";

// Interface for Lightcast API auth token response
interface LightcastAuthToken {
  access_token: string;
  expires_in: number;
  token_type: string;
}

// Interface for Lightcast job posting
interface LightcastJob {
  id: string;
  title: string;
  company: {
    name: string;
  };
  location: {
    name: string;
  };
  description: string;
  posted: string;
  remote_type?: string;
  job_type?: string;
  max_salary?: number;
  min_salary?: number;
  skills?: {
    name: string;
    type: string;
  }[];
  job_function?: {
    name: string;
  };
  experience_level?: {
    name: string;
  };
  education_level?: {
    name: string;
  };
  industry?: {
    name: string;
  };
}

// Interface for API search params
export interface LightcastSearchParams {
  keywords?: string;
  location?: string;
  radius?: number;
  page?: number;
  limit?: number;
  sort?: string;
  job_type?: string;
  industry?: string;
  experience_level?: string;
  education_level?: string;
  posting_date?: string;
  remote_type?: string;
  country?: "us" | "canada"; // Add country parameter to switch between US and Canada endpoints
}

// Response interface
interface LightcastJobsResponse {
  data: LightcastJob[];
  meta: {
    page: number;
    page_size: number;
    total_pages: number;
    total_records: number;
  };
}

// Google Jobs API response interface
interface GoogleJobsResponse {
  jobs_results: GoogleJob[];
  serpapi_pagination?: {
    current: number;
    next_page_link?: string;
    next_page?: string;
    other_pages?: Record<string, string>;
  };
}

interface GoogleJob {
  title: string;
  company_name: string;
  location: string;
  via: string;
  description: string;
  job_id: string;
  detected_extensions?: {
    posted_at?: string;
    schedule_type?: string;
    salary?: string;
  };
  job_highlights?: {
    title: string;
    items: string[];
  }[];
}

// Cache for the auth token to avoid requesting a new one for every API call
let authTokenCache: { token: string; expiresAt: number } | null = null;

/**
 * Get authentication token for Lightcast API
 */
export const getLightcastAuthToken = async (): Promise<string> => {
  // Check if we have a cached token that's still valid
  if (authTokenCache && authTokenCache.expiresAt > Date.now()) {
    console.log("Using cached auth token");
    return authTokenCache.token;
  }
  
  try {
    console.log("Requesting new Lightcast auth token");
    const response = await fetch('https://auth.emsicloud.com/connect/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: LIGHTCAST_CLIENT_ID,
        client_secret: LIGHTCAST_SECRET,
        grant_type: 'client_credentials',
        scope: LIGHTCAST_SCOPE,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Auth token request failed with status:", response.status, errorText);
      throw new Error(`Authentication failed: ${response.status} ${response.statusText}`);
    }
    
    const data: LightcastAuthToken = await response.json();
    console.log("Received new auth token, expires in:", data.expires_in, "seconds");
    
    // Cache the token
    authTokenCache = {
      token: data.access_token,
      expiresAt: Date.now() + (data.expires_in * 1000) - 60000, // Subtract 1 minute to be safe
    };
    
    return data.access_token;
  } catch (error) {
    console.error('Failed to get Lightcast auth token:', error);
    throw error;
  }
};

/**
 * Convert Lightcast job format to our internal Job format
 */
const mapLightcastJobToJob = (job: LightcastJob): Job => {
  return {
    id: job.id,
    title: job.title,
    company: job.company.name,
    location: job.location.name,
    description: job.description,
    category: job.job_function?.name?.toLowerCase() || 'other',
    salaryRange: job.max_salary ? (
      job.max_salary > 100000 ? 'range5' :
      job.max_salary > 75000 ? 'range3' :
      job.max_salary > 50000 ? 'range2' : 'range1'
    ) : 'range1',
    remote: job.remote_type === 'Full' || job.remote_type === 'Hybrid',
    clearanceLevel: 'none', // Default as this is not provided by Lightcast API
    mosCode: '', // Default as this is not provided by Lightcast API
    requiredSkills: job.skills?.filter(s => s.type === 'Required').map(s => s.name) || [],
    preferredSkills: job.skills?.filter(s => s.type === 'Preferred').map(s => s.name) || [],
    date: job.posted,
    jobType: job.job_type || 'fulltime',
    industry: job.industry?.name || '',
    experienceLevel: job.experience_level?.name || '',
    educationLevel: job.education_level?.name || '',
  };
};

/**
 * Convert Google job format to our internal Job format
 */
const mapGoogleJobToJob = (job: GoogleJob): Job => {
  // Extract any skill requirements from highlights
  const requiredSkills: string[] = [];
  const preferredSkills: string[] = [];
  
  job.job_highlights?.forEach(highlight => {
    if (highlight.title.toLowerCase().includes('requirement') || 
        highlight.title.toLowerCase().includes('qualification')) {
      requiredSkills.push(...highlight.items);
    } else if (highlight.title.toLowerCase().includes('preferred') || 
               highlight.title.toLowerCase().includes('desired')) {
      preferredSkills.push(...highlight.items);
    }
  });
  
  // Determine if job is remote based on location string
  const isRemote = job.location.toLowerCase().includes('remote');
  
  // Try to extract job type from schedule_type or description
  let jobType = 'fulltime'; // Default
  if (job.detected_extensions?.schedule_type) {
    const scheduleType = job.detected_extensions.schedule_type.toLowerCase();
    if (scheduleType.includes('part-time')) {
      jobType = 'parttime';
    } else if (scheduleType.includes('contract')) {
      jobType = 'contract';
    } else if (scheduleType.includes('temporary')) {
      jobType = 'temporary';
    }
  }
  
  // Try to extract salary range
  let salaryRange = 'range1'; // Default
  if (job.detected_extensions?.salary) {
    const salary = job.detected_extensions.salary;
    // Simple parsing - looking for highest number in the string
    const numbers = salary.match(/\d+/g);
    if (numbers) {
      const maxSalary = Math.max(...numbers.map(Number));
      if (maxSalary > 100000) {
        salaryRange = 'range5';
      } else if (maxSalary > 75000) {
        salaryRange = 'range3';
      } else if (maxSalary > 50000) {
        salaryRange = 'range2';
      }
    }
  }
  
  return {
    id: job.job_id,
    title: job.title,
    company: job.company_name,
    location: job.location,
    description: job.description,
    category: 'other', // Default as this is not provided by Google Jobs API
    salaryRange,
    remote: isRemote,
    clearanceLevel: 'none', // Default as this is not provided by Google Jobs API
    mosCode: '', // Default as this is not provided by Google Jobs API
    requiredSkills,
    preferredSkills,
    date: job.detected_extensions?.posted_at || new Date().toISOString(),
    jobType,
    industry: '',
    experienceLevel: '',
    educationLevel: '',
  };
};

/**
 * Get the appropriate Lightcast API endpoint based on country
 */
const getLightcastEndpoint = (country: "us" | "canada" = "us"): string => {
  return country === "us" 
    ? "https://emsiservices.com/job-postings/us/jobs" 
    : "https://emsiservices.com/job-postings/ca/jobs";
};

/**
 * Search jobs using RapidAPI's Google Jobs API (CORS-friendly) as an alternative
 */
const searchGoogleJobs = async (params: LightcastSearchParams): Promise<{
  jobs: Job[];
  totalJobs: number;
  currentPage: number;
  totalPages: number;
}> => {
  try {
    const apiKey = "ea344cfe6cmsh7d7a042dec7c1f6p1ec333jsn37ba9c0ab03d"; // RapidAPI key (free tier)
    const host = "google-jobs-search.p.rapidapi.com";
    
    const queryParams = new URLSearchParams();
    
    if (params.keywords) queryParams.append('query', params.keywords);
    if (params.location) queryParams.append('location', params.location);
    
    // Handle country parameter
    const countryCode = params.country === 'canada' ? 'ca' : 'us';
    queryParams.append('country', countryCode);
    
    // Handle job type
    if (params.job_type) {
      let jobTypeParam = '';
      switch (params.job_type.toLowerCase()) {
        case 'fulltime':
          jobTypeParam = 'fulltime';
          break;
        case 'parttime':
          jobTypeParam = 'parttime';
          break;
        case 'contract':
          jobTypeParam = 'contract';
          break;
        case 'temporary':
          jobTypeParam = 'temporary';
          break;
      }
      if (jobTypeParam) queryParams.append('jobType', jobTypeParam);
    }
    
    // Handle remote
    if (params.remote_type === 'Full') {
      queryParams.append('remote', 'true');
    }
    
    // Handle pagination
    if (params.page) queryParams.append('start', String((params.page - 1) * 10));
    
    console.log(`Making API request to Google Jobs API for ${params.country || 'us'}`);
    const url = `https://google-jobs-search.p.rapidapi.com/search?${queryParams.toString()}`;
    console.log("Google Jobs API URL:", url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': host
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Google Jobs API error response:", errorText);
      console.error("Response status:", response.status, response.statusText);
      throw new Error(`Job search failed: ${response.status} ${response.statusText}`);
    }
    
    const data: GoogleJobsResponse = await response.json();
    console.log("Google Jobs API raw response:", data);
    
    return {
      jobs: data.jobs_results.map(mapGoogleJobToJob),
      totalJobs: data.jobs_results.length,
      currentPage: params.page || 1,
      totalPages: data.serpapi_pagination?.other_pages ? 
        Object.keys(data.serpapi_pagination.other_pages).length + 1 : 1
    };
  } catch (error) {
    console.error('Failed to search Google jobs:', error);
    throw error;
  }
};

/**
 * Search jobs from Lightcast API
 */
export const searchLightcastJobs = async (params: LightcastSearchParams): Promise<{
  jobs: Job[];
  totalJobs: number;
  currentPage: number;
  totalPages: number;
}> => {
  try {
    // First try the Google Jobs API
    try {
      return await searchGoogleJobs(params);
    } catch (googleError) {
      console.error('Google Jobs API failed, falling back to Lightcast API:', googleError);
      // Fall back to Lightcast API if Google fails
    }
    
    const token = await getLightcastAuthToken();
    
    // Build query params for the API call
    const queryParams = new URLSearchParams();
    
    if (params.keywords) queryParams.append('q', params.keywords);
    if (params.location) queryParams.append('location', params.location);
    if (params.radius) queryParams.append('radius', params.radius.toString());
    if (params.job_type) queryParams.append('job_type', params.job_type);
    if (params.industry) queryParams.append('industry', params.industry);
    if (params.experience_level) queryParams.append('experience_level', params.experience_level);
    if (params.education_level) queryParams.append('education_level', params.education_level);
    if (params.posting_date) queryParams.append('posting_date', params.posting_date);
    if (params.remote_type) queryParams.append('remote_type', params.remote_type);
    
    // Pagination
    queryParams.append('page', params.page?.toString() || '1');
    queryParams.append('limit', params.limit?.toString() || '10');
    
    // Sorting
    if (params.sort) queryParams.append('sort', params.sort);
    
    // Determine which endpoint to use based on country parameter
    const endpoint = getLightcastEndpoint(params.country);
    const url = `${endpoint}?${queryParams.toString()}`;
    console.log("Lightcast API URL:", url);
    
    console.log("Making API request to Lightcast jobs endpoint for", params.country || "us");
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Lightcast API error response:", errorText);
      console.error("Response status:", response.status, response.statusText);
      console.error("Response headers:", [...response.headers.entries()]);
      throw new Error(`Job search failed: ${response.status} ${response.statusText}`);
    }
    
    const data: LightcastJobsResponse = await response.json();
    console.log("Lightcast API raw response:", data);
    
    return {
      jobs: data.data.map(mapLightcastJobToJob),
      totalJobs: data.meta.total_records,
      currentPage: data.meta.page,
      totalPages: data.meta.total_pages,
    };
  } catch (error) {
    console.error('Failed to search jobs:', error);
    
    // Add more context to the error
    if (error instanceof Error) {
      if (error.message.includes('NetworkError')) {
        console.error('This appears to be a CORS or network connectivity issue');
        throw new Error(`Network connectivity issue: ${error.message}. This might be due to CORS restrictions.`);
      }
    }
    
    throw error;
  }
};
