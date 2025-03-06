
import { Job } from "@/context/JobContext";

// Lightcast API credentials
const LIGHTCAST_CLIENT_ID = "41sty9h1mnp7l8q5";
const LIGHTCAST_SECRET = "7ie5tMCn";
const LIGHTCAST_SCOPE = "emsi_open";

// JSearch API key from RapidAPI
const JSEARCH_API_KEY = "ea344cfe6cmsh7d7a042dec7c1f6p1ec333jsn37ba9c0ab03d";
const JSEARCH_API_HOST = "jsearch.p.rapidapi.com";

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

// Interface for JSearch job result
interface JSearchJob {
  employer_name: string;
  employer_logo?: string;
  employer_website?: string;
  employer_company_type?: string;
  job_publisher?: string;
  job_id: string;
  job_employment_type: string;
  job_title: string;
  job_apply_link: string;
  job_apply_is_direct?: boolean;
  job_apply_quality_score?: number;
  job_description: string;
  job_is_remote?: boolean;
  job_posted_at_timestamp?: number;
  job_posted_at_datetime_utc?: string;
  job_city?: string;
  job_state?: string;
  job_country?: string;
  job_latitude?: number;
  job_longitude?: number;
  job_benefits?: string[];
  job_google_link?: string;
  job_offer_expiration_datetime_utc?: string;
  job_required_experience?: {
    no_experience_required?: boolean;
    required_experience_in_months?: number;
    experience_mentioned?: boolean;
    experience_preferred?: boolean;
  };
  job_required_skills?: string[];
  job_required_education?: {
    postgraduate_degree?: boolean;
    professional_certification?: boolean;
    high_school?: boolean;
    associates_degree?: boolean;
    bachelors_degree?: boolean;
    degree_mentioned?: boolean;
    degree_preferred?: boolean;
    professional_certification_mentioned?: boolean;
  };
  job_experience_in_place_of_education?: boolean;
  job_min_salary?: number;
  job_max_salary?: number;
  job_salary_currency?: string;
  job_salary_period?: string;
  job_highlights?: {
    Qualifications?: string[];
    Responsibilities?: string[];
    Benefits?: string[];
  };
  job_job_title?: string;
  job_posting_language?: string;
  job_onet_soc?: string;
  job_onet_job_zone?: string;
  job_naics_code?: string;
  job_naics_name?: string;
}

