
import React from "react";
import { useUser } from "@/context/UserContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Mail, AlertTriangle } from "lucide-react";
import LoadingButton from "./ui/LoadingButton";

interface EmailVerificationBannerProps {
  className?: string;
}

const EmailVerificationBanner: React.FC<EmailVerificationBannerProps> = ({ className }) => {
  const { user, isLoading, resendVerificationEmail } = useUser();

  // Don't show if user is not logged in or email is already verified
  if (!user || !user.isAuthenticated || user.emailVerified) {
    return null;
  }

  const handleResendVerification = async () => {
    await resendVerificationEmail();
  };

  return (
    <Alert variant="warning" className={`mb-6 border-yellow-400 bg-yellow-50 text-yellow-800 ${className}`}>
      <AlertTriangle className="h-5 w-5 text-yellow-600" />
      <div className="flex-1">
        <AlertTitle className="font-medium text-yellow-800">Verify your email address</AlertTitle>
        <AlertDescription className="mt-1 text-sm text-yellow-700">
          <p className="mb-2">
            We've sent a verification email to <span className="font-medium">{user.email}</span>. 
            Please verify your email to access all features.
          </p>
          <div className="mt-3">
            <LoadingButton 
              onClick={handleResendVerification} 
              size="sm" 
              className="bg-yellow-700 hover:bg-yellow-800 text-white"
              isLoading={isLoading}
              loadingText="Sending..."
            >
              <Mail className="h-4 w-4 mr-1" />
              Resend verification email
            </LoadingButton>
          </div>
        </AlertDescription>
      </div>
    </Alert>
  );
};

export default EmailVerificationBanner;
