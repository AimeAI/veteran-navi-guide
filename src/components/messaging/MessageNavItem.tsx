
import React from 'react';
import { NavLink } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import MessageNotificationBadge from './MessageNotificationBadge';

const MessageNavItem: React.FC = () => {
  return (
    <NavLink 
      to="/messages" 
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
