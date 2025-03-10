import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MentorshipConnection, MentorshipProfile } from '@/services/mentorship/types';
import { UserRound, Users, Clock, CheckCircle2, XCircle } from 'lucide-react';

interface ConnectionsListProps {
  connections: MentorshipConnection[];
  userIsMentor: boolean;
  onSelectConnection: (connection: MentorshipConnection) => void;
  onAcceptRequest: (connectionId: string) => void;
  onDeclineRequest: (connectionId: string) => void;
  selectedConnectionId?: string;
  isLoading: boolean;
}

const ConnectionsList: React.FC<ConnectionsListProps> = ({
  connections,
  userIsMentor = false,
  onSelectConnection,
  onAcceptRequest,
  onDeclineRequest,
  selectedConnectionId,
  isLoading = false,
}) => {
  const pendingConnections = connections.filter((c) => c.status === 'pending');
  const activeConnections = connections.filter((c) => c.status === 'active');
  const pastConnections = connections.filter((c) => ['completed', 'declined'].includes(c.status));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'active':
        return <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">Active</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">Completed</Badge>;
      case 'declined':
        return <Badge variant="outline" className="bg-gray-50 text-gray-800 border-gray-200">Declined</Badge>;
      default:
        return null;
    }
  };

  const getConnectionName = (connection: MentorshipConnection) => {
    if (userIsMentor) {
      return connection.mentee?.full_name || 'Mentee';
    } else {
      return connection.mentor?.full_name || 'Mentor';
    }
  };

  const getConnectionAvatar = (connection: MentorshipConnection) => {
    if (userIsMentor) {
      return connection.mentee?.avatar_url;
    } else {
      return connection.mentor?.avatar_url;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Tabs defaultValue="active" className="w-full">
      <TabsList className="grid grid-cols-3 w-full mb-4">
        <TabsTrigger value="active">
          Active
          {activeConnections.length > 0 && (
            <span className="ml-1 text-xs bg-primary/10 text-primary rounded-full px-2">
              {activeConnections.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="pending">
          Pending
          {pendingConnections.length > 0 && (
            <span className="ml-1 text-xs bg-primary/10 text-primary rounded-full px-2">
              {pendingConnections.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="past">Past</TabsTrigger>
      </TabsList>

      <TabsContent value="active">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Active Mentorships</CardTitle>
            <CardDescription>Your ongoing mentorship connections</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 bg-gray-100 rounded-md"></div>
                  </div>
                ))}
              </div>
            ) : activeConnections.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No active mentorships yet</p>
              </div>
            ) : (
              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  {activeConnections.map((connection) => (
                    <div
                      key={connection.id}
                      className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors ${
                        selectedConnectionId === connection.id
                          ? 'bg-primary/10'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => onSelectConnection(connection)}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage
                            src={getConnectionAvatar(connection)}
                            alt={getConnectionName(connection)}
                          />
                          <AvatarFallback>
                            {getInitials(getConnectionName(connection))}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{getConnectionName(connection)}</p>
                          <div className="flex space-x-2 text-xs text-gray-500">
                            <span className="flex items-center">
                              <MessageCircle className="mr-1 h-3 w-3" />
                              Message
                            </span>
                            <span className="flex items-center">
                              <Clock className="mr-1 h-3 w-3" />
                              Schedule
                            </span>
                          </div>
                        </div>
                      </div>
                      {getStatusBadge(connection.status)}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="pending">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Pending Requests</CardTitle>
            <CardDescription>
              {userIsMentor
                ? 'Mentorship requests waiting for your approval'
                : 'Your pending mentorship requests'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-20 bg-gray-100 rounded-md"></div>
                  </div>
                ))}
              </div>
            ) : pendingConnections.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No pending requests</p>
              </div>
            ) : (
              <ScrollArea className="h-[300px]">
                <div className="space-y-3">
                  {pendingConnections.map((connection) => (
                    <div
                      key={connection.id}
                      className="flex items-center justify-between p-3 border rounded-md"
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage
                            src={getConnectionAvatar(connection)}
                            alt={getConnectionName(connection)}
                          />
                          <AvatarFallback>
                            {getInitials(getConnectionName(connection))}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{getConnectionName(connection)}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(connection.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {userIsMentor && onAcceptRequest && onDeclineRequest && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 px-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeclineRequest(connection.id);
                              }}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Decline
                            </Button>
                            <Button
                              size="sm"
                              className="h-8 px-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                onAcceptRequest(connection.id);
                              }}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Accept
                            </Button>
                          </>
                        )}
                        {!userIsMentor && getStatusBadge(connection.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="past">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Past Mentorships</CardTitle>
            <CardDescription>Your completed or declined mentorships</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 bg-gray-100 rounded-md"></div>
                  </div>
                ))}
              </div>
            ) : pastConnections.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No past mentorships</p>
              </div>
            ) : (
              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  {pastConnections.map((connection) => (
                    <div
                      key={connection.id}
                      className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors ${
                        selectedConnectionId === connection.id
                          ? 'bg-primary/10'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => onSelectConnection(connection)}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage
                            src={getConnectionAvatar(connection)}
                            alt={getConnectionName(connection)}
                          />
                          <AvatarFallback>
                            {getInitials(getConnectionName(connection))}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{getConnectionName(connection)}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(connection.updated_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(connection.status)}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ConnectionsList;
