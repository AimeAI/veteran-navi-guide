/**
 * Under Construction Page
 * Displayed for features that are not yet ready
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Construction, ArrowLeft, Home } from 'lucide-react';

interface UnderConstructionProps {
  autoRedirect?: boolean;
  redirectDelay?: number;
  title?: string;
  message?: string;
}

const UnderConstruction: React.FC<UnderConstructionProps> = ({
  autoRedirect = true,
  redirectDelay = 3000,
  title = "Under Construction",
  message = "This feature is currently being developed. You will be redirected to the homepage shortly."
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (autoRedirect) {
      const timer = setTimeout(() => {
        navigate('/');
      }, redirectDelay);

      return () => clearTimeout(timer);
    }
  }, [autoRedirect, redirectDelay, navigate]);

  return (
    <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Construction className="h-16 w-16 text-yellow-500" />
          </div>
          <CardTitle className="text-3xl">{title}</CardTitle>
          <CardDescription className="text-lg mt-2">
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>What's available now:</strong>
            </p>
            <ul className="list-disc list-inside text-sm text-blue-700 mt-2 space-y-1">
              <li>80+ Canadian Defense Contractors with direct career page links</li>
              <li>Real veteran job fair resources and organizations</li>
              <li>Government transition services and support programs</li>
            </ul>
          </div>

          <div className="flex gap-4 justify-center pt-4">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
            <Button
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              Go to Homepage
            </Button>
          </div>

          {autoRedirect && (
            <p className="text-center text-sm text-muted-foreground mt-4">
              Redirecting to homepage in {redirectDelay / 1000} seconds...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UnderConstruction;
