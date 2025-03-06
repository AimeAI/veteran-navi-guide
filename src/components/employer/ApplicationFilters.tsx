
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ApplicationStatus } from '@/types/application';

interface ApplicationFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: ApplicationStatus | 'all';
  setStatusFilter: (status: ApplicationStatus | 'all') => void;
  jobTitleFilter: string;
  setJobTitleFilter: (title: string) => void;
  resetFilters: () => void;
}

export function ApplicationFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  jobTitleFilter,
  setJobTitleFilter,
  resetFilters
}: ApplicationFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="search"
            placeholder="Search applicants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:w-2/3">
          <div className="w-full sm:w-1/2">
            <Label htmlFor="status" className="sr-only">Status</Label>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as ApplicationStatus | 'all')}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewing">Reviewing</SelectItem>
                <SelectItem value="interviewing">Interviewing</SelectItem>
                <SelectItem value="offered">Offered</SelectItem>
                <SelectItem value="hired">Hired</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-1/2">
            <Label htmlFor="job-title" className="sr-only">Job Title</Label>
            <Input
              id="job-title"
              placeholder="Filter by job title..."
              value={jobTitleFilter}
              onChange={(e) => setJobTitleFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="ghost" onClick={resetFilters} className="text-sm">
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
