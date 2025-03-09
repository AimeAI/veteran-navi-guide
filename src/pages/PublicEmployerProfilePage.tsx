
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Building, ArrowLeft, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EmployerProfileView from '@/components/employer/EmployerProfileView';

const PublicEmployerProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState<any[]>([]);
  
  useEffect(() => {
    if (id) {
      fetchEmployerProfile();
    }
  }, [id]);
  
  const fetchEmployerProfile = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('employers')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      setProfile(data);
      
      // Also fetch jobs from this employer
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .eq('employer_id', id)
        .eq('status', 'Open')
        .order('created_at', { ascending: false });
        
      if (jobsError) throw jobsError;
      
      setJobs(jobsData || []);
    } catch (error) {
      console.error('Error fetching employer profile:', error);
      toast.error('Failed to load employer profile');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-gray-200 rounded mb-6"></div>
            <EmployerProfileView profile={{} as any} isLoading={true} />
          </div>
        </div>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="container py-12">
        <div className="max-w-4xl mx-auto text-center">
          <Building className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Employer Profile Not Found</h1>
          <p className="text-gray-600 mb-6">The employer profile you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/job-search">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Job Search
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <Helmet>
        <title>{profile.company_name} - Employer Profile - Veteran Career Compass</title>
      </Helmet>
      
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center">
            <Building className="mr-2 h-8 w-8" />
            Employer Profile
          </h1>
          
          <Button variant="outline" size="sm" asChild>
            <Link to="/job-search">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Job Search
            </Link>
          </Button>
        </div>
        
        <EmployerProfileView profile={profile} />
        
        {/* Show jobs from this employer */}
        {jobs.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Briefcase className="h-5 w-5 mr-2" />
              Open Positions at {profile.company_name}
            </h2>
            
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="border rounded-lg p-4 hover:border-primary hover:shadow-sm transition-all">
                  <Link to={`/jobs/${job.id}`} className="block">
                    <h3 className="text-lg font-semibold text-primary">{job.title}</h3>
                    <div className="text-sm text-gray-500 mt-1">
                      <span>{job.location}</span>
                      {job.job_type && (
                        <span className="ml-3 font-medium">
                          {job.job_type}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-gray-700 line-clamp-2">{job.description}</p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicEmployerProfilePage;
