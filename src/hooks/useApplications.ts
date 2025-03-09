
import { useEffect, useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';

export type ApplicationStatus = 'pending' | 'reviewing' | 'interviewing' | 'offered' | 'rejected' | 'hired';

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  appliedDate: Date;
  status: ApplicationStatus;
  notes?: string;
  resumeUrl?: string;
  coverLetter?: string;
}

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast: uiToast } = useToast();
  const { user } = useUser();

  const fetchApplications = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: applicationData, error: fetchError } = await supabase
        .from('applications')
        .select(`
          id,
          job_id,
          cover_letter,
          resume_url,
          status,
          date_applied,
          notes,
          jobs(title, company)
        `)
        .eq('applicant_id', user.id);
      
      if (fetchError) throw fetchError;
      
      const mappedApplications: Application[] = applicationData.map(app => ({
        id: app.id,
        jobId: app.job_id,
        jobTitle: app.jobs?.title || 'Unknown Job',
        company: app.jobs?.company || 'Unknown Company',
        appliedDate: new Date(app.date_applied || app.created_at || new Date()),
        status: app.status as ApplicationStatus,
        notes: app.notes,
        resumeUrl: app.resume_url,
        coverLetter: app.cover_letter,
      }));
      
      setApplications(mappedApplications);
    } catch (err: any) {
      console.error('Error fetching applications:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const applyForJob = async (jobId: string, { coverLetter, resumeUrl }: { coverLetter?: string, resumeUrl?: string }) => {
    if (!user) {
      toast.error('You must be logged in to apply for jobs');
      return null;
    }
    
    try {
      // Check if already applied
      const { data: existingApplications } = await supabase
        .from('applications')
        .select('id')
        .eq('job_id', jobId)
        .eq('applicant_id', user.id);
      
      if (existingApplications && existingApplications.length > 0) {
        uiToast({
          title: "Already Applied",
          description: "You have already applied for this job",
          variant: "destructive"
        });
        return existingApplications[0].id;
      }
      
      // Create new application
      const { data, error } = await supabase.from('applications').insert({
        job_id: jobId,
        applicant_id: user.id,
        status: 'pending',
        cover_letter: coverLetter,
        resume_url: resumeUrl,
        date_applied: new Date().toISOString()
      }).select('id').single();
      
      if (error) throw error;
      
      toast.success('Application submitted successfully!');
      fetchApplications(); // Refresh the list
      return data.id;
    } catch (err: any) {
      console.error('Error applying for job:', err);
      uiToast({
        title: "Application Failed",
        description: err.message || "There was an error submitting your application",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateApplicationStatus = async (applicationId: string, newStatus: ApplicationStatus, notes?: string) => {
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
      fetchApplications(); // Refresh the list
      return true;
    } catch (err: any) {
      console.error('Error updating application:', err);
      uiToast({
        title: "Update Failed",
        description: err.message || "There was an error updating the application status",
        variant: "destructive"
      });
      return false;
    }
  };

  const withdrawApplication = async (applicationId: string) => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', applicationId)
        .eq('applicant_id', user.id); // Safety check - only delete own applications
      
      if (error) throw error;
      
      toast.success('Application withdrawn successfully');
      fetchApplications(); // Refresh the list
      return true;
    } catch (err: any) {
      console.error('Error withdrawing application:', err);
      uiToast({
        title: "Action Failed",
        description: err.message || "There was an error withdrawing your application",
        variant: "destructive"
      });
      return false;
    }
  };

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
    applyForJob,
    updateApplicationStatus,
    withdrawApplication,
    refreshApplications: fetchApplications
  };
}
