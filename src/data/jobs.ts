import { Job } from '@/types/job';
import { mockJobs } from './mockJobs';
import { supabase } from '@/integrations/supabase/client';

// Function to fetch all jobs
export const getAllJobs = async (): Promise<Job[]> => {
  console.log('DEV MODE: getAllJobs returning mock data');
  return mockJobs;
  
  /* Real implementation commented out during development
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('posted_date', { ascending: false });
      
    if (error) {
      console.error('Error fetching jobs:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getAllJobs:', error);
    return [];
  }
  */
};

// Function to fetch a single job by ID
export const getJobById = async (id: string): Promise<Job | null> => {
  console.log('DEV MODE: getJobById returning mock data');
  return mockJobs.find(job => job.id === id) || null;
  
  /* Real implementation commented out during development
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching job:', error);
      return null;
    }
    
    return data || null;
  } catch (error) {
    console.error('Error in getJobById:', error);
    return null;
  }
  */
};

// Function to fetch featured jobs
export const getFeaturedJobs = async (): Promise<Job[]> => {
  console.log('DEV MODE: getFeaturedJobs returning mock data');
  return mockJobs.slice(0, 3);
  
  /* Real implementation commented out during development
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('is_featured', true)
      .order('posted_date', { ascending: false });
      
    if (error) {
      console.error('Error fetching featured jobs:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getFeaturedJobs:', error);
    return [];
  }
  */
};

// Function to create a new job
export const createJob = async (jobData: Omit<Job, 'id'>): Promise<Job | null> => {
  console.log('DEV MODE: createJob returning mock data');
  
  // Create a mock job with the provided data and a random ID
  const mockJob: Job = {
    ...jobData,
    id: `mock-${Date.now()}`,
    company_logo: jobData.company_logo || '/placeholder.svg'
  };
  
  return mockJob;
  
  /* Real implementation commented out during development
  try {
    const { data, error } = await supabase
      .from('jobs')
      .insert(jobData)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating job:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in createJob:', error);
    return null;
  }
  */
};

// Function to update an existing job
export const updateJob = async (id: string, jobData: Partial<Job>): Promise<Job | null> => {
  console.log('DEV MODE: updateJob returning mock data');
  
  // Find the index of the job to update in the mockJobs array
  const jobIndex = mockJobs.findIndex(job => job.id === id);
  
  if (jobIndex === -1) {
    console.error('Job not found in mock data');
    return null;
  }
  
  // Update the job with the provided data
  mockJobs[jobIndex] = { ...mockJobs[jobIndex], ...jobData };
  
  return mockJobs[jobIndex];
  
  /* Real implementation commented out during development
  try {
    const { data, error } = await supabase
      .from('jobs')
      .update(jobData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating job:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in updateJob:', error);
    return null;
  }
  */
};

// Function to delete a job
export const deleteJob = async (id: string): Promise<boolean> => {
  console.log('DEV MODE: deleteJob returning mock data');
  
  // Find the index of the job to delete in the mockJobs array
  const jobIndex = mockJobs.findIndex(job => job.id === id);
  
  if (jobIndex === -1) {
    console.error('Job not found in mock data');
    return false;
  }
  
  // Remove the job from the mockJobs array
  mockJobs.splice(jobIndex, 1);
  
  return true;
  
  /* Real implementation commented out during development
  try {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting job:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteJob:', error);
    return false;
  }
  */
};
