
import { UserProfile } from './types';

// Mock current user profile for testing
export const currentUserProfile: UserProfile = {
  id: 'usr-123',
  email: 'veteran@example.com',
  firstName: 'John',
  lastName: 'Doe',
  militaryBranch: 'Army',
  rank: 'E-5 Sergeant',
  mosId: '11B',
  securityClearance: 'Secret',
  skills: [
    'Leadership',
    'Project Management',
    'Logistics',
    'Security Operations',
    'Communication',
    'Team Building',
    'Problem Solving'
  ],
  jobPreferences: {
    locations: ['Toronto, ON', 'Remote'],
    remote: true,
    industry: ['Technology', 'Defense', 'Security'],
    jobType: ['Full-time', 'Contract']
  }
};
