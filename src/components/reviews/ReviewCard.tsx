
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ThumbsUp, Flag } from 'lucide-react';
import EmployerRating from '@/components/EmployerRating';
import { EmployerReview } from '@/types/review';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

interface ReviewCardProps {
  review: EmployerReview;
  onHelpful: (reviewId: string) => void;
  onReport: (reviewId: string) => void;
  isHelpfulClicked: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onHelpful,
  onReport,
  isHelpfulClicked
}) => {
  return (
    <Card>
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
          onClick={() => onHelpful(review.id)}
          disabled={isHelpfulClicked}
        >
          <ThumbsUp className="h-4 w-4 mr-1.5" />
          <span>Helpful{review.helpfulCount ? ` (${review.helpfulCount})` : ''}</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gray-500 hover:text-gray-700"
          onClick={() => onReport(review.id)}
        >
          <Flag className="h-4 w-4 mr-1.5" />
          <span>Report</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReviewCard;
