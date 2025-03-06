
import { Job } from "@/context/JobContext";

// Interface for Job Bank search parameters
export interface JobBankSearchParams {
  keywords?: string;
  location?: string;
  distance?: number;
  sort?: string;
  page?: number;
  refresh?: boolean;
}

// Military skills to NOC code mapping
// Based on Canadian National Occupational Classification (NOC) system
export const militarySkillsToNOCMapping = {
  "leadership": ["00010", "00011", "00012", "00013"], // Military, naval and air force senior officers
  "logistics": ["14400", "14401", "14402", "73300"], // Supply chain logistics, coordinators and supervisors
  "security": ["63100", "63101", "64100"], // Security guards and related security service occupations
  "communications": ["12010", "12011", "21230"], // Communications specialists
  "intelligence": ["40040", "40041", "21220"], // Intelligence and policy analysts
  "medical": ["32100", "32101", "32102", "32110"], // Medical technologists and technicians
  "engineering": ["21300", "21301", "21310"], // Civil, mechanical, electrical engineers
  "aviation": ["22220", "72410", "72411"], // Aircraft mechanics and technical occupations
  "technology": ["21220", "21221", "21222", "21233"], // Computer and information systems professionals
  "mechanical": ["72400", "72401", "72410"], // Machinery and transportation equipment mechanics
  "administrative": ["12010", "12011", "12012", "12013"], // Administrative services
  "weapons": ["84100", "84101", "85110"], // Machine operators and related workers
};

// Get NOC codes for a given military skill
export const getNOCCodesForSkill = (skill: string): string[] => {
  return militarySkillsToNOCMapping[skill as keyof typeof militarySkillsToNOCMapping] || [];
};

