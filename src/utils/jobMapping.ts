
import { Job } from '@/types/job';

/**
 * Maps job data from Supabase to our Job interface
 */
export const mapSupabaseJobToJobModel = (job: any): Job => {
  return {
    id: job.id,
    title: job.title || 'Untitled Position',
    company: job.company || 'Unknown Company',
    location: job.location || 'Location not specified',
    description: job.description || '',
    category: job.job_type || 'other', // Map job_type to category
    salaryRange: job.salary_range || 'range1',
    remote: job.job_type?.toLowerCase().includes('remote') || false, // Determine remote status from job_type
    clearanceLevel: Array.isArray(job.requirements) 
      ? job.requirements.find((req: string) => req?.toLowerCase().includes('clearance')) || 'none'
      : 'none',
    mosCode: Array.isArray(job.military_skill_mapping) && job.military_skill_mapping.length > 0
      ? job.military_skill_mapping[0]
      : '',
    requiredSkills: job.required_skills || [],
    preferredSkills: [], // Not available in the DB schema, use empty array
    jobType: job.job_type || 'fulltime',
    date: job.created_at || new Date().toISOString(),
    industry: job.company || '', // Use company as fallback for industry
    experienceLevel: Array.isArray(job.requirements)
      ? job.requirements.find((req: string) => req?.toLowerCase().includes('experience')) || ''
      : '',
    educationLevel: Array.isArray(job.requirements)
      ? job.requirements.find((req: string) => req?.toLowerCase().includes('education')) || ''
      : '',
    url: job.application_url || ''
  };
};
