
import { Job } from '@/types/job';
import { mockJobs as typedMockJobs } from '@/utils/recommendationAlgorithm';
import { supabase } from '@/integrations/supabase/client';

// Helper function to convert JobListing to Job type
const convertToJobType = (job: any): Job => ({
  id: job.id,
  title: job.title,
  company: job.company,
  location: job.location,
  description: job.description,
  category: job.industry || 'Technology',
  salaryRange: job.salaryRange || job.salary || 'Competitive',
  remote: job.remote || false,
  clearanceLevel: job.securityClearanceRequired || job.clearanceLevel || 'None',
  mosCode: job.requiredMosCodes ? job.requiredMosCodes[0] : '',
  requiredSkills: job.requiredSkills || [],
  preferredSkills: job.preferredSkills || [],
  jobType: job.jobType || 'full-time',
  date: job.postedDate || new Date().toISOString(),
  url: job.url || '',
  industry: job.industry || '',
  experienceLevel: job.experienceLevel || '',
  educationLevel: job.educationLevel || '',
  source: job.source || 'Internal'
});

// Function to fetch all jobs
export const getAllJobs = async (): Promise<Job[]> => {
  console.log('DEV MODE: getAllJobs returning mock data');
  return typedMockJobs.map(convertToJobType);
  
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
    
    return data.map(convertToJobType) || [];
  } catch (error) {
    console.error('Error in getAllJobs:', error);
    return [];
  }
  */
};

// Function to fetch a single job by ID
export const getJobById = async (id: string): Promise<Job | null> => {
  console.log('DEV MODE: getJobById returning mock data');
  const job = typedMockJobs.find(job => job.id === id);
  return job ? convertToJobType(job) : null;
  
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
    
    return data ? convertToJobType(data) : null;
  } catch (error) {
    console.error('Error in getJobById:', error);
    return null;
  }
  */
};

// Function to fetch featured jobs
export const getFeaturedJobs = async (): Promise<Job[]> => {
  console.log('DEV MODE: getFeaturedJobs returning mock data');
  return typedMockJobs.slice(0, 3).map(convertToJobType);
  
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
    
    return data.map(convertToJobType) || [];
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
    id: `mock-${Date.now()}`
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
    
    return convertToJobType(data);
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
  const jobIndex = typedMockJobs.findIndex(job => job.id === id);
  
  if (jobIndex === -1) {
    console.error('Job not found in mock data');
    return null;
  }
  
  // Update the job with the provided data
  const updatedJob = {
    ...convertToJobType(typedMockJobs[jobIndex]),
    ...jobData
  };
  
  return updatedJob;
  
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
    
    return convertToJobType(data);
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
  const jobIndex = typedMockJobs.findIndex(job => job.id === id);
  
  if (jobIndex === -1) {
    console.error('Job not found in mock data');
    return false;
  }
  
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

// Function to search for jobs based on filter criteria
export const searchJobs = async (filters: any): Promise<Job[]> => {
  console.log('DEV MODE: searchJobs returning filtered mock data', filters);
  
  // Simple filtering logic for mock data
  let filteredJobs = typedMockJobs.map(convertToJobType);
  
  // Filter by keywords (in title or description)
  if (filters.keywords && filters.keywords.length > 0) {
    const keywords = Array.isArray(filters.keywords) 
      ? filters.keywords 
      : [filters.keywords];
      
    filteredJobs = filteredJobs.filter(job => {
      return keywords.some(keyword => 
        job.title.toLowerCase().includes(keyword.toLowerCase()) || 
        job.description.toLowerCase().includes(keyword.toLowerCase())
      );
    });
  }
  
  // Filter by location
  if (filters.locations && filters.locations.length > 0) {
    const locations = Array.isArray(filters.locations) 
      ? filters.locations 
      : [filters.locations];
      
    filteredJobs = filteredJobs.filter(job => {
      return locations.some(location => 
        job.location.toLowerCase().includes(location.toLowerCase())
      );
    });
  }
  
  // Filter by job type
  if (filters.jobType) {
    filteredJobs = filteredJobs.filter(job => 
      job.jobType.toLowerCase() === filters.jobType.toLowerCase()
    );
  }
  
  // Return a random subset of the filtered jobs (for demo purposes)
  return filteredJobs.slice(0, 5);
  
  /* Real implementation commented out during development
  try {
    // Build Supabase query with filters
    let query = supabase.from('jobs').select('*');
    
    // Apply filters...
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error searching jobs:', error);
      return [];
    }
    
    return data.map(convertToJobType) || [];
  } catch (error) {
    console.error('Error in searchJobs:', error);
    return [];
  }
  */
};
