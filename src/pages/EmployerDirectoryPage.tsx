
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Building, Search, MapPin, Briefcase } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import EmployerCard from '@/components/employer/EmployerCard';

const EmployerDirectoryPage: React.FC = () => {
  const [employers, setEmployers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [jobCounts, setJobCounts] = useState<Record<string, number>>({});
  
  useEffect(() => {
    fetchEmployers();
  }, []);
  
  const fetchEmployers = async () => {
    try {
      setIsLoading(true);
      
      // Only fetch approved employers
      const { data, error } = await supabase
        .from('employers')
        .select('*')
        .eq('vetting_status', 'Approved')
        .order('company_name');
      
      if (error) throw error;
      
      setEmployers(data || []);
      
      // Fetch job counts for each employer
      const employerIds = (data || []).map(emp => emp.id);
      if (employerIds.length > 0) {
        // Fetch jobs for these employers
        const { data: jobsData, error: jobsError } = await supabase
          .from('jobs')
          .select('employer_id, count')
          .eq('status', 'Open')
          .in('employer_id', employerIds)
          .group('employer_id');
          
        if (jobsError) throw jobsError;
        
        // Create a map of employer_id to job count
        const jobCountMap: Record<string, number> = {};
        jobsData?.forEach((item: any) => {
          jobCountMap[item.employer_id] = item.count;
        });
        
        setJobCounts(jobCountMap);
      }
    } catch (error) {
      console.error('Error fetching employers:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const filteredEmployers = employers.filter(employer => {
    const query = searchQuery.toLowerCase();
    return (
      employer.company_name.toLowerCase().includes(query) ||
      (employer.industry && employer.industry.toLowerCase().includes(query)) ||
      (employer.location && employer.location.toLowerCase().includes(query)) ||
      (employer.company_description && employer.company_description.toLowerCase().includes(query))
    );
  });
  
  return (
    <div className="container py-8">
      <Helmet>
        <title>Employer Directory - Veteran Career Compass</title>
      </Helmet>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Building className="mr-2 h-8 w-8" />
            Employer Directory
          </h1>
          <p className="text-gray-600 mt-2">
            Explore verified employers with opportunities for veterans
          </p>
        </div>
        
        <div className="w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9 w-full md:w-64"
              placeholder="Search employers..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse">
              <Skeleton className="h-52 w-full rounded-lg" />
            </div>
          ))}
        </div>
      ) : filteredEmployers.length === 0 ? (
        <div className="text-center py-12">
          <Building className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold">No employers found</h2>
          <p className="text-gray-600 mt-2">
            {searchQuery 
              ? `No employers match your search "${searchQuery}"`
              : "There are no approved employers in the directory yet"}
          </p>
          {searchQuery && (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setSearchQuery('')}
            >
              Clear Search
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="text-sm text-gray-500 mb-4">
            {filteredEmployers.length} employer{filteredEmployers.length !== 1 ? 's' : ''} found
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployers.map((employer) => (
              <EmployerCard
                key={employer.id}
                id={employer.id}
                companyName={employer.company_name}
                industry={employer.industry}
                location={employer.location}
                companySize={employer.company_size}
                logoUrl={employer.company_logo_url}
                description={employer.company_description || ''}
                jobCount={jobCounts[employer.id] || 0}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default EmployerDirectoryPage;
