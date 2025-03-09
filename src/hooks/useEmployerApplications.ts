
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';
import { ApplicationStatus } from '@/hooks/useApplications';
import { toast } from 'sonner';

export interface JobApplicant {
  id: string;
  applicationId: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  resumeUrl?: string;
  coverLetter?: string;
  appliedDate: Date;
  status: ApplicationStatus;
  notes?: string;
  jobId: string;
  jobTitle: string;
}

export function useEmployerApplications(jobId?: string) {
  const [applications, setApplications] = useState<JobApplicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useUser();

  const fetchApplications = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('applications')
        .select(`
          id,
          job_id,
          applicant_id,
          status,
          date_applied,
          created_at,
          resume_url,
          cover_letter,
          notes,
          jobs!inner(
            id,
            title,
            employer_id
          ),
          profiles:applicant_id(
            full_name,
            avatar_url,
            id
          )
        `)
        .eq('jobs.employer_id', user.id);
      
      // Filter by job ID if provided
      if (jobId) {
        query = query.eq('job_id', jobId);
      }
      
      const { data, error: fetchError } = await query;
      
      if (fetchError) throw fetchError;
      
      const mappedApplications: JobApplicant[] = data.map(app => ({
        id: app.applicant_id,
        applicationId: app.id,
        fullName: app.profiles?.full_name || 'Anonymous Applicant',
        email: '', // We'll need to add email to profiles or fetch from auth
        avatarUrl: app.profiles?.avatar_url,
        resumeUrl: app.resume_url,
        coverLetter: app.cover_letter,
        appliedDate: new Date(app.date_applied || app.created_at),
        status: app.status as ApplicationStatus,
        notes: app.notes,
        jobId: app.job_id,
        jobTitle: app.jobs?.title || 'Unknown Job'
      }));
      
      setApplications(mappedApplications);
    } catch (err: any) {
      console.error('Error fetching applications:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [user, jobId]);

  const updateApplicationStatus = useCallback(async (
    applicationId: string, 
    newStatus: ApplicationStatus,
    notes?: string
  ) => {
    if (!user) return false;
    
    try {
      const updateData: { status: ApplicationStatus, notes?: string } = { status: newStatus };
      if (notes) updateData.notes = notes;
      
      const { error } = await supabase
        .from('applications')
        .update(updateData)
        .eq('id', applicationId);
      
      if (error) throw error;
      
      toast.success(`Application status updated to ${newStatus}`);
      fetchApplications();
      return true;
    } catch (err: any) {
      console.error('Error updating application status:', err);
      toast.error(err.message || 'Failed to update application status');
      return false;
    }
  }, [user, fetchApplications]);

  useEffect(() => {
    if (user) {
      fetchApplications();
    } else {
      setApplications([]);
      setIsLoading(false);
    }
  }, [user, fetchApplications]);

  return {
    applications,
    isLoading,
    error,
    updateApplicationStatus,
    refreshApplications: fetchApplications
  };
}
