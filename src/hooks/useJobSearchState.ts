
import { useState, useCallback } from 'react';
import { JobFilterState } from '@/context/JobContext';
import { JobCache } from '@/utils/jobCache';
import { toast } from 'sonner';

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
    skills: [],
    category: '',
    salaryRange: '',
  });
  
  const [activeTab, setActiveTab] = useState('search');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showSkillsFilter, setShowSkillsFilter] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
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
    handleClearFilters,
    handleClearCacheAndRefresh,
  };
}
