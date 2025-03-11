
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useJobSearch } from '@/hooks/useJobSearch';
import { useJobSearchState } from '@/hooks/useJobSearchState';
import { useTranslation } from 'react-i18next';
import JobSearchHeader from '@/components/job-search/JobSearchHeader';
import SearchTabs from '@/components/job-search/SearchTabs';

const JobSearch: React.FC = () => {
  const { t } = useTranslation();
  
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
  });
  
  const {
    filters,
    activeTab,
    isRefreshing,
    setActiveTab,
    handleFilterChange,
    handleKeywordSearch,
    handleLocationSearch,
    handleRemoteToggle,
    handleCountryChange,
    handleMilitarySkillsChange,
    handleSkillsChange, // New handler
    handleClearFilters,
    handleClearCacheAndRefresh,
  } = useJobSearchState(refreshJobs);
  
  const handlePageChange = (page: number) => {
    setPage(page);
    window.scrollTo(0, 0);
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
    filters.skills, // Add skills dependency
  ]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>{t('Job Search - Veteran Career Compass')}</title>
      </Helmet>
      
      <JobSearchHeader 
        onRefresh={handleClearCacheAndRefresh}
        isRefreshing={isRefreshing}
        isLoading={isLoading}
      />
      
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
