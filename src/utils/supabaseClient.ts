
import { createClient } from '@supabase/supabase-js';
import { Job } from '@/context/JobContext';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Store jobs in Supabase with deduplication
 */
export const storeJobsInSupabase = async (jobs: Job[]): Promise<number> => {
  if (!jobs.length) return 0;
  
  try {
    // First, get existing jobs from the database to check for duplicates
    const { data: existingJobs, error: fetchError } = await supabase
      .from('jobs')
      .select('id, source_id');
    
    if (fetchError) {
      console.error('Error fetching existing jobs:', fetchError);
      throw fetchError;
    }
    
    // Create a Set of existing job IDs for efficient lookup
    const existingJobIds = new Set(existingJobs?.map(job => job.source_id) || []);
    
    // Filter out jobs that already exist
    const newJobs = jobs.filter(job => !existingJobIds.has(job.id));
    
    if (!newJobs.length) {
      console.log('No new jobs to insert');
      return 0;
    }
    
    // Transform jobs to match Supabase schema
    const jobsToInsert = newJobs.map(job => ({
      source_id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      category: job.category,
      salary_range: job.salaryRange,
      remote: job.remote,
      clearance_level: job.clearanceLevel,
      mos_code: job.mosCode,
      required_skills: job.requiredSkills,
      preferred_skills: job.preferredSkills,
      date_posted: job.date,
      job_type: job.jobType,
      industry: job.industry,
      experience_level: job.experienceLevel,
      education_level: job.educationLevel,
      source: job.source,
      url: job.url
    }));
    
    // Insert new jobs
    const { error: insertError, count } = await supabase
      .from('jobs')
      .insert(jobsToInsert)
      .select('count');
    
    if (insertError) {
      console.error('Error inserting jobs:', insertError);
      throw insertError;
    }
    
    console.log(`Successfully inserted ${count} new jobs`);
    return count || jobsToInsert.length;
  } catch (error) {
    console.error('Error storing jobs in Supabase:', error);
    return 0;
  }
};

/**
 * Get jobs from Supabase with optional filters
 */
export const getJobsFromSupabase = async (
  filters: {
    source?: string;
    keywords?: string;
    location?: string;
    remote?: boolean;
    category?: string;
    jobType?: string;
    limit?: number;
    offset?: number;
  } = {}
): Promise<{ jobs: Job[]; count: number }> => {
  try {
    let query = supabase
      .from('jobs')
      .select('*', { count: 'exact' });
    
    // Apply filters
    if (filters.source) {
      query = query.eq('source', filters.source);
    }
    
    if (filters.keywords) {
      query = query.or(`title.ilike.%${filters.keywords}%,description.ilike.%${filters.keywords}%`);
    }
    
    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }
    
    if (filters.remote !== undefined) {
      query = query.eq('remote', filters.remote);
    }
    
    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    
    if (filters.jobType) {
      query = query.eq('job_type', filters.jobType);
    }
    
    // Add pagination
    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    
    if (filters.offset) {
      query = query.range(filters.offset, (filters.offset + (filters.limit || 10)) - 1);
    }
    
    // Order by date
    query = query.order('date_posted', { ascending: false });
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Error fetching jobs from Supabase:', error);
      throw error;
    }
    
    // Transform from Supabase schema back to our Job interface
    const jobs = data.map(item => ({
      id: item.source_id,
      title: item.title,
      company: item.company,
      location: item.location,
      description: item.description,
      category: item.category,
      salaryRange: item.salary_range,
      remote: item.remote,
      clearanceLevel: item.clearance_level,
      mosCode: item.mos_code,
      requiredSkills: item.required_skills,
      preferredSkills: item.preferred_skills,
      date: item.date_posted,
      jobType: item.job_type,
      industry: item.industry,
      experienceLevel: item.experience_level,
      educationLevel: item.education_level,
      source: item.source,
      url: item.url
    })) as Job[];
    
    return { jobs, count: count || 0 };
  } catch (error) {
    console.error('Error getting jobs from Supabase:', error);
    return { jobs: [], count: 0 };
  }
};
