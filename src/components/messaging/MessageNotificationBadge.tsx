
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { useMessages } from '@/context/MessageContext';
import { useUser } from '@/context/UserContext';

interface MessageNotificationBadgeProps {
  className?: string;
}

const MessageNotificationBadge: React.FC<MessageNotificationBadgeProps> = ({ className }) => {
  const { getTotalUnreadCount, refreshMessages } = useMessages();
  const { user } = useUser();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Update unread count when it changes
    setUnreadCount(getTotalUnreadCount());

    // Set up polling for new messages when user is authenticated
    if (user?.isAuthenticated) {
      const intervalId = setInterval(() => {
        refreshMessages();
      }, 30000); // Poll every 30 seconds

      return () => clearInterval(intervalId);
    }
  }, [getTotalUnreadCount, refreshMessages, user]);

  if (unreadCount === 0) {
    return null;
  }

  return (
    <Badge 
      variant="destructive" 
      className={`text-xs h-5 min-w-5 flex items-center justify-center ${className}`}
    >
      {unreadCount > 99 ? '99+' : unreadCount}
    </Badge>
  );
};

export default MessageNotificationBadge;
