
import React from "react";
import { useUser } from "@/context/UserContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Mail, AlertTriangle } from "lucide-react";
import LoadingButton from "./ui/LoadingButton";
import { useNavigate } from "react-router-dom";

interface EmailVerificationBannerProps {
  className?: string;
}

const EmailVerificationBanner: React.FC<EmailVerificationBannerProps> = ({ className }) => {
  const { user, isLoading, resendVerificationEmail } = useUser();
  const navigate = useNavigate();

  // Don't show if user is not logged in or email is already verified
  if (!user || !user.isAuthenticated || user.emailVerified) {
    return null;
  }

  const handleResendVerification = async () => {
    await resendVerificationEmail();
  };

  const handleVerifyPage = () => {
    navigate('/verify-email');
  };

  return (
    <Alert variant="warning" className={`mb-6 ${className}`}>
      <AlertTriangle className="h-5 w-5" />
      <div className="flex-1">
        <AlertTitle className="font-medium">Verify your email address</AlertTitle>
        <AlertDescription className="mt-1 text-sm">
          <p className="mb-2">
            We've sent a verification email to <span className="font-medium">{user.email}</span>. 
            Please verify your email to access all features.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
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
            <Button
              onClick={handleVerifyPage}
              size="sm"
              variant="outline"
              className="border-yellow-700 text-yellow-800 hover:bg-yellow-50"
            >
              Verification Instructions
            </Button>
          </div>
        </AlertDescription>
      </div>
    </Alert>
  );
};

export default EmailVerificationBanner;
