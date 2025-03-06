
import React, { useEffect, useRef, useState } from 'react';
import { useMessages } from '@/context/MessageContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Send } from 'lucide-react';
import { formatRelative } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/context/UserContext';

interface ConversationViewProps {
  onBack: () => void;
}

const ConversationView: React.FC<ConversationViewProps> = ({ onBack }) => {
  const { currentConversation, isLoading, sendMessage } = useMessages();
  const { user } = useUser();
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages]);

  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="border-b p-4 flex items-center">
          <Button variant="ghost" size="sm" className="mr-2" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-5 w-36" />
        </div>
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[80%] ${i % 2 === 0 ? 'bg-muted' : 'bg-primary text-primary-foreground'} rounded-lg p-3`}>
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-24 mt-2" />
                <div className="text-xs opacity-70 mt-1">
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t p-4">
          <Skeleton className="h-20 w-full rounded-md" />
        </div>
      </div>
    );
  }

  if (!currentConversation) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/30">
        <div className="text-center p-4">
          <h3 className="text-lg font-medium mb-2">No conversation selected</h3>
          <p className="text-muted-foreground">Select a conversation from the list or start a new one</p>
        </div>
      </div>
    );
  }

  // Find the other participant (not the current user)
  const otherParticipant = currentConversation.participants.find(
    p => p.id !== user?.email
  );

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !otherParticipant) return;
    
    setIsSending(true);
    try {
      await sendMessage(otherParticipant.id, newMessage.trim(), currentConversation.id);
      setNewMessage('');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-4 flex items-center">
        <Button variant="ghost" size="sm" className="mr-2 md:hidden" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h3 className="font-medium">{currentConversation.subject || otherParticipant?.id}</h3>
          <div className="flex items-center text-sm text-muted-foreground">
            <span>{otherParticipant?.id}</span>
            <Badge variant="outline" className="ml-2 text-xs">
              {otherParticipant?.role === 'employer' ? 'Employer' : 'Veteran'}
            </Badge>
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {currentConversation.messages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No messages yet. Start the conversation!
          </div>
        ) : (
          currentConversation.messages.map((message) => {
            const isCurrentUser = message.senderId === user?.email;
            
            return (
              <div key={message.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                {!isCurrentUser && (
                  <Avatar className="h-8 w-8 mr-2">
                    <div className="bg-primary text-primary-foreground rounded-full w-full h-full flex items-center justify-center text-xs font-medium">
                      {message.senderRole === 'employer' ? 'E' : 'V'}
                    </div>
                  </Avatar>
                )}
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${
                    isCurrentUser 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <div className={`text-xs mt-1 ${isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {formatRelative(new Date(message.timestamp), new Date())}
                    {isCurrentUser && (
                      <span className="ml-2">
                        {message.read ? 'Read' : 'Delivered'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="resize-none"
            rows={3}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isSending}
            className="self-end"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConversationView;
