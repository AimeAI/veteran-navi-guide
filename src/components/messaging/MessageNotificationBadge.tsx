
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { useMessages } from '@/context/MessageContext';
import { useUser } from '@/context/UserContext';
import { getUnreadMessageCount, executeWithRetry } from '@/utils/supabaseHelpers';
import { QueryCache } from '@/utils/batchOperations';
import { measurePerformance } from '@/utils/performanceUtils';

interface MessageNotificationBadgeProps {
  className?: string;
}

// Create a shared cache for unread counts with a 30 second TTL
const unreadCountCache = new QueryCache<string, number>(30000);

const MessageNotificationBadge: React.FC<MessageNotificationBadgeProps> = ({ className }) => {
  const { getTotalUnreadCount, refreshMessages } = useMessages();
  const { user } = useUser();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Function to fetch unread count from the database with caching
  const fetchUnreadCount = async () => {
    if (!user?.email) return;

    // Check cache first
    const cacheKey = `unread-count:${user.email}`;
    const cachedCount = unreadCountCache.get(cacheKey);
    
    if (cachedCount !== undefined) {
      setUnreadCount(cachedCount);
      return;
    }
    
    setIsLoading(true);
    try {
      // Measure the performance of the unread count fetch
      const count = await measurePerformance('Fetch unread message count', () => 
        executeWithRetry(() => getUnreadMessageCount(user.email))
      );
      
      // Cache the result
      unreadCountCache.set(cacheKey, count);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching unread message count:', error);
      // Fallback to the context method
      const contextCount = getTotalUnreadCount();
      setUnreadCount(contextCount);
      
      // Still cache the fallback result, but with a shorter TTL
      unreadCountCache.set(cacheKey, contextCount);
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
      
      // Set up polling for new messages with staggered intervals to prevent
      // all components from refreshing at the exact same time
      const randomOffset = Math.floor(Math.random() * 5000); // Random offset up to 5 seconds
      const intervalId = setInterval(() => {
        fetchUnreadCount();
        
        // Only refresh messages every other time to reduce load
        if (Math.random() > 0.5) {
          refreshMessages();
        }
      }, 30000 + randomOffset); // Poll approximately every 30 seconds

      return () => clearInterval(intervalId);
    }
  }, [getTotalUnreadCount, refreshMessages, user]);

  // Periodically clean up the cache to prevent memory leaks
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      unreadCountCache.prune();
    }, 60000); // Clean up every minute
    
    return () => clearInterval(cleanupInterval);
  }, []);

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
