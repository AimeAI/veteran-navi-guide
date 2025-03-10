
import React from 'react';
import { Clock, X, Check } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SavedFilter } from '@/context/JobContext';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';
import { useJobs } from '@/context/JobContext';

interface SavedFilterBarProps {
  savedFilters: SavedFilter[];
  onApplyFilter: (id: string) => void;
}

export const SavedFilterBar: React.FC<SavedFilterBarProps> = ({ 
  savedFilters,
  onApplyFilter
}) => {
  const { t } = useTranslation();
  const { deleteSavedFilter } = useJobs();
  const [open, setOpen] = React.useState(false);

  if (savedFilters.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-medium flex items-center text-gray-700">
          <Clock className="h-3 w-3 mr-1 text-gray-500" />
          {t('Saved Searches')}
        </h3>
        
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 text-xs px-2">
              {t('View All')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <h4 className="font-medium mb-2">{t('Saved Searches')}</h4>
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {savedFilters.map((filter) => (
                  <div 
                    key={filter.id} 
                    className="border border-gray-200 rounded-md p-3 text-sm"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">{filter.name}</span>
                      <div className="flex">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => {
                            onApplyFilter(filter.id);
                            setOpen(false);
                          }}
                          title={t('Apply Filter')}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-6 w-6 p-0 text-red-600"
                          onClick={() => deleteSavedFilter(filter.id)}
                          title={t('Delete Filter')}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-gray-500 text-xs">
                      {t('Created')} {formatDistanceToNow(new Date(filter.dateCreated), { addSuffix: true })}
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-600 space-y-1">
                      {filter.filters.keywords && (
                        <div><strong>{t('Keywords')}:</strong> {filter.filters.keywords}</div>
                      )}
                      {filter.filters.location && (
                        <div><strong>{t('Location')}:</strong> {filter.filters.location}</div>
                      )}
                      {filter.filters.salaryRange && (
                        <div><strong>{t('Salary')}:</strong> {formatSalaryRange(filter.filters.salaryRange)}</div>
                      )}
                      {filter.filters.remote && (
                        <div>{t('Remote only')}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="flex overflow-x-auto py-1 gap-2">
        {savedFilters.slice(0, 5).map((filter) => (
          <Button
            key={filter.id}
            variant="outline"
            size="sm"
            className="h-7 text-xs whitespace-nowrap bg-white"
            onClick={() => onApplyFilter(filter.id)}
          >
            {filter.name}
          </Button>
        ))}
        {savedFilters.length > 5 && (
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs whitespace-nowrap bg-white"
            onClick={() => setOpen(true)}
          >
            +{savedFilters.length - 5} {t('more')}
          </Button>
        )}
      </div>
    </div>
  );
};

function formatSalaryRange(range: string): string {
  switch (range) {
    case 'under_50k':
      return 'Under $50K';
    case '50k_75k':
      return '$50K - $75K';
    case '75k_100k':
      return '$75K - $100K';
    case '100k_150k':
      return '$100K - $150K';
    case 'over_150k':
      return 'Over $150K';
    default:
      return 'Any';
  }
}
