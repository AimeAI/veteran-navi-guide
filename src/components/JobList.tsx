
import React from 'react';
import { Job } from '@/context/JobContext';
import JobListing from '@/components/JobListing';
import { Briefcase, AlertCircle, Globe } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface JobListProps {
  jobs: Job[];
  isLoading: boolean;
  error: Error | null;
  currentPage: number;
  totalPages: number;
  totalJobs: number;
  onPageChange: (page: number) => void;
  country?: "us" | "canada"; // Add country parameter
}

const JobList: React.FC<JobListProps> = ({
  jobs,
  isLoading,
  error,
  currentPage,
  totalPages,
  totalJobs,
  onPageChange,
  country = "us", // Default to US
}) => {
  // Calculate page range to display
  const getPageRange = () => {
    const range = [];
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(1, currentPage - halfVisiblePages);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      range.push(i);
    }
    
    return range;
  };

  const countryName = country === "canada" ? "Canada" : "United States";

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error loading jobs</AlertTitle>
        <AlertDescription>
          {error.message}
          {error.message.includes('NetworkError') && (
            <p className="mt-2 text-sm">
              This appears to be a network connectivity issue. We're showing you fallback job data instead.
            </p>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Job Listings</h2>
        <div className="flex items-center gap-2">
          <Badge variant={country === "canada" ? "outline" : "default"} className="flex items-center gap-1">
            <Globe className="h-3 w-3" />
            {countryName}
          </Badge>
          <span className="text-sm text-gray-500">{totalJobs} jobs found</span>
        </div>
      </div>
      
      {isLoading ? (
        <div className="py-12 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-gray-100 h-32 rounded-lg"></div>
          ))}
        </div>
      ) : jobs.length > 0 ? (
        <>
          <div className="space-y-4">
            {jobs.map(job => (
              <JobListing
                key={job.id}
                jobId={job.id}
                title={job.title}
                company={job.company}
                location={job.location}
                description={job.description}
              />
            ))}
          </div>
          
          {totalPages > 1 && (
            <Pagination className="my-8">
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => onPageChange(currentPage - 1)} 
                      className="cursor-pointer"
                    />
                  </PaginationItem>
                )}
                
                {getPageRange().map(page => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={page === currentPage}
                      onClick={() => onPageChange(page)}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => onPageChange(currentPage + 1)} 
                      className="cursor-pointer"
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No jobs found in {countryName}</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search criteria or searching in a different region.
          </p>
        </div>
      )}
    </div>
  );
};

export default JobList;
