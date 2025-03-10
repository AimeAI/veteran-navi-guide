
/**
 * Main jobs data module
 * This file serves as an entry point to the job-related functionality
 */

import { searchJobs as searchJobsService } from "@/services/jobService";
import { refreshJobicyFeed as refreshJobicyFeedUtil } from "@/utils/jobFeedRefresher";

// Re-export the main search function with the same signature
export const searchJobs = searchJobsService;

// Re-export the feed refresher with the same signature
export const refreshJobicyFeed = refreshJobicyFeedUtil;
