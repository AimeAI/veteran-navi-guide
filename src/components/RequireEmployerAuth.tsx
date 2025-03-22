
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';

interface RequireEmployerAuthProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * A wrapper component for employer routes that ensures
 * the user is authenticated and has an employer role.
 */
const RequireEmployerAuth: React.FC<RequireEmployerAuthProps> = ({ 
  children,
  redirectTo = '/auth' 
}) => {
  const { user, isLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // If authentication check is complete
    if (!isLoading) {
      // If user is not authenticated, redirect to login
      if (!user?.isAuthenticated) {
        navigate(redirectTo);
      }
      // If user is authenticated but not an employer, redirect to home
      else if (user.role !== 'employer') {
        navigate('/');
      }
    }
  }, [user, isLoading, navigate, redirectTo]);

  // Show loading state while checking authentication
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[40vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  // Render children only if user is authenticated and has employer role
  return (user?.isAuthenticated && user.role === 'employer') ? <>{children}</> : null;
};

export default RequireEmployerAuth;
