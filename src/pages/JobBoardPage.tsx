
import React, { useState } from 'react';
import { Search, MapPin, Filter, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import JobList from '@/components/JobList';
import { useJobSearch, JobSearchParams } from '@/hooks/useJobSearch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const JobBoardPage: React.FC = () => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchParams, setSearchParams] = useState<JobSearchParams>({
    keywords: '',
    location: '',
    radius: 25,
    page: 1,
  });

  const [localFilters, setLocalFilters] = useState({
    keywords: '',
    location: '',
    radius: 25,
  });

  const { 
    jobs, 
    isLoading, 
    error, 
    currentPage, 
    totalPages, 
    totalJobs, 
    setPage 
  } = useJobSearch(searchParams);

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
    setSearchParams({
      ...searchParams,
      ...localFilters,
      page: 1, // Reset to first page on new search
    });
    toast.success("Search results updated");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Job Board</CardTitle>
              <CardDescription>
                Browse job listings from Job Bank Canada
              </CardDescription>
            </CardHeader>
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
                      placeholder="City, state, or zip code"
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
                      <option value="5">Within 5 miles</option>
                      <option value="10">Within 10 miles</option>
                      <option value="25">Within 25 miles</option>
                      <option value="50">Within 50 miles</option>
                      <option value="100">Within 100 miles</option>
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
                
                {isFiltersOpen && (
                  <div className="bg-white p-6 rounded-md shadow-sm border border-gray-100 animate-fade-in">
                    {/* Add advanced filters here */}
                    <p className="text-sm text-gray-500">Advanced filters coming soon</p>
                  </div>
                )}
                
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
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <JobList
                jobs={jobs}
                isLoading={isLoading}
                error={error}
                currentPage={currentPage}
                totalPages={totalPages}
                totalJobs={totalJobs}
                onPageChange={setPage}
                country="canada"
              />
            </CardContent>
          </Card>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2023 VeteranJobBoard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default JobBoardPage;
