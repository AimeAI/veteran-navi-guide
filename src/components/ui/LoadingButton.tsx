
import React from 'react';
import { Button, ButtonProps } from './button';
import { Loader } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean;
  loadingText?: string;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  children,
  isLoading = false,
  loadingText,
  disabled,
  className,
  ...props
}) => {
  return (
    <Button 
      disabled={isLoading || disabled} 
      aria-busy={isLoading}
      className={cn("w-full sm:w-auto flex justify-center items-center", className)}
      {...props}
    >
      {isLoading && (
        <Loader 
          className="mr-2 h-4 w-4 animate-spin" 
          aria-hidden="true" 
        />
      )}
      <span className="truncate">{isLoading && loadingText ? loadingText : children}</span>
    </Button>
  );
};

export default LoadingButton;
