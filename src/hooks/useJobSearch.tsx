
import { useState } from 'react';
import { JobFilterState, Job } from '../types/job';
import { fetchMockJobs } from '../utils/jobUtils';

export function useJobSearchOperations() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Function to search for jobs
  const searchJobs = async (filters: JobFilterState) => {
    setLoading(true);
    setError(null);
    try {
      const mockJobs = await fetchMockJobs();
      setJobs(mockJobs);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch jobs'));
    } finally {
      setLoading(false);
    }
  };

  return {
    jobs,
    loading,
    error,
    searchJobs
  };
}
