
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { EmployerReview } from '@/types/review';

// Import refactored components
import ReviewStatusFilter from './review-moderation/ReviewStatusFilter';
import ReviewSearchFilter from './review-moderation/ReviewSearchFilter';
import ReviewList from './review-moderation/ReviewList';
import ReviewsLoading from './review-moderation/ReviewsLoading';

const ReviewModeration: React.FC = () => {
  const [reviews, setReviews] = useState<EmployerReview[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchReviews();
  }, [statusFilter]);
  
  const fetchReviews = async () => {
    setIsLoading(true);
    
    try {
      let query = supabase.from('employer_reviews').select('*');
      
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      const { data, error } = await query.order('date_posted', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Transform snake_case to camelCase for frontend components
      const transformedData = data.map(item => ({
        id: item.id,
        employerId: item.employer_id,
        reviewerId: item.reviewer_id,
        reviewerName: item.reviewer_name,
        rating: item.rating,
        title: item.title,
        comment: item.comment,
        datePosted: item.date_posted,
        isVerified: item.is_verified,
        isHidden: item.is_hidden,
        position: item.position,
        pros: item.pros,
        cons: item.cons,
        helpfulCount: item.helpful_count,
        status: item.status
      })) as EmployerReview[];
      
      setReviews(transformedData);
    } catch (error) {
      console.error('Error fetching reviews for moderation:', error);
      toast.error('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle review approval
  const handleApprove = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('employer_reviews')
        .update({ status: 'approved' })
        .eq('id', reviewId);
        
      if (error) throw error;
      
      setReviews(reviews.map(review => 
        review.id === reviewId ? { ...review, status: 'approved' } : review
      ));
      
      toast.success('Review approved and published');
    } catch (error) {
      console.error('Error approving review:', error);
      toast.error('Failed to approve review');
    }
  };
  
  // Handle review rejection
  const handleReject = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('employer_reviews')
        .update({ status: 'rejected' })
        .eq('id', reviewId);
        
      if (error) throw error;
      
      setReviews(reviews.map(review => 
        review.id === reviewId ? { ...review, status: 'rejected' } : review
      ));
      
      toast.success('Review rejected');
    } catch (error) {
      console.error('Error rejecting review:', error);
      toast.error('Failed to reject review');
    }
  };
  
  // Handle toggling review visibility
  const handleToggleVisibility = async (reviewId: string) => {
    try {
      const review = reviews.find(r => r.id === reviewId);
      
      if (!review) return;
      
      const { error } = await supabase
        .from('employer_reviews')
        .update({ is_hidden: !review.isHidden })
        .eq('id', reviewId);
        
      if (error) throw error;
      
      setReviews(reviews.map(r => 
        r.id === reviewId ? { ...r, isHidden: !r.isHidden } : r
      ));
      
      toast.success(review.isHidden ? 'Review is now visible' : 'Review is now hidden');
    } catch (error) {
      console.error('Error updating review visibility:', error);
      toast.error('Failed to update review visibility');
    }
  };
  
  // Get counts by status
  const statusCounts = {
    all: reviews.length,
    pending: reviews.filter(r => r.status === 'pending').length,
    approved: reviews.filter(r => r.status === 'approved').length,
    rejected: reviews.filter(r => r.status === 'rejected').length
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Review Moderation</h2>
        </div>
        <ReviewsLoading />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Review Moderation</h2>
        <ReviewStatusFilter 
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          statusCounts={statusCounts}
        />
      </div>
      
      <ReviewSearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      
      <ReviewList
        reviews={reviews}
        searchTerm={searchTerm}
        onApprove={handleApprove}
        onReject={handleReject}
        onToggleVisibility={handleToggleVisibility}
      />
    </div>
  );
};

export default ReviewModeration;
