
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { Button } from './ui/button';
import { LogIn, Facebook, Github } from 'lucide-react';

interface RequireAuthProps {
  children: React.ReactNode;
  redirectTo?: string;
  roles?: string[];
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ 
  children, 
  redirectTo = '/auth',
  roles
}) => {
  const { user, isLoading, session } = useUser();
  const location = useLocation();

  // In development mode, bypass authentication completely
  if (process.env.NODE_ENV === 'development') {
    console.log('DEV MODE: Authentication bypassed');
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  const isAuthenticated = !!session && !!user?.isAuthenticated;

  // If roles are specified, check if user has the required role
  const hasRequiredRole = !roles || (user && roles.includes(user.role));

  if (!isAuthenticated || !hasRequiredRole) {
    // Save the current location to redirect back after login
    const currentPath = encodeURIComponent(location.pathname + location.search);
    const loginRedirect = `${redirectTo}?redirect=${currentPath}`;
    
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
        <p className="text-muted-foreground mb-6">
          {!isAuthenticated
            ? "You need to be logged in to access this page."
            : "You don't have permission to access this page."}
        </p>
        <div className="space-y-4 w-full">
          <Button asChild className="w-full">
            <a href={loginRedirect}>
              <LogIn className="mr-2 h-4 w-4" />
              Log In or Sign Up
            </a>
          </Button>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <Button variant="outline" className="w-full" asChild>
              <a href={`${redirectTo}?provider=google&redirect=${currentPath}`}>
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                    <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                    <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                    <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                    <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                  </g>
                </svg>
                Google
              </a>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <a href={`${redirectTo}?provider=facebook&redirect=${currentPath}`}>
                <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                Facebook
              </a>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <a href={`${redirectTo}?provider=github&redirect=${currentPath}`}>
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
