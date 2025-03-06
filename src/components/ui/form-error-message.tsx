
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormErrorMessageProps {
  message?: string;
  className?: string;
}

const FormErrorMessage: React.FC<FormErrorMessageProps> = ({ message, className }) => {
  if (!message) return null;
  
  return (
    <div className={cn("flex items-center mt-1 text-destructive text-sm", className)}>
      <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
};

export default FormErrorMessage;
