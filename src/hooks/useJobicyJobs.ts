
import { useState, useEffect } from 'react';
import { Job } from '@/types/job';
import { supabase } from '@/integrations/supabase/client';
import { parseJobicyRss } from '@/utils/jobicyRssParser';

const useJobicyJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        
        // In development mode, use mock data or fetch directly
        console.log('DEV MODE: Using mock Jobicy jobs');
        const mockJobs: Job[] = Array.from({ length: 15 }, (_, index) => ({
          id: `jobicy-${index}`,
          title: `Jobicy Mock Job ${index + 1}`,
          company: `Jobicy Employer ${Math.floor(index / 3) + 1}`,
          location: ['Remote', 'New York, NY', 'San Francisco, CA'][index % 3],
          description: `This is a mock Jobicy job description for testing purposes. This would contain details about the job requirements and responsibilities.`,
          category: ['Technology', 'Development'][index % 2],
          salaryRange: `$${70 + index * 5}k - $${90 + index * 5}k`,
          remote: [true, false][index % 2],
          clearanceLevel: ['None', 'Secret', 'Top Secret'][index % 3],
          mosCode: `MOS-${index % 5}`,
          requiredSkills: ['JavaScript', 'React', 'Node.js'].slice(0, (index % 3) + 1),
          preferredSkills: ['TypeScript', 'AWS', 'Docker'].slice(0, (index % 3) + 1),
          jobType: ['full-time', 'part-time', 'contract'][index % 3],
          date: new Date(Date.now() - index * 86400000).toISOString(),
          url: 'https://example.com/apply',
          industry: ['Technology', 'Healthcare', 'Finance'][index % 3],
          experienceLevel: ['Entry Level', 'Mid Level', 'Senior Level'][index % 3],
          educationLevel: ["Bachelor's Degree", "Master's Degree", "High School"][index % 3],
          source: 'Jobicy'
        }));
        
        setJobs(mockJobs);

        /* Real implementation commented out during development
        const { data, error } = await supabase.functions.invoke('jobicy-feed-fetcher');

        if (error) {
          throw new Error(error.message);
        }

        if (data) {
          const parsedJobs = await parseJobicyRss(data.feedContent);
          // Ensure the parsedJobs match the Job type
          setJobs(parsedJobs);
        }
        */
        
      } catch (err) {
        console.error('Error fetching Jobicy jobs:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return { jobs, isLoading, error };
};

export default useJobicyJobs;
