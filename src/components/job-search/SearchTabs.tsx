
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import FilterBar from '@/components/FilterBar';
import AdvancedSearchFilters from '@/components/AdvancedSearchFilters';
import MilitarySkillsFilter from '@/components/MilitarySkillsFilter';
import JobList from '@/components/JobList';
import { JobFilterState } from '@/context/JobContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface SearchTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  filters: JobFilterState;
  onKeywordChange: (keywords: string) => void;
  onLocationChange: (location: string) => void;
  onRemoteToggle: (remote: boolean) => void;
  onCountryChange: (country: "us" | "canada") => void;
  onClearFilters: () => void;
  onFilterChange: (name: string, value: any) => void;
  onMilitarySkillsChange: (skills: string[]) => void;
  jobs: any[];
  isLoading: boolean;
  error: Error | null;
  currentPage: number;
  totalPages: number;
  totalJobs: number;
  onPageChange: (page: number) => void;
}

const SearchTabs: React.FC<SearchTabsProps> = ({
  activeTab,
  setActiveTab,
  filters,
  onKeywordChange,
  onLocationChange,
  onRemoteToggle,
  onCountryChange,
  onClearFilters,
  onFilterChange,
  onMilitarySkillsChange,
  jobs,
  isLoading,
  error,
  currentPage,
  totalPages,
  totalJobs,
  onPageChange,
}) => {
  const { t } = useTranslation();

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="search">{t('Job Search')}</TabsTrigger>
        <TabsTrigger value="filters">{t('Advanced Filters')}</TabsTrigger>
      </TabsList>
      
      <TabsContent value="search" className="space-y-6">
        <FilterBar
          keywords={filters.keywords}
          location={filters.location}
          remote={filters.remote}
          country={filters.country}
          onKeywordChange={onKeywordChange}
          onLocationChange={onLocationChange}
          onRemoteToggle={onRemoteToggle}
          onCountryChange={onCountryChange}
          onToggleAdvancedFilters={() => setActiveTab('filters')}
          onClearFilters={onClearFilters}
        />
        
        <Separator className="my-6" />
        
        {error && !error.message.includes('NetworkError') && !error.message.includes('CORS') && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}
        
        <JobList
          jobs={jobs}
          isLoading={isLoading}
          error={error}
          currentPage={currentPage}
          totalPages={totalPages}
          totalJobs={totalJobs}
          onPageChange={onPageChange}
          country={filters.country}
        />
      </TabsContent>
      
      <TabsContent value="filters" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">{t('Advanced Filters')}</h2>
            
            <AdvancedSearchFilters
              filters={filters}
              onFilterChange={onFilterChange}
            />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">{t('Military Skills Translation')}</h2>
            
            <MilitarySkillsFilter
              selectedSkills={filters.militarySkills || []}
              onChange={onMilitarySkillsChange}
            />
          </div>
        </div>
        
        <div className="flex justify-between mt-6">
          <button 
            onClick={() => setActiveTab('search')}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
          >
            {t('Back to Search')}
          </button>
          
          <button 
            onClick={onClearFilters}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition"
          >
            {t('Clear All Filters')}
          </button>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default SearchTabs;
