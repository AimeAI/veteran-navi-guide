
import { useState, useCallback } from 'react';
import { JobFilterState } from '@/types/job';
import { JobCache } from '@/utils/jobCache';
import { toast } from 'sonner';

/**
 * Hook for managing job search filter state
 * @param refreshJobs - Function to refresh job results
 * @returns Filter state and utility functions
 */
export function useJobSearchState(refreshJobs: () => Promise<void>) {
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
    skills: [], // Initialize skills array
    category: '',
    salaryRange: '',
  });
  
  const [activeTab, setActiveTab] = useState('search');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showSkillsFilter, setShowSkillsFilter] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  /**
   * Handle changes to a specific filter
   * @param name - Name of the filter to update
   * @param value - New value for the filter
   */
  const handleFilterChange = (name: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  /**
   * Update the keywords filter
   * @param keywords - New keywords value
   */
  const handleKeywordSearch = (keywords: string) => {
    handleFilterChange('keywords', keywords);
  };
  
  /**
   * Update the location filter
   * @param location - New location value
   */
  const handleLocationSearch = (location: string) => {
    handleFilterChange('location', location);
  };
  
  /**
   * Toggle the remote jobs filter
   * @param remote - New remote value
   */
  const handleRemoteToggle = (remote: boolean) => {
    handleFilterChange('remote', remote);
  };
  
  /**
   * Update the country filter
   * @param country - New country value
   */
  const handleCountryChange = (country: "us" | "canada") => {
    handleFilterChange('country', country);
  };
  
  /**
   * Update military skills filter
   * @param skills - New military skills array
   */
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
  
  /**
   * Update the skills filter
   * @param skills - New skills array
   */
  const handleSkillsChange = (skills: string[]) => {
    setFilters(prev => ({
      ...prev,
      skills,
    }));
  };
  
  /**
   * Reset all filters to default values
   */
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
      skills: [], // Clear skills too
      category: '',
      salaryRange: '',
    });
    setShowAdvancedFilters(false);
    setShowSkillsFilter(false);
    
    toast.info("All filters have been cleared");
  };
  
  /**
   * Clear cache and refresh job results
   */
  const handleClearCacheAndRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      JobCache.clearCache();
      toast.info("Cleared job search cache");
      await refreshJobs();
      toast.success("Job results refreshed with the latest listings");
    } catch (error) {
      console.error('Error refreshing jobs:', error);
      toast.error("Failed to refresh job results");
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshJobs]);
  
  return {
    filters,
    activeTab,
    showAdvancedFilters,
    showSkillsFilter,
    isRefreshing,
    setActiveTab,
    setShowAdvancedFilters,
    setShowSkillsFilter,
    handleFilterChange,
    handleKeywordSearch,
    handleLocationSearch,
    handleRemoteToggle,
    handleCountryChange,
    handleMilitarySkillsChange,
    handleSkillsChange,
    handleClearFilters,
    handleClearCacheAndRefresh,
  };
}
