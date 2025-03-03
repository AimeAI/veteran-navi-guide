
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
    remote: false
  },
  {
    id: '2',
    title: 'Logistics Coordinator',
    company: 'Canadian Supply Chain Inc.',
    location: 'Halifax, NS',
    description: 'Perfect for veterans with logistics MOSID. Coordinate shipments, manage inventory, and optimize supply chain processes. Competitive salary with benefits package.',
    requiredSkills: ['logistics', 'inventory management', 'supply chain'],
    preferredSkills: ['leadership', 'communication'],
    requiredMosCodes: ['88N', 'QM'],
    remote: false
  },
  {
    id: '3',
    title: 'Healthcare Administrator',
    company: 'Veterans Medical Centre',
    location: 'Remote - Canada',
    description: 'Join our team dedicated to improving healthcare for veterans. Looking for organized professionals with healthcare experience from military settings.',
    requiredSkills: ['healthcare', 'administration', 'organization'],
    preferredSkills: ['leadership', 'project management'],
    remote: true
  },
  {
    id: '4',
    title: 'Cybersecurity Analyst',
    company: 'DefenceNet Systems',
    location: 'Toronto, ON',
    description: 'Ideal for veterans with intelligence or cybersecurity background. Monitor network security and respond to incidents. Secret clearance required.',
    requiredSkills: ['cybersecurity', 'network security', 'incident response'],
    preferredSkills: ['communication', 'risk assessment'],
    requiredMosCodes: ['17C', '25B'],
    securityClearanceRequired: 'Secret',
    remote: false
  },
  {
    id: '5',
    title: 'Project Manager',
    company: 'Veterans Construction Group',
    location: 'Edmonton, AB',
    description: 'Looking for veterans with leadership experience to manage construction projects from planning to completion. Strong organizational skills required.',
    requiredSkills: ['project management', 'leadership', 'organization'],
    preferredSkills: ['communication', 'budgeting'],
    remote: false
  },
  {
    id: '6',
    title: 'Emergency Medical Technician',
    company: 'First Responders Alliance',
    location: 'Calgary, AB',
    description: 'Former military medics encouraged to apply. Provide emergency medical care in civilian settings. Training assistance available.',
    requiredSkills: ['emergency medicine', 'first aid', 'patient care'],
    preferredSkills: ['communication', 'stress management'],
    requiredMosCodes: ['68W', 'Med Tech'],
    remote: false
  },
  {
    id: '7',
    title: 'Aviation Maintenance Technician',
    company: 'SkyWorks Aerospace',
    location: 'Vancouver, BC',
    description: 'Perfect transition for military aircraft technicians. Maintain and repair commercial aircraft. Transport Canada certification assistance provided.',
    requiredSkills: ['aircraft maintenance', 'mechanical repair', 'troubleshooting'],
    preferredSkills: ['leadership', 'communication'],
    requiredMosCodes: ['15T', 'AMET'],
    remote: false
  },
  {
    id: '8',
    title: 'Remote IT Support Specialist',
    company: 'TechVet Solutions',
    location: 'Remote - Canada',
    description: 'Provide technical support to clients across Canada. Perfect for veterans with IT background looking for flexible work arrangements.',
    requiredSkills: ['IT support', 'troubleshooting', 'customer service'],
    preferredSkills: ['communication', 'networking'],
    requiredMosCodes: ['25B', 'IT Spec'],
    remote: true
  }
];
