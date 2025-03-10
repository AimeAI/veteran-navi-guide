import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface MentorshipProfile {
  id: string;
  user_id: string;
  is_mentor: boolean;
  mentor_bio?: string;
  mentoring_topics?: string[];
  years_experience?: number;
  availability?: string;
  max_mentees?: number;
  industry?: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  full_name?: string;
  avatar_url?: string;
  military_branch?: string;
}

export interface MentorshipConnection {
  id: string;
  mentor_id: string;
  mentee_id: string;
  status: 'pending' | 'active' | 'declined' | 'completed';
  created_at: string;
  updated_at: string;
  // Joined fields
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
  // Joined fields
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

// Get all available mentors
export const getAvailableMentors = async (): Promise<MentorshipProfile[]> => {
  try {
    const { data, error } = await supabase
      .from('mentorship_profiles')
      .select(`
        *,
        profiles:user_id (full_name, avatar_url, military_branch)
      `)
      .eq('is_mentor', true);
    
    if (error) throw error;
    
    // Format the data to include profile information
    return data.map(mentor => ({
      ...mentor,
      full_name: mentor.profiles?.full_name || '',
      avatar_url: mentor.profiles?.avatar_url || '',
      military_branch: mentor.profiles?.military_branch || ''
    }));
  } catch (error) {
    console.error('Error fetching mentors:', error);
    toast.error('Failed to load mentors');
    return [];
  }
};

// Get a user's mentorship profile
export const getUserMentorshipProfile = async (userId: string): Promise<MentorshipProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('mentorship_profiles')
      .select(`
        *,
        profiles:user_id (full_name, avatar_url, military_branch)
      `)
      .eq('user_id', userId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No profile found
      }
      throw error;
    }
    
    return {
      ...data,
      full_name: data.profiles?.full_name || '',
      avatar_url: data.profiles?.avatar_url || '',
      military_branch: data.profiles?.military_branch || ''
    };
  } catch (error) {
    console.error('Error fetching mentorship profile:', error);
    toast.error('Failed to load mentorship profile');
    return null;
  }
};

// Create or update a mentorship profile
export const upsertMentorshipProfile = async (profile: Partial<MentorshipProfile>): Promise<MentorshipProfile | null> => {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('User not authenticated');
    
    const { data: existingProfile } = await supabase
      .from('mentorship_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();
    
    const { data, error } = await supabase
      .from('mentorship_profiles')
      .upsert({
        ...(existingProfile ? { id: existingProfile.id } : {}),
        user_id: user.id,
        ...profile
      })
      .select(`
        *,
        profiles:user_id (full_name, avatar_url, military_branch)
      `)
      .single();
    
    if (error) throw error;
    
    toast.success(existingProfile ? 'Profile updated successfully' : 'Profile created successfully');
    
    return {
      ...data,
      full_name: data.profiles?.full_name || '',
      avatar_url: data.profiles?.avatar_url || '',
      military_branch: data.profiles?.military_branch || ''
    };
  } catch (error) {
    console.error('Error updating mentorship profile:', error);
    toast.error('Failed to update profile');
    return null;
  }
};

// Get user's mentorship connections (as mentor or mentee)
export const getUserMentorshipConnections = async (userId: string): Promise<MentorshipConnection[]> => {
  try {
    // First get the user's profile id
    const { data: userProfile, error: profileError } = await supabase
      .from('mentorship_profiles')
      .select('id')
      .eq('user_id', userId)
      .single();
    
    if (profileError) {
      if (profileError.code === 'PGRST116') {
        return []; // No profile found
      }
      throw profileError;
    }
    
    // Then get connections where user is mentor or mentee
    const { data, error } = await supabase
      .from('mentorship_connections')
      .select(`
        *,
        mentor:mentor_id (
          *,
          profiles:user_id (full_name, avatar_url, military_branch)
        ),
        mentee:mentee_id (
          *,
          profiles:user_id (full_name, avatar_url, military_branch)
        )
      `)
      .or(`mentor_id.eq.${userProfile.id},mentee_id.eq.${userProfile.id}`);
    
    if (error) throw error;
    
    // Format the connections with profile information and type cast for safety
    return data.map(connection => {
      // Type assertion to handle status
      const typedStatus = connection.status as 'pending' | 'active' | 'declined' | 'completed';
      
      const formattedConnection: MentorshipConnection = {
        ...connection,
        status: typedStatus,
        mentor: connection.mentor ? {
          ...connection.mentor,
          full_name: connection.mentor.profiles?.full_name || '',
          avatar_url: connection.mentor.profiles?.avatar_url || '',
          military_branch: connection.mentor.profiles?.military_branch || ''
        } : undefined,
        mentee: connection.mentee ? {
          ...connection.mentee,
          full_name: connection.mentee.profiles?.full_name || '',
          avatar_url: connection.mentee.profiles?.avatar_url || '',
          military_branch: connection.mentee.profiles?.military_branch || ''
        } : undefined
      };
      
      return formattedConnection;
    });
  } catch (error) {
    console.error('Error fetching mentorship connections:', error);
    toast.error('Failed to load mentorship connections');
    return [];
  }
};

