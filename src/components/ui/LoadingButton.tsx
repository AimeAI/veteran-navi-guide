
import React from 'react';
import { Button, ButtonProps } from './button';
import { Loader } from 'lucide-react';

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean;
  loadingText?: string;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  children,
  isLoading = false,
  loadingText,
  disabled,
  ...props
}) => {
  return (
    <Button 
      disabled={isLoading || disabled} 
      aria-busy={isLoading}
      {...props}
    >
      {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
      <span>{isLoading && loadingText ? loadingText : children}</span>
    </Button>
  );
};

export default LoadingButton;
