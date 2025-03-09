
import React from 'react';
import { useJobSearch, JobSearchParams } from '@/hooks/useJobSearch';
import JobListHeader from './JobListHeader';
import JobListContent from './JobListContent';
import JobListEmptyState from './JobListEmptyState';
import JobListLoading from './JobListLoading';
import JobListPagination from './JobListPagination';

interface JobListProps {
  searchParams: JobSearchParams;
  showHeader?: boolean;
  showSearch?: boolean;
  showFilters?: boolean;
  emptyStateMessage?: string;
  className?: string;
}

const JobList: React.FC<JobListProps> = ({
  searchParams,
  showHeader = true,
  showSearch = true,
  showFilters = true,
  emptyStateMessage = "No jobs found matching your search criteria.",
  className = "",
}) => {
  const {
    jobs,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalJobs,
    setPage,
    refreshJobs
  } = useJobSearch(searchParams);

  return (
    <div className={`job-list-container space-y-4 ${className}`}>
      {showHeader && (
        <JobListHeader 
          totalJobs={totalJobs} 
          showSearch={showSearch} 
          showFilters={showFilters}
          onRefresh={refreshJobs}
          country={searchParams.country}
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
          country={searchParams.country}
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
