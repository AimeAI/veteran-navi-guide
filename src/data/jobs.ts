
import { mockJobs } from "./mockJobs";
import { searchLightcastJobs } from "@/utils/lightcastApi";
import { Job } from "@/context/JobContext";
import { JobListing } from "@/utils/recommendationAlgorithm";
import { getJobsFromSupabase } from "@/utils/supabaseClient";
import { searchJobBankJobs } from "@/utils/jobBankApi";

// Define the search parameters interface
interface SearchParams {
  keywords?: string[];
  locations?: string[];
  jobType?: string;
  mosCodes?: string[];
  clearanceLevel?: string[];
  remote?: boolean;
  militarySkills?: string[]; // Added military skills parameter
  radius?: number; // Added radius parameter
  industry?: string; // Added industry parameter
  experienceLevel?: string; // Added experience level parameter
  educationLevel?: string; // Added education level parameter
  companySize?: string; // Added company size parameter
  companyRating?: number; // Added company rating parameter
  benefits?: string[]; // Added benefits parameter
  useLightcastApi?: boolean; // Flag to use Lightcast API instead of mock data
  country?: "us" | "canada"; // Added country parameter for international searches
  useJobicy?: boolean; // Flag to include Jobicy jobs
}

// Search function to filter jobs based on criteria
export const searchJobs = async (params: SearchParams): Promise<Job[]> => {
  let allJobs: Job[] = [];
  
  // Try to get Jobicy jobs from Supabase if requested
  if (params.useJobicy) {
    try {
      const supabaseParams = {
        source: 'jobicy',
        keywords: params.keywords?.join(' '),
        location: params.locations?.[0],
        remote: params.remote,
        category: params.industry,
        jobType: params.jobType,
        limit: 50,
      };
      
      const { jobs: jobicyJobs } = await getJobsFromSupabase(supabaseParams);
      
      if (jobicyJobs.length > 0) {
        console.log(`Retrieved ${jobicyJobs.length} Jobicy jobs from Supabase`);
        allJobs = [...allJobs, ...jobicyJobs];
      }
    } catch (error) {
      console.error('Error fetching Jobicy jobs from Supabase:', error);
    }
  }
  
  // Fetch jobs based on country
  if (params.country === 'canada') {
    try {
      // Try to get Job Bank jobs
      const jobBankParams = {
        keywords: params.keywords?.join(' ') || '',
        location: params.locations?.[0] || '',
        distance: params.radius,
        page: 1,
      };
      
      const jobBankResult = await searchJobBankJobs(jobBankParams);
      
      if (jobBankResult.jobs.length > 0) {
        console.log(`Retrieved ${jobBankResult.jobs.length} Job Bank jobs`);
        allJobs = [...allJobs, ...jobBankResult.jobs];
      }
    } catch (error) {
      console.error('Error fetching Job Bank jobs:', error);
    }
  }
  
  // Check if we should use Lightcast API
  if (params.useLightcastApi) {
    try {
      // Map our search params to Lightcast API params
      const lightcastParams = {
        keywords: params.keywords ? params.keywords.join(' ') : '',
        location: params.locations ? params.locations[0] : '',
        radius: params.radius,
        job_type: params.jobType,
        industry: params.industry,
        experience_level: params.experienceLevel,
        education_level: params.educationLevel,
        remote_type: params.remote ? 'Full' : undefined,
        country: params.country || "us", // Default to US if not specified
      };
      
      const result = await searchLightcastJobs(lightcastParams);
      
      if (result.jobs.length > 0) {
        console.log(`Retrieved ${result.jobs.length} Lightcast jobs`);
        allJobs = [...allJobs, ...result.jobs];
      }
    } catch (error) {
      console.error('Error searching Lightcast jobs:', error);
    }
  }
  
  // If we don't have any jobs yet, use mock data
  if (allJobs.length === 0) {
    console.log('Using mock job data as fallback');
    allJobs = filterMockJobs(params);
  }
  
  // Deduplicate jobs by ID
  const uniqueJobs = Array.from(
    new Map(allJobs.map(job => [job.id, job])).values()
  );
  
  console.log(`Returning ${uniqueJobs.length} jobs after deduplication`);
  return uniqueJobs;
};

