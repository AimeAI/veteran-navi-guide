import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/UserContext';
import { CheckCircle, ArrowLeft, Mail } from 'lucide-react';
import LoadingButton from '@/components/ui/LoadingButton';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

const VerifyEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading, resendVerificationEmail } = useUser();
  const [searchParams] = useSearchParams();

  // Check if this is a redirect from email verification
  useEffect(() => {
    const handleEmailVerification = async () => {
      // Only process if we have email verification parameters
      if (searchParams.has('type') && searchParams.get('type') === 'email_confirmation') {
        try {
          // Exchange the email verification token
          const { error } = await supabase.auth.exchangeCodeForSession(
            searchParams.toString()
          );
          
          if (error) {
            toast.error("Email verification failed", {
              description: error.message
            });
          } else {
            toast.success("Email verification successful!", {
              description: "Your email has been verified. You now have full access to all features."
            });
            
            // Force reload to update the session
            setTimeout(() => {
              window.location.href = '/';
            }, 2000);
          }
        } catch (error) {
          console.error("Error verifying email:", error);
          toast.error("Verification failed", {
            description: "There was a problem verifying your email. Please try again."
          });
        }
      }
    };
    
    handleEmailVerification();
  }, [searchParams]);

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
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-yellow-100 p-3">
              <Mail className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <CardTitle className="text-center">Verify Your Email</CardTitle>
          <CardDescription className="text-center">
            We've sent a verification email to <span className="font-medium">{user.email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-6">
            Please check your inbox and click the verification link to complete your registration.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
            <h3 className="font-medium text-blue-800 mb-2">How to verify your email:</h3>
            <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1 text-left">
              <li>Check your email inbox for a message from us</li>
              <li>Open the email and click on the verification link</li>
              <li>You'll be redirected back to our site with full access</li>
            </ol>
          </div>
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
