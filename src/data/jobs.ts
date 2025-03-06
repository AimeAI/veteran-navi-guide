
import { Job } from "@/context/JobContext";

interface JobSearchParams {
  keywords: string[];
  locations: string[];
  jobType: string;
  mosCodes: string[];
  clearanceLevel: string[];
  remote: boolean;
}

export const searchJobs = (params: JobSearchParams): Job[] => {
  // For now, return empty array as this is just for TypeScript satisfaction
  // The actual implementation would filter jobs based on the params
  return [];
};
