import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageCircle, 
  Phone, 
  Calendar, 
  Clock, 
  User, 
  Shield, 
  UserCheck,
  UserX 
} from 'lucide-react';
import { getConnections, MentorshipConnection, MentorshipProfile } from '@/services/mentorshipService';
import { format } from 'date-fns';

interface ConnectionsListProps {
  userId: string;
}

const ConnectionsList: React.FC<ConnectionsListProps> = ({ userId }) => {
  const [connections, setConnections] = useState<MentorshipConnection[]>([]);
  const [pendingConnections, setPendingConnections] = useState<MentorshipConnection[]>([]);
  const [approvedConnections, setApprovedConnections] = useState<MentorshipConnection[]>([]);
  const [rejectedConnections, setRejectedConnections] = useState<MentorshipConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchConnections();
  }, [userId]);
  
  const fetchConnections = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const connectionsData = await getConnections(userId);
      setConnections(connectionsData);
      
      // Filter connections based on status
      setPendingConnections(connectionsData.filter(c => c.status === 'pending'));
      setApprovedConnections(connectionsData.filter(c => c.status === 'approved'));
      setRejectedConnections(connectionsData.filter(c => c.status === 'rejected'));
    } catch (err) {
      setError('Failed to load connections.');
      console.error('Error fetching connections:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return <div>Loading connections...</div>;
  }
  
  if (error) {
    return <div>Error: {error}</div>;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Connections</CardTitle>
        <CardDescription>Manage your mentorship connections</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultvalue="approved" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="approved">Approved <UserCheck className="ml-2 h-4 w-4" /></TabsTrigger>
            <TabsTrigger value="pending">Pending <Clock className="ml-2 h-4 w-4" /></TabsTrigger>
            <TabsTrigger value="rejected">Rejected <UserX className="ml-2 h-4 w-4" /></TabsTrigger>
          </TabsList>
          
          <TabsContent value="approved" className="p-4">
            <ScrollArea className="h-[400px] w-full rounded-md border">
              {approvedConnections.length > 0 ? (
                <div className="grid gap-4 p-4">
                  {approvedConnections.map(connection => (
                    <ConnectionCard key={connection.id} connection={connection} />
                  ))}
                </div>
              ) : (
                <div className="p-4 text-sm text-muted-foreground">No approved connections yet.</div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="pending" className="p-4">
            <ScrollArea className="h-[400px] w-full rounded-md border">
              {pendingConnections.length > 0 ? (
                <div className="grid gap-4 p-4">
                  {pendingConnections.map(connection => (
                    <ConnectionCard key={connection.id} connection={connection} />
                  ))}
                </div>
              ) : (
                <div className="p-4 text-sm text-muted-foreground">No pending connections.</div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="rejected" className="p-4">
            <ScrollArea className="h-[400px] w-full rounded-md border">
              {rejectedConnections.length > 0 ? (
                <div className="grid gap-4 p-4">
                  {rejectedConnections.map(connection => (
                    <ConnectionCard key={connection.id} connection={connection} />
                  ))}
                </div>
              ) : (
                <div className="p-4 text-sm text-muted-foreground">No rejected connections.</div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface ConnectionCardProps {
  connection: MentorshipConnection;
}

const ConnectionCard: React.FC<ConnectionCardProps> = ({ connection }) => {
  const [profile, setProfile] = useState<MentorshipProfile | null>(null);
  const isMentor = connection.mentor_id === connection.mentee_id;
  
  useEffect(() => {
    // Determine the other user's ID based on whether the current user is the mentor or mentee
    const otherUserId = connection.mentor_id === connection.mentee_id ? connection.mentee_id : connection.mentor_id;
    
    if (connection.mentor) {
      setProfile(connection.mentor);
    }
  }, [connection]);
  
  if (!profile) {
    return <div>Loading profile...</div>;
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <Avatar className="mr-4 h-10 w-10">
            <AvatarImage src={profile.avatar_url || ""} alt={profile.full_name || "Mentor"} />
            <AvatarFallback>{profile.full_name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <CardTitle>{profile.full_name}</CardTitle>
            <CardDescription>{profile.military_branch}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 text-sm">
          <Button variant="ghost" size="sm">
            <MessageCircle className="mr-2 h-4 w-4" />
            Message
          </Button>
          <Button variant="ghost" size="sm">
            <Phone className="mr-2 h-4 w-4" />
            Call
          </Button>
          <Button variant="ghost" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectionsList;
