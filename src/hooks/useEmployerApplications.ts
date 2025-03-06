
import { useState } from 'react';
import { JobApplication, ApplicationStatus, MessageToApplicant } from '@/types/application';
import { toast } from 'sonner';
import { Job } from '@/context/JobContext';
import { mockJobs } from '@/data/mockJobs';
import { currentUserProfile } from '@/utils/recommendationAlgorithm';

// Mock data for job applications
const mockApplications: JobApplication[] = [
  {
    id: 'app-1',
    jobId: '1',
    job: {
      id: '1',
      title: 'Security Operations Manager',
      company: 'TechDefense Solutions',
      location: 'Ottawa, ON',
      description: 'Seeking a veteran with security background to lead our operations team.',
      category: 'Security',
      salaryRange: '$80,000 - $100,000',
      clearanceLevel: 'Secret',
      mosCode: ['00161'],
      requiredSkills: ['leadership', 'security', 'risk assessment'],
      preferredSkills: ['project management', 'communication'],
      remote: false,
      jobType: 'full-time',
    },
    applicantId: 'user1',
    applicant: currentUserProfile,
    appliedDate: '2023-05-15',
    status: 'reviewing',
    resume: 'resume-john-doe.pdf',
    coverLetter: 'cover-letter-john-doe.pdf',
    matchScore: 92
  },
  {
    id: 'app-2',
    jobId: '2',
    job: {
      id: '2',
      title: 'Logistics Coordinator',
      company: 'Canadian Supply Chain Inc.',
      location: 'Halifax, NS',
      description: 'Perfect for veterans with logistics MOSID.',
      category: 'Logistics',
      salaryRange: '$65,000 - $80,000',
      clearanceLevel: 'None',
      mosCode: ['00168'],
      requiredSkills: ['logistics', 'inventory management', 'supply chain'],
      preferredSkills: ['leadership', 'communication'],
      remote: false,
      jobType: 'full-time'
    },
    applicantId: 'user2',
    applicant: {
      ...currentUserProfile,
      id: 'user2',
      name: 'Maria Rodriguez',
      skills: ['logistics', 'inventory management', 'leadership'],
    },
    appliedDate: '2023-05-18',
    status: 'pending',
    resume: 'resume-maria-rodriguez.pdf',
    matchScore: 85
  },
  {
    id: 'app-3',
    jobId: '3',
    job: {
      id: '3',
      title: 'Healthcare Administrator',
      company: 'Veterans Medical Centre',
      location: 'Remote - Canada',
      description: 'Join our team dedicated to improving healthcare for veterans.',
      category: 'Healthcare',
      salaryRange: '$70,000 - $90,000',
      clearanceLevel: 'None',
      mosCode: [],
      requiredSkills: ['healthcare', 'administration', 'organization'],
      preferredSkills: ['leadership', 'project management'],
      remote: true,
      jobType: 'full-time'
    },
    applicantId: 'user3',
    applicant: {
      ...currentUserProfile,
      id: 'user3',
      name: 'David Washington',
      skills: ['healthcare', 'administration', 'project management'],
    },
    appliedDate: '2023-05-21',
    status: 'interviewing',
    resume: 'resume-david-washington.pdf',
    coverLetter: 'cover-letter-david-washington.pdf',
    matchScore: 95
  },
  {
    id: 'app-4',
    jobId: '4',
    job: {
      id: '4',
      title: 'Cybersecurity Analyst',
      company: 'DefenceNet Systems',
      location: 'Toronto, ON',
      description: 'Ideal for veterans with intelligence or cybersecurity background.',
      category: 'Information Technology',
      salaryRange: '$75,000 - $95,000',
      clearanceLevel: 'Secret',
      mosCode: ['00271'],
      requiredSkills: ['cybersecurity', 'network security', 'incident response'],
      preferredSkills: ['communication', 'risk assessment'],
      remote: false,
      jobType: 'full-time'
    },
    applicantId: 'user4',
    applicant: {
      ...currentUserProfile,
      id: 'user4',
      name: 'Sarah Johnson',
      skills: ['cybersecurity', 'risk assessment', 'network security'],
    },
    appliedDate: '2023-05-25',
    status: 'hired',
    resume: 'resume-sarah-johnson.pdf',
    coverLetter: 'cover-letter-sarah-johnson.pdf',
    matchScore: 98
  },
  {
    id: 'app-5',
    jobId: '5',
    job: {
      id: '5',
      title: 'Project Manager',
      company: 'Veterans Construction Group',
      location: 'Edmonton, AB',
      description: 'Looking for veterans with leadership experience.',
      category: 'Construction',
      salaryRange: '$85,000 - $110,000',
      clearanceLevel: 'None',
      mosCode: [],
      requiredSkills: ['project management', 'leadership', 'organization'],
      preferredSkills: ['communication', 'budgeting'],
      remote: false,
      jobType: 'contract'
    },
    applicantId: 'user5',
    applicant: {
      ...currentUserProfile,
      id: 'user5',
      name: 'Michael Chen',
      skills: ['organization', 'communication', 'budgeting'],
    },
    appliedDate: '2023-05-28',
    status: 'rejected',
    resume: 'resume-michael-chen.pdf',
    matchScore: 72
  }
];

// Mock data for messages
const mockMessages: MessageToApplicant[] = [
  {
    id: 'msg-1',
    applicationId: 'app-3',
    message: 'Thank you for your application. We would like to schedule an interview with you next week.',
    sentDate: '2023-05-23',
    read: true
  },
  {
    id: 'msg-2',
    applicationId: 'app-4',
    message: 'Congratulations! We are pleased to offer you the position of Cybersecurity Analyst.',
    sentDate: '2023-05-26',
    read: false
  }
];

export interface EmployerApplicationsFilters {
  searchQuery: string;
  statusFilter: ApplicationStatus | 'all';
  jobTitleFilter: string;
}

export function useEmployerApplications() {
  const [applications, setApplications] = useState<JobApplication[]>(mockApplications);
  const [messages, setMessages] = useState<MessageToApplicant[]>(mockMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchApplications = async (filters?: EmployerApplicationsFilters) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let filtered = [...mockApplications];
      
      if (filters) {
        const { searchQuery, statusFilter, jobTitleFilter } = filters;
        
        if (searchQuery) {
          filtered = filtered.filter(app => 
            app.applicant.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        
        if (statusFilter !== 'all') {
          filtered = filtered.filter(app => app.status === statusFilter);
        }
        
        if (jobTitleFilter) {
          filtered = filtered.filter(app => 
            app.job.title.toLowerCase().includes(jobTitleFilter.toLowerCase())
          );
        }
      }
      
      setApplications(filtered);
      return filtered;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred fetching applications';
      setError(errorMessage);
      console.error('Error fetching applications:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateApplicationStatus = async (applicationId: string, newStatus: ApplicationStatus) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setApplications(prev => prev.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));
      
      toast.success(`Application status updated to ${newStatus}`);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred updating status';
      setError(errorMessage);
      console.error('Error updating application status:', err);
      toast.error('Failed to update application status');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const sendMessageToApplicant = async (applicationId: string, message: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newMessage: MessageToApplicant = {
        id: `msg-${Date.now()}`,
        applicationId,
        message,
        sentDate: new Date().toISOString(),
        read: false
      };
      
      setMessages(prev => [...prev, newMessage]);
      toast.success('Message sent to applicant');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred sending message';
      setError(errorMessage);
      console.error('Error sending message:', err);
      toast.error('Failed to send message');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    applications,
    messages,
    isLoading,
    error,
    fetchApplications,
    updateApplicationStatus,
    sendMessageToApplicant
  };
}
