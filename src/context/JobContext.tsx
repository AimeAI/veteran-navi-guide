
import React, { createContext, useContext, useState } from 'react';
import { defaultFilters } from '../utils/jobUtils';
import { useJobOperations } from '../hooks/useJobOperations';
import { useJobSearchOperations } from '../hooks/useJobSearch';
import { Job, JobFilterState, JobContextProps } from '../types/job';

// Create the context
const JobContext = createContext<JobContextProps | undefined>(undefined);

// Context Provider component
export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<JobFilterState>(defaultFilters);
  const { jobs, loading, error, searchJobs } = useJobSearchOperations();
  const { savedJobs, appliedJobs, saveJob, unsaveJob, applyToJob } = useJobOperations();

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
