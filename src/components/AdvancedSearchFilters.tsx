
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Briefcase, Building, GraduationCap, DollarSign, Star, Users, Shield, Award, Wifi, Target, Filter, X } from 'lucide-react';

interface AdvancedSearchFiltersProps {
  filters: any;
  onChange: (name: string, value: any) => void;
  onArrayChange: (name: string, value: string, checked: boolean) => void;
}

const AdvancedSearchFilters: React.FC<AdvancedSearchFiltersProps> = ({
  filters,
  onChange,
  onArrayChange,
}) => {
  const [locationRadius, setLocationRadius] = useState<number>(filters.radius || 25);

  const jobTypes = [
    { id: 'fullTime', name: 'Full-time' },
    { id: 'partTime', name: 'Part-time' },
    { id: 'contract', name: 'Contract' },
    { id: 'temporary', name: 'Temporary' },
    { id: 'internship', name: 'Internship' },
  ];

  const industries = [
    { id: 'technology', name: 'Technology' },
    { id: 'healthcare', name: 'Healthcare' },
    { id: 'construction', name: 'Construction' },
    { id: 'education', name: 'Education' },
    { id: 'finance', name: 'Finance' },
    { id: 'manufacturing', name: 'Manufacturing' },
    { id: 'retail', name: 'Retail' },
    { id: 'transportation', name: 'Transportation' },
    { id: 'government', name: 'Government' },
    { id: 'military', name: 'Military' },
  ];

  const experienceLevels = [
    { id: 'entry', name: 'Entry-level' },
    { id: 'midLevel', name: 'Mid-level' },
    { id: 'senior', name: 'Senior' },
    { id: 'executive', name: 'Executive' },
  ];

  const educationLevels = [
    { id: 'highSchool', name: 'High School' },
    { id: 'associate', name: 'Associate Degree' },
    { id: 'bachelor', name: 'Bachelor\'s Degree' },
    { id: 'master', name: 'Master\'s Degree' },
    { id: 'doctorate', name: 'Doctorate' },
  ];

  const companySizes = [
    { id: 'small', name: 'Small (1-50 employees)' },
    { id: 'medium', name: 'Medium (51-200 employees)' },
    { id: 'large', name: 'Large (201-1000 employees)' },
    { id: 'enterprise', name: 'Enterprise (1000+ employees)' },
  ];

  const benefits = [
    { id: 'healthcare', name: 'Healthcare' },
    { id: 'retirement', name: 'Retirement Plan' },
    { id: 'paidTimeOff', name: 'Paid Time Off' },
    { id: 'tuition', name: 'Tuition Assistance' },
    { id: 'relocation', name: 'Relocation Assistance' },
    { id: 'veteranPrograms', name: 'Veteran Programs' },
  ];

  const handleRadiusChange = (value: number[]) => {
    setLocationRadius(value[0]);
    onChange('radius', value[0]);
  };

  const handleSelectChange = (name: string, value: string) => {
    onChange(name, value);
  };

  return (
    <div className="space-y-6">
      {/* Location with Radius */}
      <div className="space-y-3">
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-2 text-primary" />
          <Label className="text-sm font-medium">Location & Radius</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Input
            placeholder="City, State, or Zip Code"
            value={filters.location}
            onChange={(e) => onChange('location', e.target.value)}
            className="flex-1"
          />
          <span className="text-sm text-gray-500">within</span>
          <div className="w-32">
            <Slider 
              defaultValue={[locationRadius]} 
              max={100} 
              step={5}
              onValueChange={handleRadiusChange}
            />
          </div>
          <span className="text-sm text-gray-500">{locationRadius} km</span>
        </div>
      </div>

      {/* Industry */}
      <div className="space-y-3">
        <div className="flex items-center">
          <Building className="h-4 w-4 mr-2 text-primary" />
          <Label className="text-sm font-medium">Industry</Label>
        </div>
        
        <Select onValueChange={(value) => handleSelectChange('industry', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select an industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Industries</SelectLabel>
              {industries.map((industry) => (
                <SelectItem key={industry.id} value={industry.id}>
                  {industry.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Job Type */}
      <div className="space-y-3">
        <div className="flex items-center">
          <Briefcase className="h-4 w-4 mr-2 text-primary" />
          <Label className="text-sm font-medium">Job Type</Label>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {jobTypes.map((type) => (
            <div key={type.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`jobType-${type.id}`}
                checked={filters.jobType === type.id}
                onCheckedChange={(checked) => onChange('jobType', checked ? type.id : '')}
              />
              <Label htmlFor={`jobType-${type.id}`} className="text-sm">
                {type.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Experience Level */}
      <div className="space-y-3">
        <div className="flex items-center">
          <Award className="h-4 w-4 mr-2 text-primary" />
          <Label className="text-sm font-medium">Experience Level</Label>
        </div>
        
        <Select onValueChange={(value) => handleSelectChange('experienceLevel', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select experience level" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Experience Levels</SelectLabel>
              {experienceLevels.map((level) => (
                <SelectItem key={level.id} value={level.id}>
                  {level.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Education Level */}
      <div className="space-y-3">
        <div className="flex items-center">
          <GraduationCap className="h-4 w-4 mr-2 text-primary" />
          <Label className="text-sm font-medium">Education Level</Label>
        </div>
        
        <Select onValueChange={(value) => handleSelectChange('educationLevel', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select education level" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Education Levels</SelectLabel>
              {educationLevels.map((level) => (
                <SelectItem key={level.id} value={level.id}>
                  {level.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Company Size */}
      <div className="space-y-3">
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-2 text-primary" />
          <Label className="text-sm font-medium">Company Size</Label>
        </div>
        
        <Select onValueChange={(value) => handleSelectChange('companySize', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select company size" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Company Sizes</SelectLabel>
              {companySizes.map((size) => (
                <SelectItem key={size.id} value={size.id}>
                  {size.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Company Rating */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Star className="h-4 w-4 mr-2 text-primary" />
            <Label className="text-sm font-medium">Minimum Company Rating</Label>
          </div>
          <span className="text-sm text-gray-500">
            {filters.companyRating || 0} ★ & Up
          </span>
        </div>
        
        <Slider 
          defaultValue={[filters.companyRating || 0]} 
          max={5} 
          step={1}
          onValueChange={(value) => onChange('companyRating', value[0])}
        />
      </div>

      {/* Benefits */}
      <div className="space-y-3">
        <div className="flex items-center">
          <DollarSign className="h-4 w-4 mr-2 text-primary" />
          <Label className="text-sm font-medium">Benefits</Label>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {benefits.map((benefit) => (
            <div key={benefit.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`benefit-${benefit.id}`}
                checked={filters.benefits?.includes(benefit.id)}
                onCheckedChange={(checked) => 
                  onArrayChange('benefits', benefit.id, checked === true)
                }
              />
              <Label htmlFor={`benefit-${benefit.id}`} className="text-sm">
                {benefit.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Remote Work Options */}
      <div className="space-y-2">
        <div className="flex items-center">
          <Wifi className="h-4 w-4 mr-2 text-primary" />
          <Label className="text-sm font-medium">Remote Work Options</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="remote"
            checked={filters.remote}
            onCheckedChange={(checked) => onChange('remote', checked === true)}
          />
          <Label htmlFor="remote" className="text-sm">
            Remote / Work from home
          </Label>
        </div>
      </div>

      {/* Selected Filters Summary */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center mb-2">
          <Filter className="h-4 w-4 mr-2 text-primary" />
          <Label className="text-sm font-medium">Active Filters</Label>
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.location && (
            <Badge variant="outline" className="flex items-center gap-1">
              Location: {filters.location}
              <button
                onClick={() => onChange('location', '')}
                className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.radius > 0 && (
            <Badge variant="outline" className="flex items-center gap-1">
              Within {filters.radius} km
              <button
                onClick={() => onChange('radius', 0)}
                className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.industry && (
            <Badge variant="outline" className="flex items-center gap-1">
              Industry: {industries.find(i => i.id === filters.industry)?.name}
              <button
                onClick={() => onChange('industry', '')}
                className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.jobType && (
            <Badge variant="outline" className="flex items-center gap-1">
              Job Type: {jobTypes.find(t => t.id === filters.jobType)?.name}
              <button
                onClick={() => onChange('jobType', '')}
                className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.experienceLevel && (
            <Badge variant="outline" className="flex items-center gap-1">
              Experience: {experienceLevels.find(e => e.id === filters.experienceLevel)?.name}
              <button
                onClick={() => onChange('experienceLevel', '')}
                className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.educationLevel && (
            <Badge variant="outline" className="flex items-center gap-1">
              Education: {educationLevels.find(e => e.id === filters.educationLevel)?.name}
              <button
                onClick={() => onChange('educationLevel', '')}
                className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.remote && (
            <Badge variant="outline" className="flex items-center gap-1">
              Remote Only
              <button
                onClick={() => onChange('remote', false)}
                className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.companyRating > 0 && (
            <Badge variant="outline" className="flex items-center gap-1">
              {filters.companyRating}+ Stars
              <button
                onClick={() => onChange('companyRating', 0)}
                className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearchFilters;
