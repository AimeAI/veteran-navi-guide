
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { useMessages } from '@/context/MessageContext';
import { useUser } from '@/context/UserContext';
import { getUnreadMessageCount, executeWithRetry } from '@/utils/supabaseHelpers';

interface MessageNotificationBadgeProps {
  className?: string;
}

const MessageNotificationBadge: React.FC<MessageNotificationBadgeProps> = ({ className }) => {
  const { getTotalUnreadCount, refreshMessages } = useMessages();
  const { user } = useUser();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Function to fetch unread count from the database
  const fetchUnreadCount = async () => {
    if (!user?.email) return;
    
    setIsLoading(true);
    try {
      // Use executeWithRetry for better connection handling with our optimized function
      const count = await executeWithRetry(() => 
        getUnreadMessageCount(user.email)
      );
      
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching unread message count:', error);
      // Fallback to the context method
      setUnreadCount(getTotalUnreadCount());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Use context method initially
    setUnreadCount(getTotalUnreadCount());
    
    // Then try to get the more accurate DB count
    if (user?.isAuthenticated) {
      fetchUnreadCount();
      
      // Set up polling for new messages
      const intervalId = setInterval(() => {
        fetchUnreadCount();
        refreshMessages();
      }, 30000); // Poll every 30 seconds

      return () => clearInterval(intervalId);
    }
  }, [getTotalUnreadCount, refreshMessages, user]);

  if (unreadCount === 0 || isLoading) {
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
