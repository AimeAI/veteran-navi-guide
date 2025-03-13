
import React from 'react';
import { NavLink } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import MessageNotificationBadge from './MessageNotificationBadge';
import { useUser } from '@/context/UserContext';

const MessageNavItem: React.FC = () => {
  const { user } = useUser();
  
  // Determine the correct messages path based on user role
  const messagesPath = user?.role === 'employer' ? '/employer/messages' : '/messages';

  return (
    <NavLink 
      to={messagesPath} 
      className={({ isActive }) => 
        `relative nav-link ${isActive ? 'font-medium text-primary' : 'text-muted-foreground hover:text-foreground'}`
      }
    >
      <div className="flex items-center gap-1.5">
        <MessageSquare className="h-4 w-4" />
        <span>Messages</span>
        <div className="absolute -top-1 -right-1">
          <MessageNotificationBadge />
        </div>
      </div>
    </NavLink>
  );
};

export default MessageNavItem;
