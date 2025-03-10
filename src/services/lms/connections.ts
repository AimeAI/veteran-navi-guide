
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LmsConnection } from "./types";

// Get a user's LMS connections
export const getUserLmsConnections = async (userId: string): Promise<LmsConnection[]> => {
  try {
    const { data, error } = await supabase
      .from('lms_connections')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true);
    
    if (error) throw error;
    
    return data as LmsConnection[];
  } catch (error) {
    console.error('Error fetching LMS connections:', error);
    toast.error('Failed to load LMS connections');
    return [];
  }
};

// Add a new LMS connection
export const addLmsConnection = async (connection: Omit<LmsConnection, 'id' | 'connected_at'>): Promise<LmsConnection | null> => {
  try {
    const { data, error } = await supabase
      .from('lms_connections')
      .insert({
        ...connection,
        connected_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('LMS connected successfully');
    return data as LmsConnection;
  } catch (error) {
    console.error('Error connecting LMS:', error);
    toast.error('Failed to connect LMS');
    return null;
  }
};

// Remove an LMS connection
export const removeLmsConnection = async (connectionId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('lms_connections')
      .update({ is_active: false })
      .eq('id', connectionId);
    
    if (error) throw error;
    
    toast.success('LMS disconnected successfully');
    return true;
  } catch (error) {
    console.error('Error disconnecting LMS:', error);
    toast.error('Failed to disconnect LMS');
    return false;
  }
};
