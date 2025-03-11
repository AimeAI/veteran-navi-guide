
import { JobFilterState } from '../types/job';

// Default filter state
export const defaultFilters: JobFilterState = {
  keywords: '',
  location: '',
  mosCodes: undefined,
  clearanceLevel: undefined,
  remote: false,
  militarySkills: undefined,
  radius: 50,
  industry: '',
  experienceLevel: '',
  educationLevel: '',
  jobType: '',
  companySize: '',
  companyRating: undefined,
  benefits: undefined,
  country: 'canada',
  useJobicy: false,
  skills: undefined,
  category: '',
  salaryRange: '',
};

// Mock API call for jobs
export const fetchMockJobs = (): Promise<any[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockJobs = [
        {
          id: '1',
          title: 'Software Engineer',
          company: 'TechCorp',
          location: 'Toronto, Canada',
          description: 'Looking for an experienced software engineer...',
          category: 'technology',
          salaryRange: 'range4',
          clearanceLevel: 'none',
          mosCode: '',
          requiredSkills: ['JavaScript', 'React', 'Node.js'],
          preferredSkills: ['TypeScript', 'AWS'],
          remote: false,
          jobType: 'fulltime',
          date: new Date().toISOString(),
          industry: 'technology',
          experienceLevel: 'mid',
          educationLevel: 'bachelors',
        },
        {
          id: '2',
          title: 'Project Manager',
          company: 'Management Solutions',
          location: 'Vancouver, Canada',
          description: 'Seeking a project manager with experience in...',
          category: 'management',
          salaryRange: 'range4',
          clearanceLevel: 'none',
          mosCode: '',
          requiredSkills: ['Project Management', 'Agile', 'Scrum'],
          preferredSkills: ['PMP Certification', 'Jira'],
          remote: false,
          jobType: 'fulltime',
          date: new Date().toISOString(),
          industry: 'management',
          experienceLevel: 'senior',
          educationLevel: 'masters',
        },
      ];
      resolve(mockJobs);
    }, 1000);
  });
};
