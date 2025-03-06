
import { createClient } from "@supabase/supabase-js";
import { Job } from "@/context/JobContext";
import { generateJobDeduplicationKey } from "@/utils/jobicyRssParser";

// The Supabase URL and anon key
const supabaseUrl = "https://ykperxxuwqolbfvhuqig.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrcGVyeHh1d3FvbGJmdmh1cWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwODE3OTIsImV4cCI6MjA1MzY1Nzc5Mn0.-WvuM5Xtfo4Q2oFwWQrXiJm5UTxnUqupOPsDRQ2DDOU";

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Interface for job search parameters
interface JobSearchParams {
  source?: string;
  keywords?: string;
  location?: string;
  remote?: boolean;
  category?: string;
  jobType?: string;
  limit?: number;
}

// Function to get jobs from Supabase
export const getJobsFromSupabase = async (params: JobSearchParams): Promise<{
  jobs: Job[];
  count: number;
}> => {
  try {
    let query = supabase.from('jobs').select('*', { count: 'exact' });
    
    // Apply filters if provided
    if (params.source) {
      query = query.eq('source', params.source);
    }
    
    if (params.keywords) {
      query = query.or(`title.ilike.%${params.keywords}%,description.ilike.%${params.keywords}%`);
    }
    
    if (params.location) {
      query = query.ilike('location', `%${params.location}%`);
    }
    
    if (params.remote !== undefined) {
      query = query.eq('remote', params.remote);
    }
    
    if (params.category) {
      query = query.eq('category', params.category);
    }
    
    if (params.jobType) {
      query = query.eq('job_type', params.jobType);
    }
    
    // Set limit
    if (params.limit) {
      query = query.limit(params.limit);
    }
    
    // Execute query
    const { data, error, count } = await query;
    
    if (error) {
      throw error;
    }
    
    // Map database records to Job interface
    const jobs: Job[] = data.map(record => ({
      id: record.id,
      title: record.title,
      company: record.company,
      location: record.location,
      description: record.description,
      category: record.category || 'other',
      salaryRange: record.salary_range || 'range1',
      remote: record.remote || false,
      clearanceLevel: record.clearance_level || 'none',
      mosCode: record.mos_code || '',
      requiredSkills: record.required_skills || [],
      preferredSkills: record.preferred_skills || [],
      date: record.created_at,
      jobType: record.job_type || 'fulltime',
      industry: record.industry || '',
      experienceLevel: record.experience_level || '',
      educationLevel: record.education_level || '',
      source: record.source,
      url: record.url,
    }));
    
    return {
      jobs,
      count: count || 0
    };
  } catch (error) {
    console.error('Error getting jobs from Supabase:', error);
    return { jobs: [], count: 0 };
  }
};

// Function to store jobs in Supabase
export const storeJobsInSupabase = async (jobs: Job[]): Promise<number> => {
  try {
    if (!jobs || jobs.length === 0) {
      return 0;
    }
    
    // Create a map of deduplication keys to detect duplicates
    const existingJobsResponse = await supabase
      .from('jobs')
      .select('id, title, company')
      .in('source', ['jobicy']);
    
    if (existingJobsResponse.error) {
      throw existingJobsResponse.error;
    }
    
    // Create a set of existing job keys for deduplication
    const existingJobKeys = new Set(
      existingJobsResponse.data.map(job => 
        generateJobDeduplicationKey({ title: job.title, company: job.company } as Job)
      )
    );
    
    // Filter out jobs that already exist
    const newJobs = jobs.filter(job => 
      !existingJobKeys.has(generateJobDeduplicationKey(job))
    );
    
    if (newJobs.length === 0) {
      console.log('No new jobs to insert');
      return 0;
    }
    
    // Map the jobs to the database schema
    const jobsToInsert = newJobs.map(job => ({
      id: job.id,
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
      date: job.date,
      job_type: job.jobType,
      industry: job.industry,
      experience_level: job.experienceLevel,
      education_level: job.educationLevel,
      source: job.source,
      url: job.url,
    }));
    
    // Insert jobs in batches to avoid exceeding payload limits
    const BATCH_SIZE = 50;
    let insertedCount = 0;
    
    for (let i = 0; i < jobsToInsert.length; i += BATCH_SIZE) {
      const batch = jobsToInsert.slice(i, i + BATCH_SIZE);
      const { error, count } = await supabase
        .from('jobs')
        .insert(batch)
        .select();
      
      if (error) {
        console.error(`Error inserting batch ${i / BATCH_SIZE + 1}:`, error);
      } else {
        insertedCount += count || batch.length;
        console.log(`Inserted batch ${i / BATCH_SIZE + 1} with ${count || batch.length} jobs`);
      }
    }
    
    return insertedCount;
  } catch (error) {
    console.error('Error storing jobs in Supabase:', error);
    return 0;
  }
};
