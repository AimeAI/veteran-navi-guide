
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ThumbsUp, Flag, AlertCircle } from 'lucide-react';
import EmployerRating from '@/components/EmployerRating';
import { EmployerReview } from '@/types/review';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { getEmployerReviews, markReviewAsHelpful, reportReview } from '@/services/reviewService';

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

  // Fetch reviews on component mount
  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        const fetchedReviews = await getEmployerReviews(employerId);
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
      const success = await markReviewAsHelpful(reviewId);
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
      const success = await reportReview(reviewId, 'Reported by user');
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
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 mb-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-40"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card className="bg-gray-50 border border-dashed">
        <CardContent className="pt-6 text-center py-10">
          <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No reviews yet. Be the first to review this employer!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <EmployerRating rating={review.rating} showText />
              <span className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(review.datePosted), { addSuffix: true })}
              </span>
            </div>
            
            <h4 className="font-semibold text-gray-900 mb-1">{review.title}</h4>
            
            <div className="flex items-center text-sm text-gray-500 mb-3">
              <span>{review.reviewerName}</span>
              {review.position && (
                <>
                  <span className="mx-1.5">•</span>
                  <span>{review.position}</span>
                </>
              )}
              {review.isVerified && (
                <span className="ml-2 px-1.5 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                  Verified
                </span>
              )}
            </div>
            
            <div className="text-sm text-gray-700 space-y-2">
              <p>{review.comment}</p>
              
              {(review.pros || review.cons) && (
                <div className="grid md:grid-cols-2 gap-4 mt-3">
                  {review.pros && (
                    <div>
                      <h5 className="font-medium text-green-700 mb-1">Pros</h5>
                      <p className="text-sm text-gray-600">{review.pros}</p>
                    </div>
                  )}
                  
                  {review.cons && (
                    <div>
                      <h5 className="font-medium text-red-700 mb-1">Cons</h5>
                      <p className="text-sm text-gray-600">{review.cons}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="border-t pt-3 flex justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-500 hover:text-gray-700"
              onClick={() => handleHelpful(review.id)}
              disabled={helpfulClicks[review.id]}
            >
              <ThumbsUp className="h-4 w-4 mr-1.5" />
              <span>Helpful{review.helpfulCount ? ` (${review.helpfulCount})` : ''}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-500 hover:text-gray-700"
              onClick={() => handleReport(review.id)}
            >
              <Flag className="h-4 w-4 mr-1.5" />
              <span>Report</span>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default EmployerReviewsList;
