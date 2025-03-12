
import { supabase } from "@/integrations/supabase/client";

// Helper function to check if a user is authenticated
export async function isUserAuthenticated(): Promise<boolean> {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
}

// Helper function to get the current user's ID
export async function getCurrentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id || null;
}

// Helper function to check if user has already submitted a review for an employer
export async function hasUserReviewedEmployer(employerId: string): Promise<boolean> {
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
}

