import { Job } from "@/context/JobContext";
import { searchJobBankJobs } from "./jobBankApi";

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

// Response interface for GitHub Jobs API
interface GitHubJob {
  id: string;
  type: string;
  url: string;
  created_at: string;
  company: string;
  company_url: string | null;
  location: string;
  title: string;
  description: string;
  how_to_apply: string;
  company_logo: string | null;
}

// Convert GitHub job format to our internal Job format
const mapGitHubJobToJob = (job: GitHubJob): Job => {
  // Determine if job is remote based on location string
  const isRemote = job.location.toLowerCase().includes('remote');
  
  // Try to extract job type
  let jobType = 'fulltime'; // Default
  if (job.type.toLowerCase().includes('part')) {
    jobType = 'parttime';
  } else if (job.type.toLowerCase().includes('contract')) {
    jobType = 'contract';
  }
  
  return {
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    description: job.description,
    category: 'technology', // GitHub Jobs is primarily tech jobs
    salaryRange: 'range3', // Default middle range since GitHub Jobs doesn't provide salary
    remote: isRemote,
    clearanceLevel: 'none', // Default as this is not provided
    mosCode: '', // Default as this is not provided
    requiredSkills: [], // GitHub Jobs doesn't explicitly list skills
    preferredSkills: [],
    date: job.created_at,
    jobType,
    industry: 'technology',
    experienceLevel: '',
    educationLevel: '',
  };
};

// Function to search GitHub Jobs API through a CORS proxy
const searchGitHubJobs = async (params: LightcastSearchParams): Promise<{
  jobs: Job[];
  totalJobs: number;
  currentPage: number;
  totalPages: number;
}> => {
  try {
    // Build the query parameters
    const queryParams = new URLSearchParams();
    
    // GitHub Jobs API only supports a few parameters
    if (params.keywords) queryParams.append('description', params.keywords);
    if (params.location) queryParams.append('location', params.location);
    if (params.job_type === 'fulltime') queryParams.append('full_time', 'true');
    
    // Add page parameter
    if (params.page) queryParams.append('page', String(params.page - 1)); // GitHub Jobs is 0-indexed
    
    console.log("Searching for jobs with GitHub Jobs API");
    
    // Use a CORS proxy to access GitHub Jobs API
    // Note: Using a free CORS proxy - these have rate limits and may need to be replaced over time
    const corsProxy = "https://cors-anywhere.herokuapp.com/";
    const baseUrl = "https://jobs.github.com/positions.json";
    const url = `${corsProxy}${baseUrl}?${queryParams.toString()}`;
    
    console.log("GitHub Jobs API URL (via proxy):", url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Origin': window.location.origin,
      },
    });
    
    if (!response.ok) {
      throw new Error(`GitHub Jobs API returned status: ${response.status}`);
    }
    
    const data: GitHubJob[] = await response.json();
    console.log("GitHub Jobs API response:", data);
    
    // Convert the GitHub Jobs data to our internal format
    const jobs = data.map(mapGitHubJobToJob);
    
    // GitHub Jobs API doesn't provide total counts, so we estimate
    // If we got a full page of results, assume there might be more pages
    const estimatedTotalJobs = jobs.length >= 50 ? 100 : jobs.length;
    const estimatedTotalPages = Math.ceil(estimatedTotalJobs / 50);
    
    return {
      jobs,
      totalJobs: estimatedTotalJobs,
      currentPage: params.page || 1,
      totalPages: estimatedTotalPages,
    };
  } catch (error) {
    console.error("GitHub Jobs API search failed:", error);
    throw error;
  }
};

