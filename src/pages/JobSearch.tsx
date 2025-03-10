
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useJobSearch } from '@/hooks/useJobSearch';
import { useJobSearchState } from '@/hooks/useJobSearchState';
import { useTranslation } from 'react-i18next';
import JobSearchHeader from '@/components/job-search/JobSearchHeader';
import SearchTabs from '@/components/job-search/SearchTabs';
import { useUser } from '@/context/UserContext'; // Changed from useAuth to useUser
import { getUserSkills } from '@/utils/skillMatching'; // Import skill matching function

const JobSearch: React.FC = () => {
  const { t } = useTranslation();
  const { user, supabaseUser } = useUser(); // Get both user profile and supabaseUser which has the ID
  
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
    handleSkillsChange,
    handleClearFilters,
    handleClearCacheAndRefresh,
  } = useJobSearchState(refreshJobs);
  
  const handlePageChange = (page: number) => {
    setPage(page);
    window.scrollTo(0, 0);
  };
  
  // Fetch user skills when component mounts if user is logged in
  useEffect(() => {
    const fetchUserSkills = async () => {
      if (supabaseUser?.id) {
        try {
          const skills = await getUserSkills(supabaseUser.id);
          if (skills.length > 0) {
            handleSkillsChange(skills);
          }
        } catch (error) {
          console.error("Error fetching user skills:", error);
        }
      }
    };
    
    fetchUserSkills();
  }, [supabaseUser, handleSkillsChange]);
  
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
