
import { supabase } from "@/integrations/supabase/client";
import { MentorshipMessage } from "./types";
import { toast } from "sonner";

// Get messages for a connection
export const getConnectionMessages = async (connectionId: string): Promise<MentorshipMessage[]> => {
  try {
    // First, get the messages
    const { data: messagesData, error: messagesError } = await supabase
      .from('mentorship_messages')
      .select('*')
      .eq('connection_id', connectionId)
      .order('created_at', { ascending: true });
    
    if (messagesError) throw messagesError;
    
    // Create a set of unique sender IDs to fetch their profiles
    const senderIds = [...new Set(messagesData.map(message => message.sender_id))];
    
    // Fetch all relevant profiles in a single query
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .in('id', senderIds);
    
    if (profilesError) throw profilesError;
    
    // Create a map of user_id to profile data for quick lookups
    const profilesMap = profilesData.reduce((map, profile) => {
      map[profile.id] = profile;
      return map;
    }, {});
    
    // Combine messages with sender profile data
    return messagesData.map(message => {
      const senderProfile = profilesMap[message.sender_id] || {};
      return {
        ...message,
        sender_name: senderProfile.full_name || '',
        sender_avatar: senderProfile.avatar_url || ''
      };
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
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

// Set up real-time subscription to messages for a connection
export const subscribeToMessages = (connectionId: string, callback: (message: MentorshipMessage) => void) => {
  const subscription = supabase
    .channel(`mentorship_messages:${connectionId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'mentorship_messages',
        filter: `connection_id=eq.${connectionId}`
      },
      (payload) => {
        const newMessage = payload.new as MentorshipMessage;
        callback(newMessage);
      }
    )
    .subscribe();
  
  return () => {
    subscription.unsubscribe();
  };
};
