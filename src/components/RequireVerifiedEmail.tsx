
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import LoadingButton from './ui/LoadingButton';

interface RequireVerifiedEmailProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const RequireVerifiedEmail: React.FC<RequireVerifiedEmailProps> = ({ 
  children, 
  redirectTo = '/verify-email' 
}) => {
  const { user, isLoading, resendVerificationEmail } = useUser();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <p>Checking authentication status...</p>
      </div>
    );
  }

  // If user is not logged in, they need to authenticate first
  if (!user || !user.isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  // If email is verified, render the children (protected content)
  if (user.emailVerified) {
    return <>{children}</>;
  }

  // If we get here, user is logged in but email is not verified
  const handleResendVerification = async () => {
    await resendVerificationEmail();
  };

  return (
    <div className="container mx-auto max-w-md py-10 px-4">
      <Card>
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-yellow-100 p-3">
              <Mail className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <CardTitle className="text-center">Email Verification Required</CardTitle>
          <CardDescription className="text-center">
            Please verify your email address to access this feature
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col space-y-2">
          <LoadingButton 
            onClick={handleResendVerification} 
            className="w-full" 
            isLoading={isLoading}
            loadingText="Sending..."
          >
            Resend Verification Email
          </LoadingButton>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = redirectTo} 
            className="w-full"
          >
            Verification Instructions
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RequireVerifiedEmail;
