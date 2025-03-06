import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Search, User, Shield, Medal, Briefcase, ChevronDown, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LoadingButton from '@/components/ui/LoadingButton';
import VeteranProfileDialog from '@/components/VeteranProfileDialog';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  email?: string;
  phone?: string;
  education?: {
    institution: string;
    degree: string;
    dates: string;
  }[];
  experience?: {
    role: string;
    organization: string;
    dates: string;
    description: string;
  }[];
  achievements?: string[];
}

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

const clearanceLevels = [
  'None',
  'Reliability Status',
  'Secret',
  'Top Secret',
  'Enhanced Top Secret',
];

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
    summary: 'Experienced Combat Engineer with 8 years of service in the Canadian Army. Led teams of up to 20 personnel in construction, demolition, and tactical operations. Specialized in bridge construction, mine clearing operations, and defensive fortifications. Trained in explosives handling and disaster response.',
    available: true,
    email: 'james.wilson@example.com',
    phone: '(416) 555-1234',
    education: [
      {
        institution: 'Royal Military College of Canada',
        degree: 'Bachelor of Engineering',
        dates: '2008-2012'
      },
      {
        institution: 'Canadian Forces School of Military Engineering',
        degree: 'Combat Engineer Qualification',
        dates: '2012'
      }
    ],
    experience: [
      {
        role: 'Combat Engineer Section Commander',
        organization: 'Canadian Armed Forces, 4 Engineer Support Regiment',
        dates: '2016-2020',
        description: 'Led a section of 8 combat engineers in construction, demolition, and tactical operations. Managed equipment worth over $2M. Deployed to Latvia as part of Operation REASSURANCE.'
      },
      {
        role: 'Combat Engineer',
        organization: 'Canadian Armed Forces, 2 Combat Engineer Regiment',
        dates: '2012-2016',
        description: 'Participated in construction of field defenses, mine clearing operations, and route reconnaissance. Assisted in disaster relief operations during Alberta floods.'
      }
    ],
    achievements: [
      'Canadian Forces Decoration (CD) for 8 years of service',
      'Operation LENTUS Commendation for flood relief efforts',
      'Completed Advanced IED Detection and Disposal course',
      'Team leader for bridge construction competition, placed 1st nationally'
    ]
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
  const [filteredVeterans, setFilteredVeterans] = useState<VeteranProfile[]>(veterans);
  const [isFiltering, setIsFiltering] = useState(false);
  const [selectedVeteran, setSelectedVeteran] = useState<VeteranProfile | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const allSkills = Array.from(
    new Set(veterans.flatMap(vet => vet.skills))
  ).sort();

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill) 
        : [...prev, skill]
    );
  };

  const applyFilters = () => {
    setIsFiltering(true);
    
    setTimeout(() => {
      const filtered = veterans.filter(veteran => {
        const matchesSearch = 
          searchQuery === '' || 
          veteran.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          veteran.mosTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          veteran.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
          veteran.summary.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesSkills = 
          selectedSkills.length === 0 || 
          selectedSkills.every(skill => veteran.skills.includes(skill));
        
        const matchesMOS = 
          selectedMOS === '' || 
          veteran.mosCode === selectedMOS;
        
        const matchesClearance = 
          selectedClearance === '' || 
          (veteran.clearanceLevel && clearanceLevels.indexOf(veteran.clearanceLevel) >= clearanceLevels.indexOf(selectedClearance));
        
        return matchesSearch && matchesSkills && matchesMOS && matchesClearance;
      });
      
      setFilteredVeterans(filtered);
      setIsFiltering(false);
    }, 300);
  };

  const openVeteranProfile = (veteran: VeteranProfile) => {
    setSelectedVeteran(veteran);
    setIsProfileOpen(true);
  };

  const closeVeteranProfile = () => {
    setIsProfileOpen(false);
  };

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedSkills, selectedMOS, selectedClearance]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSkills([]);
    setSelectedMOS('');
    setSelectedClearance('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8 flex flex-col">
        <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
          <div className="sticky top-16 bg-gradient-to-b from-white to-gray-50 z-10 pb-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Veteran Talent</h1>
            <p className="text-gray-600 mb-8">Search for qualified Canadian veterans based on skills, experience, and military background</p>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
              <div className="p-4 sm:p-6">
                <div className="relative mb-4">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search by name, skills, or keywords..."
                    className="pl-10 block w-full py-3 px-4"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    aria-label="Search veterans"
                  />
                </div>

                <Button 
                  variant="outline" 
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full sm:w-auto flex justify-between items-center mb-4"
                  aria-expanded={showFilters}
                  aria-controls="filter-panel"
                >
                  <Filter className="h-4 w-4 mr-2" aria-hidden="true" />
                  Advanced Filters
                  <ChevronDown 
                    className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} 
                    aria-hidden="true" 
                  />
                </Button>

                {showFilters && (
                  <div id="filter-panel" className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pb-2">
                    <div>
                      <Label htmlFor="mos" className="mb-1">
                        Military Occupation Specialty (MOSID)
                      </Label>
                      <Select
                        value={selectedMOS}
                        onValueChange={setSelectedMOS}
                      >
                        <SelectTrigger id="mos" className="w-full" aria-label="Select MOSID">
                          <SelectValue placeholder="All MOSID Codes" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All MOSID Codes</SelectItem>
                          {canadianMOSCodes.map(mos => (
                            <SelectItem key={mos.code} value={mos.code}>
                              {mos.code} - {mos.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="clearance" className="mb-1">
                        Security Clearance Level
                      </Label>
                      <Select
                        value={selectedClearance}
                        onValueChange={setSelectedClearance}
                      >
                        <SelectTrigger id="clearance" className="w-full" aria-label="Select clearance level">
                          <SelectValue placeholder="Any Clearance" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Any Clearance</SelectItem>
                          {clearanceLevels.map(level => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="mb-1">Skills</Label>
                      <div className="p-2 border border-gray-300 rounded-md bg-white max-h-32 overflow-y-auto">
                        {allSkills.map(skill => (
                          <div key={skill} className="flex items-center mb-1">
                            <input
                              type="checkbox"
                              id={`skill-${skill}`}
                              checked={selectedSkills.includes(skill)}
                              onChange={() => toggleSkill(skill)}
                              className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                              aria-label={`Skill: ${skill}`}
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
                
                {showFilters && (
                  <div className="mt-4 flex flex-wrap gap-2 justify-end">
                    <Button 
                      variant="outline" 
                      onClick={resetFilters}
                      size="sm"
                      className="mt-2"
                    >
                      Reset Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-4 flex justify-between items-center">
              {isFiltering ? (
                <LoadingButton 
                  isLoading={true} 
                  loadingText="Filtering veterans..." 
                  className="bg-transparent hover:bg-transparent text-gray-700 hover:text-gray-700"
                  disabled
                />
              ) : (
                <h2 className="text-lg font-semibold text-gray-900">
                  {filteredVeterans.length} {filteredVeterans.length === 1 ? 'Veteran' : 'Veterans'} Found
                </h2>
              )}
            </div>
          </div>

          <ScrollArea className="flex-grow overflow-y-auto pr-2">
            <div className="space-y-6 pb-6">
              {filteredVeterans.length > 0 ? (
                filteredVeterans.map(veteran => (
                  <div
                    key={veteran.id}
                    className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-3/4">
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

                          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 mb-4">
                            <div className="flex items-center">
                              <Shield className="h-4 w-4 mr-1 text-gray-400" aria-hidden="true" />
                              <span>{veteran.rank}, {veteran.branch}</span>
                            </div>
                            <div className="flex items-center">
                              <Briefcase className="h-4 w-4 mr-1 text-gray-400" aria-hidden="true" />
                              <span>{veteran.mosTitle} ({veteran.mosCode})</span>
                            </div>
                            <div className="flex items-center">
                              <Medal className="h-4 w-4 mr-1 text-gray-400" aria-hidden="true" />
                              <span>{veteran.serviceYears}</span>
                            </div>
                          </div>

                          <p className="text-gray-700 mb-4">{veteran.summary}</p>

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

                          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span>{veteran.location}</span>
                            </div>
                            {veteran.clearanceLevel && (
                              <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <span>Clearance: {veteran.clearanceLevel}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="md:w-1/4 mt-4 md:mt-0 md:pl-6 md:border-l md:border-gray-200 flex flex-col justify-between">
                          <div className="flex flex-col space-y-3">
                            <Button 
                              className="w-full"
                              onClick={() => openVeteranProfile(veteran)}
                            >
                              <User className="mr-2 h-4 w-4" aria-hidden="true" />
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
                    <User className="h-12 w-12 text-gray-400" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No veterans match your search</h3>
                  <p className="text-gray-600">
                    Try adjusting your search criteria or filters to see more results.
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </main>
      
      {selectedVeteran && (
        <VeteranProfileDialog 
          isOpen={isProfileOpen} 
          onClose={closeVeteranProfile} 
          veteran={selectedVeteran}
        />
      )}
      
      <footer className="bg-gray-50 border-t border-gray-200">
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
