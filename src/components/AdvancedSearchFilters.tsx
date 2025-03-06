import React from 'react';
import { Briefcase, Building, GraduationCap, Star, Heart, MapPin, Database, Medal } from 'lucide-react';
import { JobFilterState } from '@/context/JobContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

interface AdvancedSearchFiltersProps {
  filters: JobFilterState;
  onFilterChange: (name: string, value: any) => void;
}

const AdvancedSearchFilters: React.FC<AdvancedSearchFiltersProps> = ({
  filters,
  onFilterChange
}) => {
  // Job types
  const jobTypes = [
    { id: 'fulltime', name: 'Full Time' },
    { id: 'parttime', name: 'Part Time' },
    { id: 'contract', name: 'Contract' },
    { id: 'temporary', name: 'Temporary' },
    { id: 'internship', name: 'Internship' }
  ];
  
  // Experience levels
  const experienceLevels = [
    { id: 'entry', name: 'Entry Level' },
    { id: 'mid', name: 'Mid Level' },
    { id: 'senior', name: 'Senior Level' },
    { id: 'executive', name: 'Executive' }
  ];
  
  // Education levels
  const educationLevels = [
    { id: 'highschool', name: 'High School' },
    { id: 'associate', name: 'Associate Degree' },
    { id: 'bachelor', name: 'Bachelor\'s Degree' },
    { id: 'master', name: 'Master\'s Degree' },
    { id: 'doctorate', name: 'Doctorate' }
  ];
  
  // Company sizes
  const companySizes = [
    { id: 'small', name: '1-50 employees' },
    { id: 'medium', name: '51-200 employees' },
    { id: 'large', name: '201-1000 employees' },
    { id: 'enterprise', name: '1000+ employees' }
  ];
  
  // Benefits
  const benefitOptions = [
    { id: 'health', name: 'Health Insurance' },
    { id: 'dental', name: 'Dental Insurance' },
    { id: 'vision', name: 'Vision Insurance' },
    { id: '401k', name: '401(k)' },
    { id: 'paidTimeOff', name: 'Paid Time Off' },
    { id: 'remote', name: 'Remote Work' },
    { id: 'flexible', name: 'Flexible Hours' },
    { id: 'education', name: 'Education Assistance' }
  ];
  
  // Data sources
  const dataSources = [
    { id: 'useJobicy', name: 'Include Jobicy Jobs' },
  ];
  
  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    onFilterChange('radius', value[0] || 0);
  };
  
  // Handle job type change
  const handleJobTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange('jobType', e.target.value);
  };
  
  // Handle experience level change
  const handleExperienceLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange('experienceLevel', e.target.value);
  };
  
  // Handle education level change
  const handleEducationLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange('educationLevel', e.target.value);
  };
  
  // Handle company size change
  const handleCompanySizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange('companySize', e.target.value);
  };
  
  // Handle checkbox change
  const handleCheckboxChange = (checked: boolean, id: string, filterType: string) => {
    let newValues;
    const currentValues = filters[filterType as keyof JobFilterState] as string[] || [];
    
    if (checked) {
      newValues = [...currentValues, id];
    } else {
      newValues = currentValues.filter(value => value !== id);
    }
    
    onFilterChange(filterType, newValues);
  };
  
  // Handle data source change
  const handleDataSourceChange = (checked: boolean, id: string) => {
    onFilterChange(id, checked);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
          <MapPin className="h-4 w-4 mr-2 text-primary" />
          Search Radius (km)
        </label>
        <div className="px-2">
          <Slider
            defaultValue={[filters.radius || 0]}
            max={100}
            step={5}
            onValueChange={handleSliderChange}
            className="mb-2"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>0 km</span>
            <span>50 km</span>
            <span>100 km</span>
          </div>
          {filters.radius > 0 && (
            <Badge variant="outline" className="mt-2">
              Within {filters.radius} km
            </Badge>
          )}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
          <Briefcase className="h-4 w-4 mr-2 text-primary" />
          Job Type
        </label>
        <select
          name="jobType"
          value={filters.jobType}
          onChange={handleJobTypeChange}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        >
          <option value="">Any Job Type</option>
          {jobTypes.map(type => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
          <Medal className="h-4 w-4 mr-2 text-primary" />
          Experience Level
        </label>
        <select
          name="experienceLevel"
          value={filters.experienceLevel}
          onChange={handleExperienceLevelChange}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        >
          <option value="">Any Experience Level</option>
          {experienceLevels.map(level => (
            <option key={level.id} value={level.id}>
              {level.name}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
          <GraduationCap className="h-4 w-4 mr-2 text-primary" />
          Education Level
        </label>
        <select
          name="educationLevel"
          value={filters.educationLevel}
          onChange={handleEducationLevelChange}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        >
          <option value="">Any Education Level</option>
          {educationLevels.map(level => (
            <option key={level.id} value={level.id}>
              {level.name}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
          <Building className="h-4 w-4 mr-2 text-primary" />
          Company Size
        </label>
        <select
          name="companySize"
          value={filters.companySize}
          onChange={handleCompanySizeChange}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        >
          <option value="">Any Company Size</option>
          {companySizes.map(size => (
            <option key={size.id} value={size.id}>
              {size.name}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
          <Star className="h-4 w-4 mr-2 text-primary" />
          Company Rating
        </label>
        <div className="px-2">
          <Slider
            defaultValue={[filters.companyRating || 0]}
            max={5}
            step={1}
            onValueChange={(value) => onFilterChange('companyRating', value[0] || 0)}
            className="mb-2"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Any</span>
            <span>⭐</span>
            <span>⭐⭐</span>
            <span>⭐⭐⭐</span>
            <span>⭐⭐⭐⭐</span>
            <span>⭐⭐⭐⭐⭐</span>
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
          <Heart className="h-4 w-4 mr-2 text-primary" />
          Benefits
        </label>
        <div className="grid grid-cols-2 gap-2 border border-gray-200 rounded-md p-3">
          {benefitOptions.map(benefit => (
            <div key={benefit.id} className="flex items-center">
              <Checkbox
                id={`benefit-${benefit.id}`}
                checked={(filters.benefits || []).includes(benefit.id)}
                onCheckedChange={(checked) => 
                  handleCheckboxChange(checked as boolean, benefit.id, 'benefits')
                }
                className="h-4 w-4"
              />
              <Label
                htmlFor={`benefit-${benefit.id}`}
                className="ml-2 text-sm text-gray-700"
              >
                {benefit.name}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
          <Database className="h-4 w-4 mr-2 text-primary" />
          Data Sources
        </label>
        <div className="border border-gray-200 rounded-md p-3">
          {dataSources.map(source => (
            <div key={source.id} className="flex items-center">
              <Checkbox
                id={`source-${source.id}`}
                checked={filters[source.id as keyof JobFilterState] as boolean || false}
                onCheckedChange={(checked) => 
                  handleDataSourceChange(checked as boolean, source.id)
                }
                className="h-4 w-4"
              />
              <Label
                htmlFor={`source-${source.id}`}
                className="ml-2 text-sm text-gray-700"
              >
                {source.name}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearchFilters;
