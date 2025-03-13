
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
