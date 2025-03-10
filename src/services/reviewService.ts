
import { supabase } from "@/integrations/supabase/client";
import { EmployerReview, EmployerRatingSummary } from "@/types/review";

// Helper function to transform database response to frontend model
const transformDbToReview = (data: any[]): EmployerReview[] => {
  return data.map(item => ({
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
  }));
};

// Fetch reviews for an employer
export async function getEmployerReviews(employerId: string): Promise<EmployerReview[]> {
  const { data, error } = await supabase
    .from('employer_reviews')
    .select('*')
    .eq('employer_id', employerId)
    .eq('status', 'approved')
    .eq('is_hidden', false)
    .order('date_posted', { ascending: false });

  if (error) {
    console.error('Error fetching employer reviews:', error);
    return [];
  }

  return transformDbToReview(data);
}

// Submit a new review
export async function submitEmployerReview(
  review: Omit<EmployerReview, 'id' | 'datePosted' | 'isVerified' | 'isHidden' | 'helpfulCount'>
): Promise<{ success: boolean; error?: string }> {
  // Transform from camelCase to snake_case for database
  const dbReview = {
    employer_id: review.employerId,
    reviewer_id: review.reviewerId,
    reviewer_name: review.reviewerName,
    rating: review.rating,
    title: review.title,
    comment: review.comment,
    position: review.position,
    pros: review.pros,
    cons: review.cons,
    status: review.status
  };

  const { data, error } = await supabase
    .from('employer_reviews')
    .insert([dbReview])
    .select();

  if (error) {
    console.error('Error submitting review:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// Mark a review as helpful
export async function markReviewAsHelpful(reviewId: string): Promise<boolean> {
  const { error } = await supabase.rpc('increment_review_helpful_count', {
    review_id: reviewId
  });

  if (error) {
    console.error('Error marking review as helpful:', error);
    return false;
  }

  return true;
}

// Get rating summary for an employer
export async function getEmployerRatingSummary(employerId: string): Promise<EmployerRatingSummary> {
  const { data, error } = await supabase
    .from('employer_reviews')
    .select('rating')
    .eq('employer_id', employerId)
    .eq('status', 'approved')
    .eq('is_hidden', false);

  if (error || !data) {
    console.error('Error fetching employer rating summary:', error);
    return {
      avgRating: 0,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  }

  // Calculate average rating
  const ratings = data.map(review => Number(review.rating));
  const avgRating = ratings.length > 0 
    ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
    : 0;

  // Calculate rating distribution
  const ratingDistribution = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0
  };

  ratings.forEach(rating => {
    const roundedRating = Math.round(rating) as 1 | 2 | 3 | 4 | 5;
    ratingDistribution[roundedRating]++;
  });

  return {
    avgRating,
    totalReviews: ratings.length,
    ratingDistribution
  };
}

// Report a review
export async function reportReview(reviewId: string, reason: string): Promise<boolean> {
  // Since review_reports table is not in the database yet, we'll just log the report
  // In a real application, this table would be created through a SQL migration
  console.log(`Review reported: ${reviewId}, Reason: ${reason}`);
  
  // Mock successful report since we can't insert into a non-existent table
  return true;
}
