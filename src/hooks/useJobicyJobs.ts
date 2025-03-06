
import { useState, useEffect } from 'react';
import { Job } from '@/context/JobContext';
import { getJobsFromSupabase } from '@/utils/supabaseClient';
import { toast } from 'sonner';

interface UseJobicyJobsProps {
  keywords?: string;
  location?: string;
  remote?: boolean;
  jobType?: string;
  limit?: number;
  page?: number;
  enabled?: boolean;
}

interface UseJobicyJobsResult {
  jobs: Job[];
  isLoading: boolean;
  error: Error | null;
  totalJobs: number;
  totalPages: number;
  currentPage: number;
  setPage: (page: number) => void;
  refreshJobs: () => Promise<void>;
}

export const useJobicyJobs = ({
  keywords,
  location,
  remote,
  jobType,
  limit = 10,
  page = 1,
  enabled = true
}: UseJobicyJobsProps): UseJobicyJobsResult => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [totalJobs, setTotalJobs] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);
  
  const fetchJobs = async () => {
    if (!enabled) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const offset = (currentPage - 1) * limit;
      
      const { jobs: fetchedJobs, count } = await getJobsFromSupabase({
        source: 'jobicy',
        keywords,
        location,
        remote,
        jobType,
        limit,
        offset
      });
      
      setJobs(fetchedJobs);
      setTotalJobs(count);
    } catch (err) {
      console.error('Error fetching Jobicy jobs:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch jobs'));
      toast.error('Failed to load jobs from Jobicy');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch jobs on initial load and when dependencies change
  useEffect(() => {
    fetchJobs();
  }, [keywords, location, remote, jobType, currentPage, limit, enabled]);
  
  const setPage = (newPage: number) => {
    setCurrentPage(newPage);
  };
  
  const refreshJobs = async () => {
    await fetchJobs();
  };
  
  const totalPages = Math.max(1, Math.ceil(totalJobs / limit));
  
  return {
    jobs,
    isLoading,
    error,
    totalJobs,
    totalPages,
    currentPage,
    setPage,
    refreshJobs
  };
};
