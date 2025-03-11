
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
  return <>{children}</>;
};

export default DevRouteWrapper;
