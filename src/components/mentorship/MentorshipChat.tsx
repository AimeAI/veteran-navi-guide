
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SendHorizontal } from 'lucide-react';
import { MentorshipMessage } from '@/services/mentorshipService';
import { useUser } from '@/context/UserContext';

interface MentorshipChatProps {
  messages: MentorshipMessage[];
  onSendMessage: (content: string) => Promise<boolean>;
  recipientName?: string;
  isLoading?: boolean;
}

const MentorshipChat: React.FC<MentorshipChatProps> = ({
  messages,
  onSendMessage,
  recipientName = 'your connection',
  isLoading = false,
}) => {
  const { user } = useUser();
  const [messageInput, setMessageInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;
    
    setIsSending(true);
    const success = await onSendMessage(messageInput);
    if (success) {
      setMessageInput('');
    }
    setIsSending(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };
  
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const groupMessagesByDate = () => {
    const groups: { date: string; messages: MentorshipMessage[] }[] = [];
    let currentDate = '';
    let currentGroup: MentorshipMessage[] = [];
    
    messages.forEach(message => {
      const messageDate = formatDate(message.created_at);
      
      if (messageDate !== currentDate) {
        if (currentGroup.length > 0) {
          groups.push({ date: currentDate, messages: currentGroup });
        }
        currentDate = messageDate;
        currentGroup = [message];
      } else {
        currentGroup.push(message);
      }
    });
    
    if (currentGroup.length > 0) {
      groups.push({ date: currentDate, messages: currentGroup });
    }
    
    return groups;
  };
  
  const messageGroups = groupMessagesByDate();
  
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3">
        <CardTitle>Chat with {recipientName}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Loading messages...</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] px-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[300px] text-center p-4">
                <p className="text-gray-500 mb-2">No messages yet</p>
                <p className="text-sm text-gray-400">
                  Start the conversation with {recipientName}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {messageGroups.map((group, groupIndex) => (
                  <div key={groupIndex} className="space-y-4">
                    <div className="flex justify-center">
                      <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {group.date}
                      </div>
                    </div>
                    {group.messages.map((message) => {
                      const isCurrentUser = message.sender_id === user?.email;
                      
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-2 max-w-[80%]`}>
                            {!isCurrentUser && (
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={message.sender_avatar} alt={message.sender_name} />
                                <AvatarFallback>{getInitials(message.sender_name)}</AvatarFallback>
                              </Avatar>
                            )}
                            <div
                              className={`rounded-lg px-4 py-2 ${
                                isCurrentUser
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              <div className="break-words">{message.content}</div>
                              <div
                                className={`text-xs mt-1 ${
                                  isCurrentUser ? 'text-primary-foreground/70' : 'text-gray-500'
                                }`}
                              >
                                {formatTime(message.created_at)}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-3 border-t">
        <div className="flex w-full items-end gap-2">
          <Textarea
            placeholder={`Message ${recipientName}...`}
            className="flex-1 min-h-[80px]"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSending}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!messageInput.trim() || isSending}
            className="h-10"
          >
            <SendHorizontal className="h-4 w-4 mr-1" />
            Send
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MentorshipChat;
