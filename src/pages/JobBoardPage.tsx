
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import JobList from '@/components/JobList';
import { useJobSearch } from '@/hooks/useJobSearch';
import type { JobSearchParams } from '@/types/jobSearch';
import { Card, CardContent } from '@/components/ui/card';
import { JobCache } from '@/utils/jobCache';
import JobBoardHeader from '@/components/job-board/JobBoardHeader';
import JobSearchForm from '@/components/job-board/JobSearchForm';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { debounce, connectionHealthMonitor, measurePerformance } from '@/utils/performanceUtils';
import { clearApiCache } from '@/utils/apiCache';

const JobBoardPage: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchParams, setSearchParams] = useState<JobSearchParams>({
    keywords: '',
    location: '',
    radius: 25,
    page: 1,
    pageSize: 20,
  });

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

  const handleSearch = useCallback((params: JobSearchParams) => {
    measurePerformance('Job search params update', () => {
      setSearchParams({
        ...searchParams,
        ...params,
        page: 1, // Reset to first page on new search
      });
    });
    toast.info("Searching for jobs...");
  }, [searchParams]);

  // Debounced version of the page change handler to prevent rapid changes
  const debouncedPageChange = useCallback(
    debounce((newPage: number) => {
      setSearchParams(prev => ({
        ...prev,
        page: newPage
      }));
      setPage(newPage);
    }, 300), 
    [setPage]
  );
  
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    debouncedPageChange(newPage);
  };

  // Handle refresh with improved performance tracking
  const handleRefreshJobs = async () => {
    setIsRefreshing(true);
    try {
      // Clear all caches
      measurePerformance('Clear job caches', () => {
        JobCache.clearCache();
        clearApiCache();
      });
      
      toast.info("Cleared job search cache");
      
      // Refresh the jobs with a forced refresh flag
      await refreshJobs();
      
      // Record a successful network request
      connectionHealthMonitor.recordSuccess();
      
      toast.success("Job results refreshed with latest listings");
    } catch (error) {
      console.error('Error refreshing jobs:', error);
      
      // Record a failed network request
      connectionHealthMonitor.recordFailure();
      
      toast.error("Failed to refresh job results");
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Initial data loading with optimized performance
  useEffect(() => {
    const hasInitialData = sessionStorage.getItem('hasInitialJobData');
    if (!hasInitialData) {
      toast.info("Loading initial job listings...");
      
      // Measure the performance of the initial data load
      measurePerformance('Initial job data load', async () => {
        try {
          await refreshJobs();
          sessionStorage.setItem('hasInitialJobData', 'true');
          toast.success("Job listings loaded successfully");
          connectionHealthMonitor.recordSuccess();
        } catch (error) {
          console.error('Error loading initial job data:', error);
          connectionHealthMonitor.recordFailure();
        }
      });
    }
  }, [refreshJobs]);

  // Pagination UI
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    // Calculate what page numbers to show
    let pageNumbers = [];
    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      // Always include first and last page
      pageNumbers.push(1);
      
      // Add middle pages with ellipsis as needed
      if (currentPage <= 3) {
        pageNumbers.push(2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push('...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push('...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return (
      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => handlePageChange(currentPage - 1)}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              aria-disabled={currentPage === 1}
            />
          </PaginationItem>
          
          {pageNumbers.map((page, i) => (
            <PaginationItem key={i}>
              {page === '...' ? (
                <span className="px-4 py-2">...</span>
              ) : (
                <PaginationLink
                  onClick={() => handlePageChange(page as number)}
                  isActive={page === currentPage}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => handlePageChange(currentPage + 1)}
              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              aria-disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Card className="mb-8">
            <JobBoardHeader 
              isRefreshing={isRefreshing} 
              isLoading={isLoading} 
              onRefresh={handleRefreshJobs} 
            />
            <JobSearchForm 
              onSearch={handleSearch} 
              initialFilters={{
                keywords: searchParams.keywords || '',
                location: searchParams.location || '',
                radius: searchParams.radius || 25,
              }}
            />
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <JobList
                jobs={jobs}
                isLoading={isLoading}
                error={error}
                currentPage={currentPage}
                totalPages={totalPages}
                totalJobs={totalJobs}
                onPageChange={setPage}
                country="canada"
                onRefresh={refreshJobs}
              />
              
              {/* Add our enhanced pagination */}
              {renderPagination()}
              
              {!isLoading && jobs.length > 0 && (
                <div className="text-sm text-gray-500 text-center mt-4">
                  Showing {Math.min((currentPage - 1) * searchParams.pageSize + 1, totalJobs)} - {Math.min(currentPage * searchParams.pageSize, totalJobs)} of {totalJobs} jobs
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2023 VeteranJobBoard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default JobBoardPage;
