
import React from 'react';

interface RequireAuthProps {
  children: React.ReactNode;
  redirectTo?: string;
  roles?: string[];
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ 
  children
}) => {
  // Always bypass authentication for all routes
  console.log('DEV MODE: Authentication bypassed for all routes');
  return <>{children}</>;
};

