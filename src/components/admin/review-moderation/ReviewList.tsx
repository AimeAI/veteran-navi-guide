
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { EmployerReview } from '@/types/review';
import ReviewCard from './ReviewCard';

interface ReviewListProps {
  reviews: EmployerReview[];
  searchTerm: string;
  onApprove: (reviewId: string) => void;
  onReject: (reviewId: string) => void;
  onToggleVisibility: (reviewId: string) => void;
}

const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  searchTerm,
  onApprove,
  onReject,
  onToggleVisibility
}) => {
  // Filter reviews based on search term
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.reviewerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());
      
    return matchesSearch;
  });
  
  if (filteredReviews.length === 0) {
    return (
      <Card className="bg-gray-50 border border-dashed">
        <CardContent className="pt-6 text-center py-10">
          <p className="text-gray-500">No reviews match your criteria</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      {filteredReviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          onApprove={onApprove}
          onReject={onReject}
          onToggleVisibility={onToggleVisibility}
        />
      ))}
    </div>
  );
};

export default ReviewList;
