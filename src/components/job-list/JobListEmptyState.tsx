
import React from 'react';
import { Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface JobListEmptyStateProps {
  message: string;
  country?: "us" | "canada";
  onRetry?: () => void;
}

const JobListEmptyState: React.FC<JobListEmptyStateProps> = ({ 
  message, 
  country = "canada", 
  onRetry 
}) => {
  const countryName = country === "canada" ? "Canada" : "United States";

  return (
    <div className="text-center py-12">
      <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-lg font-medium text-gray-900">No jobs found in {countryName}</h3>
      <p className="mt-1 text-sm text-gray-500">
        {message}
      </p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="mt-4">
          Try Again
        </Button>
      )}
    </div>
  );
};

export default JobListEmptyState;
