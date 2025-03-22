
import React, { ReactNode, useState, useEffect } from "react";
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
  const { user, isLoading } = useUser();
  const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    // Only show content if user is authenticated and email is verified
    if (!isLoading && user?.isAuthenticated) {
      setShowContent(user.emailVerified === true);
    }
  }, [user, isLoading]);

  // If still loading, show nothing yet
  if (isLoading) {
    return null;
  }

  // If user is authenticated but email is not verified
  if (user?.isAuthenticated && !user.emailVerified) {
    return (
      <>
        {showBanner && <EmailVerificationBanner />}
        {fallback || null}
      </>
    );
  }

  // Only render children if user is authenticated and email is verified
  return showContent ? <>{children}</> : null;
};

export default RequireVerifiedEmail;
