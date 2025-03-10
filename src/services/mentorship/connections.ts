
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MentorshipConnection } from "./types";

// Get a user's mentor connections (where user is mentee)
export const getMentorConnections = async (userId: string): Promise<MentorshipConnection[]> => {
  try {
    const { data, error } = await supabase
      .from('mentorship_connections')
      .select(`
        *,
        mentor:mentor_id (
          id,
          user_id,
          is_mentor,
          years_experience,
          industry,
          mentor_bio,
          mentoring_topics,
          availability,
          profiles:user_id (
            full_name,
            avatar_url,
            military_branch
          )
        )
      `)
      .eq('mentee_id', userId);
    
    if (error) throw error;
    
    return data.map(connection => {
      const mentorProfile = connection.mentor as any;
      return {
        ...connection,
        status: connection.status as 'pending' | 'active' | 'declined' | 'completed',
        mentor: mentorProfile ? {
          ...mentorProfile,
          user_name: mentorProfile.profiles?.full_name || '',
          user_avatar: mentorProfile.profiles?.avatar_url || '',
          military_branch: mentorProfile.profiles?.military_branch || ''
        } : undefined
      } as MentorshipConnection;
    });
  } catch (error) {
    console.error("Error in getMentorConnections:", error);
    return [];
  }
};

// Get a user's mentee connections (where user is mentor)
export const getMenteeConnections = async (userId: string): Promise<MentorshipConnection[]> => {
  try {
    const { data, error } = await supabase
      .from('mentorship_connections')
      .select(`
        *,
        mentee:mentee_id (
          id,
          user_id,
          is_mentor,
          years_experience,
          industry,
          mentor_bio,
          mentoring_topics,
          availability,
          profiles:user_id (
            full_name,
            avatar_url,
            military_branch
          )
        )
      `)
      .eq('mentor_id', userId);
    
    if (error) throw error;
    
    return data.map(connection => {
      const menteeProfile = connection.mentee as any;
      return {
        ...connection,
        status: connection.status as 'pending' | 'active' | 'declined' | 'completed',
        mentee: menteeProfile ? {
          ...menteeProfile,
          user_name: menteeProfile.profiles?.full_name || '',
          user_avatar: menteeProfile.profiles?.avatar_url || '',
          military_branch: menteeProfile.profiles?.military_branch || ''
        } : undefined
      } as MentorshipConnection;
    });
  } catch (error) {
    console.error("Error in getMenteeConnections:", error);
    return [];
  }
};

// Create a mentorship connection request
export const createConnectionRequest = async (mentorId: string, menteeId: string): Promise<MentorshipConnection | null> => {
  try {
    // Check if connection already exists
    const { data: existingConnection } = await supabase
      .from('mentorship_connections')
      .select('*')
      .or(`and(mentor_id.eq.${mentorId},mentee_id.eq.${menteeId}),and(mentor_id.eq.${menteeId},mentee_id.eq.${mentorId})`)
      .maybeSingle();
    
    if (existingConnection) {
      toast.error('A connection with this mentor already exists');
      return null;
    }
    
    const { data, error } = await supabase
      .from('mentorship_connections')
      .insert({
        mentor_id: mentorId,
        mentee_id: menteeId,
        status: 'pending'
      })
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Connection request sent');
    return {
      ...data,
      status: data.status as 'pending' | 'active' | 'declined' | 'completed'
    };
  } catch (error) {
    console.error("Error in createConnectionRequest:", error);
    toast.error('Failed to send connection request');
    return null;
  }
};

// Update a connection status
export const updateConnectionStatus = async (connectionId: string, status: 'active' | 'declined' | 'completed'): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('mentorship_connections')
      .update({ status })
      .eq('id', connectionId);
    
    if (error) throw error;
    
    const statusMessages = {
      active: 'Connection accepted',
      declined: 'Connection declined',
      completed: 'Mentorship marked as completed'
    };
    
    toast.success(statusMessages[status]);
    return true;
  } catch (error) {
    console.error("Error in updateConnectionStatus:", error);
    toast.error('Failed to update connection status');
    return false;
  }
};

// Helper to get all user connections
export const getUserConnections = async (userId: string): Promise<MentorshipConnection[]> => {
  try {
    const mentorConnections = await getMentorConnections(userId);
    const menteeConnections = await getMenteeConnections(userId);
    
    return [...mentorConnections, ...menteeConnections];
  } catch (error) {
    console.error("Error in getUserConnections:", error);
    return [];
  }
};
