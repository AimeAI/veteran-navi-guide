
import React from 'react';
import { Button } from './button';
import { FaGoogle, FaFacebook, FaGithub } from 'react-icons/fa';
import { RiAdminFill } from 'react-icons/ri';

interface SocialLoginButtonsProps {
  onSocialLogin: (provider: string) => Promise<void>;
  isLoading: boolean;
  showAdminLogin?: boolean;
  onAdminLogin?: () => void;
}

const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({ 
  onSocialLogin, 
  isLoading,
  showAdminLogin = true,
  onAdminLogin
}) => {
  return (
    <div className="space-y-3">
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <Button 
          variant="outline" 
          type="button"
          onClick={() => onSocialLogin('google')} 
          disabled={isLoading}
        >
          <FaGoogle className="h-4 w-4 mr-2" />
          Google
        </Button>
        <Button 
          variant="outline" 
          type="button"
          onClick={() => onSocialLogin('facebook')} 
          disabled={isLoading}
        >
          <FaFacebook className="h-4 w-4 mr-2" />
          Facebook
        </Button>
        <Button 
          variant="outline" 
          type="button"
          onClick={() => onSocialLogin('github')} 
          disabled={isLoading}
        >
          <FaGithub className="h-4 w-4 mr-2" />
          GitHub
        </Button>
      </div>
      
      {showAdminLogin && onAdminLogin && (
        <Button 
          variant="outline" 
          type="button"
          onClick={onAdminLogin} 
          disabled={isLoading}
          className="w-full mt-2 bg-black text-white hover:bg-gray-800"
        >
          <RiAdminFill className="h-4 w-4 mr-2" />
          Admin Demo Login
        </Button>
      )}
    </div>
  );
};

export default SocialLoginButtons;