// Helper function to filter mock jobs based on search params
const filterMockJobs = (params: SearchParams): Job[] => {
  // First convert the mockJobs (JobListing[]) to Job[] by mapping and adding required properties
  const jobsWithRequiredProps: Job[] = mockJobs.map((job: JobListing) => ({
    ...job,
    // Add the required properties from the Job interface that are missing in JobListing
    category: job.industry?.toLowerCase() || 'other',
    salaryRange: job.salaryRange || 'range2', // Default salary range
    clearanceLevel: job.clearanceLevel || job.securityClearanceRequired || 'none',
    mosCode: job.requiredMosCodes?.[0] || '',
    // Make sure these required properties exist in each job
    industry: job.industry || '',
    experienceLevel: job.experienceLevel || '',
    educationLevel: job.educationLevel || '',
    // Ensure date is always defined
    date: job.date || new Date().toISOString(),
  }));

  let filteredJobs = [...jobsWithRequiredProps];

  // If a country is specified, filter by country-specific locations
  // Apply the country filter first to prioritize location-based filtering
  if (params.country) {
    // This is a simple implementation - in a real app, we'd have proper country data
    const canadianLocations = ['toronto', 'vancouver', 'montreal', 'calgary', 'ottawa', 'edmonton', 'winnipeg', 'canada'];
    const usLocations = ['new york', 'los angeles', 'chicago', 'houston', 'phoenix', 'usa', 'united states'];
    
    filteredJobs = filteredJobs.filter(job => {
      const jobLocationLower = job.location.toLowerCase();
      if (params.country === 'canada') {
        return canadianLocations.some(loc => jobLocationLower.includes(loc));
      } else if (params.country === 'us') {
        return usLocations.some(loc => jobLocationLower.includes(loc));
      }
      return true;
    });
  }

  // Filter by keywords
  if (params.keywords && params.keywords.length > 0) {
    const keywordsLower = params.keywords.map(k => k.toLowerCase());
    filteredJobs = filteredJobs.filter(job => {
      // Check if any keyword matches the job title, company, description, or required skills
      return keywordsLower.some(keyword => 
        job.title.toLowerCase().includes(keyword) ||
        job.company.toLowerCase().includes(keyword) ||
        job.description.toLowerCase().includes(keyword) ||
        (job.requiredSkills && job.requiredSkills.some(skill => 
          skill.toLowerCase().includes(keyword)
        )) ||
        (job.preferredSkills && job.preferredSkills.some(skill => 
          skill.toLowerCase().includes(keyword)
        ))
      );
    });
  }

  // Filter by locations
  if (params.locations && params.locations.length > 0) {
    const locationsLower = params.locations.map(l => l.toLowerCase());
    filteredJobs = filteredJobs.filter(job => {
      // Check if the job location matches any of the provided locations
      // Also match "Remote" jobs if "Remote" is in the locations
      const isRemoteSearch = locationsLower.some(loc => loc.toLowerCase().includes('remote'));
      return locationsLower.some(location => 
        job.location.toLowerCase().includes(location)
      ) || (isRemoteSearch && job.remote);
    });
  }

  // If a country is specified, filter by country-specific locations
  if (params.country) {
    // This is a simple implementation - in a real app, we'd have proper country data
    const canadianLocations = ['toronto', 'vancouver', 'montreal', 'calgary', 'ottawa', 'edmonton', 'winnipeg', 'canada'];
    const usLocations = ['new york', 'los angeles', 'chicago', 'houston', 'phoenix', 'usa', 'united states'];
    
    filteredJobs = filteredJobs.filter(job => {
      const jobLocationLower = job.location.toLowerCase();
      if (params.country === 'canada') {
        return canadianLocations.some(loc => jobLocationLower.includes(loc));
      } else if (params.country === 'us') {
        return usLocations.some(loc => jobLocationLower.includes(loc)) || 
               !canadianLocations.some(loc => jobLocationLower.includes(loc)); // Default to US if not explicitly Canadian
      }
      return true;
    });
  }

  // Filter by radius (if we had coordinates)
  if (params.radius && params.radius > 0 && params.locations && params.locations.length > 0) {
    // In a real implementation, we would:
    // 1. Geocode the location to get lat/lng
    // 2. Calculate distance between job location and search location
    // 3. Filter jobs within the radius
    console.log(`Searching within ${params.radius} km of ${params.locations[0]}`);
    // For now, we'll just use the existing location filter
  }

  // Filter by job type
  if (params.jobType && params.jobType.trim() !== '') {
    filteredJobs = filteredJobs.filter(job => 
      job.jobType && job.jobType.toLowerCase() === params.jobType?.toLowerCase()
    );
  }

  // Filter by industry
  if (params.industry && params.industry.trim() !== '') {
    filteredJobs = filteredJobs.filter(job => 
      job.industry && job.industry.toLowerCase().includes(params.industry.toLowerCase())
    );
  }

  // Filter by experience level
  if (params.experienceLevel && params.experienceLevel.trim() !== '') {
    filteredJobs = filteredJobs.filter(job => 
      job.experienceLevel && job.experienceLevel === params.experienceLevel
    );
  }

  // Filter by education level
  if (params.educationLevel && params.educationLevel.trim() !== '') {
    filteredJobs = filteredJobs.filter(job => 
      job.educationLevel && job.educationLevel === params.educationLevel
    );
  }

  // Filter by company size
  if (params.companySize && params.companySize.trim() !== '') {
    filteredJobs = filteredJobs.filter(job => 
      job.companySize && job.companySize === params.companySize
    );
  }

  // Filter by company rating
  if (params.companyRating) {
    filteredJobs = filteredJobs.filter(job => 
      job.companyRating && job.companyRating >= params.companyRating
    );
  }

  // Filter by benefits
  if (params.benefits && params.benefits.length > 0) {
    filteredJobs = filteredJobs.filter(job => 
      job.benefits && params.benefits.some(benefit => 
        job.benefits.includes(benefit)
      )
    );
  }

  // Filter by MOS codes
  if (params.mosCodes && params.mosCodes.length > 0) {
    filteredJobs = filteredJobs.filter(job => 
      job.requiredMosCodes && job.requiredMosCodes.some(mos => 
        params.mosCodes?.includes(mos)
      )
    );
  }

  // Filter by clearance level
  if (params.clearanceLevel && params.clearanceLevel.length > 0) {
    filteredJobs = filteredJobs.filter(job => 
      job.clearanceLevel && 
      params.clearanceLevel?.includes(job.clearanceLevel)
    );
  }

  // Filter by military skills
  if (params.militarySkills && params.militarySkills.length > 0) {
    filteredJobs = filteredJobs.filter(job => {
      // If job has no required skills, don't match it
      if (!job.requiredSkills || job.requiredSkills.length === 0) return false;
      
      // Check if any of the job's skills match the selected military skills
      return params.militarySkills!.some(skill => 
        job.requiredSkills!.some(jobSkill => 
          jobSkill.toLowerCase().includes(skill.toLowerCase())
        )
      );
    });
  }

  // Filter by remote option
  if (params.remote !== undefined) {
    filteredJobs = filteredJobs.filter(job => job.remote === params.remote);
  }

  return filteredJobs;
};

// Function to manually trigger a Jobicy RSS feed fetch
export const refreshJobicyFeed = async (): Promise<void> => {
  try {
    const { fetchAndParseJobicyFeed } = await import('@/utils/jobicyRssParser');
    const { storeJobsInSupabase } = await import('@/utils/supabaseClient');
    
    console.log('Fetching Jobicy RSS feed...');
    const jobs = await fetchAndParseJobicyFeed();
    
    if (jobs.length === 0) {
      console.warn('No jobs found in Jobicy RSS feed');
      return;
    }
    
    console.log(`Parsed ${jobs.length} jobs from Jobicy RSS feed`);
    
    // Store jobs in Supabase
    const insertedCount = await storeJobsInSupabase(jobs);
    console.log(`Stored ${insertedCount} new Jobicy jobs in Supabase`);
  } catch (error) {
    console.error('Error refreshing Jobicy feed:', error);
  }
};
