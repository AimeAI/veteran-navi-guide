
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/context/UserContext';
import { 
  UserCircle2, 
  Users, 
  Calendar, 
  BookOpen, 
  Clock, 
  ChevronRight, 
  UserPlus, 
  CalendarPlus,
  MessageSquare,
  UserRound
} from 'lucide-react';
import { useMentorship } from '@/hooks/useMentorship';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import MentorshipProfileForm from '@/components/mentorship/MentorshipProfileForm';
import ConnectionsList from '@/components/mentorship/ConnectionsList';
import MentorshipChat from '@/components/mentorship/MentorshipChat';
import MeetingScheduler from '@/components/mentorship/MeetingScheduler';
import MeetingsList from '@/components/mentorship/MeetingsList';

const MentorshipDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const {
    isLoading,
    userProfile,
    connections,
    selectedConnection,
    messages,
    meetings,
    updateProfile,
    loadConnections,
    updateMentorshipStatus,
    selectConnection,
    sendMessage,
    scheduleMeeting,
    changeMeetingStatus
  } = useMentorship();

  const [activeTab, setActiveTab] = useState<string>('profile');

  useEffect(() => {
    if (userProfile && activeTab === 'profile') {
      setActiveTab('connections');
    }

    if (selectedConnection && activeTab === 'connections') {
      setActiveTab('conversation');
    }
  }, [userProfile, selectedConnection, activeTab]);

  const handleProfileSubmit = async (data: Partial<any>) => {
    await updateProfile(data);
    toast.success('Profile updated successfully');
    setActiveTab('connections');
  };

  const handleAcceptRequest = async (connectionId: string) => {
    await updateMentorshipStatus(connectionId, 'active');
    await loadConnections();
  };

  const handleDeclineRequest = async (connectionId: string) => {
    await updateMentorshipStatus(connectionId, 'declined');
    await loadConnections();
  };

  const handleCompleteMeeting = async (meetingId: string) => {
    await changeMeetingStatus(meetingId, 'completed');
  };

  const handleCancelMeeting = async (meetingId: string) => {
    await changeMeetingStatus(meetingId, 'cancelled');
  };

  const getConnectionName = (connection: any) => {
    const userIsMentor = connection.mentor?.user_id === user?.email;
    return userIsMentor 
      ? connection.mentee?.user_name || 'Mentee'
      : connection.mentor?.user_name || 'Mentor';
  };

  if (!user) {
    return (
      <div className="container py-10">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Mentorship</CardTitle>
            <CardDescription>
              You need to be logged in to access the mentorship program
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/login')} className="w-full">
              Log In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Mentorship Program</h1>
            <p className="text-gray-500 mt-1">Connect with mentors to help with your career transition</p>
          </div>
          <Button
            onClick={() => navigate('/mentorship/find')}
            className="whitespace-nowrap"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Find Mentors
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <UserRound className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="connections" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Users className="mr-2 h-4 w-4" />
              Connections
            </TabsTrigger>
            <TabsTrigger value="conversation" disabled={!selectedConnection} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <MessageSquare className="mr-2 h-4 w-4" />
              Conversation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Mentorship Profile</CardTitle>
                <CardDescription>
                  Set up your profile to connect with mentors or become a mentor yourself
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MentorshipProfileForm
                  initialData={userProfile || undefined}
                  onSubmit={handleProfileSubmit}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="connections" className="space-y-6">
            {userProfile ? (
              <ConnectionsList
                connections={connections}
                userIsMentor={userProfile.is_mentor}
                onSelectConnection={selectConnection}
                onAcceptRequest={handleAcceptRequest}
                onDeclineRequest={handleDeclineRequest}
                selectedConnectionId={selectedConnection?.id}
                isLoading={isLoading}
              />
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <p className="text-center text-gray-500 mb-4">
                    You need to create a mentorship profile first
                  </p>
                  <Button onClick={() => setActiveTab('profile')}>
                    Create Profile
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="conversation" className="space-y-6">
            {selectedConnection ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <MentorshipChat
                    messages={messages}
                    onSendMessage={sendMessage}
                    recipientName={getConnectionName(selectedConnection)}
                    isLoading={isLoading}
                  />
                </div>
                <div className="space-y-6">
                  <MeetingScheduler
                    onScheduleMeeting={scheduleMeeting}
                    isLoading={isLoading}
                  />
                  <MeetingsList
                    meetings={meetings}
                    onCompleteMeeting={handleCompleteMeeting}
                    onCancelMeeting={handleCancelMeeting}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="py-10 text-center">
                  <p className="text-gray-500">
                    Select a connection to view the conversation
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MentorshipDashboardPage;
