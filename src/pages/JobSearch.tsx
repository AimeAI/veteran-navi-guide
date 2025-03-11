
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useJobSearch } from '@/hooks/useJobSearch';
import { useJobSearchState } from '@/hooks/useJobSearchState';
import { useTranslation } from 'react-i18next';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import JobSearchHeader from '@/components/job-search/JobSearchHeader';
import SearchTabs from '@/components/job-search/SearchTabs';
import SearchFilters from '@/components/job-search/SearchFilters';
import SortOptions from '@/components/job-search/SortOptions';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const JobSearch: React.FC = () => {
  const { t } = useTranslation();
  const [sortBy, setSortBy] = useState('relevant');
  
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
    keywords: '',
    location: '',
    radius: 50,
    jobType: '',
    industry: '',
    experienceLevel: '',
    educationLevel: '',
    remote: false,
    country: 'canada',
    page: 1,
    sortBy: sortBy,
  });
  
  const {
    filters,
    activeTab,
    showAdvancedFilters,
    isRefreshing,
    setActiveTab,
    setShowAdvancedFilters,
    handleFilterChange,
    handleKeywordSearch,
    handleLocationSearch,
    handleRemoteToggle,
    handleCountryChange,
    handleMilitarySkillsChange,
    handleSkillsChange,
    handleClearFilters,
    handleClearCacheAndRefresh,
  } = useJobSearchState(refreshJobs);
  
  const handlePageChange = (page: number) => {
    setPage(page);
    window.scrollTo(0, 0);
  };
  
  const handleSortChange = (value: string) => {
    setSortBy(value);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refreshJobs();
    toast.info(t('Searching for jobs...'));
  };
  
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
    filters.skills,
    filters.salaryRange,
    sortBy,
  ]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>{t('Job Search - Veteran Career Compass')}</title>
        <meta name="description" content={t('Search for veteran-friendly jobs and career opportunities')} />
      </Helmet>
      
      <JobSearchHeader 
        onRefresh={handleClearCacheAndRefresh}
        isRefreshing={isRefreshing}
        isLoading={isLoading}
      />
      
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={filters.keywords}
                onChange={(e) => handleKeywordSearch(e.target.value)}
                placeholder={t('Job title, keywords, or company')}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={filters.location}
                onChange={(e) => handleLocationSearch(e.target.value)}
                placeholder={t('City, province, or postal code')}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>
            
            <div className="relative">
              <select
                value={filters.radius}
                onChange={(e) => handleFilterChange('radius', parseInt(e.target.value))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              >
                <option value="5">{t('Within 5 km')}</option>
                <option value="10">{t('Within 10 km')}</option>
                <option value="25">{t('Within 25 km')}</option>
                <option value="50">{t('Within 50 km')}</option>
                <option value="100">{t('Within 100 km')}</option>
              </select>
            </div>
          </div>
          
          {/* Search Filters Component */}
          <SearchFilters 
            filters={filters}
            onChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            showAdvancedFilters={showAdvancedFilters}
            setShowAdvancedFilters={setShowAdvancedFilters}
          />
          
          <div className="flex justify-between items-center pt-2">
            <SortOptions 
              sortBy={sortBy}
              onSortChange={handleSortChange}
            />
            
            <Button
              type="submit"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <Search className="h-5 w-5 mr-2" />
              {t('Search Jobs')}
            </Button>
          </div>
        </form>
      </div>
      
      <SearchTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        filters={filters}
        onKeywordChange={handleKeywordSearch}
        onLocationChange={handleLocationSearch}
        onRemoteToggle={handleRemoteToggle}
        onCountryChange={handleCountryChange}
        onClearFilters={handleClearFilters}
        onFilterChange={handleFilterChange}
        onMilitarySkillsChange={handleMilitarySkillsChange}
        onSkillsChange={handleSkillsChange}
        jobs={jobs}
        isLoading={isLoading}
        error={error}
        currentPage={currentPage}
        totalPages={totalPages}
        totalJobs={totalJobs}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default JobSearch;
