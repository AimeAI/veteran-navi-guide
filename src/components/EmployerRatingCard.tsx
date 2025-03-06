
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import EmployerRating from './EmployerRating';
import EmployerReviewDialog from './EmployerReviewDialog';
import { getEmployerRatingSummary } from '@/data/employerReviews';
import { useUser } from '@/context/UserContext';

interface EmployerRatingCardProps {
  employerId: string;
  employerName: string;
  className?: string;
}

const EmployerRatingCard: React.FC<EmployerRatingCardProps> = ({
  employerId,
  employerName,
  className
}) => {
  const { user } = useUser();
  const isVeteran = user?.role === 'veteran';
  const ratingSummary = getEmployerRatingSummary(employerId);
  
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Company Ratings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 mb-4">
          <div className="text-3xl font-bold">
            {ratingSummary.avgRating.toFixed(1)}
          </div>
          <div>
            <EmployerRating rating={ratingSummary.avgRating} size="lg" />
            <div className="text-sm text-gray-500 mt-1">
              {ratingSummary.totalReviews} {ratingSummary.totalReviews === 1 ? 'review' : 'reviews'}
            </div>
          </div>
        </div>
        
        {ratingSummary.totalReviews > 0 ? (
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>5 stars</span>
              <span>{ratingSummary.ratingDistribution[5]}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>4 stars</span>
              <span>{ratingSummary.ratingDistribution[4]}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>3 stars</span>
              <span>{ratingSummary.ratingDistribution[3]}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>2 stars</span>
              <span>{ratingSummary.ratingDistribution[2]}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>1 star</span>
              <span>{ratingSummary.ratingDistribution[1]}</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No reviews yet</p>
        )}
      </CardContent>
      
      <CardFooter className="border-t pt-4">
        {isVeteran ? (
          <EmployerReviewDialog 
            employerId={employerId} 
            employerName={employerName}
          />
        ) : (
          <p className="text-sm text-gray-500 italic">
            Sign in as a veteran to leave a review
          </p>
        )}
      </CardFooter>
    </Card>
  );
};

export default EmployerRatingCard;
