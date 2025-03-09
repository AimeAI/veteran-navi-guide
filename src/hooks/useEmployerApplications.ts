
import { useState, useEffect } from 'react';

// Import the Job interface from JobContext
import { Job } from '@/context/JobContext';

export const useEmployerApplications = () => {
  const [applications, setApplications] = useState<{job: Job, applicants: any[]}[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to get applications
    setTimeout(() => {
      const mockApplications = [
        {
          job: {
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
          applicants: [
            { id: '101', name: 'John Smith', experience: '5 years', status: 'pending' },
            { id: '102', name: 'Sara Johnson', experience: '7 years', status: 'reviewed' }
          ]
        },
        {
          job: {
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
          applicants: [
            { id: '103', name: 'Michael Brown', experience: '8 years', status: 'interviewed' },
            { id: '104', name: 'Emily Davis', experience: '6 years', status: 'pending' },
            { id: '105', name: 'David Wilson', experience: '4 years', status: 'rejected' }
          ]
        },
        {
          job: {
            id: '3',
            title: 'UX Designer',
            company: 'Creative Designs',
            location: 'Remote',
            description: 'Join our team as a UX Designer...',
            category: 'design',
            salaryRange: 'range3',
            clearanceLevel: 'none',
            mosCode: '',
            requiredSkills: ['Figma', 'UI/UX', 'User Research'],
            preferredSkills: ['Adobe XD', 'Prototyping'],
            remote: true,
            jobType: 'fulltime',
            date: new Date().toISOString(),
            industry: 'creative',
            experienceLevel: 'mid',
            educationLevel: 'bachelors',
          },
          applicants: [
            { id: '106', name: 'Jessica Taylor', experience: '3 years', status: 'pending' }
          ]
        },
        {
          job: {
            id: '4',
            title: 'Marketing Specialist',
            company: 'Global Marketing',
            location: 'Montreal, Canada',
            description: 'We are looking for a marketing specialist...',
            category: 'marketing',
            salaryRange: 'range3',
            clearanceLevel: 'none',
            mosCode: '',
            requiredSkills: ['Digital Marketing', 'Social Media', 'Content Creation'],
            preferredSkills: ['Google Analytics', 'SEO'],
            remote: false,
            jobType: 'fulltime',
            date: new Date().toISOString(),
            industry: 'marketing',
            experienceLevel: 'junior',
            educationLevel: 'bachelors',
          },
          applicants: [
            { id: '107', name: 'Andrew Clark', experience: '2 years', status: 'reviewed' },
            { id: '108', name: 'Laura Walker', experience: '4 years', status: 'pending' }
          ]
        },
        {
          job: {
            id: '5',
            title: 'Data Analyst',
            company: 'Data Insights',
            location: 'Ottawa, Canada',
            description: 'Data analyst position available...',
            category: 'data',
            salaryRange: 'range3',
            clearanceLevel: 'none',
            mosCode: '',
            requiredSkills: ['SQL', 'Python', 'Data Visualization'],
            preferredSkills: ['R', 'Tableau'],
            remote: false,
            jobType: 'fulltime',
            date: new Date().toISOString(),
            industry: 'technology',
            experienceLevel: 'mid',
            educationLevel: 'bachelors',
          },
          applicants: [
            { id: '109', name: 'Daniel Lee', experience: '3 years', status: 'interviewed' },
            { id: '110', name: 'Sophia Chen', experience: '5 years', status: 'pending' }
          ]
        }
      ];
      
      setApplications(mockApplications);
      setIsLoading(false);
    }, 1500);
  }, []);

  return { applications, isLoading };
};
