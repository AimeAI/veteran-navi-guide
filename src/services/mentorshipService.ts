
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface MentorshipProfile {
  id: string;
  user_id: string;
  is_mentor: boolean;
  years_experience?: number;
  max_mentees?: number;
  created_at: string;
  updated_at: string;
  industry?: string;
  mentor_bio?: string;
  mentoring_topics?: string[];
  availability?: string;
  user_name?: string;
  user_avatar?: string;
  military_branch?: string;
}

export interface MentorshipConnection {
  id: string;
  mentor_id: string;
  mentee_id: string;
  status: 'pending' | 'active' | 'declined' | 'completed';
  created_at: string;
  updated_at: string;
  mentor?: MentorshipProfile;
  mentee?: MentorshipProfile;
}

export interface MentorshipMessage {
  id: string;
  connection_id: string;
  sender_id: string;
  content: string;
  read: boolean;
  created_at: string;
  sender_name?: string;
  sender_avatar?: string;
}

export interface MentorshipMeeting {
  id: string;
  connection_id: string;
  title: string;
  description?: string;
  meeting_time: string;
  duration: number;
  meeting_link?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

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

// Get messages for a connection
export const getConnectionMessages = async (connectionId: string): Promise<MentorshipMessage[]> => {
  try {
    const { data, error } = await supabase
      .from('mentorship_messages')
      .select(`
        *,
        sender:sender_id (
          full_name,
          avatar_url
        )
      `)
      .eq('connection_id', connectionId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    return data.map(message => ({
      ...message,
      sender_name: message.sender?.full_name || '',
      sender_avatar: message.sender?.avatar_url || ''
    }));
  } catch (error) {
    console.error("Error in getConnectionMessages:", error);
    return [];
  }
};

// Send a message in a connection
export const sendMessage = async (connectionId: string, senderId: string, content: string): Promise<MentorshipMessage | null> => {
  try {
    const { data, error } = await supabase
      .from('mentorship_messages')
      .insert({
        connection_id: connectionId,
        sender_id: senderId,
        content,
        read: false
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error in sendMessage:", error);
    toast.error('Failed to send message');
    return null;
  }
};

// Mark messages as read
export const markMessagesAsRead = async (connectionId: string, userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('mentorship_messages')
      .update({ read: true })
      .eq('connection_id', connectionId)
      .neq('sender_id', userId)
      .eq('read', false);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error in markMessagesAsRead:", error);
    return false;
  }
};

// Schedule a meeting
export const scheduleMeeting = async (meeting: Omit<MentorshipMeeting, 'id' | 'created_at' | 'updated_at'>): Promise<MentorshipMeeting | null> => {
  try {
    const { data, error } = await supabase
      .from('mentorship_meetings')
      .insert(meeting)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Meeting scheduled successfully');
    return {
      ...data,
      status: data.status as 'scheduled' | 'completed' | 'cancelled'
    };
  } catch (error) {
    console.error("Error in scheduleMeeting:", error);
    toast.error('Failed to schedule meeting');
    return null;
  }
};

// Get meetings for a connection
export const getMentorshipMeetings = async (connectionId: string): Promise<MentorshipMeeting[]> => {
  try {
    const { data, error } = await supabase
      .from('mentorship_meetings')
      .select('*')
      .eq('connection_id', connectionId)
      .order('meeting_time', { ascending: true });
    
    if (error) throw error;
    
    return data.map(meeting => ({
      ...meeting,
      status: meeting.status as 'scheduled' | 'completed' | 'cancelled'
    }));
  } catch (error) {
    console.error("Error in getMentorshipMeetings:", error);
    return [];
  }
};

// Update meeting status
export const updateMeetingStatus = async (meetingId: string, status: 'completed' | 'cancelled'): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('mentorship_meetings')
      .update({ status })
      .eq('id', meetingId);
    
    if (error) throw error;
    
    const statusMessages = {
      completed: 'Meeting marked as completed',
      cancelled: 'Meeting cancelled'
    };
    
    toast.success(statusMessages[status]);
    return true;
  } catch (error) {
    console.error("Error in updateMeetingStatus:", error);
    toast.error('Failed to update meeting status');
    return false;
  }
};
