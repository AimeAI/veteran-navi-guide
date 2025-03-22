
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';

interface DevRouteWrapperProps {
  children: React.ReactNode;
}

/**
 * A wrapper component for development routes that ensures they're only accessible
 * to authenticated users with admin privileges.
 */
const DevRouteWrapper: React.FC<DevRouteWrapperProps> = ({ children }) => {
  const { user, isLoading } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading) {
      // Redirect if not authenticated
      if (!user?.isAuthenticated) {
        navigate('/auth');
        return;
      }
      
      // Allow access only to admins or in a development environment
      const isDev = process.env.NODE_ENV === 'development';
      const isAdmin = user.role === 'admin';
      
      if (!isDev && !isAdmin) {
        navigate('/');
      }
    }
  }, [user, isLoading, navigate]);

  // Show loading state while checking authentication
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[40vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  // Only render the children if user is authenticated and either in dev mode or an admin
  const isDev = process.env.NODE_ENV === 'development';
  const isAdmin = user?.role === 'admin';
  
  if (user?.isAuthenticated && (isDev || isAdmin)) {
    return <>{children}</>;
  }
  
  return null;
};

export default DevRouteWrapper;
