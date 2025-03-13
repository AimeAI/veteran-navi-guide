
import React, { useState, useEffect, useCallback, memo } from 'react';
import { EmployerReview } from '@/types/review';
import { toast } from 'sonner';
import { 
  getEmployerReviewsOptimized,
  markReviewAsHelpfulOptimized, 
  executeWithRetry 
} from '@/utils/supabaseHelpers';
import { reportReview } from '@/services/reviewService';
import ReviewCard from './ReviewCard';
import EmptyReviewsState from './EmptyReviewsState';
import ReviewsLoadingSkeleton from './ReviewsLoadingSkeleton';
import { QueryCache } from '@/utils/batchOperations';
import { measurePerformance } from '@/utils/performanceUtils';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

// Create a cache for employer reviews with a 5 minute TTL
const reviewsCache = new QueryCache<string, EmployerReview[]>(5 * 60 * 1000);

interface EmployerReviewsListProps {
  employerId: string;
  isLoading?: boolean;
  onReviewsLoaded?: (reviews: EmployerReview[]) => void;
  pageSize?: number;
}

const EmployerReviewsList: React.FC<EmployerReviewsListProps> = ({
  employerId,
  isLoading: externalLoading = false,
  onReviewsLoaded,
  pageSize = 5
}) => {
  const [reviews, setReviews] = useState<EmployerReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [helpfulClicks, setHelpfulClicks] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);

  // Fetch reviews with caching and batching - memoized with useCallback
  const fetchReviews = useCallback(async (page: number = 1) => {
    if (!employerId) return;
    
    setIsLoading(true);
    
    // Check cache first
    const cacheKey = `reviews:${employerId}:${page}:${pageSize}`;
    const cachedReviews = reviewsCache.get(cacheKey);
    
    if (cachedReviews) {
      setReviews(cachedReviews);
      if (onReviewsLoaded) onReviewsLoaded(cachedReviews);
      setIsLoading(false);
      return;
    }
    
    try {
      // Use executeWithRetry for better connection handling with performance measurement
      const result = await measurePerformance('Fetch employer reviews', () => 
        executeWithRetry(() => 
          // Fix: Pass only the employerId parameter to avoid the type error
          getEmployerReviewsOptimized(employerId, {
            page, 
            pageSize
          })
        )
      );
      
      const fetchedReviews = result.data || [];
      setReviews(fetchedReviews);
      setTotalReviews(result.pagination?.totalItems || fetchedReviews.length);
      
      // Cache the results
      reviewsCache.set(cacheKey, fetchedReviews);
      
      if (onReviewsLoaded) {
        onReviewsLoaded(fetchedReviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  }, [employerId, onReviewsLoaded, pageSize]);

  // Initial data loading
  useEffect(() => {
    fetchReviews(currentPage);
    
    // Clean up the cache periodically
    const intervalId = setInterval(() => {
      reviewsCache.prune();
    }, 10 * 60 * 1000); // Every 10 minutes
    
    return () => clearInterval(intervalId);
  }, [employerId, fetchReviews, currentPage]);

  // Memoized handlers to prevent recreation on each render
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleHelpful = useCallback(async (reviewId: string) => {
    // Prevent multiple clicks
    if (helpfulClicks[reviewId]) return;
    
    setHelpfulClicks(prev => ({ ...prev, [reviewId]: true }));
    
    try {
      // Use our optimized markReviewAsHelpful function with retry logic
      const success = await executeWithRetry(() => 
        markReviewAsHelpfulOptimized(reviewId)
      );
      
      if (success) {
        // Update the local state to increment the helpful count
        setReviews(reviews => reviews.map(review => 
          review.id === reviewId 
            ? { ...review, helpfulCount: (review.helpfulCount || 0) + 1 } 
            : review
        ));
        
        // Also update the cached version
        const cacheKey = `reviews:${employerId}:${currentPage}:${pageSize}`;
        const cachedReviews = reviewsCache.get(cacheKey);
        if (cachedReviews) {
          reviewsCache.set(cacheKey, 
            cachedReviews.map(review => 
              review.id === reviewId 
                ? { ...review, helpfulCount: (review.helpfulCount || 0) + 1 } 
                : review
            )
          );
        }
        
        toast.success('Thank you for your feedback!');
      }
    } catch (error) {
      console.error('Error marking review as helpful:', error);
      toast.error('Failed to record your feedback');
      // Reset the click state if there was an error
      setHelpfulClicks(prev => ({ ...prev, [reviewId]: false }));
    }
  }, [helpfulClicks, employerId, currentPage, pageSize]);

  const handleReport = useCallback(async (reviewId: string) => {
    try {
      const success = await executeWithRetry(() => 
        reportReview(reviewId, 'Reported by user')
      );
      
      if (success) {
        toast.success('Review reported to moderators', {
          description: 'Thank you for helping to maintain the quality of our community.'
        });
      }
    } catch (error) {
      console.error('Error reporting review:', error);
      toast.error('Failed to report review');
    }
  }, []);

  const loading = isLoading || externalLoading;
  const totalPages = Math.ceil(totalReviews / pageSize);

  if (loading) {
    return <ReviewsLoadingSkeleton />;
  }

  if (reviews.length === 0) {
    return <EmptyReviewsState />;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard 
            key={review.id}
            review={review}
            onHelpful={handleHelpful}
            onReport={handleReport}
            isHelpfulClicked={!!helpfulClicks[review.id]}
          />
        ))}
      </div>
      
      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Calculate which page numbers to show
              let pageNum = i + 1;
              if (totalPages > 5) {
                if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
              }
              
              return (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => handlePageChange(pageNum)}
                    isActive={pageNum === currentPage}
                    className="cursor-pointer"
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default memo(EmployerReviewsList);