// Request a mentorship connection
export const requestMentorship = async (mentorProfileId: string): Promise<boolean> => {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('User not authenticated');
    
    // Get mentee profile id
    const { data: menteeProfile, error: profileError } = await supabase
      .from('mentorship_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();
    
    if (profileError) {
      if (profileError.code === 'PGRST116') {
        throw new Error('Please create a mentorship profile first');
      }
      throw profileError;
    }
    
    // Create the connection
    const { error } = await supabase
      .from('mentorship_connections')
      .insert({
        mentor_id: mentorProfileId,
        mentee_id: menteeProfile.id,
        status: 'pending'
      });
    
    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        toast.error('You have already requested mentorship from this mentor');
        return false;
      }
      throw error;
    }
    
    toast.success('Mentorship request sent successfully');
    return true;
  } catch (error) {
    console.error('Error requesting mentorship:', error);
    toast.error(error instanceof Error ? error.message : 'Failed to send mentorship request');
    return false;
  }
};

// Update a mentorship connection status
export const updateConnectionStatus = async (connectionId: string, status: 'active' | 'declined' | 'completed'): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('mentorship_connections')
      .update({ status })
      .eq('id', connectionId);
    
    if (error) throw error;
    
    toast.success(`Mentorship ${status === 'active' ? 'accepted' : status}`);
    return true;
  } catch (error) {
    console.error('Error updating mentorship status:', error);
    toast.error('Failed to update mentorship status');
    return false;
  }
};

// Get messages for a mentorship connection
export const getMentorshipMessages = async (connectionId: string): Promise<MentorshipMessage[]> => {
  try {
    const { data, error } = await supabase
      .from('mentorship_messages')
      .select(`
        *,
        profiles:sender_id (full_name, avatar_url)
      `)
      .eq('connection_id', connectionId)
      .order('created_at');
    
    if (error) throw error;
    
    // Format the messages with sender information
    return data.map(message => ({
      ...message,
      sender_name: message.profiles?.full_name || '',
      sender_avatar: message.profiles?.avatar_url || ''
    }));
  } catch (error) {
    console.error('Error fetching mentorship messages:', error);
    toast.error('Failed to load messages');
    return [];
  }
};

// Send a message in a mentorship connection
export const sendMentorshipMessage = async (connectionId: string, content: string): Promise<boolean> => {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('User not authenticated');
    
    const { error } = await supabase
      .from('mentorship_messages')
      .insert({
        connection_id: connectionId,
        sender_id: user.id,
        content
      });
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error sending message:', error);
    toast.error('Failed to send message');
    return false;
  }
};

// Subscribe to messages for real-time updates
export const subscribeToMessages = (connectionId: string, callback: (message: MentorshipMessage) => void) => {
  const subscription = supabase
    .channel(`messages:${connectionId}`)
    .on('postgres_changes', { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'mentorship_messages',
      filter: `connection_id=eq.${connectionId}`
    }, async (payload) => {
      // Get the sender information
      const { data } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', payload.new.sender_id)
        .single();
      
      // Call the callback with the formatted message
      callback({
        ...payload.new,
        sender_name: data?.full_name,
        sender_avatar: data?.avatar_url
      } as MentorshipMessage);
    })
    .subscribe();
  
  // Return function to unsubscribe
  return () => {
    supabase.removeChannel(subscription);
  };
};

// Create a meeting for a mentorship connection
export const createMentorshipMeeting = async (meeting: Omit<MentorshipMeeting, 'id' | 'created_at' | 'updated_at'>): Promise<MentorshipMeeting | null> => {
  try {
    const { data, error } = await supabase
      .from('mentorship_meetings')
      .insert(meeting)
      .select()
      .single();
    
    if (error) throw error;
    
    // Type assertion for status
    const typedMeeting: MentorshipMeeting = {
      ...data,
      status: data.status as 'scheduled' | 'completed' | 'cancelled'
    };
    
    toast.success('Meeting scheduled successfully');
    return typedMeeting;
  } catch (error) {
    console.error('Error creating meeting:', error);
    toast.error('Failed to schedule meeting');
    return null;
  }
};

// Get meetings for a mentorship connection
export const getMentorshipMeetings = async (connectionId: string): Promise<MentorshipMeeting[]> => {
  try {
    const { data, error } = await supabase
      .from('mentorship_meetings')
      .select('*')
      .eq('connection_id', connectionId)
      .order('meeting_time');
    
    if (error) throw error;
    
    // Type assertion for status in each meeting
    return data.map(meeting => ({
      ...meeting,
      status: meeting.status as 'scheduled' | 'completed' | 'cancelled'
    }));
  } catch (error) {
    console.error('Error fetching meetings:', error);
    toast.error('Failed to load meetings');
    return [];
  }
};

// Update a meeting's status
export const updateMeetingStatus = async (meetingId: string, status: 'scheduled' | 'completed' | 'cancelled'): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('mentorship_meetings')
      .update({ status })
      .eq('id', meetingId);
    
    if (error) throw error;
    
    toast.success(`Meeting ${status}`);
    return true;
  } catch (error) {
    console.error('Error updating meeting status:', error);
    toast.error('Failed to update meeting');
    return false;
  }
};
