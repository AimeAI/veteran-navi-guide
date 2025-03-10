
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
import { MentorshipConnection, MentorshipProfile } from '@/services/mentorship/types';
import { getUserConnections } from '@/services/mentorship/connections';
import { format } from 'date-fns';

interface ConnectionsListProps {
  userId: string;
  connections?: MentorshipConnection[];
  userIsMentor?: boolean;
  onSelectConnection?: (connection: MentorshipConnection) => void;
  onAcceptRequest?: (connectionId: string) => Promise<void>;
  onDeclineRequest?: (connectionId: string) => Promise<void>;
  selectedConnectionId?: string;
  isLoading?: boolean;
}

const ConnectionsList: React.FC<ConnectionsListProps> = ({ 
  userId,
  connections: externalConnections,
  userIsMentor,
  onSelectConnection,
  onAcceptRequest,
  onDeclineRequest,
  selectedConnectionId,
  isLoading: externalLoading
}) => {
  const [connections, setConnections] = useState<MentorshipConnection[]>([]);
  const [pendingConnections, setPendingConnections] = useState<MentorshipConnection[]>([]);
  const [approvedConnections, setApprovedConnections] = useState<MentorshipConnection[]>([]);
  const [rejectedConnections, setRejectedConnections] = useState<MentorshipConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (externalConnections) {
      setConnections(externalConnections);
      setPendingConnections(externalConnections.filter(c => c.status === 'pending'));
      setApprovedConnections(externalConnections.filter(c => c.status === 'active'));
      setRejectedConnections(externalConnections.filter(c => c.status === 'declined' || c.status === 'completed'));
      setIsLoading(false);
    } else {
      fetchConnections();
    }
  }, [userId, externalConnections]);
  
  const fetchConnections = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const connectionsData = await getUserConnections(userId);
      setConnections(connectionsData);
      
      // Filter connections based on status
      setPendingConnections(connectionsData.filter(c => c.status === 'pending'));
      setApprovedConnections(connectionsData.filter(c => c.status === 'active'));
      setRejectedConnections(connectionsData.filter(c => c.status === 'declined' || c.status === 'completed'));
    } catch (err) {
      setError('Failed to load connections.');
      console.error('Error fetching connections:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (externalLoading || isLoading) {
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
        <Tabs defaultValue="approved" className="w-full">
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
                    <ConnectionCard 
                      key={connection.id} 
                      connection={connection} 
                      userIsMentor={userIsMentor}
                      onSelect={onSelectConnection}
                      isSelected={selectedConnectionId === connection.id}
                    />
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
                    <ConnectionCard 
                      key={connection.id} 
                      connection={connection} 
                      userIsMentor={userIsMentor}
                      onSelect={onSelectConnection}
                      isSelected={selectedConnectionId === connection.id}
                      onAccept={onAcceptRequest}
                      onDecline={onDeclineRequest}
                    />
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
                    <ConnectionCard 
                      key={connection.id} 
                      connection={connection} 
                      userIsMentor={userIsMentor}
                      onSelect={onSelectConnection}
                      isSelected={selectedConnectionId === connection.id}
                    />
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
  userIsMentor?: boolean;
  onSelect?: (connection: MentorshipConnection) => void;
  onAccept?: (connectionId: string) => Promise<void>;
  onDecline?: (connectionId: string) => Promise<void>;
  isSelected?: boolean;
}

const ConnectionCard: React.FC<ConnectionCardProps> = ({ 
  connection, 
  userIsMentor, 
  onSelect,
  onAccept,
  onDecline,
  isSelected
}) => {
  const profileToShow = userIsMentor ? connection.mentee : connection.mentor;
  
  if (!profileToShow) {
    return <div>Missing profile information</div>;
  }
  
  const handleSelect = () => {
    if (onSelect) {
      onSelect(connection);
    }
  };
  
  const handleAccept = async () => {
    if (onAccept) {
      await onAccept(connection.id);
    }
  };
  
  const handleDecline = async () => {
    if (onDecline) {
      await onDecline(connection.id);
    }
  };
  
  return (
    <Card className={isSelected ? 'border-primary' : ''}>
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <Avatar className="mr-4 h-10 w-10">
            <AvatarImage src={profileToShow.avatar_url || profileToShow.user_avatar || ""} alt={profileToShow.full_name || profileToShow.user_name || "User"} />
            <AvatarFallback>{(profileToShow.full_name || profileToShow.user_name || "User").charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <CardTitle className="text-base">{profileToShow.full_name || profileToShow.user_name}</CardTitle>
            <CardDescription>{profileToShow.military_branch || profileToShow.industry || 'Veteran'}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 text-sm">
          <Button variant="ghost" size="sm" onClick={handleSelect}>
            <MessageCircle className="mr-2 h-4 w-4" />
            Message
          </Button>
          <Button variant="ghost" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule
          </Button>
          {connection.status === 'pending' && userIsMentor && (
            <>
              <Button variant="outline" size="sm" onClick={handleAccept}>
                <UserCheck className="mr-2 h-4 w-4" />
                Accept
              </Button>
              <Button variant="outline" size="sm" onClick={handleDecline}>
                <UserX className="mr-2 h-4 w-4" />
                Decline
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectionsList;
