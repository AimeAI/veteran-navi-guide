
import React from 'react';
import { useMessages } from '@/context/MessageContext';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Plus, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ConversationListProps {
  onNewConversation: () => void;
}

const ConversationList: React.FC<ConversationListProps> = ({ onNewConversation }) => {
  const { conversations, isLoading, setCurrentConversation, currentConversation, refreshMessages } = useMessages();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-3 border rounded-md flex items-center space-x-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <h3 className="font-medium text-lg mb-2">No conversations yet</h3>
        <p className="text-muted-foreground mb-4">Start a new conversation with an employer or veteran</p>
        <Button onClick={onNewConversation}>
          <Plus className="h-4 w-4 mr-2" />
          New Conversation
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-medium text-lg">Conversations</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => refreshMessages()}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          <Button size="sm" onClick={onNewConversation}>
            <Plus className="h-4 w-4 mr-1" />
            New
          </Button>
        </div>
      </div>
      
      <div className="space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto pr-2">
        {conversations.map((conversation) => {
          // Determine the other participant (not the current user)
          const otherParticipant = conversation.participants[0];
          
          return (
            <button
              key={conversation.id}
              onClick={() => setCurrentConversation(conversation.id)}
              className={`w-full text-left p-3 rounded-md transition-colors border hover:bg-muted/50 ${
                currentConversation?.id === conversation.id ? 'bg-muted border-primary' : 'bg-card'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium truncate max-w-[180px]">
                    {conversation.subject || otherParticipant.id}
                  </div>
                  <div className="text-sm text-muted-foreground truncate max-w-[180px]">
                    {conversation.lastMessage?.content || 'No messages yet'}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {conversation.updatedAt ? formatDistanceToNow(new Date(conversation.updatedAt), { addSuffix: true }) : ''}
                  {conversation.unreadCount > 0 && (
                    <Badge variant="secondary" className="ml-2 bg-primary text-primary-foreground">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ConversationList;
