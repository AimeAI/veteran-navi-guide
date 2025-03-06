
import React, { ReactNode } from "react";
import { useUser } from "@/context/UserContext";
import EmailVerificationBanner from "./EmailVerificationBanner";

interface RequireVerifiedEmailProps {
  children: ReactNode;
  fallback?: ReactNode;
  showBanner?: boolean;
}

const RequireVerifiedEmail: React.FC<RequireVerifiedEmailProps> = ({ 
  children, 
  fallback, 
  showBanner = true 
}) => {
  const { user } = useUser();
  
  const isVerified = user?.isAuthenticated && user?.emailVerified;
  
  if (isVerified) {
    return <>{children}</>;
  }
  
  return (
    <>
      {showBanner && <EmailVerificationBanner />}
      {fallback || (
        <div className="p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Email verification required</h3>
          <p className="text-gray-600">
            Please verify your email address to access this feature.
          </p>
        </div>
      )}
    </>
  );
};

export default RequireVerifiedEmail;
