
import { Job } from './job';

/**
 * Parameters for job search operations
 */
export interface JobSearchParams {
  keywords?: string;
  location?: string;
  radius?: number;
  remote?: boolean;
  jobType?: string;
  industry?: string;
  experienceLevel?: string;
  educationLevel?: string;
  country?: "us" | "canada";
  page?: number;
  skills?: string[];
  salaryRange?: string;
  sortBy?: string;
  refresh?: boolean;  // Needed for refreshing search results
}

/**
 * Results from job search operations
 */
export interface JobSearchResults {
  jobs: Job[];
  isLoading: boolean;
  error: Error | null;
  currentPage: number;
  totalPages: number;
  totalJobs: number;
  setPage: (page: number) => void;
  refreshJobs: () => Promise<void>;
}
