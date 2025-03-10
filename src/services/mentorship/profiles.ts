
import { supabase } from "@/integrations/supabase/client";
import { MentorshipProfile } from "./types";

const mapProfileData = (profile: any): MentorshipProfile => ({
  id: profile.id,
  user_id: profile.user_id,
  is_mentor: profile.is_mentor,
  years_experience: profile.years_experience,
  max_mentees: profile.max_mentees,
  created_at: profile.created_at,
  updated_at: profile.updated_at,
  industry: profile.industry,
  mentor_bio: profile.mentor_bio,
  mentoring_topics: profile.mentoring_topics,
  availability: profile.availability,
  full_name: profile.user?.full_name,
  avatar_url: profile.user?.avatar_url,
  military_branch: profile.user?.military_branch,
  user_name: profile.user?.full_name,
  user_avatar: profile.user?.avatar_url
});

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
    return data.map(mapProfileData);
  } catch (error) {
    console.error('Error fetching mentors:', error);
    return [];
  }
};

// Get a single profile by ID
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
    return mapProfileData(data);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};

// Get profile by user ID
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
    return mapProfileData(data);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};

// Create or update a mentorship profile
export const upsertMentorshipProfile = async (profile: Partial<MentorshipProfile>): Promise<MentorshipProfile | null> => {
  try {
    // Ensure we have a user_id
    if (!profile.user_id) {
      throw new Error('user_id is required for upserting profile');
    }

    const { data, error } = await supabase
      .from('mentorship_profiles')
      .upsert({
        user_id: profile.user_id,
        is_mentor: profile.is_mentor ?? false,
        years_experience: profile.years_experience,
        max_mentees: profile.max_mentees,
        industry: profile.industry,
        mentor_bio: profile.mentor_bio,
        mentoring_topics: profile.mentoring_topics,
        availability: profile.availability
      })
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
    return mapProfileData(data);
  } catch (error) {
    console.error('Error upserting profile:', error);
    return null;
  }
};
