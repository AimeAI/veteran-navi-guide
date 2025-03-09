
import { supabase } from "@/integrations/supabase/client";
import { EmployerReview, EmployerRatingSummary } from "@/types/review";

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

  return data as EmployerReview[];
}

// Submit a new review
export async function submitEmployerReview(review: Omit<EmployerReview, 'id' | 'date_posted' | 'is_verified' | 'is_hidden' | 'helpful_count'>): Promise<{ success: boolean; error?: string }> {
  const { data, error } = await supabase
    .from('employer_reviews')
    .insert([review])
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
  const { error } = await supabase
    .from('review_reports')
    .insert([{ review_id: reviewId, reason, reported_at: new Date() }]);

  if (error) {
    console.error('Error reporting review:', error);
    return false;
  }

  return true;
}
