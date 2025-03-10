
import { createClient } from "@supabase/supabase-js";
import { Job } from "@/context/JobContext";
import { generateJobDeduplicationKey } from "@/utils/jobicyRssParser";
import { supabase as supabaseIntegration } from "@/integrations/supabase/client";

// The Supabase URL and anon key
const supabaseUrl = "https://ykperxxuwqolbfvhuqig.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrcGVyeHh1d3FvbGJmdmh1cWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwODE3OTIsImV4cCI6MjA1MzY1Nzc5Mn0.-WvuM5Xtfo4Q2oFwWQrXiJm5UTxnUqupOPsDRQ2DDOU";

// Create the Supabase client - use integration client if available
export const supabase = supabaseIntegration || createClient(supabaseUrl, supabaseAnonKey);

// Interface for job search parameters
interface JobSearchParams {
  source?: string;
  keywords?: string;
  location?: string;
  remote?: boolean;
  category?: string;
  jobType?: string;
  limit?: number;
  offset?: number;
}

// Function to get jobs from Supabase
export const getJobsFromSupabase = async (params: JobSearchParams): Promise<{
  jobs: Job[];
  count: number;
}> => {
  try {
    console.log("Fetching jobs from Supabase with params:", params);
    
    let query = supabase
      .from('jobs')
      .select('*', { count: 'exact' });
    
    // Apply filters if provided
    if (params.source) {
      // Using .ilike for case-insensitive matching if source information is stored in a field
      query = query.ilike('source', `%${params.source}%`);
    }
    
    if (params.keywords) {
      query = query.or(`title.ilike.%${params.keywords}%,description.ilike.%${params.keywords}%`);
    }
    
    if (params.location) {
      query = query.ilike('location', `%${params.location}%`);
    }
    
    if (params.remote !== undefined) {
      // Only apply if the field exists in your table
      if (params.remote === true) {
        // For boolean fields or to check specific values
        query = query.eq('remote', true);
      }
    }
    
    if (params.category) {
      // Only apply if you have a category field
      query = query.eq('category', params.category);
    }
    
    if (params.jobType) {
      query = query.eq('job_type', params.jobType);
    }
    
    // Apply offset and limit for pagination
    if (params.offset !== undefined) {
      query = query.range(params.offset, params.offset + (params.limit || 10) - 1);
    } else if (params.limit) {
      query = query.limit(params.limit);
    }
    
    // Execute query
    const { data, error, count } = await query;
    
    if (error) {
      console.error("Supabase query error:", error);
      throw error;
    }
    
    console.log(`Supabase returned ${data?.length || 0} jobs`);
    
    // Map database records to Job interface
    const jobs: Job[] = (data || []).map(record => ({
      id: record.id,
      title: record.title,
      company: record.company,
      location: record.location,
      description: record.description,
      category: record.category || 'other', // Provide defaults for fields that might not exist
      salaryRange: record.salary_range || '',
      remote: false, // Default value since field doesn't exist in DB
      clearanceLevel: 'none', // Default value
      mosCode: '', // Default value
      requiredSkills: record.required_skills || [],
      preferredSkills: record.requirements || [],
      date: record.created_at,
      jobType: record.job_type || 'fulltime',
      industry: '', // Default value
      experienceLevel: '', // Default value
      educationLevel: '', // Default value
      source: params.source || 'supabase',
      url: record.application_url || '',
    }));
    
    return {
      jobs,
      count: count || 0
    };
  } catch (error) {
    console.error('Error getting jobs from Supabase:', error);
    throw error; // Re-throw so we can handle it in the calling code
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
      salary_range: job.salaryRange,
      job_type: job.jobType,
      required_skills: job.requiredSkills,
      requirements: job.preferredSkills,
      application_url: job.url,
      status: 'open',
      // Only include fields that actually exist in your database schema
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
