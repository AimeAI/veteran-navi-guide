
import React, { useState } from 'react';
import { Search, MapPin, Briefcase, Filter, ChevronDown, Banknote, Medal, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';

interface FilterState {
  keywords: string;
  location: string;
  category: string;
  salaryRange: string;
  mosCodes: string[];
  clearanceLevel: string[];
  remote: boolean;
}

const JobSearch = () => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    keywords: '',
    location: '',
    category: '',
    salaryRange: '',
    mosCodes: [],
    clearanceLevel: [],
    remote: false
  });

  const jobCategories = [
    { id: 'tech', name: 'Technology' },
    { id: 'healthcare', name: 'Healthcare' },
    { id: 'logistics', name: 'Logistics & Supply Chain' },
    { id: 'admin', name: 'Administrative' },
    { id: 'engineering', name: 'Engineering' },
    { id: 'security', name: 'Security' },
    { id: 'management', name: 'Management' },
    { id: 'other', name: 'Other' }
  ];

  const salaryRanges = [
    { id: 'any', range: 'Any' },
    { id: 'range1', range: '$30,000 - $50,000' },
    { id: 'range2', range: '$50,000 - $75,000' },
    { id: 'range3', range: '$75,000 - $100,000' },
    { id: 'range4', range: '$100,000 - $125,000' },
    { id: 'range5', range: '$125,000+' }
  ];

  const mosCodes = [
    { id: '11B', code: '11B - Infantryman' },
    { id: '25B', code: '25B - Information Technology Specialist' },
    { id: '68W', code: '68W - Combat Medic Specialist' },
    { id: '42A', code: '42A - Human Resources Specialist' },
    { id: '31B', code: '31B - Military Police' },
    { id: '88M', code: '88M - Motor Transport Operator' }
  ];

  const clearanceLevels = [
    { id: 'none', level: 'None' },
    { id: 'confidential', level: 'Confidential' },
    { id: 'secret', level: 'Secret' },
    { id: 'topsecret', level: 'Top Secret' },
    { id: 'sci', level: 'TS/SCI' }
  ];

  const toggleFilter = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, filterType: 'mosCodes' | 'clearanceLevel') => {
    const { value, checked } = e.target;
    
    setFilters(prev => {
      if (checked) {
        return {
          ...prev,
          [filterType]: [...prev[filterType], value]
        };
      } else {
        return {
          ...prev,
          [filterType]: prev[filterType].filter(item => item !== value)
        };
      }
    });
  };

  const handleToggleRemote = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({
      ...prev,
      remote: e.target.checked
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search filters:', filters);
    // In a real application, we would send these filters to an API
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-primary/5 rounded-lg px-6 py-8 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Find Your Next Career</h1>
            
            {/* Main search form */}
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="keywords"
                    value={filters.keywords}
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
                    value={filters.location}
                    onChange={handleInputChange}
                    placeholder="City, state, or zip code"
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleInputChange}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  >
                    <option value="">All Job Categories</option>
                    {jobCategories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Advanced filters toggle */}
              <div className="flex items-center pt-2">
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
              
              {/* Advanced filters panel */}
              {isFiltersOpen && (
                <div className="bg-white p-6 rounded-md shadow-sm border border-gray-100 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Salary Range */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                        <Banknote className="h-4 w-4 mr-2 text-primary" />
                        Salary Range
                      </label>
                      <select
                        name="salaryRange"
                        value={filters.salaryRange}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      >
                        {salaryRanges.map(salary => (
                          <option key={salary.id} value={salary.id}>
                            {salary.range}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* MOS Codes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                        <Medal className="h-4 w-4 mr-2 text-primary" />
                        Military Occupation Specialty (MOS)
                      </label>
                      <div className="max-h-40 overflow-y-auto space-y-2 border border-gray-200 rounded-md p-3">
                        {mosCodes.map(mos => (
                          <div key={mos.id} className="flex items-center">
                            <input
                              id={`mos-${mos.id}`}
                              name={`mos-${mos.id}`}
                              type="checkbox"
                              value={mos.id}
                              checked={filters.mosCodes.includes(mos.id)}
                              onChange={(e) => handleCheckboxChange(e, 'mosCodes')}
                              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                            />
                            <label htmlFor={`mos-${mos.id}`} className="ml-2 block text-sm text-gray-700">
                              {mos.code}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Clearance Level */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                        <Shield className="h-4 w-4 mr-2 text-primary" />
                        Security Clearance
                      </label>
                      <div className="space-y-2 border border-gray-200 rounded-md p-3">
                        {clearanceLevels.map(clearance => (
                          <div key={clearance.id} className="flex items-center">
                            <input
                              id={`clearance-${clearance.id}`}
                              name={`clearance-${clearance.id}`}
                              type="checkbox"
                              value={clearance.id}
                              checked={filters.clearanceLevel.includes(clearance.id)}
                              onChange={(e) => handleCheckboxChange(e, 'clearanceLevel')}
                              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                            />
                            <label htmlFor={`clearance-${clearance.id}`} className="ml-2 block text-sm text-gray-700">
                              {clearance.level}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Remote option */}
                  <div className="mt-4">
                    <div className="flex items-center">
                      <input
                        id="remote"
                        name="remote"
                        type="checkbox"
                        checked={filters.remote}
                        onChange={handleToggleRemote}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label htmlFor="remote" className="ml-2 block text-sm text-gray-700">
                        Remote / Work from home
                      </label>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Search button */}
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
          </div>
          
          {/* Results placeholder */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Search Results</h2>
              <span className="text-sm text-gray-500">0 jobs found</span>
            </div>
            
            <div className="text-center py-12">
              <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No jobs found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search criteria or adding more filters.
              </p>
            </div>
          </div>
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

export default JobSearch;
