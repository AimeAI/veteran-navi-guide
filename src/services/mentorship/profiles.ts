
import { supabase } from "@/integrations/supabase/client";
import { MentorshipProfile } from "./types";

// Get a user's mentorship profile
export const getMentorshipProfile = async (userId: string): Promise<MentorshipProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('mentorship_profiles')
      .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url,
          military_branch
        )
      `)
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error("Error fetching mentorship profile:", error);
      return null;
    }

    if (!data) {
      return null;
    }

    const profile = {
      ...data,
      user_name: data.profiles?.full_name || '',
      user_avatar: data.profiles?.avatar_url || '',
      military_branch: data.profiles?.military_branch || ''
    } as MentorshipProfile;

    return profile;
  } catch (error) {
    console.error("Error in getMentorshipProfile:", error);
    return null;
  }
};

// Create or update a mentorship profile
export const upsertMentorshipProfile = async (profile: Partial<MentorshipProfile>): Promise<MentorshipProfile | null> => {
  try {
    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('mentorship_profiles')
      .select('id')
      .eq('user_id', profile.user_id)
      .single();

    let result;
    
    if (existingProfile) {
      // Update existing profile
      const { data, error } = await supabase
        .from('mentorship_profiles')
        .update(profile)
        .eq('id', existingProfile.id)
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url,
            military_branch
          )
        `)
        .single();
      
      if (error) throw error;
      result = data;
    } else {
      // Insert new profile
      const { data, error } = await supabase
        .from('mentorship_profiles')
        .insert(profile)
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url,
            military_branch
          )
        `)
        .single();
      
      if (error) throw error;
      result = data;
    }

    if (!result) {
      throw new Error('Failed to create or update profile');
    }

    const updatedProfile = {
      ...result,
      user_name: result.profiles?.full_name || '',
      user_avatar: result.profiles?.avatar_url || '',
      military_branch: result.profiles?.military_branch || ''
    } as MentorshipProfile;

    return updatedProfile;
  } catch (error) {
    console.error("Error in upsertMentorshipProfile:", error);
    return null;
  }
};

// Get available mentors
export const getAvailableMentors = async (): Promise<MentorshipProfile[]> => {
  try {
    const { data, error } = await supabase
      .from('mentorship_profiles')
      .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url,
          military_branch
        )
      `)
      .eq('is_mentor', true);
    
    if (error) throw error;
    
    const mentors = data.map(mentor => ({
      ...mentor,
      user_name: mentor.profiles?.full_name || '',
      user_avatar: mentor.profiles?.avatar_url || '',
      military_branch: mentor.profiles?.military_branch || ''
    })) as MentorshipProfile[];
    
    return mentors;
  } catch (error) {
    console.error("Error in getAvailableMentors:", error);
    return [];
  }
};
