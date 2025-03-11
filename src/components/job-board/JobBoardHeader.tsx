
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface JobBoardHeaderProps {
  isRefreshing: boolean;
  isLoading: boolean;
  onRefresh: () => void;
}

const JobBoardHeader: React.FC<JobBoardHeaderProps> = ({ 
  isRefreshing, 
  isLoading, 
  onRefresh 
}) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <div>
        <CardTitle className="text-3xl font-bold">Job Board</CardTitle>
        <CardDescription>
          Browse job listings from Job Bank Canada and other sources
        </CardDescription>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onRefresh}
        disabled={isRefreshing || isLoading}
        className="flex items-center gap-1"
      >
        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        {isRefreshing ? "Refreshing..." : "Refresh Jobs"}
      </Button>
    </CardHeader>
  );
};

export default JobBoardHeader;
