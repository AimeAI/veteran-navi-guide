
import { Job } from "@/context/JobContext";
import { UserProfile } from "@/utils/recommendationAlgorithm";

export type ApplicationStatus = 'pending' | 'reviewing' | 'interviewing' | 'offered' | 'hired' | 'rejected';

export type UserRole = 'veteran' | 'employer' | 'admin';

export interface JobApplication {
  id: string;
  jobId: string;
  job: Job;
  applicantId: string;
  applicant: UserProfile;
  appliedDate: string;
  status: ApplicationStatus;
  resume?: string;
  coverLetter?: string;
  notes?: string;
  matchScore?: number;
}

export interface MessageToApplicant {
  id: string;
  applicationId: string;
  message: string;
  sentDate: string;
  read: boolean;
}

export interface EmployerProfile {
  id: string;
  companyName: string;
  industry: string;
  companySize: string;
  location: string;
  website?: string;
  description: string;
  contactEmail: string;
  contactPhone?: string;
  logo?: string;
  isVerified: boolean;
}
