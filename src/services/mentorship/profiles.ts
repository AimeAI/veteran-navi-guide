
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
      military_branch: profile.user?.military_branch,
      user_name: profile.user?.full_name,
      user_avatar: profile.user?.avatar_url
    }));
    
    return profiles as MentorshipProfile[];
  } catch (error) {
    console.error('Error fetching mentorship profiles:', error);
    return [];
  }
};

// Get all available mentors
export const getAvailableMentors = async (): Promise<MentorshipProfile[]> => {
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
      .eq('is_mentor', true);
    
    if (error) throw error;
    
    // Map the joined data to our expected format
    const profiles = data.map(profile => ({
      ...profile,
      full_name: profile.user?.full_name,
      avatar_url: profile.user?.avatar_url,
      military_branch: profile.user?.military_branch,
      user_name: profile.user?.full_name,
      user_avatar: profile.user?.avatar_url
    }));
    
    return profiles as MentorshipProfile[];
  } catch (error) {
    console.error('Error fetching mentors:', error);
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
      military_branch: data.user?.military_branch,
      user_name: data.user?.full_name,
      user_avatar: data.user?.avatar_url
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
      military_branch: data.user?.military_branch,
      user_name: data.user?.full_name,
      user_avatar: data.user?.avatar_url
    };
    
    return profileData as MentorshipProfile;
  } catch (error) {
    console.error('Error fetching mentorship profile:', error);
    return null;
  }
};

// Get mentorship profile by email
export const getMentorshipProfile = async (email: string): Promise<MentorshipProfile | null> => {
  try {
    // First get the user by email
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();
    
    if (userError) throw userError;
    
    if (!userData) return null;
    
    // Then get the mentorship profile by user ID
    return getProfileByUserId(userData.id);
  } catch (error) {
    console.error('Error fetching mentorship profile by email:', error);
    return null;
  }
};

// Create a new mentorship profile
export const createProfile = async (profile: Omit<MentorshipProfile, 'id' | 'created_at' | 'updated_at' | 'full_name' | 'avatar_url' | 'military_branch' | 'user_name' | 'user_avatar'>): Promise<MentorshipProfile | null> => {
  try {
    // Ensure user_id is included
    if (!profile.user_id) {
      throw new Error('user_id is required when creating a profile');
    }

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
      military_branch: data.user?.military_branch,
      user_name: data.user?.full_name,
      user_avatar: data.user?.avatar_url
    };
    
    return profileData as MentorshipProfile;
  } catch (error) {
    console.error('Error creating mentorship profile:', error);
    return null;
  }
};

// Update a mentorship profile
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

    // Remove fields that shouldn't be stored directly
    const { full_name, avatar_url, military_branch, user_name, user_avatar, ...validUpdates } = updates;

    const { data, error } = await supabase
      .from('mentorship_profiles')
      .update(validUpdates)
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
      military_branch: data.user?.military_branch,
      user_name: data.user?.full_name,
      user_avatar: data.user?.avatar_url
    };
    
    return profileData as MentorshipProfile;
  } catch (error) {
    console.error('Error updating mentorship profile:', error);
    return null;
  }
};

// Create or update a profile by email (upsert functionality)
export const upsertMentorshipProfile = async (profileData: Partial<MentorshipProfile>): Promise<MentorshipProfile | null> => {
  try {
    // Get user id from email or use provided user_id
    let userId = profileData.user_id;
    if (!userId && typeof window !== 'undefined') {
      const { data } = await supabase.auth.getSession();
      userId = data.session?.user.id;
    }
    
    if (!userId) {
      throw new Error('User ID is required to upsert profile');
    }
    
    // Check if profile exists
    const existingProfile = await getProfileByUserId(userId);
    
    if (existingProfile) {
      // Update existing profile
      return updateProfile(existingProfile.id, {
        ...profileData,
        user_id: userId
      });
    } else {
      // Create new profile
      return createProfile({
        ...profileData,
        user_id: userId,
      } as Omit<MentorshipProfile, 'id' | 'created_at' | 'updated_at' | 'full_name' | 'avatar_url' | 'military_branch' | 'user_name' | 'user_avatar'>);
    }
  } catch (error) {
    console.error('Error upserting mentorship profile:', error);
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
