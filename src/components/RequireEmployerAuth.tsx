
import React from 'react';

interface RequireEmployerAuthProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * A wrapper component for employer routes that ensures they're always accessible
 * regardless of authentication state during development.
 */
const RequireEmployerAuth: React.FC<RequireEmployerAuthProps> = ({ children }) => {
  // Always render the children without any authentication checks
  console.log('DEV MODE: Bypassing employer authentication checks');
  
  return <>{children}</>;
};

export default RequireEmployerAuth;
