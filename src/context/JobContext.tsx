
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { searchJobs } from '@/data/jobs';
import { fetchAndParseJobicyFeed } from '@/utils/jobicyRssParser';
import { supabase } from '@/utils/supabaseClient';

// Define the Job interface
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
  date: string;
  jobType: string;
  industry: string;
  experienceLevel: string;
  educationLevel: string;
  companySize?: string;
  companyRating?: number;
  benefits?: string[];
  source?: string;
  url?: string;
  requiredMosCodes?: string[];
}

// Define the JobFilterState interface
export interface JobFilterState {
  keywords: string;
  location: string;
  radius: number;
  jobType: string;
  mosCodes: string[];
  clearanceLevel: string[];
  remote: boolean;
  militarySkills: string[];
  industry: string;
  experienceLevel: string;
  educationLevel: string;
  companySize: string;
  companyRating: number;
  benefits: string[];
  skills: string[];
  useJobicy: boolean;
  // Add these to fix type errors in JobSearch component
  category: string;
  salaryRange: string;
}

// Update the SearchParams interface to include the correct country type
export interface SearchParams {
  keywords: string[];
  locations: string[];
  radius: number;
  jobType: string;
  mosCodes: string[];
  clearanceLevel: string[];
  remote: boolean;
  militarySkills: string[];
  industry: string;
  experienceLevel: string;
  educationLevel: string;
  companySize: string;
  companyRating: number;
  benefits: string[];
  skills: string[];
  country: "us" | "canada"; // Make sure this is the correct type
  useJobicy: boolean;
}

// Define the JobContextProps interface
interface JobContextProps {
  jobs: Job[];
  isLoading: boolean;
  error: string | null;
  filters: JobFilterState;
  savedJobs: Job[];
  appliedJobs: string[]; // Added to match what components expect
  performSearch: (filters: JobFilterState) => Promise<void>;
  updateFilter: (name: string, value: any) => void;
  updateArrayFilter: (name: string, value: string, checked: boolean) => void;
  resetFilters: () => void;
  saveJob: (job: Job) => void;
  removeSavedJob: (jobId: string) => void;
}

// Create the context
const JobContext = createContext<JobContextProps | undefined>(undefined);

// Default filter values
const defaultFilters: JobFilterState = {
  keywords: '',
  location: '',
  radius: 25,
  jobType: '',
  mosCodes: [],
  clearanceLevel: [],
  remote: false,
  militarySkills: [],
  industry: '',
  experienceLevel: '',
  educationLevel: '',
  companySize: '',
  companyRating: 0,
  benefits: [],
  skills: [],
  useJobicy: false,
  // Add the missing properties
  category: '',
  salaryRange: ''
};

