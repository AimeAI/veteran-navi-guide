
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/UserContext';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import LoadingButton from '@/components/ui/LoadingButton';

const VerifyEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading, resendVerificationEmail } = useUser();

  // Redirect if not logged in
  if (!user?.isAuthenticated) {
    return (
      <div className="container mx-auto max-w-md py-10 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please login to verify your email</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate('/auth')} className="w-full">
              Go to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // If already verified
  if (user.emailVerified) {
    return (
      <div className="container mx-auto max-w-md py-10 px-4">
        <Card>
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-center">Email Already Verified</CardTitle>
            <CardDescription className="text-center">
              Your email address has been successfully verified
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button onClick={() => navigate('/')} className="mt-2">
              Return to Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const handleResend = async () => {
    await resendVerificationEmail();
  };

  return (
    <div className="container mx-auto max-w-md py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Verify Your Email</CardTitle>
          <CardDescription>
            We've sent a verification email to <span className="font-medium">{user.email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-6">
            Please check your inbox and click the verification link to complete your registration.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            If you don't see the email, please check your spam folder.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <LoadingButton 
            onClick={handleResend} 
            className="w-full" 
            isLoading={isLoading}
            loadingText="Sending..."
          >
            Resend Verification Email
          </LoadingButton>
          <Button 
            variant="outline" 
            onClick={() => navigate('/')} 
            className="w-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyEmailPage;
