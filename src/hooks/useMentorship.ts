
import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/context/UserContext';
import { 
  MentorshipProfile, 
  MentorshipConnection,
  getMentorshipMessages,
  getUserMentorshipProfile,
  getUserMentorshipConnections,
  getAvailableMentors,
  upsertMentorshipProfile,
  requestMentorship,
  updateConnectionStatus,
  sendMentorshipMessage,
  subscribeToMessages,
  createMentorshipMeeting,
  getMentorshipMeetings,
  updateMeetingStatus,
  MentorshipMessage,
  MentorshipMeeting
} from '@/services/mentorshipService';

export const useMentorship = () => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<MentorshipProfile | null>(null);
  const [availableMentors, setAvailableMentors] = useState<MentorshipProfile[]>([]);
  const [connections, setConnections] = useState<MentorshipConnection[]>([]);
  const [selectedConnection, setSelectedConnection] = useState<MentorshipConnection | null>(null);
  const [messages, setMessages] = useState<MentorshipMessage[]>([]);
  const [meetings, setMeetings] = useState<MentorshipMeeting[]>([]);

  // Load user's mentorship profile
  const loadUserProfile = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    const profile = await getUserMentorshipProfile(user.email);
    setUserProfile(profile);
    setIsLoading(false);
  }, [user]);

  // Load available mentors
  const loadMentors = useCallback(async () => {
    setIsLoading(true);
    const mentors = await getAvailableMentors();
    setAvailableMentors(mentors);
    setIsLoading(false);
  }, []);

  // Load user's connections
  const loadConnections = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    const userConnections = await getUserMentorshipConnections(user.email);
    setConnections(userConnections);
    setIsLoading(false);
  }, [user]);

  // Create or update user's mentorship profile
  const updateProfile = useCallback(async (profile: Partial<MentorshipProfile>) => {
    const updatedProfile = await upsertMentorshipProfile(profile);
    if (updatedProfile) {
      setUserProfile(updatedProfile);
      return true;
    }
    return false;
  }, []);

  // Request mentorship from a mentor
  const requestMentorConnection = useCallback(async (mentorProfileId: string) => {
    const success = await requestMentorship(mentorProfileId);
    if (success) {
      await loadConnections();
    }
    return success;
  }, [loadConnections]);

  // Update connection status (accept/decline/complete)
  const updateMentorshipStatus = useCallback(async (connectionId: string, status: 'active' | 'declined' | 'completed') => {
    const success = await updateConnectionStatus(connectionId, status);
    if (success) {
      await loadConnections();
      
      // Update selected connection if it's the one being modified
      if (selectedConnection && selectedConnection.id === connectionId) {
        setSelectedConnection(prev => prev ? { ...prev, status } : null);
      }
    }
    return success;
  }, [loadConnections, selectedConnection]);

  // Select a connection to view details
  const selectConnection = useCallback(async (connection: MentorshipConnection) => {
    setSelectedConnection(connection);
    
    // Load messages for this connection
    const connectionMessages = await getMentorshipMessages(connection.id);
    setMessages(connectionMessages);
    
    // Load meetings for this connection
    const connectionMeetings = await getMentorshipMeetings(connection.id);
    setMeetings(connectionMeetings);
  }, []);

  // Send a message in the selected connection
  const sendMessage = useCallback(async (content: string) => {
    if (!selectedConnection) return false;
    
    const success = await sendMentorshipMessage(selectedConnection.id, content);
    if (success) {
      // Message will be added through the real-time subscription
      return true;
    }
    return false;
  }, [selectedConnection]);

  // Schedule a meeting in the selected connection
  const scheduleMeeting = useCallback(async (meetingData: Omit<MentorshipMeeting, 'id' | 'connection_id' | 'created_at' | 'updated_at'>) => {
    if (!selectedConnection) return null;
    
    const meeting = await createMentorshipMeeting({
      ...meetingData,
      connection_id: selectedConnection.id
    });
    
    if (meeting) {
      setMeetings(prev => [...prev, meeting]);
      return meeting;
    }
    return null;
  }, [selectedConnection]);

  // Update a meeting's status
  const changeMeetingStatus = useCallback(async (meetingId: string, status: 'scheduled' | 'completed' | 'cancelled') => {
    const success = await updateMeetingStatus(meetingId, status);
    if (success) {
      setMeetings(prev => 
        prev.map(meeting => 
          meeting.id === meetingId ? { ...meeting, status } : meeting
        )
      );
    }
    return success;
  }, []);

  // Setup real-time messages subscription
  useEffect(() => {
    if (!selectedConnection) return;
    
    const unsubscribe = subscribeToMessages(selectedConnection.id, (newMessage) => {
      setMessages(prev => [...prev, newMessage]);
    });
    
    return () => {
      unsubscribe();
    };
  }, [selectedConnection]);

  // Load initial data
  useEffect(() => {
    if (user) {
      loadUserProfile();
      loadConnections();
    }
  }, [user, loadUserProfile, loadConnections]);

  return {
    isLoading,
    userProfile,
    availableMentors,
    connections,
    selectedConnection,
    messages,
    meetings,
    loadUserProfile,
    loadMentors,
    loadConnections,
    updateProfile,
    requestMentorConnection,
    updateMentorshipStatus,
    selectConnection,
    sendMessage,
    scheduleMeeting,
    changeMeetingStatus
  };
};
