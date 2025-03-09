
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LoadingButton from '@/components/ui/LoadingButton';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { isValidEmail } from '@/utils/validation';
import FormErrorMessage from '@/components/ui/form-error-message';
import { toast } from 'sonner';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validate email
    if (!email) {
      setError("Email is required");
      return;
    }
    
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });
      
      if (resetError) throw resetError;
      
      setIsSubmitted(true);
    } catch (err) {
      console.error("Password reset error:", err);
      
      if (err instanceof Error) {
        setError(err.message);
        toast.error("Failed to send reset email", {
          description: err.message
        });
      } else {
        setError("An unexpected error occurred. Please try again.");
        toast.error("Failed to send reset email");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-center">Check Your Email</CardTitle>
          <CardDescription className="text-center">
            We've sent you a password reset link to <span className="font-medium">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-2">
            Click the link in the email to reset your password.
          </p>
          <p className="text-sm text-gray-500">
            If you don't see the email, please check your spam folder.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center flex-col gap-2">
          <Button onClick={() => navigate('/auth')} variant="default" className="w-full">
            Return to Login
          </Button>
          <Button 
            variant="ghost" 
            className="w-full"
            onClick={() => {
              setIsSubmitted(false);
              setEmail("");
            }}
          >
            Try with a different email
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Reset Your Password</CardTitle>
        <CardDescription>
          Enter your email address and we'll send you a link to reset your password
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className={error ? "text-red-500" : ""}>
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                className={error ? "border-red-500" : ""}
                required
              />
              {error && <FormErrorMessage message={error} />}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <LoadingButton 
            type="submit" 
            className="w-full" 
            isLoading={isLoading}
            loadingText="Sending..."
          >
            Send Reset Link
          </LoadingButton>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate('/auth')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ForgotPassword;
