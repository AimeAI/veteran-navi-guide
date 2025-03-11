
import React, { useState } from 'react';
import { Search, MapPin, Filter, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import AdvancedFilters from './AdvancedFilters';
import { CardContent } from '@/components/ui/card';
import type { JobSearchParams } from '@/types/jobSearch';

interface JobSearchFormProps {
  onSearch: (params: JobSearchParams) => void;
  initialFilters: {
    keywords: string;
    location: string;
    radius: number;
  };
}

const JobSearchForm: React.FC<JobSearchFormProps> = ({ onSearch, initialFilters }) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(initialFilters);

  const toggleFilter = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleRadiusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const radius = parseInt(e.target.value, 10);
    setLocalFilters(prev => ({ ...prev, radius }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      ...localFilters,
      page: 1,
    });
  };

  return (
    <CardContent>
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="keywords"
              value={localFilters.keywords}
              onChange={handleInputChange}
              placeholder="Job title, keywords, or company"
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="location"
              value={localFilters.location}
              onChange={handleInputChange}
              placeholder="City, province, or postal code"
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>
          
          <div className="relative">
            <select
              name="radius"
              value={localFilters.radius}
              onChange={handleRadiusChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            >
              <option value="5">Within 5 km</option>
              <option value="10">Within 10 km</option>
              <option value="25">Within 25 km</option>
              <option value="50">Within 50 km</option>
              <option value="100">Within 100 km</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={toggleFilter}
            className="inline-flex items-center text-sm text-gray-600 hover:text-primary"
          >
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
            <ChevronDown className={cn(
              "ml-1 h-4 w-4 transition-transform duration-200",
              isFiltersOpen ? "rotate-180" : ""
            )} />
          </button>
        </div>
        
        <AdvancedFilters isOpen={isFiltersOpen} />
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <Search className="h-5 w-5 mr-2" />
            Search Jobs
          </button>
        </div>
      </form>
    </CardContent>
  );
};

export default JobSearchForm;
