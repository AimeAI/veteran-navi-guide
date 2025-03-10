import { supabase } from "@/integrations/supabase/client";
import { MentorshipProfile } from "./types";

// Get all mentorship profiles
export const getAllProfiles = async (): Promise<MentorshipProfile[]> => {
  try {
    const { data, error } = await supabase
      .from('mentorship_profiles')
      .select(`
        *,
        user:user_id (
          full_name,
          avatar_url,
          military_branch
        )
      `);
    
    if (error) throw error;
    
    // Map the joined data to our expected format
    const profiles = data.map(profile => ({
      ...profile,
      full_name: profile.user?.full_name,
      avatar_url: profile.user?.avatar_url,
      military_branch: profile.user?.military_branch
    }));
    
    return profiles as MentorshipProfile[];
  } catch (error) {
    console.error('Error fetching mentorship profiles:', error);
    return [];
  }
};

// Get a single mentorship profile by ID
export const getProfileById = async (profileId: string): Promise<MentorshipProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('mentorship_profiles')
      .select(`
        *,
        user:user_id (
          full_name,
          avatar_url,
          military_branch
        )
      `)
      .eq('id', profileId)
      .single();
    
    if (error) throw error;
    
    // Map the joined data to our expected format
    const profileData = {
      ...data,
      full_name: data.user?.full_name,
      avatar_url: data.user?.avatar_url,
      military_branch: data.user?.military_branch
    };
    
    return profileData as MentorshipProfile;
  } catch (error) {
    console.error('Error fetching mentorship profile:', error);
    return null;
  }
};

// Get mentorship profile by user ID
export const getProfileByUserId = async (userId: string): Promise<MentorshipProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('mentorship_profiles')
      .select(`
        *,
        user:user_id (
          full_name,
          avatar_url,
          military_branch
        )
      `)
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    
     // Map the joined data to our expected format
    const profileData = {
      ...data,
      full_name: data.user?.full_name,
      avatar_url: data.user?.avatar_url,
      military_branch: data.user?.military_branch
    };
    
    return profileData as MentorshipProfile;
  } catch (error) {
    console.error('Error fetching mentorship profile:', error);
    return null;
  }
};

// Create a new mentorship profile
export const createProfile = async (profile: Omit<MentorshipProfile, 'id' | 'created_at' | 'updated_at' | 'full_name' | 'avatar_url' | 'military_branch'>): Promise<MentorshipProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('mentorship_profiles')
      .insert(profile)
      .select(`
        *,
        user:user_id (
          full_name,
          avatar_url,
          military_branch
        )
      `)
      .single();
    
    if (error) throw error;
    
    // Map the joined data to our expected format
    const profileData = {
      ...data,
      full_name: data.user?.full_name,
      avatar_url: data.user?.avatar_url,
      military_branch: data.user?.military_branch
    };
    
    return profileData as MentorshipProfile;
  } catch (error) {
    console.error('Error creating mentorship profile:', error);
    return null;
  }
};

// Fix the updateProfile function to handle the user_id requirement
export const updateProfile = async (profileId: string, updates: Partial<MentorshipProfile>): Promise<MentorshipProfile | null> => {
  try {
    // Ensure user_id is included for required field in DB
    if (!updates.user_id) {
      // Get the existing profile to get the user_id
      const profile = await getProfileById(profileId);
      if (profile) {
        updates.user_id = profile.user_id;
      } else {
        throw new Error('Could not find profile to update');
      }
    }

    const { data, error } = await supabase
      .from('mentorship_profiles')
      .update(updates as any)
      .eq('id', profileId)
      .select(`
        *,
        user:user_id (
          full_name,
          avatar_url,
          military_branch
        )
      `)
      .single();
    
    if (error) throw error;
    
    // Map the joined data to our expected format
    const profileData = {
      ...data,
      full_name: data.user?.full_name,
      avatar_url: data.user?.avatar_url,
      military_branch: data.user?.military_branch
    };
    
    return profileData as MentorshipProfile;
  } catch (error) {
    console.error('Error updating mentorship profile:', error);
    return null;
  }
};

// Delete a mentorship profile
export const deleteProfile = async (profileId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('mentorship_profiles')
      .delete()
      .eq('id', profileId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting mentorship profile:', error);
    return false;
  }
};
