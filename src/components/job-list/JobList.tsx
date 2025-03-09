
import React, { useState } from 'react';
import { Job } from '@/context/JobContext';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

import JobListHeader from './JobListHeader';
import JobListContent from './JobListContent';
import JobListPagination from './JobListPagination';
import JobListLoading from './JobListLoading';
import JobListEmptyState from './JobListEmptyState';

interface JobListProps {
  jobs: Job[];
  isLoading: boolean;
  error: Error | null;
  currentPage: number;
  totalPages: number;
  totalJobs: number;
  onPageChange: (page: number) => void;
  country?: "us" | "canada";
  onRefresh?: () => Promise<void>;
}

const JobList: React.FC<JobListProps> = ({
  jobs,
  isLoading,
  error,
  currentPage,
  totalPages,
  totalJobs,
  onPageChange,
  country = "canada",
  onRefresh,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRetry = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      toast.info("Refreshing job listings...");
      try {
        await onRefresh();
        toast.success("Job listings refreshed successfully");
      } catch (error) {
        toast.error("Failed to refresh job listings");
      } finally {
        setIsRefreshing(false);
      }
    } else {
      onPageChange(currentPage); // This will trigger a refresh
    }
  };

  const jobsBySource = jobs.reduce((acc, job) => {
    const source = job.source || 'other';
    if (!acc[source]) {
      acc[source] = [];
    }
    acc[source].push(job);
    return acc;
  }, {} as Record<string, Job[]>);

  const jobBankCount = jobsBySource['jobbank']?.length || 0;
  const indeedCount = jobsBySource['indeed']?.length || 0;
  const linkedinCount = jobsBySource['linkedin']?.length || 0;

  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message || 'Failed to load jobs'}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <JobListHeader 
        totalJobs={totalJobs}
        country={country}
        isRefreshing={isRefreshing}
        isLoading={isLoading}
        jobBankCount={jobBankCount}
        indeedCount={indeedCount}
        linkedinCount={linkedinCount}
        onRefresh={onRefresh ? handleRetry : undefined}
      />
      
      {isLoading ? (
        <JobListLoading />
      ) : jobs.length > 0 ? (
        <>
          <JobListContent jobs={jobs} />
          <JobListPagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </>
      ) : (
        <JobListEmptyState 
          country={country} 
          onRetry={handleRetry} 
        />
      )}
    </div>
  );
};

export default JobList;
