import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useJobs, JobFilterState } from '@/context/JobContext';
import JobList from '@/components/JobList';
import FilterBar from '@/components/FilterBar';
import AdvancedSearchFilters from '@/components/AdvancedSearchFilters';
import MilitarySkillsFilter from '@/components/MilitarySkillsFilter';
import { useLightcastJobs } from '@/hooks/useLightcastJobs';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

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
  
  const {
    jobs,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalJobs,
    setPage,
    refreshJobs,
    usingFallbackData
  } = useLightcastJobs({
    keywords: filters.keywords,
    location: filters.location,
    radius: filters.radius,
    job_type: filters.jobType,
    industry: filters.industry,
    experience_level: filters.experienceLevel,
    education_level: filters.educationLevel,
    remote_type: filters.remote ? 'Full' : undefined,
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
      
      <h1 className="text-3xl font-bold mb-6">{t('Find Your Next Career')}</h1>
      
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
            usingFallbackData={usingFallbackData}
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