// Function to try a different API - Reed.co.uk through RapidAPI
const searchReedJobs = async (params: LightcastSearchParams): Promise<{
  jobs: Job[];
  totalJobs: number;
  currentPage: number;
  totalPages: number;
}> => {
  try {
    console.log("Searching for jobs with Reed API");
    
    // Reed API uses different query parameters
    const queryParams = new URLSearchParams();
    
    if (params.keywords) queryParams.append('keywords', params.keywords);
    if (params.location) queryParams.append('locationName', params.location);
    
    // Handle country parameter - Reed is UK-based, so it's limited
    // We'll just search for remote jobs if country is specified
    if (params.country) {
      queryParams.append('distanceFromLocation', '100');
    }
    
    // Handle job type
    if (params.job_type) {
      let contractType = '';
      switch (params.job_type.toLowerCase()) {
        case 'fulltime':
          contractType = 'Permanent';
          break;
        case 'parttime':
          contractType = 'Part Time';
          break;
        case 'contract':
          contractType = 'Contract';
          break;
        case 'temporary':
          contractType = 'Temp';
          break;
      }
      if (contractType) queryParams.append('contractType', contractType);
    }
    
    // Handle pagination
    const resultsPerPage = 100; // Reed allows up to 100 per page
    const pageNumber = params.page || 1;
    queryParams.append('resultsToTake', String(resultsPerPage));
    queryParams.append('resultsToSkip', String((pageNumber - 1) * resultsPerPage));
    
    // Use the API-Ninjas Jobs API which is more reliable
    const url = `https://api.api-ninjas.com/v1/jobs?${queryParams.toString()}`;
    console.log("API-Ninjas Jobs URL:", url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Api-Key': 'YOUR_API_NINJAS_KEY', // This is a free API with generous limits
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API-Ninjas Jobs API returned status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("API-Ninjas Jobs API response:", data);
    
    // Convert to our job format
    const jobs: Job[] = data.map((job: any) => ({
      id: `api-ninjas-${Math.random().toString(36).substring(2, 15)}`,
      title: job.title,
      company: job.company_name || 'Unknown Company',
      location: job.location || 'Unknown Location',
      description: job.description || 'No description provided',
      category: job.category || 'other',
      salaryRange: job.salary ? (
        parseInt(job.salary) > 100000 ? 'range5' : 
        parseInt(job.salary) > 75000 ? 'range4' : 
        parseInt(job.salary) > 50000 ? 'range3' : 
        parseInt(job.salary) > 30000 ? 'range2' : 'range1'
      ) : 'range1',
      remote: job.location?.toLowerCase().includes('remote') || false,
      clearanceLevel: 'none',
      mosCode: '',
      requiredSkills: [],
      preferredSkills: [],
      date: new Date().toISOString(),
      jobType: job.job_type || 'fulltime',
      industry: job.industry || '',
      experienceLevel: '',
      educationLevel: '',
    }));
    
    return {
      jobs,
      totalJobs: data.length,
      currentPage: pageNumber,
      totalPages: Math.ceil(data.length / resultsPerPage),
    };
  } catch (error) {
    console.error("API-Ninjas Jobs API search failed:", error);
    throw error;
  }
};

// Function to try a different API - Proxy API
const searchProxyJobs = async (params: LightcastSearchParams): Promise<{
  jobs: Job[];
  totalJobs: number;
  currentPage: number;
  totalPages: number;
}> => {
  try {
    console.log("Searching for jobs with Proxy API");
    
    // Build query for a public Job API aggregator
    const queryParams = new URLSearchParams();
    
    // Format the search query
    let query = '';
    if (params.keywords) query += params.keywords + ' ';
    if (params.location) query += 'in ' + params.location + ' ';
    if (params.country) {
      query += params.country === 'canada' ? 'Canada' : 'United States';
    }
    
    queryParams.append('q', query.trim());
    
    // Add filter parameters if applicable
    if (params.job_type) queryParams.append('employment_type', params.job_type);
    if (params.remote_type === 'Full') queryParams.append('remote', 'true');
    
    // Pagination
    const page = params.page || 1;
    queryParams.append('page', String(page));
    
    // Try using the Serpapi Google Jobs API (which has a free tier)
    // We'll use an open API proxy endpoint to avoid CORS issues
    const proxyUrl = 'https://serpapi.herokuapp.com/search';
    const url = `${proxyUrl}?engine=google_jobs&${queryParams.toString()}`;
    
    console.log("Proxy API URL:", url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Proxy API returned status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Proxy API response:", data);
    
    // Parse jobs from the response
    const jobResults = data.jobs_results || [];
    
    // Map to our job format
    const jobs: Job[] = jobResults.map((job: any) => ({
      id: `proxy-${job.job_id || Math.random().toString(36).substr(2, 9)}`,
      title: job.title,
      company: job.company_name,
      location: job.location,
      description: job.description,
      category: 'other',
      salaryRange: job.detected_extensions?.salary ? 'range3' : 'range1',
      remote: job.detected_extensions?.schedule_type?.includes('Remote') || false,
      clearanceLevel: 'none',
      mosCode: '',
      requiredSkills: job.job_highlights?.Qualifications || [],
      preferredSkills: job.job_highlights?.Requirements || [],
      date: job.detected_extensions?.posted_at || new Date().toISOString(),
      jobType: job.detected_extensions?.schedule_type?.includes('Part-time') ? 'parttime' : 'fulltime',
      industry: '',
      experienceLevel: '',
      educationLevel: '',
    }));
    
    return {
      jobs,
      totalJobs: jobs.length,
      currentPage: page,
      totalPages: data.serpapi_pagination?.total || 1,
    };
  } catch (error) {
    console.error("Proxy API search failed:", error);
    throw error;
  }
};

// Add Job Bank API as a primary source for Canadian jobs
const searchCanadianJobBankJobs = async (params: LightcastSearchParams): Promise<{
  jobs: Job[];
  totalJobs: number;
  currentPage: number;
  totalPages: number;
}> => {
  try {
    console.log("Searching for jobs with Canadian Job Bank API");
    
    // Only proceed if country is Canada
    if (params.country !== 'canada') {
      throw new Error("Job Bank API is only for Canadian jobs");
    }
    
    // Convert Lightcast params to Job Bank params
    const jobBankParams = {
      keywords: params.keywords,
      location: params.location,
      distance: params.radius,
      page: params.page,
      sort: params.sort
    };
    
    // Call the Job Bank API search function
    return await searchJobBankJobs(jobBankParams);
    
  } catch (error) {
    console.error("Canadian Job Bank API search failed:", error);
    throw error;
  }
};

// Main job search function that tries multiple sources
export const searchLightcastJobs = async (params: LightcastSearchParams): Promise<{
  jobs: Job[];
  totalJobs: number;
  currentPage: number;
  totalPages: number;
}> => {
  // Try each API in sequence until one works
  let apis = [];
  
  // Determine which APIs to try based on country parameter
  if (params.country === 'canada') {
    // For Canadian jobs, prioritize the Job Bank API
    apis = [
      { name: "Canadian Job Bank API", fn: searchCanadianJobBankJobs },
      { name: "GitHub Jobs API", fn: searchGitHubJobs },
      { name: "Reed Jobs API", fn: searchReedJobs },
      { name: "Proxy Jobs API", fn: searchProxyJobs },
    ];
  } else {
    // For US jobs, use the original API ordering
    apis = [
      { name: "GitHub Jobs API", fn: searchGitHubJobs },
      { name: "Reed Jobs API", fn: searchReedJobs },
      { name: "Proxy Jobs API", fn: searchProxyJobs },
    ];
  }
  
  let lastError: Error | null = null;
  
  // Try each API in sequence
  for (const api of apis) {
    try {
      console.log(`Attempting to use ${api.name}`);
      const result = await api.fn(params);
      console.log(`Successfully retrieved jobs from ${api.name}`);
      return result;
    } catch (error) {
      console.error(`${api.name} failed:`, error);
      lastError = error instanceof Error ? error : new Error(`${api.name} failed`);
    }
  }
  
  // If we get here, all APIs failed
  console.error("All job APIs failed");
  throw lastError || new Error("All job search APIs failed");
};
