
import React from 'react';

interface DevRouteWrapperProps {
  children: React.ReactNode;
}

/**
 * A wrapper component for development routes that ensures they're always accessible
 * regardless of authentication state.
 */
const DevRouteWrapper: React.FC<DevRouteWrapperProps> = ({ children }) => {
  // Always render the children without any authentication checks
  console.log('DEV ROUTE: Bypassing all authentication checks');
  
  // In a real production app, we might want to add some security here
  // to ensure these routes are only accessible in non-production environments
  
  return <>{children}</>;
};

export default DevRouteWrapper;