// Create the provider component
export const JobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<JobFilterState>(defaultFilters);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]); // Track applied jobs

  // Load saved jobs from local storage on initialization
  useEffect(() => {
    const loadSavedJobs = async () => {
      try {
        // Try to load from Supabase first
        const { data: supabaseSavedJobs, error } = await supabase
          .from('saved_jobs')
          .select('*');

        if (error) {
          throw error;
        }

        if (supabaseSavedJobs && supabaseSavedJobs.length > 0) {
          // Process saved jobs from Supabase
          // This would need additional logic to get the full job details
          console.log('Loaded saved jobs from Supabase:', supabaseSavedJobs);
          // For now, fall back to local storage
        }

        // Fall back to localStorage if needed
        const savedJobsJson = localStorage.getItem('savedJobs');
        if (savedJobsJson) {
          setSavedJobs(JSON.parse(savedJobsJson));
        }

        // Load applied jobs from localStorage
        const appliedJobsJson = localStorage.getItem('appliedJobs');
        if (appliedJobsJson) {
          setAppliedJobs(JSON.parse(appliedJobsJson));
        }
      } catch (err) {
        console.error('Error loading saved jobs:', err);
        
        // Fall back to localStorage
        const savedJobsJson = localStorage.getItem('savedJobs');
        if (savedJobsJson) {
          setSavedJobs(JSON.parse(savedJobsJson));
        }
      }
    };

    loadSavedJobs();
  }, []);

  // Fix the country type in the performSearch function
  const performSearch = async (filters: JobFilterState) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Convert filters to search params
      const searchParams: SearchParams = {
        keywords: filters.keywords ? [filters.keywords] : [],
        locations: filters.location ? [filters.location] : [],
        radius: filters.radius || 25,
        jobType: filters.jobType || '',
        mosCodes: filters.mosCodes || [],
        clearanceLevel: filters.clearanceLevel || [],
        remote: filters.remote || false,
        militarySkills: filters.militarySkills || [],
        industry: filters.industry || '',
        experienceLevel: filters.experienceLevel || '',
        educationLevel: filters.educationLevel || '',
        companySize: filters.companySize || '',
        companyRating: filters.companyRating || 0,
        benefits: filters.benefits || [],
        skills: filters.skills || [],
        country: "canada", // Set to "canada" as a valid value
        useJobicy: filters.useJobicy || false
      };
      
      // Replace 'results' with 'jobResults' in the code
      const jobResults = await searchJobs(searchParams);
      setJobs(jobResults);
    } catch (err) {
      setError('Failed to search jobs. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Update a single filter value
  const updateFilter = (name: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Update an array filter value (add/remove)
  const updateArrayFilter = (name: string, value: string, checked: boolean) => {
    setFilters(prev => {
      const currentArray = prev[name as keyof JobFilterState] as string[];
      
      if (checked) {
        // Add the value if it doesn't exist
        return {
          ...prev,
          [name]: [...currentArray, value]
        };
      } else {
        // Remove the value
        return {
          ...prev,
          [name]: currentArray.filter(item => item !== value)
        };
      }
    });
  };

  // Reset filters to default values
  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  // Save a job to favorites
  const saveJob = async (job: Job) => {
    // Check if job is already saved
    if (savedJobs.some(savedJob => savedJob.id === job.id)) {
      return;
    }

    try {
      // Try to save to Supabase
      const { data, error } = await supabase
        .from('saved_jobs')
        .insert([{ 
          job_id: job.id,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }]);

      if (error) {
        console.error('Error saving job to Supabase:', error);
      } else {
        console.log('Job saved to Supabase:', data);
      }
    } catch (err) {
      console.error('Failed to save job to Supabase:', err);
    }

    // Always update local state and localStorage as a fallback
    const updatedSavedJobs = [...savedJobs, job];
    setSavedJobs(updatedSavedJobs);
    localStorage.setItem('savedJobs', JSON.stringify(updatedSavedJobs));
  };

  // Remove a job from favorites
  const removeSavedJob = async (jobId: string) => {
    try {
      // Try to remove from Supabase
      const { error } = await supabase
        .from('saved_jobs')
        .delete()
        .eq('job_id', jobId)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) {
        console.error('Error removing job from Supabase:', error);
      }
    } catch (err) {
      console.error('Failed to remove job from Supabase:', err);
    }

    // Always update local state and localStorage as a fallback
    const updatedSavedJobs = savedJobs.filter(job => job.id !== jobId);
    setSavedJobs(updatedSavedJobs);
    localStorage.setItem('savedJobs', JSON.stringify(updatedSavedJobs));
  };

  // Provide the context value
  const contextValue: JobContextProps = {
    jobs,
    isLoading,
    error,
    filters,
    savedJobs,
    appliedJobs,
    performSearch,
    updateFilter,
    updateArrayFilter,
    resetFilters,
    saveJob,
    removeSavedJob
  };

  return (
    <JobContext.Provider value={contextValue}>
      {children}
    </JobContext.Provider>
  );
};

// Create a custom hook to use the job context
export const useJobs = () => {
  const context = useContext(JobContext);
  
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  
  return context;
};
