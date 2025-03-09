
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Globe, RefreshCw } from 'lucide-react';

export interface JobListHeaderProps {
  totalJobs: number;
  showSearch?: boolean;
  showFilters?: boolean;
  country?: "us" | "canada";
  isRefreshing?: boolean;
  isLoading?: boolean;
  jobBankCount?: number;
  indeedCount?: number;
  linkedinCount?: number;
  onRefresh?: () => Promise<void>;
}

const JobListHeader: React.FC<JobListHeaderProps> = ({
  totalJobs,
  showSearch = true,
  showFilters = true,
  country = "canada",
  isRefreshing = false,
  isLoading = false,
  jobBankCount = 0,
  indeedCount = 0,
  linkedinCount = 0,
  onRefresh,
}) => {
  const countryName = country === "canada" ? "Canada" : "United States";
  
  const handleRetry = async () => {
    if (onRefresh) {
      await onRefresh();
    }
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-lg font-medium text-gray-900">Job Listings</h2>
      <div className="flex items-center gap-2">
        <Badge variant={country === "canada" ? "outline" : "default"} className="flex items-center gap-1">
          <Globe className="h-3 w-3" />
          {countryName}
        </Badge>
        {jobBankCount > 0 && (
          <Badge variant="secondary" className="flex items-center gap-1">
            Job Bank: {jobBankCount}
          </Badge>
        )}
        {indeedCount > 0 && (
          <Badge variant="orange" className="flex items-center gap-1">
            Indeed: {indeedCount}
          </Badge>
        )}
        {linkedinCount > 0 && (
          <Badge variant="purple" className="flex items-center gap-1">
            LinkedIn: {linkedinCount}
          </Badge>
        )}
        <span className="text-sm text-gray-500">{totalJobs} jobs found</span>
        
        {onRefresh && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRetry}
            disabled={isRefreshing || isLoading}
            className="ml-2"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default JobListHeader;
