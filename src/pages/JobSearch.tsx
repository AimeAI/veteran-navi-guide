import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, Filter, ChevronDown, Banknote, Medal, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import JobListing from '@/components/JobListing';
import { toast } from 'sonner';

interface FilterState {
  keywords: string;
  location: string;
  category: string;
  salaryRange: string;
  mosCodes: string[];
  clearanceLevel: string[];
  remote: boolean;
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  category: string;
  salaryRange: string;
  remote: boolean;
  clearanceLevel: string;
  mosCode: string;
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
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const mockJobs: Job[] = [
    {
      id: '1',
      title: 'Security Operations Manager',
      company: 'TechDefense Solutions',
      location: 'Ottawa, ON',
      description: 'Seeking a veteran with security background to lead our operations team. Must have experience in risk assessment and team leadership. Secret clearance preferred.',
      category: 'security',
      salaryRange: 'range3',
      remote: false,
      clearanceLevel: 'secret',
      mosCode: '31B'
    },
    {
      id: '2',
      title: 'Logistics Coordinator',
      company: 'Canadian Supply Chain Inc.',
      location: 'Halifax, NS',
      description: 'Perfect for veterans with logistics MOSID. Coordinate shipments, manage inventory, and optimize supply chain processes. Competitive salary with benefits package.',
      category: 'logistics',
      salaryRange: 'range2',
      remote: false,
      clearanceLevel: 'none',
      mosCode: '88M'
    },
    {
      id: '3',
      title: 'Software Developer',
      company: 'Tech Innovations',
      location: 'Toronto, ON',
      description: 'Looking for developers with experience in React, Node.js, and cloud technologies. Join our growing team building enterprise applications.',
      category: 'tech',
      salaryRange: 'range4',
      remote: true,
      clearanceLevel: 'none',
      mosCode: '25B'
    },
    {
      id: '4',
      title: 'Healthcare Administrator',
      company: 'Veterans Medical Centre',
      location: 'Vancouver, BC',
      description: 'Join our team dedicated to improving healthcare for veterans. Looking for organized professionals with healthcare experience from military settings.',
      category: 'healthcare',
      salaryRange: 'range2',
      remote: false,
      clearanceLevel: 'confidential',
      mosCode: '68W'
    },
    {
      id: '5',
      title: 'Project Manager',
      company: 'Veterans Construction Group',
      location: 'Edmonton, AB',
      description: 'Looking for veterans with leadership experience to manage construction projects from planning to completion. Strong organizational skills required.',
      category: 'management',
      salaryRange: 'range3',
      remote: false,
      clearanceLevel: 'none',
      mosCode: '11B'
    },
    {
      id: '6',
      title: 'Cybersecurity Analyst',
      company: 'DefenceNet Systems',
      location: 'Ottawa, ON',
      description: 'Protect critical infrastructure from cyber threats. Looking for veterans with cybersecurity background or willingness to learn.',
      category: 'tech',
      salaryRange: 'range3',
      remote: true,
      clearanceLevel: 'topsecret',
      mosCode: '25B'
    },
    {
      id: '7',
      title: 'Administrative Assistant',
      company: 'Government Services',
      location: 'Montreal, QC',
      description: 'Support executive team with administrative tasks, scheduling, and document management. Excellent organizational skills required.',
      category: 'admin',
      salaryRange: 'range1',
      remote: false,
      clearanceLevel: 'confidential',
      mosCode: '42A'
    }
  ];

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

  useEffect(() => {
    setJobs(mockJobs);
    setFilteredJobs(mockJobs);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    filterJobs();
  }, [filters]);

  const filterJobs = () => {
    let results = [...jobs];

    if (filters.keywords) {
      const keywords = filters.keywords.toLowerCase();
      results = results.filter(job => 
        job.title.toLowerCase().includes(keywords) || 
        job.company.toLowerCase().includes(keywords) || 
        job.description.toLowerCase().includes(keywords)
      );
    }

    if (filters.location) {
      const location = filters.location.toLowerCase();
      results = results.filter(job => 
        job.location.toLowerCase().includes(location)
      );
    }

    if (filters.category) {
      results = results.filter(job => job.category === filters.category);
    }

    if (filters.salaryRange && filters.salaryRange !== 'any') {
      results = results.filter(job => job.salaryRange === filters.salaryRange);
    }

    if (filters.mosCodes.length > 0) {
      results = results.filter(job => filters.mosCodes.includes(job.mosCode));
    }

    if (filters.clearanceLevel.length > 0) {
      results = results.filter(job => filters.clearanceLevel.includes(job.clearanceLevel));
    }

    if (filters.remote) {
      results = results.filter(job => job.remote === true);
    }

    setFilteredJobs(results);
  };

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
    filterJobs();
    toast.success("Search results updated");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-primary/5 rounded-lg px-6 py-8 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Find Your Next Career</h1>
            
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
              
              {isFiltersOpen && (
                <div className="bg-white p-6 rounded-md shadow-sm border border-gray-100 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Search Results</h2>
              <span className="text-sm text-gray-500">{filteredJobs.length} jobs found</span>
            </div>
            
            {isLoading ? (
              <div className="py-12 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse bg-gray-100 h-32 rounded-lg"></div>
                ))}
              </div>
            ) : filteredJobs.length > 0 ? (
              <div className="space-y-4">
                {filteredJobs.map(job => (
                  <JobListing
                    key={job.id}
                    jobId={job.id}
                    title={job.title}
                    company={job.company}
                    location={job.location}
                    description={job.description}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No jobs found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search criteria or adding more filters.
                </p>
              </div>
            )}
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
