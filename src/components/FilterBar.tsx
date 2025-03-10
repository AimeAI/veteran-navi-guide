
import React, { useState } from 'react';
import { 
  Filter, Search, MapPin, Globe, X, 
  Building, BookOpen, Briefcase, DollarSign, Shield, Medal 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from 'react-i18next';
import { 
  ClearanceLevel,
  MilitaryBranch,
  EducationLevel,
  SalaryRange
} from '@/types/badges';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SavedFilterBar } from './SavedFilterBar';
import { useJobs } from '@/context/JobContext';

interface FilterBarProps {
  keywords: string;
  location: string;
  remote: boolean;
  country: "us" | "canada" | undefined;
  clearanceLevel?: ClearanceLevel;
  militaryBranch?: MilitaryBranch;
  educationLevel?: EducationLevel;
  salaryRange?: SalaryRange;
  yearsOfService?: number;
  onKeywordChange: (keywords: string) => void;
  onLocationChange: (location: string) => void;
  onRemoteToggle: (remote: boolean) => void;
  onCountryChange: (country: "us" | "canada") => void;
  onClearanceLevelChange: (level: ClearanceLevel) => void;
  onMilitaryBranchChange: (branch: MilitaryBranch) => void;
  onEducationLevelChange: (level: EducationLevel) => void;
  onSalaryRangeChange: (range: SalaryRange) => void;
  onYearsOfServiceChange: (years: number) => void;
  onToggleAdvancedFilters: () => void;
  onClearFilters: () => void;
  onSaveFilter: (name: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  keywords,
  location,
  remote,
  country = "canada",
  clearanceLevel,
  militaryBranch,
  educationLevel,
  salaryRange,
  yearsOfService,
  onKeywordChange,
  onLocationChange,
  onRemoteToggle,
  onCountryChange,
  onClearanceLevelChange,
  onMilitaryBranchChange,
  onEducationLevelChange,
  onSalaryRangeChange,
  onYearsOfServiceChange,
  onToggleAdvancedFilters,
  onClearFilters,
  onSaveFilter,
}) => {
  const { t } = useTranslation();
  const { savedFilters, applySavedFilter } = useJobs();
  const [localKeywords, setLocalKeywords] = useState(keywords);
  const [localLocation, setLocalLocation] = useState(location);
  const [saveFilterName, setSaveFilterName] = useState("");
  const [isSaveFilterOpen, setIsSaveFilterOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onKeywordChange(localKeywords);
    onLocationChange(localLocation);
  };

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalKeywords(e.target.value);
    // Only immediately update for empty field (clearing filter)
    if (e.target.value === '') {
      onKeywordChange('');
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalLocation(e.target.value);
    // Only immediately update for empty field (clearing filter)
    if (e.target.value === '') {
      onLocationChange('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onKeywordChange(localKeywords);
      onLocationChange(localLocation);
    }
  };

  const handleSaveFilter = () => {
    if (saveFilterName.trim()) {
      onSaveFilter(saveFilterName);
      setSaveFilterName("");
      setIsSaveFilterOpen(false);
    }
  };

  const hasActiveFilters = 
    keywords || 
    location || 
    remote || 
    country !== "canada" || 
    clearanceLevel || 
    militaryBranch || 
    educationLevel || 
    salaryRange || 
    yearsOfService;

  return (
    <div className="space-y-4">
      {savedFilters.length > 0 && (
        <SavedFilterBar 
          savedFilters={savedFilters} 
          onApplyFilter={applySavedFilter}
        />
      )}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium flex items-center">
            <Filter className="h-4 w-4 mr-2 text-gray-500" />
            {t('Search Jobs')}
          </h2>
          
          <div className="flex gap-2">
            {hasActiveFilters && (
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={onClearFilters}
                className="h-8 px-2 text-sm text-gray-500"
              >
                <X className="h-4 w-4 mr-1" />
                {t('Clear')}
              </Button>
            )}
            
            <Popover open={isSaveFilterOpen} onOpenChange={setIsSaveFilterOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2 text-sm"
                  disabled={!hasActiveFilters}
                >
                  {t('Save Filter')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4">
                <div className="space-y-4">
                  <h4 className="font-medium">{t('Save Current Search')}</h4>
                  <p className="text-sm text-gray-500">
                    {t('Give your search filter a name to easily find it later.')}
                  </p>
                  <Input
                    placeholder={t('Filter name')}
                    value={saveFilterName}
                    onChange={(e) => setSaveFilterName(e.target.value)}
                  />
                  <div className="flex justify-end gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsSaveFilterOpen(false)}
                    >
                      {t('Cancel')}
                    </Button>
                    <Button 
                      type="button"
                      size="sm"
                      onClick={handleSaveFilter}
                      disabled={!saveFilterName.trim()}
                    >
                      {t('Save')}
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder={t('Job title, keywords, or company')}
                className="pl-9"
                value={localKeywords}
                onChange={handleKeywordChange}
                onKeyDown={handleKeyDown}
                onBlur={() => onKeywordChange(localKeywords)}
              />
            </div>
          </div>
          
          <div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder={t('City, province, or postal code')}
                className="pl-9"
                value={localLocation}
                onChange={handleLocationChange}
                onKeyDown={handleKeyDown}
                onBlur={() => onLocationChange(localLocation)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="remote"
                checked={remote}
                onCheckedChange={onRemoteToggle}
              />
              <Label htmlFor="remote" className="text-sm">{t('Remote only')}</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-gray-500" />
              <Select
                value={country}
                onValueChange={(value: "us" | "canada") => onCountryChange(value)}
              >
                <SelectTrigger className="h-8 border-0 bg-transparent shadow-none p-0 w-[110px]">
                  <SelectValue placeholder={t('Country')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="canada">{t('Canada')}</SelectItem>
                  <SelectItem value="us">{t('United States')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <Select
                value={salaryRange}
                onValueChange={(value: SalaryRange) => onSalaryRangeChange(value)}
              >
                <SelectTrigger className="h-8 border-0 bg-transparent shadow-none p-0 w-[150px]">
                  <SelectValue placeholder={t('Salary Range')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_specified">{t('Any Salary')}</SelectItem>
                  <SelectItem value="under_50k">{t('Under $50K')}</SelectItem>
                  <SelectItem value="50k_75k">$50K - $75K</SelectItem>
                  <SelectItem value="75k_100k">$75K - $100K</SelectItem>
                  <SelectItem value="100k_150k">$100K - $150K</SelectItem>
                  <SelectItem value="over_150k">{t('Over $150K')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-gray-500" />
              <Select
                value={clearanceLevel}
                onValueChange={(value: ClearanceLevel) => onClearanceLevelChange(value)}
              >
                <SelectTrigger className="h-8 border-0 bg-transparent shadow-none p-0 w-[150px]">
                  <SelectValue placeholder={t('Security Clearance')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t('Any Clearance')}</SelectItem>
                  <SelectItem value="confidential">{t('Confidential')}</SelectItem>
                  <SelectItem value="secret">{t('Secret')}</SelectItem>
                  <SelectItem value="top_secret">{t('Top Secret')}</SelectItem>
                  <SelectItem value="ts_sci">{t('TS/SCI')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Medal className="h-4 w-4 text-gray-500" />
              <Select
                value={militaryBranch}
                onValueChange={(value: MilitaryBranch) => onMilitaryBranchChange(value)}
              >
                <SelectTrigger className="h-8 border-0 bg-transparent shadow-none p-0 w-[150px]">
                  <SelectValue placeholder={t('Military Branch')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t('Any Branch')}</SelectItem>
                  <SelectItem value="army">{t('Army')}</SelectItem>
                  <SelectItem value="navy">{t('Navy')}</SelectItem>
                  <SelectItem value="air_force">{t('Air Force')}</SelectItem>
                  <SelectItem value="marines">{t('Marines')}</SelectItem>
                  <SelectItem value="coast_guard">{t('Coast Guard')}</SelectItem>
                  <SelectItem value="space_force">{t('Space Force')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-gray-500" />
              <Select
                value={educationLevel}
                onValueChange={(value: EducationLevel) => onEducationLevelChange(value)}
              >
                <SelectTrigger className="h-8 border-0 bg-transparent shadow-none p-0 w-[150px]">
                  <SelectValue placeholder={t('Education Level')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t('Any Education')}</SelectItem>
                  <SelectItem value="high_school">{t('High School')}</SelectItem>
                  <SelectItem value="associates">{t('Associates')}</SelectItem>
                  <SelectItem value="bachelors">{t('Bachelors')}</SelectItem>
                  <SelectItem value="masters">{t('Masters')}</SelectItem>
                  <SelectItem value="doctorate">{t('Doctorate')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Briefcase className="h-4 w-4 text-gray-500" />
              <Select
                value={yearsOfService?.toString()}
                onValueChange={(value) => onYearsOfServiceChange(parseInt(value, 10))}
              >
                <SelectTrigger className="h-8 border-0 bg-transparent shadow-none p-0 w-[150px]">
                  <SelectValue placeholder={t('Years of Service')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t('Any Experience')}</SelectItem>
                  <SelectItem value="1">{t('1+ Year')}</SelectItem>
                  <SelectItem value="2">{t('2+ Years')}</SelectItem>
                  <SelectItem value="4">{t('4+ Years')}</SelectItem>
                  <SelectItem value="8">{t('8+ Years')}</SelectItem>
                  <SelectItem value="12">{t('12+ Years')}</SelectItem>
                  <SelectItem value="16">{t('16+ Years')}</SelectItem>
                  <SelectItem value="20">{t('20+ Years')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex pt-4">
            <Button
              type="submit"
              variant="default"
              size="sm"
              className="mr-2"
            >
              <Search className="h-4 w-4 mr-1" />
              {t('Search')}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onToggleAdvancedFilters}
              className="text-sm"
            >
              {t('Advanced Filters')}
            </Button>
            
            {hasActiveFilters && (
              <div className="ml-2 flex items-center">
                <Badge variant="secondary" className="ml-auto">
                  {Object.entries({
                    keywords,
                    location,
                    remote,
                    clearanceLevel,
                    militaryBranch,
                    educationLevel,
                    salaryRange,
                    yearsOfService
                  }).filter(([_, value]) => 
                    value === true || 
                    (typeof value === 'string' && value.trim() !== '') ||
                    (typeof value === 'number' && !isNaN(value))
                  ).length + (country !== "canada" ? 1 : 0)} 
                  {t('filter')}{hasActiveFilters && 
                    Object.entries({
                      keywords,
                      location,
                      remote,
                      clearanceLevel,
                      militaryBranch,
                      educationLevel,
                      salaryRange,
                      yearsOfService
                    }).filter(([_, value]) => 
                      value === true || 
                      (typeof value === 'string' && value.trim() !== '') ||
                      (typeof value === 'number' && !isNaN(value))
                    ).length + (country !== "canada" ? 1 : 0) > 1 ? 's' : ''} {t('active')}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default FilterBar;
