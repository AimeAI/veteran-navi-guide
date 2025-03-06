import { JobListing } from '../utils/recommendationAlgorithm';

// Mock job listings with skills and MOS codes
export const mockJobs: JobListing[] = [
  {
    id: '1',
    title: 'Security Operations Manager',
    company: 'TechDefense Solutions',
    location: 'Ottawa, ON',
    description: 'Seeking a veteran with security background to lead our operations team. Must have experience in risk assessment and team leadership. Secret clearance preferred.',
    requiredSkills: ['leadership', 'security', 'risk assessment'],
    preferredSkills: ['project management', 'communication'],
    securityClearanceRequired: 'Secret',
    remote: false,
    jobType: 'full-time',
    industry: 'Security',
    experienceLevel: 'Mid-level',
    educationLevel: "Bachelor's Degree",
    companySize: 'Medium',
    companyRating: 4.5,
    benefits: ['Health Insurance', 'Retirement Plan', 'Paid Time Off']
  },
  {
    id: '2',
    title: 'Logistics Coordinator',
    company: 'Canadian Supply Chain Inc.',
    location: 'Halifax, NS',
    description: 'Perfect for veterans with logistics MOSID. Coordinate shipments, manage inventory, and optimize supply chain processes. Competitive salary with benefits package.',
    requiredSkills: ['logistics', 'inventory management', 'supply chain'],
    preferredSkills: ['leadership', 'communication'],
    requiredMosCodes: ['00168', 'SUPPLY'],
    remote: false,
    jobType: 'full-time',
    industry: 'Logistics',
    experienceLevel: 'Entry-level',
    educationLevel: 'High School',
    companySize: 'Large',
    companyRating: 4.2,
    benefits: ['Health Insurance', 'Dental Insurance', 'Vision Insurance']
  },
  {
    id: '3',
    title: 'Healthcare Administrator',
    company: 'Veterans Medical Centre',
    location: 'Remote - Canada',
    description: 'Join our team dedicated to improving healthcare for veterans. Looking for organized professionals with healthcare experience from military settings.',
    requiredSkills: ['healthcare', 'administration', 'organization'],
    preferredSkills: ['leadership', 'project management'],
    remote: true,
    jobType: 'full-time',
    industry: 'Healthcare',
    experienceLevel: 'Mid-level',
    educationLevel: "Associate's Degree",
    companySize: 'Large',
    companyRating: 4.0,
    benefits: ['Health Insurance', 'Retirement Plan', 'Flexible Hours']
  },
  {
    id: '4',
    title: 'Cybersecurity Analyst',
    company: 'DefenceNet Systems',
    location: 'Toronto, ON',
    description: 'Ideal for veterans with intelligence or cybersecurity background. Monitor network security and respond to incidents. Secret clearance required.',
    requiredSkills: ['cybersecurity', 'network security', 'incident response'],
    preferredSkills: ['communication', 'risk assessment'],
    requiredMosCodes: ['00271', '00378'],
    securityClearanceRequired: 'Secret',
    remote: false,
    jobType: 'full-time',
    industry: 'Technology',
    experienceLevel: 'Mid-level',
    educationLevel: "Bachelor's Degree",
    companySize: 'Medium',
    companyRating: 4.7,
    benefits: ['Health Insurance', 'Stock Options', 'Training Budget']
  },
  {
    id: '5',
    title: 'Project Manager',
    company: 'Veterans Construction Group',
    location: 'Edmonton, AB',
    description: 'Looking for veterans with leadership experience to manage construction projects from planning to completion. Strong organizational skills required.',
    requiredSkills: ['project management', 'leadership', 'organization'],
    preferredSkills: ['communication', 'budgeting'],
    remote: false,
    jobType: 'contract',
    industry: 'Construction',
    experienceLevel: 'Senior-level',
    educationLevel: "Bachelor's Degree",
    companySize: 'Small',
    companyRating: 4.3,
    benefits: ['Competitive Pay', 'Flexible Hours', 'Career Growth']
  },
  {
    id: '6',
    title: 'Emergency Medical Technician',
    company: 'First Responders Alliance',
    location: 'Calgary, AB',
    description: 'Former CAF medical technicians encouraged to apply. Provide emergency medical care in civilian settings. Training assistance available.',
    requiredSkills: ['emergency medicine', 'first aid', 'patient care'],
    preferredSkills: ['communication', 'stress management'],
    requiredMosCodes: ['00334', 'Med Tech'],
    remote: false,
    jobType: 'full-time',
    industry: 'Healthcare',
    experienceLevel: 'Entry-level',
    educationLevel: 'Certification',
    companySize: 'Medium',
    companyRating: 4.1,
    benefits: ['Health Insurance', 'Continuing Education', 'Shift Differential']
  },
  {
    id: '7',
    title: 'Aviation Maintenance Technician',
    company: 'SkyWorks Aerospace',
    location: 'Vancouver, BC',
    description: 'Perfect transition for CAF aircraft technicians. Maintain and repair commercial aircraft. Transport Canada certification assistance provided.',
    requiredSkills: ['aircraft maintenance', 'mechanical repair', 'troubleshooting'],
    preferredSkills: ['leadership', 'communication'],
    requiredMosCodes: ['00153', 'AERE'],
    remote: false,
    jobType: 'full-time',
    industry: 'Aviation',
    experienceLevel: 'Mid-level',
    educationLevel: 'Technical Certification',
    companySize: 'Large',
    companyRating: 4.6,
    benefits: ['Health Insurance', 'Retirement Plan', 'Travel Benefits']
  },
  {
    id: '8',
    title: 'Remote IT Support Specialist',
    company: 'TechVet Solutions',
    location: 'Remote - Canada',
    description: 'Provide technical support to clients across Canada. Perfect for veterans with IT background looking for flexible work arrangements.',
    requiredSkills: ['IT support', 'troubleshooting', 'customer service'],
    preferredSkills: ['communication', 'networking'],
    requiredMosCodes: ['00369', 'CISTM'],
    remote: true,
    jobType: 'part-time',
    industry: 'Technology',
    experienceLevel: 'Entry-level',
    educationLevel: 'Certification',
    companySize: 'Small',
    companyRating: 4.4,
    benefits: ['Flexible Hours', 'Work From Home', 'Training Opportunities']
  }
];
