
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the code from the URL
        const code = searchParams.get('code');
        
        if (!code) {
          setError('No authorization code found in the URL');
          return;
        }

        // If we have the auth code, complete the OAuth flow
        const { error: signInError } = await supabase.auth.exchangeCodeForSession(code);
        
        if (signInError) {
          setError(signInError.message);
          return;
        }

        // Get the redirect path
        let redirectPath = searchParams.get('redirect') || '/';
        
        // Check for employer query param
        const isEmployer = searchParams.get('isEmployer') === 'true';
        
        // If employer, redirect to employer page
        if (isEmployer) {
          redirectPath = '/employer/manage-applications';
        }
        
        // Successfully authenticated, redirect
        navigate(redirectPath, { replace: true });
      } catch (err) {
        console.error('Error handling auth callback:', err);
        setError('Failed to complete authentication');
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams]);

  // If there's an error, show it
  if (error) {
    return (
      <div className="container py-10 max-w-lg mx-auto">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Authentication Failed</h1>
              <p className="text-red-500 mb-4">{error}</p>
              <button
                className="text-primary underline"
                onClick={() => navigate('/auth', { replace: true })}
              >
                Return to Login
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading spinner while processing
  return (
    <div className="container py-10 flex flex-col items-center justify-center min-h-[60vh]">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-muted-foreground">Completing authentication...</p>
    </div>
  );
};

export default AuthCallbackPage;
