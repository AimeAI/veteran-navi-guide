
import React from 'react';
import { EmployerRatingSummary as RatingSummaryType } from '@/types/review';
import EmployerRating from '@/components/EmployerRating';
import { Progress } from '@/components/ui/progress';

interface EmployerRatingSummaryProps {
  summary: RatingSummaryType;
  className?: string;
}

const EmployerRatingSummary: React.FC<EmployerRatingSummaryProps> = ({
  summary,
  className
}) => {
  const { avgRating, totalReviews, ratingDistribution } = summary;
  
  // Calculate percentages for each rating level
  const getPercentage = (count: number) => {
    if (totalReviews === 0) return 0;
    return (count / totalReviews) * 100;
  };
  
  return (
    <div className={className}>
      {totalReviews > 0 ? (
        <>
          <div className="flex items-center space-x-2 mb-6">
            <div className="text-4xl font-bold text-gray-900">{avgRating.toFixed(1)}</div>
            <div className="flex flex-col">
              <EmployerRating rating={avgRating} size="lg" />
              <div className="text-sm text-gray-500 mt-1">
                Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-2 text-sm text-gray-600">{star} stars</div>
                <div className="col-span-8">
                  <Progress 
                    value={getPercentage(ratingDistribution[star as keyof typeof ratingDistribution])} 
                    className="h-2" 
                  />
                </div>
                <div className="col-span-2 text-sm text-gray-500 text-right">
                  {ratingDistribution[star as keyof typeof ratingDistribution]} 
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-6">
          <p className="text-gray-500">No reviews yet</p>
          <p className="text-sm text-gray-400 mt-1">Be the first to leave a review</p>
        </div>
      )}
    </div>
  );
};

export default EmployerRatingSummary;
