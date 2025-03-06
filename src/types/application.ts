
export type ApplicationStatus = 'pending' | 'reviewing' | 'interviewing' | 'hired' | 'rejected';

export interface Application {
  id: string;
  applicantName: string;
  applicantPhoto?: string;
  jobTitle: string;
  company: string;
  appliedDate: Date;
  status: ApplicationStatus;
  resume?: string;
  coverLetter?: boolean;
  matchScore?: number;
}
