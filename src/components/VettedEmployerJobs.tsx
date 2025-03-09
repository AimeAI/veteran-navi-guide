
import React, { useState, useEffect } from 'react';
import { Shield, Briefcase, Building, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import JobListing from './JobListing';
import { Job } from '@/context/JobContext';
import { toast } from 'sonner';

const VettedEmployerJobs: React.FC = () => {
  const { t } = useTranslation();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [employers, setEmployers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    async function fetchVettedJobs() {
      setIsLoading(true);
      try {
        // First fetch approved employers
        const { data: employersData, error: employersError } = await supabase
          .from('employers')
          .select('*')
          .eq('vetting_status', 'Approved');
          
        if (employersError) throw employersError;
        setEmployers(employersData || []);
        
        if (employersData && employersData.length > 0) {
          // Get jobs from approved employers
          const employerIds = employersData.map(emp => emp.id);
          const { data: jobsData, error: jobsError } = await supabase
            .from('jobs')
            .select('*')
            .eq('status', 'Open')
            .in('employer_id', employerIds);
            
          if (jobsError) throw jobsError;
          
          // Transform to match Job interface
          const formattedJobs: Job[] = (jobsData || []).map(job => ({
            id: job.id,
            title: job.title,
            company: job.company,
            location: job.location,
            description: job.description,
            category: job.job_type || 'other', // Map job_type to category
            salaryRange: job.salary_range || '',
            remote: false, // Default to false since remote isn't in the schema
            clearanceLevel: 'none', // Default value
            mosCode: '', // Default value
            requiredSkills: job.required_skills || [],
            preferredSkills: job.requirements || [], // Map requirements to preferredSkills
            date: job.created_at,
            jobType: job.job_type || 'Full-time',
            industry: 'other', // Default value
            experienceLevel: '', // Default value
            educationLevel: '', // Default value
            source: 'vetted',
            url: job.application_url,
          }));
          
          setJobs(formattedJobs);
        }
      } catch (err) {
        console.error('Error fetching vetted jobs:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch vetted jobs'));
        toast.error('Failed to load vetted employer jobs');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchVettedJobs();
  }, []);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>{t('Vetted Employer Jobs')}</CardTitle>
          </div>
          <CardDescription>
            {t('Jobs from employers who have been vetted and approved by our team')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              {t('Verified Employers')}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Building className="h-3 w-3" />
              {employers.length} {t('Employers')}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Briefcase className="h-3 w-3" />
              {jobs.length} {t('Jobs')}
            </Badge>
          </div>
          
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse p-4 border rounded-lg">
                  <Skeleton className="h-6 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-1/3 mb-2" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">
              <p>{t('Error loading vetted jobs')}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 text-primary underline"
              >
                {t('Try again')}
              </button>
            </div>
          ) : jobs.length === 0 ? (
            <div className="p-6 text-center border rounded-lg bg-gray-50">
              <Building className="mx-auto h-12 w-12 text-gray-400 mb-2" />
              <h3 className="text-lg font-medium">{t('No vetted jobs available')}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {t('Check back soon for jobs from our verified employers')}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map(job => (
                <JobListing 
                  key={job.id}
                  jobId={job.id}
                  title={job.title}
                  company={job.company}
                  location={job.location}
                  description={job.description}
                  source="vetted"
                  url={job.url}
                  date={job.date}
                  matchScore={100} // Giving high match for vetted jobs
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VettedEmployerJobs;
