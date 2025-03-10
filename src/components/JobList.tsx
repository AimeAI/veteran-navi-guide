
import React from 'react';
import { Job } from '@/context/JobContext';
import JobListing from '@/components/JobListing';
import { Briefcase, AlertCircle, Globe, Loader2, RefreshCw } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { preloadImages } from '@/utils/cacheUtils';
import { measurePerformance } from '@/utils/performanceUtils';

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

interface JobWithScore extends Job {
  matchScore?: number;
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
  
  // Preload next page job images when close to the bottom of the list
  React.useEffect(() => {
    if (jobs.length > 0 && currentPage < totalPages) {
      // Get company logos to preload
      const companyLogos = jobs
        .map(job => {
          // Extract logo URL from company name using a hypothetical function
          // This would need to be implemented based on how logos are stored
          return `https://logo.clearbit.com/${job.company.toLowerCase().replace(/\s+/g, '')}.com`;
        })
        .filter(Boolean);
      
      if (companyLogos.length > 0) {
        preloadImages(companyLogos);
      }
    }
  }, [jobs, currentPage, totalPages]);
  
  // Prefetch next page data when user is close to the end of the current page
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const pageHeight = document.body.offsetHeight;
      const scrollPercentage = (scrollPosition / pageHeight) * 100;
      
      // If user has scrolled more than 75% of the page and there's a next page
      if (scrollPercentage > 75 && currentPage < totalPages) {
        // Prefetch next page data
        const prefetchNextPage = async () => {
          try {
            // This would need to be implemented based on how pagination is handled
            // For demonstration purposes, we're just showing the concept
            console.log(`Prefetching page ${currentPage + 1} data`);
          } catch (error) {
            console.error('Error prefetching next page:', error);
          }
        };
        
        prefetchNextPage();
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage, totalPages]);
  
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
        await measurePerformance('Job refresh', onRefresh);
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
  const otherSourcesCount = totalJobs - jobBankCount - indeedCount - linkedinCount;

  // Optimize rendering with React.memo for job listings
  const MemoizedJobListing = React.memo(JobListing);

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
          {indeedCount > 0 && (
            <Badge variant="outline" className="flex items-center gap-1 bg-orange-100">
              Indeed: {indeedCount}
            </Badge>
          )}
          {linkedinCount > 0 && (
            <Badge variant="outline" className="flex items-center gap-1 bg-purple-100">
              LinkedIn: {linkedinCount}
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
            {jobs.map(job => {
              const jobWithScore = job as JobWithScore;
              return (
                <MemoizedJobListing
                  key={job.id}
                  jobId={job.id}
                  title={job.title}
                  company={job.company}
                  location={job.location}
                  description={job.description}
                  source={job.source}
                  url={job.url}
                  date={job.date}
                  matchScore={jobWithScore.matchScore}
                />
              );
            })}
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

// Use memo to prevent unnecessary re-renders
export default React.memo(JobList);
