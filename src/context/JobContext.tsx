
import React, { createContext, useContext, useState } from 'react';
import { defaultFilters } from '../utils/jobUtils';
import { useJobOperations } from '../hooks/useJobOperations';
import { Job, JobFilterState, JobContextProps } from '../types/job';
import { supabase } from '@/integrations/supabase/client';
import { mapSupabaseJobToJobModel } from '@/utils/jobMapping';

// Create the context with a more explicit type definition
const JobContext = createContext<JobContextProps | undefined>(undefined);

// Context Provider component
export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<JobFilterState>(defaultFilters);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { savedJobs, appliedJobs, saveJob, unsaveJob, applyToJob } = useJobOperations();

  // Function to search for jobs
  const searchJobs = async (searchFilters: JobFilterState) => {
    setLoading(true);
    setError(null);
    try {
      // Start with base query
      const baseQuery = supabase.from('jobs').select('*');
      
      // Apply filters - using explicit type annotations to avoid deep instantiation
      let finalQuery = baseQuery;
      
      if (searchFilters.keywords) {
        finalQuery = finalQuery.or(`title.ilike.%${searchFilters.keywords}%,description.ilike.%${searchFilters.keywords}%`);
      }
      
      if (searchFilters.location) {
        finalQuery = finalQuery.ilike('location', `%${searchFilters.location}%`);
      }
      
      if (searchFilters.remote) {
        // Assuming jobs with remote=true are marked as such
        finalQuery = finalQuery.eq('remote', true);
      }
      
      if (searchFilters.jobType && searchFilters.jobType !== 'all') {
        finalQuery = finalQuery.eq('job_type', searchFilters.jobType);
      }
      
      if (searchFilters.industry && searchFilters.industry !== 'all') {
        finalQuery = finalQuery.eq('industry', searchFilters.industry);
      }
      
      // Execute query
      const { data, error: supabaseError } = await finalQuery;
      
      if (supabaseError) {
        throw new Error(`Supabase error: ${supabaseError.message}`);
      }
      
      // Map Supabase data to our Job model
      const jobData = data?.map(mapSupabaseJobToJobModel) || [];
      setJobs(jobData);
    } catch (err) {
      console.error('Error searching jobs:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch jobs'));
    } finally {
      setLoading(false);
    }
  };

  // Function to clear filters
  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  // Create the context value explicitly to help TypeScript resolve types
  const contextValue: JobContextProps = {
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
  };

  return (
    <JobContext.Provider value={contextValue}>
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

// Re-export types for convenience
export type { Job, JobFilterState, JobContextProps };
