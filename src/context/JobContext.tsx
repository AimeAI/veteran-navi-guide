
import React, { createContext, useContext, useState } from 'react';
import { defaultFilters } from '../utils/jobUtils';
import { useJobOperations } from '../hooks/useJobOperations';
import { Job, JobFilterState, JobContextProps } from '../types/job';
import { supabase } from '@/integrations/supabase/client';
import { mapSupabaseJobToJobModel } from '@/utils/jobMapping';
import logger from '@/utils/logger';
import { config } from '@/config/environment';

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
    logger.info('Searching for jobs with filters', searchFilters);
    setLoading(true);
    setError(null);
    
    try {
      // Using a direct approach to avoid TypeScript deep instantiation issues
      const fetchJobs = async () => {
        // Create a base query without type annotations
        const query = supabase.from('jobs').select('*');
        
        // Apply filters sequentially without chaining
        let finalQuery = query;
        
        // Apply keyword filter using OR
        if (searchFilters.keywords) {
          // Build the OR filter string
          const keywordFilter = `title.ilike.%${searchFilters.keywords}%,description.ilike.%${searchFilters.keywords}%`;
          finalQuery = finalQuery.or(keywordFilter);
        }
        
        // Apply location filter if present
        if (searchFilters.location) {
          finalQuery = finalQuery.ilike('location', `%${searchFilters.location}%`);
        }
        
        // Apply remote filter if enabled
        if (searchFilters.remote) {
          finalQuery = finalQuery.eq('remote', true);
        }
        
        // Apply job type filter if specified
        if (searchFilters.jobType && searchFilters.jobType !== 'all') {
          finalQuery = finalQuery.eq('job_type', searchFilters.jobType);
        }
        
        // Apply industry filter if specified
        if (searchFilters.industry && searchFilters.industry !== 'all') {
          finalQuery = finalQuery.eq('industry', searchFilters.industry);
        }
        
        // Execute the query and return the result
        return await finalQuery;
      };
      
      // Execute the query with performance logging
      const result = await logger.perf('Jobs query execution', fetchJobs);
      
      if (result.error) {
        throw new Error(`Supabase error: ${result.error.message}`);
      }
      
      // Map Supabase data to our Job model
      const jobData = result.data?.map(mapSupabaseJobToJobModel) || [];
      setJobs(jobData);
      
      // Log successful search in debug mode
      logger.debug(`Found ${jobData.length} jobs matching search criteria`);
      
    } catch (err) {
      logger.error('Error searching jobs:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch jobs'));
    } finally {
      setLoading(false);
    }
  };

  // Function to clear filters
  const clearFilters = () => {
    logger.debug('Clearing search filters');
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
