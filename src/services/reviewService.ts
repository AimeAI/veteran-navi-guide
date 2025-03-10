
import { supabase } from "@/integrations/supabase/client";
import { EmployerReview } from "@/types/review";

// Function to fetch reviews for a specific employer
export async function getEmployerReviews(employerId: string): Promise<EmployerReview[]> {
  try {
    const { data, error } = await supabase
      .from('employer_reviews')
      .select('*')
      .eq('employer_id', employerId)
      .eq('status', 'approved')
      .eq('is_hidden', false)
      .order('date_posted', { ascending: false });

    if (error) {
      throw error;
    }

    // Transform snake_case to camelCase for frontend
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
      status: item.status as "pending" | "approved" | "rejected"
    }));
  } catch (error) {
    console.error('Error fetching employer reviews:', error);
    throw error;
  }
}

// Function to submit a new review
export async function submitEmployerReview(reviewData: Omit<EmployerReview, "id" | "datePosted" | "isVerified" | "isHidden" | "helpfulCount">): Promise<{ success: boolean; error?: string }> {
  try {
    // Convert from camelCase to snake_case for database
    const { data, error } = await supabase
      .from('employer_reviews')
      .insert({
        employer_id: reviewData.employerId,
        reviewer_id: reviewData.reviewerId,
        reviewer_name: reviewData.reviewerName,
        rating: reviewData.rating,
        title: reviewData.title,
        comment: reviewData.comment,
        position: reviewData.position,
        pros: reviewData.pros,
        cons: reviewData.cons,
        status: reviewData.status
      });

    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error submitting employer review:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// Function to mark a review as helpful
export async function markReviewAsHelpful(reviewId: string): Promise<boolean> {
  try {
    // Call the RPC function we defined in the SQL
    // Update to use custom name instead of function name directly
    // @ts-ignore - Ignoring TypeScript error for RPC function name
    const { error } = await supabase.rpc('increment_review_helpful_count', {
      review_id: reviewId
    });

    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error marking review as helpful:', error);
    return false;
  }
}

// Function to get employer rating summary
export async function getEmployerRatingSummary(employerId: string) {
  try {
    const { data, error } = await supabase
      .from('employer_reviews')
      .select('rating')
      .eq('employer_id', employerId)
      .eq('status', 'approved')
      .eq('is_hidden', false);
      
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return {
        avgRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      };
    }
    
    // Calculate average rating
    const ratings = data.map(r => r.rating);
    const sum = ratings.reduce((acc, curr) => acc + curr, 0);
    const avg = sum / ratings.length;
    
    // Calculate rating distribution
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratings.forEach(rating => {
      distribution[rating as 1|2|3|4|5]++;
    });
    
    return {
      avgRating: parseFloat(avg.toFixed(1)),
      totalReviews: ratings.length,
      ratingDistribution: distribution
    };
  } catch (error) {
    console.error('Error fetching employer rating summary:', error);
    return {
      avgRating: 0,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  }
}

// Function to report a review
export async function reportReview(reviewId: string, reason: string): Promise<boolean> {
  try {
    // In a real implementation, you would insert into a review_reports table
    // Since this isn't implemented in the current database schema, we'll log and return true
    console.log(`Review ${reviewId} reported for reason: ${reason}`);
    
    // This would be the actual implementation once the table is created:
    /*
    const { error } = await supabase
      .from('review_reports')
      .insert([{ 
        review_id: reviewId, 
        reason: reason,
        reported_at: new Date()
      }]);
    
    if (error) throw error;
    */
    
    return true;
  } catch (error) {
    console.error('Error reporting review:', error);
    return false;
  }
}
