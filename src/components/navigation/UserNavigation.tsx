
import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Settings, FileText, Bell, Shield } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useTranslation } from 'react-i18next';

const UserNavigation = () => {
  const { user, logout } = useUser();
  const { t } = useTranslation();
  
  const handleLogout = async () => {
    await logout();
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const isAdmin = user?.email?.endsWith('@admin.com');
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full flex items-center justify-center">
          <Avatar className="h-8 w-8">
            {user?.profilePicture ? (
              <AvatarImage src={user.profilePicture} alt={user.name || 'User'} />
            ) : (
              <AvatarFallback>{user?.name ? getInitials(user.name) : 'U'}</AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex flex-col space-y-1 p-2">
          <p className="text-sm font-medium">{user?.name || 'User'}</p>
          <p className="text-xs text-muted-foreground">{user?.email || ''}</p>
          {isAdmin && (
            <p className="text-xs font-medium text-primary mt-1 flex items-center">
              <Shield className="h-3 w-3 mr-1" /> Admin
            </p>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/user-profile" className="cursor-pointer flex w-full items-center">
            <User className="mr-2 h-4 w-4" />
            <span>{t('navigation.profile', 'Profile')}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/job-alerts" className="cursor-pointer flex w-full items-center">
            <Bell className="mr-2 h-4 w-4" />
            <span>{t('navigation.jobAlerts', 'Job Alerts')}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/applications" className="cursor-pointer flex w-full items-center">
            <FileText className="mr-2 h-4 w-4" />
            <span>{t('navigation.applications', 'Applications')}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/account-settings" className="cursor-pointer flex w-full items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>{t('navigation.settings', 'Settings')}</span>
          </Link>
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link to="/admin" className="cursor-pointer flex w-full items-center">
              <Shield className="mr-2 h-4 w-4" />
              <span>Admin Dashboard</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleLogout}
          className="cursor-pointer flex w-full items-center text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t('common.logout', 'Logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserNavigation;
