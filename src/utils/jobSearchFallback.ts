
import { Job } from '@/types/job';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { mapSupabaseJobToJobModel } from './jobMapping';

/**
 * Fallback function to get jobs from Supabase when the primary job sources fail
 */
export const fetchJobsFromSupabaseFallback = async (
  currentPage: number,
  pageSize: number
): Promise<{ jobs: Job[]; totalCount: number } | null> => {
  try {
    const { data, error, count } = await supabase
      .from('jobs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((currentPage - 1) * pageSize, currentPage * pageSize - 1);
      
    if (error) {
      console.error('Supabase fallback error:', error);
      return null;
    }
    
    if (!data || data.length === 0) {
      return { jobs: [], totalCount: 0 };
    }
    
    // Map the Supabase job data to our Job type to ensure compatibility
    const mappedJobs: Job[] = data.map(mapSupabaseJobToJobModel);
    
    toast.info('Using cached job results due to search API issues');
    
    return {
      jobs: mappedJobs,
      totalCount: count || 0
    };
  } catch (fallbackErr) {
    console.error('Fallback job search also failed:', fallbackErr);
    return null;
  }
};
