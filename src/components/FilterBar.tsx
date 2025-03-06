
import React from 'react';
import { Filter, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ApplicationStatus } from '@/types/application';

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: ApplicationStatus | 'all';
  setStatusFilter: (status: ApplicationStatus | 'all') => void;
  jobTitleFilter: string;
  setJobTitleFilter: (title: string) => void;
  resetFilters: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  jobTitleFilter,
  setJobTitleFilter,
  resetFilters,
}) => {
  const hasActiveFilters = searchQuery || statusFilter !== 'all' || jobTitleFilter;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-medium flex items-center">
          <Filter className="h-5 w-5 mr-2 text-gray-500" />
          Filter Applications
        </h2>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="text-gray-500">
            <X className="h-4 w-4 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="searchQuery">Applicant Name</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              id="searchQuery"
              placeholder="Search by name..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search by applicant name"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="jobTitleFilter">Job Title</Label>
          <Input
            id="jobTitleFilter"
            placeholder="Filter by job title..."
            value={jobTitleFilter}
            onChange={(e) => setJobTitleFilter(e.target.value)}
            aria-label="Filter by job title"
          />
        </div>
        
        <div>
          <Label htmlFor="statusFilter">Application Status</Label>
          <Select 
            value={statusFilter} 
            onValueChange={(value) => setStatusFilter(value as ApplicationStatus | 'all')}
            aria-label="Filter by application status"
          >
            <SelectTrigger id="statusFilter">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="reviewing">Reviewing</SelectItem>
              <SelectItem value="interviewing">Interviewing</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
