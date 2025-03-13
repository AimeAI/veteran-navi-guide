
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useMessages } from '@/context/MessageContext';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';

interface MessageButtonProps {
  recipientId: string;
  recipientName?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

const MessageButton: React.FC<MessageButtonProps> = ({ 
  recipientId, 
  recipientName = 'User',
  variant = 'default',
  size = 'default',
  className = ''
}) => {
  const { user } = useUser();
  const { startNewConversation, setCurrentConversation } = useMessages();
  const navigate = useNavigate();

  const handleMessageClick = async () => {
    if (!user || !user.email) {
      toast.error('You must be logged in to send messages');
      return;
    }

    try {
      // Create a conversation subject based on the recipient name
      const subject = `Conversation with ${recipientName}`;
      
      // Start a new conversation with this recipient
      const conversationId = await startNewConversation(recipientId, subject);
      
      // Set this as the current conversation
      await setCurrentConversation(conversationId);
      
      // Navigate to messages page
      if (user.role === 'employer') {
        navigate('/employer/messages');
      } else {
        navigate('/messages');
      }
      
      toast.success(`Started conversation with ${recipientName}`);
    } catch (error) {
      console.error('Failed to start conversation:', error);
      toast.error('Failed to start conversation. Please try again later.');
    }
  };

  return (
    <Button 
      onClick={handleMessageClick} 
      variant={variant} 
      size={size}
      className={className}
    >
      <MessageCircle className="h-4 w-4 mr-2" />
      Message
    </Button>
  );
};

export default MessageButton;
