
import { useState, useEffect } from 'react';
import { Job } from '@/types/job';
import { supabase } from '@/integrations/supabase/client';
import { parseJobicyRssFeed } from '@/utils/jobicyRssParser';

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
          company_name: `Jobicy Employer ${Math.floor(index / 3) + 1}`,
          location: ['Remote', 'New York, NY', 'San Francisco, CA'][index % 3],
          job_type: ['Full-time', 'Part-time', 'Contract'][index % 3],
          salary_range: `$${70 + index * 5}k - $${90 + index * 5}k`,
          description: `This is a mock Jobicy job description for testing purposes. This would contain details about the job requirements and responsibilities.`,
          requirements: `Bachelor's degree in related field. ${2 + (index % 5)} years of experience required.`,
          posted_date: new Date(Date.now() - index * 86400000).toISOString(),
          application_url: 'https://example.com/apply',
          company_logo: '/placeholder.svg',
          skills: ['JavaScript', 'React', 'Node.js'].slice(0, (index % 3) + 1),
          categories: ['Technology', 'Development'],
          employment_type: ['Full-time', 'Part-time', 'Contract'][index % 3],
          experience_level: ['Entry Level', 'Mid Level', 'Senior Level'][index % 3],
          source: 'Jobicy'
        }));
        
        setJobs(mockJobs);

        /* Real implementation commented out during development
        const { data, error } = await supabase.functions.invoke('jobicy-feed-fetcher');

        if (error) {
          throw new Error(error.message);
        }

        if (data) {
          const parsedJobs = parseJobicyRssFeed(data.feedContent);
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
