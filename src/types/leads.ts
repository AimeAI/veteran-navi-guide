
export interface EmployerLead {
  id: string;
  company_name: string;
  website_url: string;
  linkedin_url?: string;
  lead_status: LeadStatus;
  notes?: string;
  date_added: string;
  updated_at: string;
}

export type LeadStatus = 'New' | 'Contacted' | 'Meeting Scheduled' | 'Onboarded' | 'Rejected';

export const LEAD_STATUS_OPTIONS: LeadStatus[] = [
  'New',
  'Contacted',
  'Meeting Scheduled',
  'Onboarded',
  'Rejected'
];
