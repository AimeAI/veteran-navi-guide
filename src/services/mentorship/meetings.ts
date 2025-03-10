
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MentorshipMeeting } from "./types";

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
