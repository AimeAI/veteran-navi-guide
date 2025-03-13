
import React, { ReactNode } from "react";

interface RequireVerifiedEmailProps {
  children: ReactNode;
  fallback?: ReactNode;
  showBanner?: boolean;
}

const RequireVerifiedEmail: React.FC<RequireVerifiedEmailProps> = ({ 
  children
}) => {
  // Always bypass email verification check in dev mode
  console.log('DEV MODE: Email verification bypassed');
  return <>{children}</>;
};

export default RequireVerifiedEmail;
