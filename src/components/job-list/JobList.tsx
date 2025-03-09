
import React from 'react';
import { useJobSearch, JobSearchParams } from '@/hooks/useJobSearch';
import JobListHeader from './JobListHeader';
import JobListContent from './JobListContent';
import JobListEmptyState from './JobListEmptyState';
import JobListLoading from './JobListLoading';
import JobListPagination from './JobListPagination';
import { Job } from '@/context/JobContext';

interface JobListProps {
  searchParams?: JobSearchParams;
  showHeader?: boolean;
  showSearch?: boolean;
  showFilters?: boolean;
  emptyStateMessage?: string;
  className?: string;
  
  // Direct props (alternative to searchParams)
  jobs?: Job[];
  isLoading?: boolean;
  error?: Error | null;
  currentPage?: number;
  totalPages?: number;
  totalJobs?: number;
  onPageChange?: (page: number) => void;
  country?: "us" | "canada";
  onRefresh?: () => Promise<void>;
}

const JobList: React.FC<JobListProps> = ({
  searchParams,
  showHeader = true,
  showSearch = true,
  showFilters = true,
  emptyStateMessage = "No jobs found matching your search criteria.",
  className = "",
  
  // Direct props
  jobs: propJobs,
  isLoading: propIsLoading,
  error: propError,
  currentPage: propCurrentPage,
  totalPages: propTotalPages,
  totalJobs: propTotalJobs,
  onPageChange: propOnPageChange,
  country,
  onRefresh: propOnRefresh
}) => {
  // Use hook if searchParams is provided, otherwise use direct props
  const hookResult = searchParams ? useJobSearch(searchParams) : null;
  
  // Determine which values to use (from hook or from props)
  const jobs = hookResult ? hookResult.jobs : (propJobs || []);
  const isLoading = hookResult ? hookResult.isLoading : (propIsLoading || false);
  const error = hookResult ? hookResult.error : propError;
  const currentPage = hookResult ? hookResult.currentPage : (propCurrentPage || 1);
  const totalPages = hookResult ? hookResult.totalPages : (propTotalPages || 0);
  const totalJobs = hookResult ? hookResult.totalJobs : (propTotalJobs || 0);
  const setPage = hookResult ? hookResult.setPage : (propOnPageChange || (() => {}));
  const refreshJobs = hookResult ? hookResult.refreshJobs : (propOnRefresh || (() => Promise.resolve()));
  
  // Determine country
  const displayCountry = country || (searchParams?.country || "canada");

  return (
    <div className={`job-list-container space-y-4 ${className}`}>
      {showHeader && (
        <JobListHeader 
          totalJobs={totalJobs} 
          showSearch={showSearch} 
          showFilters={showFilters}
          onRefresh={refreshJobs}
          country={displayCountry}
          isLoading={isLoading}
          isRefreshing={false}
          jobBankCount={jobs.filter(job => job.source === 'jobbank').length}
          indeedCount={jobs.filter(job => job.source === 'indeed').length}
          linkedinCount={jobs.filter(job => job.source === 'linkedin').length}
        />
      )}

      {isLoading ? (
        <JobListLoading />
      ) : error ? (
        <div className="py-12 text-center">
          <p className="text-red-500 mb-2">Error loading jobs</p>
          <p className="text-gray-600">{error.message}</p>
          <button 
            onClick={refreshJobs}
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      ) : jobs.length === 0 ? (
        <JobListEmptyState 
          message={emptyStateMessage} 
          country={displayCountry}
          onRetry={refreshJobs}
        />
      ) : (
        <>
          <JobListContent jobs={jobs} />
          
          {totalPages > 1 && (
            <JobListPagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={setPage} 
            />
          )}
        </>
      )}
    </div>
  );
};

export default JobList;
