
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { Button } from './ui/button';
import { LogIn } from 'lucide-react';

interface RequireAuthProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ 
  children, 
  redirectTo = '/auth'
}) => {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !user.isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
        <p className="text-muted-foreground mb-6">
          You need to be logged in to access this page.
        </p>
        <Button asChild>
          {/* Fix Navigate usage - it doesn't accept children */}
          <a href={`${redirectTo}?redirect=${window.location.pathname}`}>
            <LogIn className="mr-2 h-4 w-4" />
            Log In or Sign Up
          </a>
        </Button>
      </div>
    );
  }

  return <>{children}</>;
};
