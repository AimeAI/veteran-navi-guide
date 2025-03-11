
import React, { useState } from 'react';
import { Filter, ChevronDown, Check, X } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { JobFilterState } from '@/types/job';

interface SearchFiltersProps {
  filters: JobFilterState;
  onChange: (name: string, value: any) => void;
  onClearFilters: () => void;
  showAdvancedFilters: boolean;
  setShowAdvancedFilters: (show: boolean) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onChange,
  onClearFilters,
  showAdvancedFilters,
  setShowAdvancedFilters,
}) => {
  const { t } = useTranslation();
  const [activeSkills, setActiveSkills] = useState<string[]>(filters.skills || []);
  
  const commonSkills = [
    'Javascript', 'Python', 'Java', 'SQL', 'React', 'AWS', 
    'Project Management', 'Leadership', 'Communication', 'Problem Solving',
    'Microsoft Office', 'Customer Service', 'Data Analysis', 'Sales',
    'Security Clearance', 'Logistics', 'Healthcare', 'Finance'
  ];
  
  const handleRemoveSkill = (skill: string) => {
    const updatedSkills = activeSkills.filter(s => s !== skill);
    setActiveSkills(updatedSkills);
    onChange('skills', updatedSkills);
  };
  
  const handleAddSkill = (skill: string) => {
    if (!activeSkills.includes(skill)) {
      const updatedSkills = [...activeSkills, skill];
      setActiveSkills(updatedSkills);
      onChange('skills', updatedSkills);
    }
  };
  
  const handleCustomSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      const skill = e.currentTarget.value.trim();
      handleAddSkill(skill);
      e.currentTarget.value = '';
      e.preventDefault();
    }
  };
  
  const getSalaryRangeLabel = (range: string) => {
    switch (range) {
      case 'range1': return 'Under $30k';
      case 'range2': return '$30k - $50k';
      case 'range3': return '$50k - $75k';
      case 'range4': return '$75k - $100k';
      case 'range5': return '$100k+';
      default: return 'Any';
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="inline-flex items-center text-sm text-gray-600 hover:text-primary"
        >
          <Filter className="h-4 w-4 mr-2" />
          {t('Advanced Filters')}
          <ChevronDown className={cn(
            "ml-1 h-4 w-4 transition-transform duration-200",
            showAdvancedFilters ? "rotate-180" : ""
          )} />
        </button>
        
        {/* Clear filters button */}
        {(filters.industry || filters.experienceLevel || filters.educationLevel || filters.jobType || filters.salaryRange || (activeSkills.length > 0)) && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearFilters}
            className="text-xs h-8"
          >
            <X className="h-3 w-3 mr-1" />
            {t('Clear All Filters')}
          </Button>
        )}
      </div>
      
      {/* Advanced filters accordion */}
      {showAdvancedFilters && (
        <Accordion type="single" collapsible className="w-full" defaultValue="filters">
          <AccordionItem value="filters" className="border-none">
            <AccordionContent className="pt-4 pb-2">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 md:grid-cols-2">
                {/* Job Type Filter */}
                <div className="space-y-2">
                  <Label htmlFor="jobType">{t('Job Type')}</Label>
                  <Select 
                    value={filters.jobType || ''} 
                    onValueChange={(value) => onChange('jobType', value)}
                  >
                    <SelectTrigger id="jobType">
                      <SelectValue placeholder={t('Any Job Type')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">{t('Any')}</SelectItem>
                      <SelectItem value="fulltime">{t('Full-time')}</SelectItem>
                      <SelectItem value="parttime">{t('Part-time')}</SelectItem>
                      <SelectItem value="contract">{t('Contract')}</SelectItem>
                      <SelectItem value="temporary">{t('Temporary')}</SelectItem>
                      <SelectItem value="internship">{t('Internship')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Industry Filter */}
                <div className="space-y-2">
                  <Label htmlFor="industry">{t('Industry')}</Label>
                  <Select 
                    value={filters.industry || ''} 
                    onValueChange={(value) => onChange('industry', value)}
                  >
                    <SelectTrigger id="industry">
                      <SelectValue placeholder={t('Any Industry')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">{t('Any')}</SelectItem>
                      <SelectItem value="technology">{t('Technology')}</SelectItem>
                      <SelectItem value="healthcare">{t('Healthcare')}</SelectItem>
                      <SelectItem value="finance">{t('Finance')}</SelectItem>
                      <SelectItem value="manufacturing">{t('Manufacturing')}</SelectItem>
                      <SelectItem value="retail">{t('Retail')}</SelectItem>
                      <SelectItem value="education">{t('Education')}</SelectItem>
                      <SelectItem value="government">{t('Government')}</SelectItem>
                      <SelectItem value="military">{t('Military')}</SelectItem>
                      <SelectItem value="logistics">{t('Logistics')}</SelectItem>
                      <SelectItem value="hospitality">{t('Hospitality')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Experience Level Filter */}
                <div className="space-y-2">
                  <Label htmlFor="experienceLevel">{t('Experience Level')}</Label>
                  <Select 
                    value={filters.experienceLevel || ''} 
                    onValueChange={(value) => onChange('experienceLevel', value)}
                  >
                    <SelectTrigger id="experienceLevel">
                      <SelectValue placeholder={t('Any Experience')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">{t('Any')}</SelectItem>
                      <SelectItem value="entry-level">{t('Entry Level')}</SelectItem>
                      <SelectItem value="mid-level">{t('Mid Level')}</SelectItem>
                      <SelectItem value="senior-level">{t('Senior Level')}</SelectItem>
                      <SelectItem value="executive">{t('Executive')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Education Level Filter */}
                <div className="space-y-2">
                  <Label htmlFor="educationLevel">{t('Education')}</Label>
                  <Select 
                    value={filters.educationLevel || ''} 
                    onValueChange={(value) => onChange('educationLevel', value)}
                  >
                    <SelectTrigger id="educationLevel">
                      <SelectValue placeholder={t('Any Education')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">{t('Any')}</SelectItem>
                      <SelectItem value="High School">{t('High School')}</SelectItem>
                      <SelectItem value="Associate Degree">{t('Associate Degree')}</SelectItem>
                      <SelectItem value="Bachelor's Degree">{t('Bachelor\'s Degree')}</SelectItem>
                      <SelectItem value="Master's Degree">{t('Master\'s Degree')}</SelectItem>
                      <SelectItem value="Doctorate">{t('Doctorate')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Salary Range Filter */}
                <div className="space-y-2">
                  <Label htmlFor="salaryRange">{t('Salary Range')}</Label>
                  <Select 
                    value={filters.salaryRange || ''} 
                    onValueChange={(value) => onChange('salaryRange', value)}
                  >
                    <SelectTrigger id="salaryRange">
                      <SelectValue placeholder={t('Any Salary')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">{t('Any')}</SelectItem>
                      <SelectItem value="range1">{getSalaryRangeLabel('range1')}</SelectItem>
                      <SelectItem value="range2">{getSalaryRangeLabel('range2')}</SelectItem>
                      <SelectItem value="range3">{getSalaryRangeLabel('range3')}</SelectItem>
                      <SelectItem value="range4">{getSalaryRangeLabel('range4')}</SelectItem>
                      <SelectItem value="range5">{getSalaryRangeLabel('range5')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Remote Option */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="remote">{t('Remote Only')}</Label>
                    <Switch 
                      id="remote" 
                      checked={filters.remote || false}
                      onCheckedChange={(checked) => onChange('remote', checked)}
                    />
                  </div>
                  <p className="text-xs text-gray-500">{t('Show only remote jobs')}</p>
                </div>
              </div>
              
              {/* Skills filter section */}
              <div className="mt-4 border-t pt-4">
                <Label>{t('Skills')}</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {activeSkills.map(skill => (
                    <Badge 
                      key={skill} 
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {skill}
                      <X 
                        className="h-3 w-3 ml-1 cursor-pointer" 
                        onClick={() => handleRemoveSkill(skill)}
                      />
                    </Badge>
                  ))}
                  {activeSkills.length === 0 && (
                    <p className="text-sm text-gray-500">{t('No skills selected')}</p>
                  )}
                </div>
                
                <div className="mt-2">
                  <Input 
                    placeholder={t('Add a custom skill (press Enter)')}
                    className="mb-2"
                    onKeyDown={handleCustomSkill}
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {commonSkills.map(skill => (
                      <Badge 
                        key={skill}
                        variant={activeSkills.includes(skill) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => activeSkills.includes(skill) 
                          ? handleRemoveSkill(skill) 
                          : handleAddSkill(skill)
                        }
                      >
                        {skill}
                        {activeSkills.includes(skill) && <Check className="h-3 w-3 ml-1" />}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
};

export default SearchFilters;
