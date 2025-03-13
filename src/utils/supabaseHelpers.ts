
import { supabase } from "@/integrations/supabase/client";

// Helper function to check if a user is authenticated
export async function isUserAuthenticated(): Promise<boolean> {
  // DEVELOPMENT MODE: Always return true to bypass authentication
  console.log('DEV MODE: isUserAuthenticated always returns true');
  return true;
}

// Helper function to get the current user's ID
export async function getCurrentUserId(): Promise<string | null> {
  // DEVELOPMENT MODE: Return a mock user ID
  console.log('DEV MODE: getCurrentUserId returns mock ID');
  return "dev-test-user-id";
}

// Helper function to check if user has already submitted a review for an employer
export async function hasUserReviewedEmployer(employerId: string): Promise<boolean> {
  // DEVELOPMENT MODE: Mock response
  console.log('DEV MODE: hasUserReviewedEmployer always returns false');
  return false;
  
  /* Real implementation commented out during development
  const user = await getCurrentUserId();
  
  if (!user) return false;
  
  const { data, error } = await supabase
    .from('employer_reviews')
    .select('id')
    .eq('employer_id', employerId)
    .eq('reviewer_id', user)
    .limit(1);
    
  if (error) {
    console.error('Error checking if user has reviewed employer:', error);
    return false;
  }
  
  return (data?.length || 0) > 0;
  */
}

// Optimized query functions that take advantage of our new indexes
export async function getEmployerReviewsOptimized(employerId: string): Promise<any[]> {
  console.log('DEV MODE: getEmployerReviewsOptimized for employer:', employerId);
  
  try {
    const { data, error } = await supabase
      .from('employer_reviews')
      .select('*')
      .eq('employer_id', employerId) // Uses our new index
      .eq('status', 'approved')
      .order('helpful_count', { ascending: false }) // Uses our new index
      .order('date_posted', { ascending: false });
      
    if (error) {
      console.error('Error fetching optimized employer reviews:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception in getEmployerReviewsOptimized:', error);
    return [];
  }
}

// Function to mark a review as helpful using our optimized DB function
export async function markReviewAsHelpfulOptimized(reviewId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .rpc('increment_review_helpful_count', { review_id: reviewId });
      
    if (error) {
      console.error('Error marking review as helpful:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception in markReviewAsHelpfulOptimized:', error);
    return false;
  }
}

// Use our new efficient function to find matching jobs
export async function findMatchingJobsForUser(
  userId: string, 
  minMatchPercentage: number = 30, 
  maxResults: number = 20
): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .rpc('find_matching_jobs_efficient', { 
        user_id: userId,
        min_match_percentage: minMatchPercentage,
        max_results: maxResults
      });
      
    if (error) {
      console.error('Error finding matching jobs:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception in findMatchingJobsForUser:', error);
    return [];
  }
}

// Get unread message count using our optimized function
export async function getUnreadMessageCount(userId: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .rpc('get_unread_message_count', { user_id: userId });
      
    if (error) {
      console.error('Error getting unread message count:', error);
      return 0;
    }
    
    return data || 0;
  } catch (error) {
    console.error('Exception in getUnreadMessageCount:', error);
    return 0;
  }
}

// Improved job search with index utilization
export async function searchJobsOptimized(filters: any): Promise<any[]> {
  try {
    let query = supabase.from('jobs').select('*');
    
    // Apply status filter (uses index)
    query = query.eq('status', 'open');
    
    // Apply job type filter (uses index)
    if (filters.jobType) {
      query = query.eq('job_type', filters.jobType);
    }
    
    // Apply employer filter if present (uses index)
    if (filters.employerId) {
      query = query.eq('employer_id', filters.employerId);
    }
    
    // Apply limit and ordering
    query = query.order('created_at', { ascending: false }).limit(50);
      
    const { data, error } = await query;
      
    if (error) {
      console.error('Error searching jobs:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception in searchJobsOptimized:', error);
    return [];
  }
}

// Function to implement connection pooling retry logic
export async function executeWithRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 500
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      // Check if it's a connection or timeout error
      const isConnectionError = error?.message?.includes('connection') || 
                                error?.message?.includes('timeout');
      
      if (!isConnectionError) {
        // If it's not a connection error, don't retry
        throw error;
      }
      
      // Exponential backoff
      const backoffTime = delay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, backoffTime));
    }
  }
  
  throw lastError;
}
