
import { useState, useCallback } from 'react';
import { JobFilterState } from '@/context/JobContext';

interface JobSearchStateHook {
  filters: JobFilterState;
  activeTab: string;
  isRefreshing: boolean;
  setActiveTab: (tab: string) => void;
  handleFilterChange: (name: string, value: any) => void;
  handleKeywordSearch: (keywords: string) => void;
  handleLocationSearch: (location: string) => void;
  handleRemoteToggle: (remote: boolean) => void;
  handleCountryChange: (country: "us" | "canada") => void;
  handleMilitarySkillsChange: (skills: string[]) => void;
  handleSkillsChange: (skills: string[]) => void;
  handleClearFilters: () => void;
  handleClearCacheAndRefresh: () => Promise<void>;
}

export const useJobSearchState = (refreshCallback: () => Promise<void>): JobSearchStateHook => {
  const [activeTab, setActiveTab] = useState('search');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filters, setFilters] = useState<JobFilterState>({
    keywords: '',
    location: '',
    radius: 50,
    remote: false,
    militarySkills: [],
    jobType: '',
    industry: '',
    experienceLevel: '',
    educationLevel: '',
    country: 'canada',
    skills: [],
    // Adding the missing properties to match JobFilterState
    mosCodes: undefined,
    clearanceLevel: undefined,
    companySize: '',
    companyRating: undefined,
    benefits: undefined,
    useJobicy: false,
    category: '',
    salaryRange: '',
  });
  
  const handleFilterChange = useCallback((name: string, value: any) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  }, []);
  
  const handleKeywordSearch = useCallback((keywords: string) => {
    setFilters(prev => ({ ...prev, keywords }));
  }, []);
  
  const handleLocationSearch = useCallback((location: string) => {
    setFilters(prev => ({ ...prev, location }));
  }, []);
  
  const handleRemoteToggle = useCallback((remote: boolean) => {
    setFilters(prev => ({ ...prev, remote }));
  }, []);
  
  const handleCountryChange = useCallback((country: "us" | "canada") => {
    setFilters(prev => ({ ...prev, country }));
  }, []);
  
  const handleMilitarySkillsChange = useCallback((skills: string[]) => {
    setFilters(prev => ({ ...prev, militarySkills: skills }));
  }, []);

  const handleSkillsChange = useCallback((skills: string[]) => {
    setFilters(prev => ({ ...prev, skills }));
  }, []);
  
  const handleClearFilters = useCallback(() => {
    setFilters({
      keywords: '',
      location: '',
      radius: 50,
      remote: false,
      militarySkills: [],
      jobType: '',
      industry: '',
      experienceLevel: '',
      educationLevel: '',
      country: 'canada',
      skills: [],
      // Adding the missing properties to match JobFilterState
      mosCodes: undefined,
      clearanceLevel: undefined,
      companySize: '',
      companyRating: undefined,
      benefits: undefined,
      useJobicy: false,
      category: '',
      salaryRange: '',
    });
  }, []);
  
  const handleClearCacheAndRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refreshCallback();
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshCallback]);
  
  return {
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
  };
};
