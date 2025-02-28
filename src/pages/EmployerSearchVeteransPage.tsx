
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Search, User, Shield, Medal, Briefcase, ChevronDown, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Define veteran profile data structure
interface VeteranProfile {
  id: string;
  name: string;
  photo?: string;
  rank: string;
  serviceYears: string;
  mosCode: string;
  mosTitle: string;
  branch: string;
  skills: string[];
  clearanceLevel?: string;
  location: string;
  summary: string;
  available: boolean;
}

// Sample MOS codes for Canadian Army
const canadianMOSCodes = [
  { code: '00005', title: 'Combat Arms' },
  { code: '00008', title: 'Combat Engineer' },
  { code: '00120', title: 'Signal Operator' },
  { code: '00171', title: 'Communications and Information Systems Specialist' },
  { code: '00178', title: 'Military Police' },
  { code: '00214', title: 'Artillery Soldier' },
  { code: '00306', title: 'Vehicle Technician' },
  { code: '00328', title: 'Supply Technician' },
  { code: '00334', title: 'Cook' },
  { code: '00339', title: 'Intelligence Operator' },
];

// Canadian security clearance levels
const clearanceLevels = [
  'None',
  'Reliability Status',
  'Secret',
  'Top Secret',
  'Enhanced Top Secret',
];

// Sample veteran data
const sampleVeterans: VeteranProfile[] = [
  {
    id: 'vet-1',
    name: 'James Wilson',
    rank: 'Sergeant',
    serviceYears: '2012-2020',
    mosCode: '00008',
    mosTitle: 'Combat Engineer',
    branch: 'Canadian Army',
    skills: ['Leadership', 'Project Management', 'Team Building', 'Risk Assessment', 'Construction'],
    clearanceLevel: 'Secret',
    location: 'Toronto, ON',
    summary: 'Experienced Combat Engineer with 8 years of service in the Canadian Army. Led teams of up to 20 personnel in construction, demolition, and tactical operations.',
    available: true
  },
  {
    id: 'vet-2',
    name: 'Sarah Thompson',
    rank: 'Captain',
    serviceYears: '2010-2022',
    mosCode: '00171',
    mosTitle: 'Communications and Information Systems Specialist',
    branch: 'Canadian Army',
    skills: ['Network Security', 'Telecommunications', 'Cybersecurity', 'IT Management', 'System Administration'],
    clearanceLevel: 'Top Secret',
    location: 'Ottawa, ON',
    summary: 'Former Communications Officer with extensive experience in secure networks and battlefield communications systems. Led IT modernization projects and managed secure communications for tactical operations.',
    available: true
  },
  {
    id: 'vet-3',
    name: 'Michael Chen',
    rank: 'Corporal',
    serviceYears: '2015-2021',
    mosCode: '00306',
    mosTitle: 'Vehicle Technician',
    branch: 'Canadian Army',
    skills: ['Vehicle Maintenance', 'Diesel Engines', 'Hydraulic Systems', 'Inventory Management', 'Quality Control'],
    clearanceLevel: 'Reliability Status',
    location: 'Vancouver, BC',
    summary: 'Skilled Vehicle Technician with expertise in maintenance and repair of military vehicles including LAVs, Humvees, and transport trucks. Specialized in diesel engine repair and hydraulic systems.',
    available: false
  },
  {
    id: 'vet-4',
    name: 'Emma Rodriguez',
    rank: 'Lieutenant',
    serviceYears: '2014-2023',
    mosCode: '00339',
    mosTitle: 'Intelligence Operator',
    branch: 'Canadian Army',
    skills: ['Intelligence Analysis', 'Data Mining', 'Foreign Languages', 'Report Writing', 'Risk Assessment'],
    clearanceLevel: 'Enhanced Top Secret',
    location: 'Montreal, QC',
    summary: 'Former Intelligence Officer with expertise in data analysis and threat assessment. Fluent in English, French, and Spanish. Experienced in operational planning and intelligence briefings.',
    available: true
  },
  {
    id: 'vet-5',
    name: 'Robert Taylor',
    rank: 'Master Corporal',
    serviceYears: '2008-2018',
    mosCode: '00328',
    mosTitle: 'Supply Technician',
    branch: 'Canadian Army',
    skills: ['Logistics', 'Inventory Management', 'Supply Chain', 'Procurement', 'Warehouse Operations'],
    clearanceLevel: 'Secret',
    location: 'Edmonton, AB',
    summary: 'Experienced logistics professional with 10 years in military supply operations. Managed inventories worth over $5M and coordinated complex supply chains in both domestic and international operations.',
    available: true
  }
];

const EmployerSearchVeteransPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedMOS, setSelectedMOS] = useState<string>('');
  const [selectedClearance, setSelectedClearance] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [veterans, setVeterans] = useState<VeteranProfile[]>(sampleVeterans);

  // Combined skills from all veterans for the filter dropdown
  const allSkills = Array.from(
    new Set(veterans.flatMap(vet => vet.skills))
  ).sort();

  // Handle skill selection
  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill) 
        : [...prev, skill]
    );
  };

  // Filter veterans based on search criteria
  const filteredVeterans = veterans.filter(veteran => {
    // Filter by search query
    const matchesSearch = 
      searchQuery === '' || 
      veteran.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      veteran.mosTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      veteran.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
      veteran.summary.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by selected skills
    const matchesSkills = 
      selectedSkills.length === 0 || 
      selectedSkills.every(skill => veteran.skills.includes(skill));
    
    // Filter by MOS
    const matchesMOS = 
      selectedMOS === '' || 
      veteran.mosCode === selectedMOS;
    
    // Filter by clearance level
    const matchesClearance = 
      selectedClearance === '' || 
      (veteran.clearanceLevel && clearanceLevels.indexOf(veteran.clearanceLevel) >= clearanceLevels.indexOf(selectedClearance));
    
    return matchesSearch && matchesSkills && matchesMOS && matchesClearance;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Veteran Talent</h1>
          <p className="text-gray-600 mb-8">Search for qualified Canadian veterans based on skills, experience, and military background</p>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="p-4 sm:p-6">
              {/* Main search bar */}
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, skills, or keywords..."
                  className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 px-4 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-base"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Filter toggle button */}
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="w-full sm:w-auto flex justify-between items-center mb-4"
              >
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
                <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>

              {/* Expandable filters */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pb-2">
                  {/* MOS Filter */}
                  <div>
                    <label htmlFor="mos" className="block text-sm font-medium text-gray-700 mb-1">
                      Military Occupation Specialty (MOSID)
                    </label>
                    <select
                      id="mos"
                      className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                      value={selectedMOS}
                      onChange={e => setSelectedMOS(e.target.value)}
                    >
                      <option value="">All MOSID Codes</option>
                      {canadianMOSCodes.map(mos => (
                        <option key={mos.code} value={mos.code}>
                          {mos.code} - {mos.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Clearance Level Filter */}
                  <div>
                    <label htmlFor="clearance" className="block text-sm font-medium text-gray-700 mb-1">
                      Security Clearance Level
                    </label>
                    <select
                      id="clearance"
                      className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                      value={selectedClearance}
                      onChange={e => setSelectedClearance(e.target.value)}
                    >
                      <option value="">Any Clearance</option>
                      {clearanceLevels.map(level => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Skills Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Skills
                    </label>
                    <div className="p-2 border border-gray-300 rounded-md bg-white max-h-32 overflow-y-auto">
                      {allSkills.map(skill => (
                        <div key={skill} className="flex items-center mb-1">
                          <input
                            type="checkbox"
                            id={`skill-${skill}`}
                            checked={selectedSkills.includes(skill)}
                            onChange={() => toggleSkill(skill)}
                            className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                          />
                          <label
                            htmlFor={`skill-${skill}`}
                            className="ml-2 block text-sm text-gray-700"
                          >
                            {skill}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              {filteredVeterans.length} {filteredVeterans.length === 1 ? 'Veteran' : 'Veterans'} Found
            </h2>
          </div>

          {/* Veteran Profiles List */}
          <div className="space-y-6">
            {filteredVeterans.length > 0 ? (
              filteredVeterans.map(veteran => (
                <div
                  key={veteran.id}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-3/4">
                        {/* Header section with name and availability */}
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{veteran.name}</h3>
                          {veteran.available ? (
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              Available Now
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                              Not Available
                            </Badge>
                          )}
                        </div>

                        {/* Military info */}
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <Shield className="h-4 w-4 mr-1 text-gray-400" />
                            <span>{veteran.rank}, {veteran.branch}</span>
                          </div>
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-1 text-gray-400" />
                            <span>{veteran.mosTitle} ({veteran.mosCode})</span>
                          </div>
                          <div className="flex items-center">
                            <Medal className="h-4 w-4 mr-1 text-gray-400" />
                            <span>{veteran.serviceYears}</span>
                          </div>
                        </div>

                        {/* Profile summary */}
                        <p className="text-gray-700 mb-4">{veteran.summary}</p>

                        {/* Skills */}
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Skills:</h4>
                          <div className="flex flex-wrap gap-2">
                            {veteran.skills.map((skill, index) => (
                              <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Location and clearance */}
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{veteran.location}</span>
                          </div>
                          {veteran.clearanceLevel && (
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                              <span>Clearance: {veteran.clearanceLevel}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions column */}
                      <div className="md:w-1/4 mt-4 md:mt-0 md:pl-6 md:border-l md:border-gray-200 flex flex-col justify-between">
                        <div className="flex flex-col space-y-3">
                          <Button className="w-full">
                            <User className="mr-2 h-4 w-4" />
                            View Profile
                          </Button>
                          <Button variant="outline" className="w-full">
                            Save Profile
                          </Button>
                          <Button variant="outline" className="w-full">
                            Contact
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
                <div className="flex justify-center mb-4">
                  <User className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No veterans match your search</h3>
                <p className="text-gray-600">
                  Try adjusting your search criteria or filters to see more results.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2023 VeteranJobBoard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EmployerSearchVeteransPage;
