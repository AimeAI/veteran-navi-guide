
// Job interface with all required fields for type safety
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  category: string;
  salaryRange: string;
  remote: boolean;
  clearanceLevel: string;
  mosCode: string;
  requiredSkills: string[];
  preferredSkills: string[];
  jobType: string;
  date: string;
  url?: string;
  industry: string;
  experienceLevel: string;
  educationLevel: string;
  source?: string;
  companySize?: string;
  companyRating?: number;
  benefits?: string[];
  requiredMosCodes?: string[];
  matchingSkills?: string[]; // Added to track matching skills for highlighting
}

// Define job filter state
export interface JobFilterState {
  keywords: string;
  location: string;
  mosCodes: string[] | undefined;
  clearanceLevel: string[] | undefined;
  remote: boolean;
  militarySkills: string[] | undefined;
  radius: number;
  industry: string;
  experienceLevel: string;
  educationLevel: string;
  jobType: string;
  companySize: string;
  companyRating: number | undefined;
  benefits: string[] | undefined;
  country: "us" | "canada" | undefined;
  useJobicy: boolean;
  skills: string[] | undefined;
  category: string;
  salaryRange: string;
}

// Interface for the Job Context
export interface JobContextProps {
  jobs: Job[];
  savedJobs: Job[];
  appliedJobs: Job[];
  loading: boolean;
  error: Error | null;
  filters: JobFilterState;
  setFilters: React.Dispatch<React.SetStateAction<JobFilterState>>;
  saveJob: (job: Job) => void;
  unsaveJob: (jobId: string) => void;
  applyToJob: (job: Job) => void;
  searchJobs: (filters: JobFilterState) => Promise<void>;
  clearFilters: () => void;
}
