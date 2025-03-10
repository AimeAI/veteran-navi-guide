
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUser } from '@/context/UserContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  User,
  Settings,
  CreditCard,
  Bell,
  LogOut,
  Bookmark,
  MessageSquare,
  LifeBuoy,
  Building,
} from 'lucide-react';

const NavDropdown: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const handleSignOut = async () => {
    await logout();
    navigate('/');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-2 p-1 rounded-full hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring">
          <Avatar className="h-8 w-8">
            {user?.profilePicture ? (
              <AvatarImage src={user.profilePicture} alt={user?.name || "User"} />
            ) : (
              <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
            )}
          </Avatar>
          <span className="text-sm font-medium sr-only">{user?.name}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email || ""}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate('/profile')}>
            <User className="mr-2 h-4 w-4" />
            <span>{t('navigation.profile')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/saved')}>
            <Bookmark className="mr-2 h-4 w-4" />
            <span>{t('navigation.savedJobs')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/history')}>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>{t('navigation.applicationHistory')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/settings/notifications')}>
            <Bell className="mr-2 h-4 w-4" />
            <span>{t('navigation.notifications')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/profile/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            <span>{t('navigation.settings')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/messages')}>
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>{t('navigation.messages')}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate('/employer/profile')}>
            <Building className="mr-2 h-4 w-4" />
            <span>{t('navigation.employerProfile')}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/feedback')}>
          <LifeBuoy className="mr-2 h-4 w-4" />
          <span>{t('navigation.support')}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t('common.signOut')}</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavDropdown;
