
import { Job } from "@/context/JobContext";
import { filterMockJobs } from "@/utils/filterJobs";
import { getJobsFromSupabase } from "@/utils/supabaseClient";
import { searchJobBankJobs } from "@/utils/jobBankApi";
import { toast } from "sonner";

/**
 * Interface for job search parameters
 */
export interface SearchParams {
  keywords?: string[];
  locations?: string[];
  jobType?: string;
  mosCodes?: string[];
  clearanceLevel?: string[];
  remote?: boolean;
  militarySkills?: string[];
  radius?: number;
  industry?: string;
  experienceLevel?: string;
  educationLevel?: string;
  companySize?: string;
  companyRating?: number;
  benefits?: string[];
  useLightcastApi?: boolean;
  country?: "us" | "canada";
  useJobicy?: boolean;
  skills?: string[];
  limit?: number; // Added limit parameter
  page?: number;   // Added page parameter
}

/**
 * Main function to search for jobs from various sources
 */
export const searchJobs = async (params: SearchParams): Promise<Job[]> => {
  let allJobs: Job[] = [];
  
  // Try fetching from Supabase first
  try {
    const supabaseParams = {
      source: params.useJobicy ? 'jobicy' : undefined,
      keywords: params.keywords?.join(' '),
      location: params.locations?.[0],
      remote: params.remote,
      category: params.industry,
      jobType: params.jobType,
      limit: params.limit || 50,
      offset: params.page ? (params.page - 1) * (params.limit || 50) : 0,
    };
    
    const { jobs: supabaseJobs, count } = await getJobsFromSupabase(supabaseParams);
    
    if (supabaseJobs.length > 0) {
      console.log(`Retrieved ${supabaseJobs.length} jobs from Supabase`);
      allJobs = [...allJobs, ...supabaseJobs];
    }
  } catch (error) {
    console.error('Error fetching jobs from Supabase:', error);
    // Don't throw here, continue with other sources
  }
  
  // If specified to use Jobicy but we couldn't fetch them above
  if (params.useJobicy && allJobs.length === 0) {
    try {
      const supabaseParams = {
        source: 'jobicy',
        keywords: params.keywords?.join(' '),
        location: params.locations?.[0],
        remote: params.remote,
        category: params.industry,
        jobType: params.jobType,
        limit: params.limit || 50,
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
  
  // Try Canada Job Bank if specified
  if (params.country === 'canada' && allJobs.length === 0) {
    try {
      const jobBankParams = {
        keywords: params.keywords?.join(' ') || '',
        location: params.locations?.[0] || '',
        distance: params.radius,
        page: params.page || 1,
        skills: params.skills,
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
  
  // If all sources failed, use mock data as fallback
  if (allJobs.length === 0) {
    console.log('Using mock job data as fallback');
    allJobs = filterMockJobs(params) as Job[];
  }
  
  // Remove duplicates
  const uniqueJobs = Array.from(
    new Map(allJobs.map(job => [job.id, job])).values()
  );
  
  console.log(`Returning ${uniqueJobs.length} jobs after deduplication`);
  return uniqueJobs;
};
