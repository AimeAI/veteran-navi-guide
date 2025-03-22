
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';

interface RequireAuthProps {
  children: React.ReactNode;
  redirectTo?: string;
  roles?: string[];
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ 
  children,
  redirectTo = '/auth',
  roles = [] 
}) => {
  const { user, isLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // If authentication check is complete and user is not authenticated,
    // redirect to login page
    if (!isLoading && !user?.isAuthenticated) {
      navigate(redirectTo);
    }
    
    // If roles are specified, check if user has one of the required roles
    if (!isLoading && user?.isAuthenticated && roles.length > 0) {
      const hasRequiredRole = user.role && roles.includes(user.role);
      if (!hasRequiredRole) {
        navigate('/');
      }
    }
  }, [user, isLoading, navigate, redirectTo, roles]);

  // Show loading state while checking authentication
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[40vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  // Render children only if user is authenticated
  return user?.isAuthenticated ? <>{children}</> : null;
};
