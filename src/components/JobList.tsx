
import React from 'react';
import { Job } from '@/context/JobContext';
import JobListing from '@/components/JobListing';
import { Briefcase, AlertCircle, Globe, Loader2, RefreshCw } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from './ui/button';
import { toast } from 'sonner';

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
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  
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

  // Group jobs by source
  const jobsBySource = jobs.reduce((acc, job) => {
    const source = job.source || 'other';
    if (!acc[source]) {
      acc[source] = [];
    }
    acc[source].push(job);
    return acc;
  }, {} as Record<string, Job[]>);

  // Calculate source statistics
  const jobBankCount = jobsBySource['jobbank']?.length || 0;
  const otherSourcesCount = totalJobs - jobBankCount;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Job Listings</h2>
        <div className="flex items-center gap-2">
          <Badge variant={country === "canada" ? "outline" : "default"} className="flex items-center gap-1">
            <Globe className="h-3 w-3" />
            {countryName}
          </Badge>
          {jobBankCount > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Job Bank: {jobBankCount}
            </Badge>
          )}
          <span className="text-sm text-gray-500">{totalJobs} jobs found</span>
          
          {onRefresh && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRetry}
              disabled={isRefreshing || isLoading}
              className="ml-2"
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
          )}
        </div>
      </div>
      
      {isLoading ? (
        <div className="py-12 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-gray-100 h-32 rounded-lg flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
            </div>
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
                source={job.source}
                url={job.url}
                date={job.date}
                matchScore={job.matchScore}
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
          <Button variant="outline" onClick={handleRetry} className="mt-4">
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};

export default JobList;
