
import React, { createContext, useContext, useState } from 'react';
import { defaultFilters } from '../utils/jobUtils';
import { useJobOperations } from '../hooks/useJobOperations';
import { Job, JobFilterState, JobContextProps } from '../types/job';

// Create the context
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
      // For now, we'll use the mock job fetching function from jobUtils
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchFilters),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      
      const jobData = await response.json();
      setJobs(jobData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch jobs'));
    } finally {
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

// Re-export types for convenience
export type { Job, JobFilterState, JobContextProps };
