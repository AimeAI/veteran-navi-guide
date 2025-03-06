
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useJobs, JobFilterState } from '@/context/JobContext';
import JobList from '@/components/JobList';
import FilterBar from '@/components/FilterBar';
import AdvancedSearchFilters from '@/components/AdvancedSearchFilters';
import MilitarySkillsFilter from '@/components/MilitarySkillsFilter';
import { useJobSearch } from '@/hooks/useJobSearch';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { JobCache } from '@/utils/jobCache';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const JobSearch: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('search');
  
  const [filters, setFilters] = useState<JobFilterState>({
    keywords: '',
    location: '',
    mosCodes: [],
    clearanceLevel: [],
    remote: false,
    militarySkills: [],
    radius: 50,
    industry: '',
    experienceLevel: '',
    educationLevel: '',
    jobType: '',
    companySize: '',
    companyRating: undefined,
    benefits: [],
    country: 'canada',
    useJobicy: false,
    skills: [],
    category: '',
    salaryRange: '',
  });
  
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showSkillsFilter, setShowSkillsFilter] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const {
    jobs,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalJobs,
    setPage,
    refreshJobs
  } = useJobSearch({
    keywords: filters.keywords,
    location: filters.location,
    radius: filters.radius,
    jobType: filters.jobType,
    industry: filters.industry,
    experienceLevel: filters.experienceLevel,
    educationLevel: filters.educationLevel,
    remote: filters.remote,
    country: filters.country,
    page: 1,
  });
  
  const handlePageChange = (page: number) => {
    setPage(page);
    window.scrollTo(0, 0);
  };
  
  const handleFilterChange = (name: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleKeywordSearch = (keywords: string) => {
    handleFilterChange('keywords', keywords);
  };
  
  const handleLocationSearch = (location: string) => {
    handleFilterChange('location', location);
  };
  
  const handleRemoteToggle = (remote: boolean) => {
    handleFilterChange('remote', remote);
  };
  
  const handleCountryChange = (country: "us" | "canada") => {
    handleFilterChange('country', country);
  };
  
  const handleMilitarySkillsChange = (skills: string[]) => {
    const skillKeywords = skills.map(skill => `skill:${skill}`).join(',');
    const updatedKeywords = filters.keywords 
      ? `${filters.keywords.replace(/skill:[a-z]+,?/g, '')} ${skillKeywords}`.trim()
      : skillKeywords;
    
    setFilters(prev => ({
      ...prev,
      keywords: updatedKeywords,
      militarySkills: skills,
    }));
  };
  
  const handleClearFilters = () => {
    setFilters({
      keywords: '',
      location: '',
      mosCodes: [],
      clearanceLevel: [],
      remote: false,
      militarySkills: [],
      radius: 50,
      industry: '',
      experienceLevel: '',
      educationLevel: '',
      jobType: '',
      companySize: '',
      companyRating: undefined,
      benefits: [],
      country: 'canada',
      useJobicy: false,
      skills: [],
      category: '',
      salaryRange: '',
    });
    setShowAdvancedFilters(false);
    setShowSkillsFilter(false);
  };
  
  const handleClearCacheAndRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      JobCache.clearCache();
      toast.info("Cleared job search cache");
      await refreshJobs();
      toast.success("Job results refreshed");
    } catch (error) {
      console.error('Error refreshing jobs:', error);
      toast.error("Failed to refresh job results");
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshJobs]);
  
  useEffect(() => {
    refreshJobs();
  }, [
    filters.keywords,
    filters.location,
    filters.remote,
    filters.radius,
    filters.industry,
    filters.experienceLevel,
    filters.educationLevel,
    filters.jobType,
    filters.country,
  ]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>{t('Job Search - Veteran Career Compass')}</title>
      </Helmet>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('Find Your Next Career')}</h1>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleClearCacheAndRefresh}
          disabled={isRefreshing || isLoading}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? t('Refreshing...') : t('Refresh Jobs')}
        </Button>
      </div>
      
      {error && !error.message.includes('NetworkError') && !error.message.includes('CORS') && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
      
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
            onKeywordChange={handleKeywordSearch}
            onLocationChange={handleLocationSearch}
            onRemoteToggle={handleRemoteToggle}
            onCountryChange={handleCountryChange}
            onToggleAdvancedFilters={() => setActiveTab('filters')}
            onClearFilters={handleClearFilters}
          />
          
          <Separator className="my-6" />
          
          <JobList
            jobs={jobs}
            isLoading={isLoading}
            error={error}
            currentPage={currentPage}
            totalPages={totalPages}
            totalJobs={totalJobs}
            onPageChange={handlePageChange}
            country={filters.country}
          />
        </TabsContent>
        
        <TabsContent value="filters" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">{t('Advanced Filters')}</h2>
              
              <AdvancedSearchFilters
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">{t('Military Skills Translation')}</h2>
              
              <MilitarySkillsFilter
                selectedSkills={filters.militarySkills || []}
                onChange={handleMilitarySkillsChange}
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
              onClick={handleClearFilters}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition"
            >
              {t('Clear All Filters')}
            </button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JobSearch;
