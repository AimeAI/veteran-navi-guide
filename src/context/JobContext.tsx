
import React, { createContext, useContext, useState, useEffect } from 'react';

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

// Default filter state
const defaultFilters: JobFilterState = {
  keywords: '',
  location: '',
  mosCodes: undefined,
  clearanceLevel: undefined,
  remote: false,
  militarySkills: undefined,
  radius: 50,
  industry: '',
  experienceLevel: '',
  educationLevel: '',
  jobType: '',
  companySize: '',
  companyRating: undefined,
  benefits: undefined,
  country: 'canada',
  useJobicy: false,
  skills: undefined,
  category: '',
  salaryRange: '',
};

// Create the context
const JobContext = createContext<JobContextProps | undefined>(undefined);

// Context Provider component
export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<Job[]>(() => {
    const storedJobs = localStorage.getItem('savedJobs');
    return storedJobs ? JSON.parse(storedJobs) : [];
  });
  const [appliedJobs, setAppliedJobs] = useState<Job[]>(() => {
    const storedJobs = localStorage.getItem('appliedJobs');
    return storedJobs ? JSON.parse(storedJobs) : [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<JobFilterState>(defaultFilters);

  useEffect(() => {
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
  }, [savedJobs]);

  // Function to save a job
  const saveJob = (job: Job) => {
    setSavedJobs((prev) => {
      if (prev.some(j => j.id === job.id)) {
        return prev;
      }
      const newSavedJobs = [...prev, job];
      localStorage.setItem('savedJobs', JSON.stringify(newSavedJobs));
      return newSavedJobs;
    });
  };

  // Function to unsave a job
  const unsaveJob = (jobId: string) => {
    setSavedJobs((prev) => {
      const newSavedJobs = prev.filter(job => job.id !== jobId);
      localStorage.setItem('savedJobs', JSON.stringify(newSavedJobs));
      return newSavedJobs;
    });
  };

  // Function to apply to a job
  const applyToJob = (job: Job) => {
    setAppliedJobs((prev) => {
      if (prev.some(j => j.id === job.id)) {
        return prev;
      }
      const newAppliedJobs = [...prev, job];
      localStorage.setItem('appliedJobs', JSON.stringify(newAppliedJobs));
      return newAppliedJobs;
    });
  };

  // Function to search for jobs
  const searchJobs = async (filters: JobFilterState) => {
    setLoading(true);
    setError(null);
    try {
      setTimeout(() => {
        const mockJobs = [
          {
            id: '1',
            title: 'Software Engineer',
            company: 'TechCorp',
            location: 'Toronto, Canada',
            description: 'Looking for an experienced software engineer...',
            category: 'technology',
            salaryRange: 'range4',
            clearanceLevel: 'none',
            mosCode: '',
            requiredSkills: ['JavaScript', 'React', 'Node.js'],
            preferredSkills: ['TypeScript', 'AWS'],
            remote: false,
            jobType: 'fulltime',
            date: new Date().toISOString(),
            industry: 'technology',
            experienceLevel: 'mid',
            educationLevel: 'bachelors',
          },
          {
            id: '2',
            title: 'Project Manager',
            company: 'Management Solutions',
            location: 'Vancouver, Canada',
            description: 'Seeking a project manager with experience in...',
            category: 'management',
            salaryRange: 'range4',
            clearanceLevel: 'none',
            mosCode: '',
            requiredSkills: ['Project Management', 'Agile', 'Scrum'],
            preferredSkills: ['PMP Certification', 'Jira'],
            remote: false,
            jobType: 'fulltime',
            date: new Date().toISOString(),
            industry: 'management',
            experienceLevel: 'senior',
            educationLevel: 'masters',
          },
        ];
        setJobs(mockJobs);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch jobs'));
      setLoading(false);
    }
  };

  // Function to clear filters
  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
        savedJobs,
        appliedJobs,
        loading,
        error,
        filters,
        setFilters,
        saveJob,
        unsaveJob,
        applyToJob,
        searchJobs,
        clearFilters,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

// Hook to use the job context
export const useJobs = (): JobContextProps => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};

// For backward compatibility
export const useJobContext = useJobs;
