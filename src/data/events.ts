/**
 * Canadian Veteran Job Fair & Career Event Resources
 * Real organizations and platforms that host job fairs for veterans
 */

import { JobFairEvent } from '../types/event';

// Real Canadian veteran job fair resources and organizations
export interface JobFairResource {
  id: string;
  name: string;
  description: string;
  website: string;
  type: 'job-board' | 'organization' | 'government' | 'event-platform';
  tags: string[];
}

export const jobFairResources: JobFairResource[] = [
  {
    id: 'caf-transition',
    name: 'Canadian Armed Forces Transition Services',
    description: 'Official CAF transition support including career fairs, employment counseling, and job placement assistance for transitioning military members.',
    website: 'https://www.canada.ca/en/department-national-defence/services/benefits-military/transition.html',
    type: 'government',
    tags: ['Official', 'Government', 'Career Support']
  },
  {
    id: 'vac-careers',
    name: 'Veterans Affairs Canada - Career Services',
    description: 'Employment assistance and career transition programs specifically for Canadian Veterans, including job fairs and employer connections.',
    website: 'https://www.veterans.gc.ca/eng/services/transition/career-transition',
    type: 'government',
    tags: ['Official', 'Government', 'Career Support']
  },
  {
    id: 'helmets-to-hardhats',
    name: 'Helmets to Hardhats Canada',
    description: 'Connects military members, Veterans and Reservists with career opportunities in Canada\'s construction industry through apprenticeships and job fairs.',
    website: 'https://www.helmetstohardhats.ca',
    type: 'organization',
    tags: ['Construction', 'Trades', 'Apprenticeships']
  },
  {
    id: 'canadian-veterans-network',
    name: 'Canadian Veterans Network',
    description: 'Non-profit organization hosting career events, networking opportunities, and employment resources for Veterans across Canada.',
    website: 'https://canadianveteransnetwork.ca',
    type: 'organization',
    tags: ['Networking', 'Events', 'Support']
  },
  {
    id: 'veteran-hiring',
    name: 'Hire a Veteran',
    description: 'Platform connecting Canadian employers with military Veterans, including virtual and in-person job fair events.',
    website: 'https://hireaveteran.ca',
    type: 'job-board',
    tags: ['Job Board', 'Events', 'Employer Connections']
  },
  {
    id: 'indeed-military',
    name: 'Indeed - Military & Veteran Jobs Canada',
    description: 'Search for veteran-specific job fairs and career events across Canada on Indeed\'s dedicated military employment section.',
    website: 'https://ca.indeed.com/Military-Veteran-jobs',
    type: 'job-board',
    tags: ['Job Search', 'Major Platform', 'Events']
  },
  {
    id: 'linkedin-veterans',
    name: 'LinkedIn Military & Veterans',
    description: 'LinkedIn groups and events for Canadian military Veterans, including virtual career fairs and networking events.',
    website: 'https://www.linkedin.com/groups/Canadian-Armed-Forces',
    type: 'event-platform',
    tags: ['Networking', 'Professional', 'Virtual Events']
  },
  {
    id: 'canada-job-bank',
    name: 'Job Bank Canada - Veteran Services',
    description: 'Government of Canada\'s official job board with veteran-specific resources and information about career fairs.',
    website: 'https://www.jobbank.gc.ca',
    type: 'government',
    tags: ['Official', 'Government', 'Job Search']
  },
  {
    id: 'prince-operation-entrepreneur',
    name: 'The Prince\'s Operation Entrepreneur (Canada)',
    description: 'Supports military Veterans in their entrepreneurial journeys with events, mentorship, and networking opportunities.',
    website: 'https://www.operationentrepreneur.org',
    type: 'organization',
    tags: ['Entrepreneurship', 'Networking', 'Training']
  },
  {
    id: 'vets-canada',
    name: 'Vets Canada',
    description: 'Charity supporting homeless and at-risk Veterans with employment programs, job training, and career events.',
    website: 'https://vetscanada.org',
    type: 'organization',
    tags: ['Support Services', 'Employment Programs']
  },
  {
    id: 'legion-employment',
    name: 'Royal Canadian Legion - Employment Services',
    description: 'The Legion provides employment assistance, career counseling, and hosts job fairs for Veterans across Canada.',
    website: 'https://www.legion.ca/support-for-veterans/veterans-services',
    type: 'organization',
    tags: ['Support', 'Career Services', 'National']
  },
  {
    id: 'cfmws-jobs',
    name: 'CFMWS Employment Assistance',
    description: 'Canadian Forces Morale and Welfare Services employment support for military members and their families, including job fairs.',
    website: 'https://www.cafconnection.ca/National/Programs-Services/For-Military-Personnel/Employment-Assistance.aspx',
    type: 'government',
    tags: ['Official', 'Military Families', 'Career Support']
  }
];

// Empty array - no fake events, users should check the resources above
export const mockEvents: JobFairEvent[] = [];

// Return empty array - direct users to real resources instead
export const fetchEvents = async (): Promise<JobFairEvent[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockEvents;
};

// Filter events by status
export const getEventsByStatus = (status: 'upcoming' | 'ongoing' | 'past'): JobFairEvent[] => {
  return [];
};

// Get event by ID
export const getEventById = (id: string): JobFairEvent | undefined => {
  return undefined;
};