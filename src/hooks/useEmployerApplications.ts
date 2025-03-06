
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { JobApplication, ApplicationStatus } from '@/types/application';
import { mockJobs } from '@/data/mockJobs';
import { currentUserProfile } from '@/utils/recommendationAlgorithm';

// Mock data for job applications
const mockApplications: JobApplication[] = [
  {
    id: 'app-1',
    jobId: '1',
    job: mockJobs[0],
    applicantId: 'user2',
    applicant: {
      id: 'user2',
      name: 'Sarah Thompson',
      skills: ['security', 'risk management', 'leadership', 'project management'],
      militaryBackground: {
        branch: 'Canadian Army',
        rank: 'Captain',
        yearsOfService: 10,
        mosCodes: ['00213', '00161'],
      },
      securityClearance: 'Secret',
      preferredLocations: ['Ottawa, ON', 'Toronto, ON']
    },
    appliedDate: '2023-10-15T14:30:00Z',
    status: 'reviewing',
    resume: 'sarah-thompson-resume.pdf',
    coverLetter: 'I believe my experience in military security operations makes me an ideal candidate...',
    matchScore: 92
  },
  {
    id: 'app-2',
    jobId: '1',
    job: mockJobs[0],
    applicantId: 'user3',
    applicant: {
      id: 'user3',
      name: 'Michael Chen',
      skills: ['security', 'cybersecurity', 'leadership', 'risk assessment'],
      militaryBackground: {
        branch: 'Canadian Air Force',
        rank: 'Lieutenant',
        yearsOfService: 6,
        mosCodes: ['00214', '00158'],
      },
      securityClearance: 'Top Secret',
      preferredLocations: ['Ottawa, ON', 'Montreal, QC']
    },
    appliedDate: '2023-10-17T09:45:00Z',
    status: 'pending',
    resume: 'michael-chen-resume.pdf',
    matchScore: 85
  },
  {
    id: 'app-3',
    jobId: '2',
    job: mockJobs[1],
    applicantId: 'user4',
    applicant: {
      id: 'user4',
      name: 'Jessica Rodriguez',
      skills: ['logistics', 'supply chain', 'inventory management', 'leadership'],
      militaryBackground: {
        branch: 'Canadian Navy',
        rank: 'Petty Officer',
        yearsOfService: 8,
        mosCodes: ['00168', 'SUPPLY'],
      },
      preferredLocations: ['Halifax, NS', 'Victoria, BC']
    },
    appliedDate: '2023-10-14T11:20:00Z',
    status: 'interviewing',
    resume: 'jessica-rodriguez-resume.pdf',
    coverLetter: 'With my experience in military logistics and supply chain management...',
    matchScore: 95
  },
  {
    id: 'app-4',
    jobId: '4',
    job: mockJobs[3],
    applicantId: 'user5',
    applicant: {
      id: 'user5',
      name: 'David Wilson',
      skills: ['cybersecurity', 'network security', 'threat analysis', 'risk assessment'],
      militaryBackground: {
        branch: 'Canadian Army',
        rank: 'Warrant Officer',
        yearsOfService: 12,
        mosCodes: ['00271', '00378'],
      },
      securityClearance: 'Secret',
      preferredLocations: ['Toronto, ON', 'Ottawa, ON']
    },
    appliedDate: '2023-10-16T16:10:00Z',
    status: 'offered',
    resume: 'david-wilson-resume.pdf',
    coverLetter: 'My background in military intelligence and cybersecurity operations...',
    matchScore: 98
  },
  {
    id: 'app-5',
    jobId: '5',
    job: mockJobs[4],
    applicantId: 'user6',
    applicant: {
      id: 'user6',
      name: 'Emily Brown',
      skills: ['project management', 'leadership', 'budgeting', 'scheduling'],
      militaryBackground: {
        branch: 'Canadian Army',
        rank: 'Captain',
        yearsOfService: 7,
        mosCodes: ['00181', '00307'],
      },
      preferredLocations: ['Edmonton, AB', 'Calgary, AB']
    },
    appliedDate: '2023-10-12T10:05:00Z',
    status: 'hired',
    resume: 'emily-brown-resume.pdf',
    matchScore: 90
  },
  {
    id: 'app-6',
    jobId: '5',
    job: mockJobs[4],
    applicantId: 'user7',
    applicant: {
      id: 'user7',
      name: 'James Lee',
      skills: ['project management', 'construction', 'leadership'],
      militaryBackground: {
        branch: 'Canadian Army Reserve',
        rank: 'Sergeant',
        yearsOfService: 5,
        mosCodes: ['00171', '00306'],
      },
      preferredLocations: ['Calgary, AB', 'Edmonton, AB']
    },
    appliedDate: '2023-10-13T14:25:00Z',
    status: 'rejected',
    resume: 'james-lee-resume.pdf',
    matchScore: 72
  }
];

export function useEmployerApplications() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch all applications for the employer's jobs
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would be a Supabase query
        // For now, we'll simulate a network request with setTimeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setApplications(mockApplications);
        setError(null);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('Failed to load applications');
        toast({
          title: 'Error',
          description: 'Failed to load applications',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [toast]);

  // Update application status
  const updateApplicationStatus = async (applicationId: string, newStatus: ApplicationStatus) => {
    try {
      // In a real app, this would be a Supabase update
      // For now, we'll simulate a network request with setTimeout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setApplications(prevApplications => 
        prevApplications.map(app => 
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
      
      const application = applications.find(app => app.id === applicationId);
      
      toast({
        title: 'Status Updated',
        description: `${application?.applicant.name}'s application is now ${newStatus}`,
        variant: newStatus === 'rejected' ? 'destructive' : 'default',
      });
      
      return true;
    } catch (err) {
      console.error('Error updating application status:', err);
      toast({
        title: 'Error',
        description: 'Failed to update application status',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Send message to applicant
  const sendMessageToApplicant = async (applicationId: string, message: string) => {
    try {
      // In a real app, this would be a Supabase insert
      // For now, we'll simulate a network request with setTimeout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const application = applications.find(app => app.id === applicationId);
      
      toast({
        title: 'Message Sent',
        description: `Your message to ${application?.applicant.name} has been sent`,
      });
      
      return true;
    } catch (err) {
      console.error('Error sending message:', err);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    applications,
    loading,
    error,
    updateApplicationStatus,
    sendMessageToApplicant
  };
}
