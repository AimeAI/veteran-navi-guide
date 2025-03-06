
import React from 'react';
import { Filter, Search, MapPin, Globe, X } from 'lucide-react';
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
} from '@/components/ui/select';

interface FilterBarProps {
  keywords: string;
  location: string;
  remote: boolean;
  country: "us" | "canada" | undefined;
  onKeywordChange: (keywords: string) => void;
  onLocationChange: (location: string) => void;
  onRemoteToggle: (remote: boolean) => void;
  onCountryChange: (country: "us" | "canada") => void;
  onToggleAdvancedFilters: () => void;
  onClearFilters: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  keywords,
  location,
  remote,
  country = "canada",
  onKeywordChange,
  onLocationChange,
  onRemoteToggle,
  onCountryChange,
  onToggleAdvancedFilters,
  onClearFilters,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // The parent component should handle updates as values change
  };

  const hasActiveFilters = keywords || location || remote || country !== "canada";

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-medium flex items-center">
          <Filter className="h-4 w-4 mr-2 text-gray-500" />
          Search Jobs
        </h2>
        
        {hasActiveFilters && (
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            onClick={onClearFilters}
            className="h-8 px-2 text-sm text-gray-500"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
      
      <div className="space-y-3">
        <div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Job title, keywords, or company"
              className="pl-9"
              value={keywords}
              onChange={(e) => onKeywordChange(e.target.value)}
            />
          </div>
        </div>
        
        <div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="City, province, or postal code"
              className="pl-9"
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="remote"
              checked={remote}
              onCheckedChange={onRemoteToggle}
            />
            <Label htmlFor="remote" className="text-sm">Remote only</Label>
          </div>
          
          <Separator orientation="vertical" className="h-6" />
          
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4 text-gray-500" />
            <Select
              value={country}
              onValueChange={(value: "us" | "canada") => onCountryChange(value)}
            >
              <SelectTrigger className="h-8 border-0 bg-transparent shadow-none p-0 w-[110px]">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="canada">Canada</SelectItem>
                <SelectItem value="us">United States</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onToggleAdvancedFilters}
            className="text-sm"
          >
            Advanced Filters
          </Button>
          
          {hasActiveFilters && (
            <div className="ml-2 flex items-center">
              <Badge variant="secondary" className="ml-auto">
                {Object.entries({
                  keywords,
                  location,
                  remote,
                }).filter(([_, value]) => 
                  value === true || (typeof value === 'string' && value.trim() !== '')
                ).length + (country !== "canada" ? 1 : 0)} 
                filter{hasActiveFilters && 
                  Object.entries({
                    keywords,
                    location,
                    remote,
                  }).filter(([_, value]) => 
                    value === true || (typeof value === 'string' && value.trim() !== '')
                  ).length + (country !== "canada" ? 1 : 0) > 1 ? 's' : ''} active
              </Badge>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default FilterBar;