// Interface for JSearch API response
interface JSearchResponse {
  status: string;
  request_id: string;
  parameters: any;
  data: JSearchJob[];
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
 * Convert JSearch job to our internal Job format
 */
const mapJSearchJobToJob = (job: JSearchJob): Job => {
  // Extract salary range
  let salaryRange = 'range1'; // Default
  
  if (job.job_max_salary) {
    const maxSalary = job.job_max_salary;
    if (maxSalary > 100000) {
      salaryRange = 'range5';
    } else if (maxSalary > 75000) {
      salaryRange = 'range3';
    } else if (maxSalary > 50000) {
      salaryRange = 'range2';
    }
  }
  
  // Extract job type
  let jobType = 'fulltime'; // Default
  if (job.job_employment_type) {
    const empType = job.job_employment_type.toLowerCase();
    if (empType.includes('part_time') || empType.includes('part-time')) {
      jobType = 'parttime';
    } else if (empType.includes('contractor') || empType.includes('contract')) {
      jobType = 'contract';
    } else if (empType.includes('temporary') || empType.includes('intern')) {
      jobType = 'temporary';
    }
  }
  
  // Extract location
  const location = [
    job.job_city,
    job.job_state,
    job.job_country
  ].filter(Boolean).join(', ');
  
  // Extract skills from qualifications
  const requiredSkills = job.job_required_skills || 
                         job.job_highlights?.Qualifications || [];
  
  // Extract industry
  const industry = job.job_naics_name || '';
  
  // Extract experience level
  let experienceLevel = '';
  if (job.job_required_experience) {
    if (job.job_required_experience.no_experience_required) {
      experienceLevel = 'Entry Level';
    } else if (job.job_required_experience.required_experience_in_months) {
      const years = Math.floor(job.job_required_experience.required_experience_in_months / 12);
      if (years < 2) {
        experienceLevel = 'Entry Level';
      } else if (years < 5) {
        experienceLevel = 'Mid Level';
      } else {
        experienceLevel = 'Senior Level';
      }
    }
  }
  
  // Extract education level
  let educationLevel = '';
  if (job.job_required_education) {
    if (job.job_required_education.postgraduate_degree) {
      educationLevel = "Master's or Doctoral";
    } else if (job.job_required_education.bachelors_degree) {
      educationLevel = "Bachelor's";
    } else if (job.job_required_education.associates_degree) {
      educationLevel = "Associate's";
    } else if (job.job_required_education.high_school) {
      educationLevel = "High School";
    } else if (job.job_required_education.professional_certification) {
      educationLevel = "Certification";
    }
  }
  
  return {
    id: job.job_id,
    title: job.job_title || job.job_title,
    company: job.employer_name,
    location: location || 'Remote',
    description: job.job_description,
    category: job.job_naics_name?.toLowerCase() || 'other',
    salaryRange,
    remote: job.job_is_remote || false,
    clearanceLevel: 'none', // Default as this is not provided by JSearch API
    mosCode: '', // Default as this is not provided by JSearch API
    requiredSkills,
    preferredSkills: job.job_highlights?.Responsibilities || [],
    date: job.job_posted_at_datetime_utc || new Date().toISOString(),
    jobType,
    industry,
    experienceLevel,
    educationLevel,
    benefits: job.job_benefits || job.job_highlights?.Benefits,
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
 * Search jobs using JSearch API from RapidAPI (CORS-friendly)
 */
const searchJSearchJobs = async (params: LightcastSearchParams): Promise<{
  jobs: Job[];
  totalJobs: number;
  currentPage: number;
  totalPages: number;
}> => {
  try {
    const queryParams = new URLSearchParams();
    
    // Build the query string based on search parameters
    let query = '';
    if (params.keywords) query += params.keywords + ' ';
    if (params.location) query += 'in ' + params.location + ' ';
    
    // Handle country parameter
    if (params.country) {
      query += params.country === 'canada' ? 'Canada' : 'United States';
    } else {
      query += 'Canada'; // Default to Canada
    }
    
    queryParams.append('query', query.trim());
    
    // Handle job type
    if (params.job_type) {
      queryParams.append('employment_types', params.job_type);
    }
    
    // Handle remote
    if (params.remote_type === 'Full') {
      queryParams.append('remote_jobs_only', 'true');
    }
    
    // Handle pagination
    const page = params.page || 1;
    queryParams.append('page', String(page));
    queryParams.append('num_pages', '1');
    
    console.log(`Making API request to JSearch API for query: ${query}`);
    const url = `https://jsearch.p.rapidapi.com/search?${queryParams.toString()}`;
    console.log("JSearch API URL:", url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': JSEARCH_API_KEY,
        'X-RapidAPI-Host': JSEARCH_API_HOST
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("JSearch API error response:", errorText);
      console.error("Response status:", response.status, response.statusText);
      throw new Error(`Job search failed: ${response.status} ${response.statusText}`);
    }
    
    const data: JSearchResponse = await response.json();
    console.log("JSearch API raw response:", data);
    
    if (data.status !== 'success' || !data.data) {
      throw new Error('JSearch API returned an invalid response');
    }
    
    const jobs = data.data.map(mapJSearchJobToJob);
    
    // For now, we'll estimate total jobs as 10x the current results
    // as the API doesn't provide total count information
    const totalJobs = data.data.length * 10;
    
    return {
      jobs,
      totalJobs,
      currentPage: page,
      totalPages: 10, // Assume 10 pages as the API doesn't provide total pages info
    };
  } catch (error) {
    console.error('Failed to search JSearch jobs:', error);
    throw error;
  }
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
    // First try the JSearch API
    try {
      return await searchJSearchJobs(params);
    } catch (jSearchError) {
      console.error('JSearch API failed, falling back to Google Jobs API:', jSearchError);
      // Fall back to Google Jobs API if JSearch fails
    }
    
    // Try Google Jobs API next
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
