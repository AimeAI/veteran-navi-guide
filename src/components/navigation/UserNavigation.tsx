
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MessageNotificationBadge from '@/components/messaging/MessageNotificationBadge';
import NavDropdown from '@/components/navigation/NavDropdown';

const UserNavigation = () => {
  return (
    <div className="hidden md:flex space-x-3">
      <Button variant="ghost" size="sm" asChild className="cursor-pointer">
        <Link to="/messages">
          <MessageNotificationBadge />
        </Link>
      </Button>
      
      <NavDropdown />
    </div>
  );
};

export default UserNavigation;
