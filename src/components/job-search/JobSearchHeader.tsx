
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface JobSearchHeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  isLoading: boolean;
}

const JobSearchHeader: React.FC<JobSearchHeaderProps> = ({
  onRefresh,
  isRefreshing,
  isLoading,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">{t('Find Your Next Career')}</h1>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onRefresh}
        disabled={isRefreshing || isLoading}
        className="flex items-center gap-1"
      >
        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        {isRefreshing ? t('Refreshing...') : t('Refresh Jobs')}
      </Button>
    </div>
  );
};

export default JobSearchHeader;
