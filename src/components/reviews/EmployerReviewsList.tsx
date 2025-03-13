
import React, { useState, useEffect } from 'react';
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

interface EmployerReviewsListProps {
  employerId: string;
  isLoading?: boolean;
  onReviewsLoaded?: (reviews: EmployerReview[]) => void;
}

const EmployerReviewsList: React.FC<EmployerReviewsListProps> = ({
  employerId,
  isLoading: externalLoading = false,
  onReviewsLoaded
}) => {
  const [reviews, setReviews] = useState<EmployerReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [helpfulClicks, setHelpfulClicks] = useState<Record<string, boolean>>({});

  // Fetch reviews on component mount using our optimized function
  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        // Use the executeWithRetry utility for better connection handling
        const fetchedReviews = await executeWithRetry(() => 
          getEmployerReviewsOptimized(employerId)
        );
        
        setReviews(fetchedReviews);
        if (onReviewsLoaded) {
          onReviewsLoaded(fetchedReviews);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        toast.error('Failed to load reviews');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [employerId, onReviewsLoaded]);

  const handleHelpful = async (reviewId: string) => {
    // Prevent multiple clicks
    if (helpfulClicks[reviewId]) return;
    
    setHelpfulClicks(prev => ({ ...prev, [reviewId]: true }));
    
    try {
      // Use our optimized markReviewAsHelpful function
      const success = await executeWithRetry(() => 
        markReviewAsHelpfulOptimized(reviewId)
      );
      
      if (success) {
        // Update the local state to increment the helpful count
        setReviews(reviews.map(review => 
          review.id === reviewId 
            ? { ...review, helpfulCount: (review.helpfulCount || 0) + 1 } 
            : review
        ));
        toast.success('Thank you for your feedback!');
      }
    } catch (error) {
      console.error('Error marking review as helpful:', error);
      toast.error('Failed to record your feedback');
      // Reset the click state if there was an error
      setHelpfulClicks(prev => ({ ...prev, [reviewId]: false }));
    }
  };

  const handleReport = async (reviewId: string) => {
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
  };

  const loading = isLoading || externalLoading;

  if (loading) {
    return <ReviewsLoadingSkeleton />;
  }

  if (reviews.length === 0) {
    return <EmptyReviewsState />;
  }

  return (
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
  );
};

export default EmployerReviewsList;
