
import React, { useState } from 'react';
import { Button } from './button';
import { Facebook, Github, Linkedin, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface SocialLoginButtonsProps {
  onSocialLogin: (provider: string) => void;
  isLoading?: boolean;
}

const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({ 
  onSocialLogin,
  isLoading = false
}) => {
  const { t } = useTranslation();
  const [clickedProvider, setClickedProvider] = useState<string | null>(null);
  
  const handleSocialLogin = (provider: string) => {
    if (isLoading) return;
    
    setClickedProvider(provider);
    try {
      onSocialLogin(provider);
    } catch (error) {
      console.error(`Error with ${provider} login:`, error);
      toast.error(`${provider} login failed`, {
        description: "The provider may not be enabled. Please try another method."
      });
      setClickedProvider(null);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {t('auth.orContinueWith')}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => handleSocialLogin('google')}
          disabled={isLoading || clickedProvider === 'google'}
        >
          <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
              <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
              <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
              <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
              <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
            </g>
          </svg>
          {clickedProvider === 'google' && isLoading ? 'Connecting...' : 'Google'}
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => handleSocialLogin('facebook')}
          disabled={isLoading || clickedProvider === 'facebook'}
        >
          <Facebook className="h-4 w-4 mr-2 text-blue-600" />
          {clickedProvider === 'facebook' && isLoading ? 'Connecting...' : 'Facebook'}
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => handleSocialLogin('github')}
          disabled={isLoading || clickedProvider === 'github'}
        >
          <Github className="h-4 w-4 mr-2" />
          {clickedProvider === 'github' && isLoading ? 'Connecting...' : 'GitHub'}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => handleSocialLogin('linkedin_oidc')}
          disabled={isLoading || clickedProvider === 'linkedin_oidc'}
        >
          <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
          {clickedProvider === 'linkedin_oidc' && isLoading ? 'Connecting...' : 'LinkedIn'}
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => handleSocialLogin('twitter')}
          disabled={isLoading || clickedProvider === 'twitter'}
        >
          <svg className="h-4 w-4 mr-2 fill-current text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
          </svg>
          {clickedProvider === 'twitter' && isLoading ? 'Connecting...' : 'Twitter'}
        </Button>
      </div>

      <div className="p-4 border border-amber-200 bg-amber-50 rounded-md text-amber-800 text-sm">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 text-amber-500" />
          <div>
            <p className="font-medium">Note about Social Login</p>
            <p className="mt-1">
              Social login providers like Google need to be enabled in your Supabase project settings. 
              If you're seeing "provider is not enabled" errors, please visit the Supabase dashboard to 
              configure your authentication providers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialLoginButtons;
