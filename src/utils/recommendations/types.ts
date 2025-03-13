
// Define the JobListing interface
export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requiredSkills?: string[];
  preferredSkills?: string[];
  securityClearanceRequired?: string;
  remote?: boolean;
  jobType?: string;
  industry?: string;
  experienceLevel?: string;
  educationLevel?: string;
  companySize?: string;
  companyRating?: number;
  benefits?: string[];
  requiredMosCodes?: string[];
  clearanceLevel?: string;
  salary?: string | number;
  salaryRange?: string;
  postedDate?: string;
}

// Export alias Job for compatibility
export type Job = JobListing;

// Define UserProfile interface
export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  militaryBranch?: string;
  rank?: string;
  mosId?: string;
  securityClearance?: string;
  skills: string[];
  jobPreferences?: {
    locations?: string[];
    remote?: boolean;
    industry?: string[];
    jobType?: string[];
  };
  photo?: string;
  serviceYears?: number;
}

// Result of a recommendation calculation
export interface RecommendationResult {
  job: JobListing;
  matchScore: number;
  matchDetails: {
    skillMatches: string[];
    mosCodeMatches: string[];
    locationMatch: boolean;
    clearanceMatch: boolean;
  };
}