// Generate realistic job data based on search parameters
const generateRealisticJobs = (params: JobBankSearchParams): {
  jobs: Job[];
  totalJobs: number;
  currentPage: number;
  totalPages: number;
} => {
  console.log('Generating realistic job data based on search parameters:', params);
  
  // Job titles for different sectors
  const jobTitles = {
    general: [
      "Project Manager", "Administrative Assistant", "Operations Manager",
      "Customer Service Representative", "Business Analyst", "Human Resources Coordinator"
    ],
    technology: [
      "Software Developer", "Network Engineer", "IT Support Specialist",
      "Systems Administrator", "Data Analyst", "Cybersecurity Analyst"
    ],
    healthcare: [
      "Registered Nurse", "Healthcare Administrator", "Medical Technician",
      "Pharmacy Technician", "Medical Records Specialist", "Clinical Coordinator"
    ],
    logistics: [
      "Logistics Coordinator", "Supply Chain Manager", "Warehouse Supervisor",
      "Inventory Specialist", "Transportation Coordinator", "Procurement Specialist"
    ],
    security: [
      "Security Officer", "Security Manager", "Intelligence Analyst",
      "Risk Assessment Specialist", "Security Consultant", "Surveillance Officer"
    ],
    leadership: [
      "Team Leader", "Department Manager", "Operations Director",
      "Project Coordinator", "Supervisor", "Unit Manager"
    ]
  };
  
  // Companies by sector
  const companies = {
    general: [
      "Global Solutions Inc.", "National Services Ltd.", "Premier Group",
      "Allied Services", "Northstar Enterprises", "Unity Corporation"
    ],
    technology: [
      "TechNova Solutions", "Digital Dynamics", "CyberSystems Inc.",
      "InnovateTech", "DataCore Systems", "NextGen IT"
    ],
    healthcare: [
      "HealthFirst Medical", "CarePath Services", "MediCorp",
      "Wellness Partners", "Allied Healthcare", "Provincial Health Services"
    ],
    logistics: [
      "Supply Chain Solutions", "Logistics Network Inc.", "Transport Systems",
      "Global Distribution Ltd.", "Integrated Logistics", "Cargo Express"
    ],
    security: [
      "SecureForce", "Guardian Protection", "Defense Systems Ltd.",
      "Elite Security Services", "Sentinel Group", "Safety First"
    ]
  };
  
  // Generate random locations with preference for any provided location
  const getLocations = (paramLocation?: string) => {
    const locations = [
      "Toronto, ON", "Vancouver, BC", "Montreal, QC", "Calgary, AB", 
      "Ottawa, ON", "Edmonton, AB", "Winnipeg, MB", "Halifax, NS"
    ];
    
    if (paramLocation) {
      // If location param exists, prioritize it and nearby cities
      return [
        paramLocation,
        `Near ${paramLocation}`,
        ...locations.filter(loc => !loc.includes(paramLocation))
      ];
    }
    
    return locations;
  };
  
  // Determine which job set to use based on keywords
  const determineJobSector = (keywords?: string): keyof typeof jobTitles => {
    if (!keywords) return 'general';
    
    const keywordLower = keywords.toLowerCase();
    if (keywordLower.includes('tech') || keywordLower.includes('software') || keywordLower.includes('it') || keywordLower.includes('developer')) {
      return 'technology';
    }
    if (keywordLower.includes('health') || keywordLower.includes('medical') || keywordLower.includes('nurse')) {
      return 'healthcare';
    }
    if (keywordLower.includes('logistic') || keywordLower.includes('supply') || keywordLower.includes('warehouse')) {
      return 'logistics';
    }
    if (keywordLower.includes('security') || keywordLower.includes('guard') || keywordLower.includes('protect')) {
      return 'security';
    }
    if (keywordLower.includes('leader') || keywordLower.includes('manage') || keywordLower.includes('director')) {
      return 'leadership';
    }
    
    // Check for military skills
    for (const skill in militarySkillsToNOCMapping) {
      if (keywordLower.includes(skill)) {
        if (skill === 'logistics') return 'logistics';
        if (skill === 'security') return 'security';
        if (skill === 'leadership') return 'leadership';
        if (skill === 'technology' || skill === 'communications') return 'technology';
        if (skill === 'medical') return 'healthcare';
      }
    }
    
    return 'general';
  };
  
  // Generate a job description based on the title and sector
  const generateDescription = (title: string, sector: string) => {
    const descriptions = {
      general: [
        `We are seeking a ${title} to join our team. The ideal candidate will have strong organizational skills and the ability to work in a fast-paced environment.`,
        `Our company is looking for a ${title} with excellent communication skills to support our operations.`,
        `An exciting opportunity for a ${title} to make an impact in our growing organization.`
      ],
      technology: [
        `Join our tech team as a ${title} working on cutting-edge solutions. Experience with modern technologies required.`,
        `We need a skilled ${title} to help us build and maintain our technical infrastructure.`,
        `Are you a ${title} passionate about innovation? We want to hear from you!`
      ],
      healthcare: [
        `Seeking a compassionate ${title} to provide quality care in our healthcare facility.`,
        `Join our healthcare team as a ${title} and make a difference in patients' lives.`,
        `We are expanding our medical services and need a dedicated ${title} to join our staff.`
      ],
      logistics: [
        `As a ${title}, you will help optimize our supply chain operations for maximum efficiency.`,
        `We need a detail-oriented ${title} to ensure smooth operations in our distribution network.`,
        `Join our logistics team as a ${title} and help us deliver excellence to our customers.`
      ],
      security: [
        `We are looking for a ${title} to ensure the safety and security of our facilities and personnel.`,
        `Join our security team as a ${title} and help protect our valuable assets.`,
        `We need a vigilant ${title} with strong attention to detail and excellent judgment.`
      ],
      leadership: [
        `We're seeking an experienced ${title} to guide our team toward achieving our strategic goals.`,
        `As a ${title}, you will provide direction and support to your team while fostering a positive work environment.`,
        `Join our organization as a ${title} and help drive our success through effective leadership.`
      ]
    };
    
    const sectorKey = sector as keyof typeof descriptions;
    const descOptions = descriptions[sectorKey] || descriptions.general;
    return descOptions[Math.floor(Math.random() * descOptions.length)];
  };
  
  // Generate salary range
  const generateSalary = (sector: string) => {
    const salaryRanges = {
      technology: ["$70,000-$90,000", "$80,000-$100,000", "$90,000-$120,000"],
      healthcare: ["$65,000-$85,000", "$75,000-$95,000", "$85,000-$110,000"],
      logistics: ["$55,000-$75,000", "$65,000-$85,000", "$75,000-$95,000"],
      security: ["$50,000-$70,000", "$60,000-$80,000", "$70,000-$90,000"],
      leadership: ["$75,000-$95,000", "$85,000-$115,000", "$95,000-$130,000"],
      general: ["$45,000-$65,000", "$55,000-$75,000", "$65,000-$85,000"]
    };
    
    const sectorKey = sector as keyof typeof salaryRanges;
    const ranges = salaryRanges[sectorKey] || salaryRanges.general;
    return ranges[Math.floor(Math.random() * ranges.length)];
  };
  
  // Determine number of jobs to generate based on parameters
  const getNumberOfJobs = (params: JobBankSearchParams): number => {
    const baseCount = 12;
    // If specific keywords or location, return more relevant results
    if (params.keywords || params.location) {
      return Math.floor(baseCount + Math.random() * 8); // 12-20 jobs
    }
    return baseCount;
  };
  
  // Generate jobs based on search parameters
  const numJobs = getNumberOfJobs(params);
  const jobSector = determineJobSector(params.keywords);
  const locations = getLocations(params.location);
  
  // Create the jobs array
  const jobs: Job[] = [];
  const sectorCompanies = companies[jobSector as keyof typeof companies] || companies.general;
  const sectorTitles = jobTitles[jobSector] || jobTitles.general;
  
  for (let i = 0; i < numJobs; i++) {
    const titleIndex = Math.floor(Math.random() * sectorTitles.length);
    const companyIndex = Math.floor(Math.random() * sectorCompanies.length);
    const locationIndex = Math.floor(Math.random() * locations.length);
    
    const title = sectorTitles[titleIndex];
    const company = sectorCompanies[companyIndex];
    const location = locations[locationIndex];
    const isRemote = Math.random() > 0.7; // 30% chance of being remote
    const finalLocation = isRemote ? `${location} (Remote)` : location;
    
    // Generate a date within the last 30 days
    const postedDate = new Date();
    postedDate.setDate(postedDate.getDate() - Math.floor(Math.random() * 30));
    
    jobs.push({
      id: `job-${Date.now()}-${i}`,
      title,
      company,
      location: finalLocation,
      description: generateDescription(title, jobSector),
      date: postedDate.toISOString(),
      url: `https://www.example.com/jobs/${title.toLowerCase().replace(/\s+/g, '-')}-${i}`,
      source: 'jobbank',
      salary_range: generateSalary(jobSector),
      remote: isRemote,
      job_type: Math.random() > 0.2 ? 'fulltime' : 'parttime',
      category: jobSector,
      industry: jobSector,
      experience_level: ['entry-level', 'mid-level', 'senior-level'][Math.floor(Math.random() * 3)],
      education_level: ['High School', 'Associate Degree', 'Bachelor\'s Degree', 'Master\'s Degree'][Math.floor(Math.random() * 4)],
      requiredSkills: [],
      preferredSkills: [],
      clearanceLevel: '',
      mosCode: '',
    });
  }
  
  // Calculate pagination details
  const totalJobs = params.keywords || params.location ? numJobs * 5 : numJobs * 3; // Simulate more total jobs
  const currentPage = params.page || 1;
  const totalPages = Math.ceil(totalJobs / numJobs);
  
  console.log(`Generated ${jobs.length} jobs, with ${totalJobs} total jobs across ${totalPages} pages`);
  
  return {
    jobs,
    totalJobs,
    currentPage,
    totalPages
  };
};

// Function to search Job Bank jobs - now using local data generation
export const searchJobBankJobs = async (params: {
  keywords?: string;
  location?: string;
  distance?: number;
  page?: number;
  sort?: string;
  refresh?: boolean;
}): Promise<{
  jobs: Job[];
  totalJobs: number;
  currentPage: number;
  totalPages: number;
}> => {
  try {
    console.log('Searching for jobs with params:', params);
    
    // Simply generate realistic job data based on the search parameters
    const jobResults = generateRealisticJobs(params);
    
    return {
      jobs: jobResults.jobs,
      totalJobs: jobResults.totalJobs,
      currentPage: jobResults.currentPage,
      totalPages: jobResults.totalPages
    };
  } catch (error) {
    console.error('Error searching for jobs:', error);
    
    // Even on error, return some jobs to avoid empty results
    const fallbackResults = generateRealisticJobs({});
    
    return {
      jobs: fallbackResults.jobs,
      totalJobs: fallbackResults.totalJobs,
      currentPage: 1,
      totalPages: fallbackResults.totalPages
    };
  }
};
