
import { useState } from 'react';
import { JobFilterState, Job } from '../types/job';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { mapSupabaseJobToJobModel } from '../utils/jobMapping';

export function useJobSearchOperations() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Function to search for jobs from Supabase
  const searchJobs = async (filters: JobFilterState) => {
    setLoading(true);
    setError(null);
    
    try {
      // Build our Supabase query based on the filters
      let query = supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply filters if they exist
      if (filters.keywords) {
        query = query.ilike('title', `%${filters.keywords}%`);
      }
      
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }
      
      if (filters.remote) {
        query = query.eq('job_type', 'remote');
      }
      
      if (filters.jobType && filters.jobType !== 'all') {
        query = query.eq('job_type', filters.jobType);
      }
      
      if (filters.industry && filters.industry !== 'all') {
        query = query.eq('industry', filters.industry);
      }
      
      // Execute the query
      const { data, error: queryError } = await query;
      
      if (queryError) {
        throw new Error(`Error fetching jobs: ${queryError.message}`);
      }
      
      if (!data || data.length === 0) {
        setJobs([]);
        toast.info("No jobs found matching your search criteria.");
        return;
      }
      
      // Map the Supabase job data to our Job type
      const mappedJobs: Job[] = data.map(mapSupabaseJobToJobModel);
      setJobs(mappedJobs);
      
    } catch (err) {
      console.error('Error searching jobs:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch jobs'));
      toast.error("Failed to load jobs. Please try again later.");
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
