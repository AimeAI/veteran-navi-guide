
/**
 * Main jobs data module
 * This file serves as an entry point to the job-related functionality
 */

import { searchJobs as searchJobsService } from "@/services/jobService";
import { refreshJobicyFeed as refreshJobicyFeedUtil } from "@/utils/jobFeedRefresher";
import { getJobsFromSupabase } from "@/utils/supabaseClient";
import { Job } from "@/context/JobContext";

// Re-export the main search function with the same signature
export const searchJobs = searchJobsService;

// Re-export the feed refresher with the same signature
export const refreshJobicyFeed = refreshJobicyFeedUtil;

/**
 * Fetch jobs directly from Supabase
 * @param limit - Number of jobs to fetch
 * @returns Promise with jobs array
 */
export const fetchJobs = async (limit: number = 50): Promise<Job[]> => {
  try {
    const { jobs, count } = await getJobsFromSupabase({ limit });
    console.log(`Successfully fetched ${jobs.length} jobs from Supabase`);
    return jobs;
  } catch (error) {
    console.error("Error fetching jobs from Supabase:", error);
    throw new Error(`Failed to fetch jobs: ${error.message}`);
  }
};
