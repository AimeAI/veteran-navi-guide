/**
 * Canadian Armed Forces Military Occupational Specialties to Civilian Job Mapping
 * Based on real CAF trades and their civilian equivalents
 */

export interface MilitaryTrade {
  id: string;
  name: string;
  code?: string;
  branch: 'Army' | 'Navy' | 'Air Force' | 'All';
  description: string;
  civilianRoles: CivilianRole[];
  transferableSkills: string[];
  certifications?: string[];
}

export interface CivilianRole {
  title: string;
  industry: string[];
  matchPercentage: number; // How well military experience translates (0-100)
  description: string;
  typicalSalaryRange?: string;
  inDemand?: boolean;
}

export const militaryTrades: MilitaryTrade[] = [
  // COMBAT ARMS
  {
    id: 'infantry',
    name: 'Infantry Soldier',
    branch: 'Army',
    description: 'Combat operations, leadership, tactical planning',
    transferableSkills: [
      'Team Leadership',
      'Crisis Management',
      'Decision Making Under Pressure',
      'Physical Fitness',
      'Attention to Detail',
      'Risk Assessment',
      'Project Planning',
      'Training & Mentoring'
    ],
    civilianRoles: [
      {
        title: 'Security Manager',
        industry: ['Public Safety', 'Corporate Security'],
        matchPercentage: 90,
        description: 'Oversee security operations, risk assessment, team leadership',
        typicalSalaryRange: '$60,000 - $90,000',
        inDemand: true
      },
      {
        title: 'Emergency Response Coordinator',
        industry: ['Public Safety', 'Government'],
        matchPercentage: 85,
        description: 'Coordinate emergency response, crisis management, team coordination',
        typicalSalaryRange: '$55,000 - $85,000',
        inDemand: true
      },
      {
        title: 'Police Officer',
        industry: ['Public Safety'],
        matchPercentage: 80,
        description: 'Law enforcement, public safety, community protection',
        typicalSalaryRange: '$65,000 - $95,000',
        inDemand: true
      },
      {
        title: 'Operations Manager',
        industry: ['Manufacturing', 'Logistics'],
        matchPercentage: 75,
        description: 'Manage operations, team leadership, process improvement',
        typicalSalaryRange: '$70,000 - $100,000',
        inDemand: true
      },
      {
        title: 'Safety Coordinator',
        industry: ['Construction', 'Manufacturing'],
        matchPercentage: 70,
        description: 'Safety protocols, risk management, training delivery',
        typicalSalaryRange: '$55,000 - $80,000',
        inDemand: true
      }
    ]
  },
  {
    id: 'combat-engineer',
    name: 'Combat Engineer',
    branch: 'Army',
    description: 'Construction, demolition, route clearance, bridge building',
    transferableSkills: [
      'Project Management',
      'Heavy Equipment Operation',
      'Construction Planning',
      'Safety Management',
      'Team Leadership',
      'Problem Solving',
      'Technical Drawing',
      'Logistics Coordination'
    ],
    civilianRoles: [
      {
        title: 'Construction Project Manager',
        industry: ['Construction'],
        matchPercentage: 90,
        description: 'Manage construction projects, coordinate teams, ensure safety',
        typicalSalaryRange: '$75,000 - $110,000',
        inDemand: true
      },
      {
        title: 'Civil Engineering Technician',
        industry: ['Construction', 'Engineering'],
        matchPercentage: 85,
        description: 'Support civil engineering projects, technical drawings, site coordination',
        typicalSalaryRange: '$55,000 - $75,000',
        inDemand: true
      },
      {
        title: 'Heavy Equipment Operator',
        industry: ['Construction', 'Mining'],
        matchPercentage: 80,
        description: 'Operate heavy machinery, site preparation, earthworks',
        typicalSalaryRange: '$60,000 - $85,000',
        inDemand: true
      },
      {
        title: 'Utilities Maintenance Supervisor',
        industry: ['Utilities'],
        matchPercentage: 75,
        description: 'Oversee infrastructure maintenance, team management',
        typicalSalaryRange: '$70,000 - $95,000',
        inDemand: true
      }
    ],
    certifications: ['Red Seal Heavy Equipment Operator', 'Construction Safety Training System (CSTS)']
  },
  {
    id: 'armoured',
    name: 'Armoured Soldier',
    branch: 'Army',
    description: 'Armoured vehicle operations, reconnaissance, crew coordination',
    transferableSkills: [
      'Vehicle Operations',
      'Mechanical Troubleshooting',
      'Navigation',
      'Team Coordination',
      'Situational Awareness',
      'Radio Communications',
      'Preventive Maintenance',
      'Quick Decision Making'
    ],
    civilianRoles: [
      {
        title: 'Heavy Equipment Operator',
        industry: ['Construction', 'Mining', 'Logistics'],
        matchPercentage: 85,
        description: 'Operate heavy machinery and vehicles',
        typicalSalaryRange: '$60,000 - $85,000',
        inDemand: true
      },
      {
        title: 'Fleet Manager',
        industry: ['Logistics', 'Transportation'],
        matchPercentage: 80,
        description: 'Manage vehicle fleets, maintenance schedules, operations',
        typicalSalaryRange: '$65,000 - $90,000',
        inDemand: true
      },
      {
        title: 'Transportation Coordinator',
        industry: ['Logistics'],
        matchPercentage: 75,
        description: 'Coordinate transportation operations, route planning',
        typicalSalaryRange: '$50,000 - $70,000',
        inDemand: true
      }
    ]
  },

  // LOGISTICS & SUPPORT
  {
    id: 'supply-tech',
    name: 'Supply Technician',
    branch: 'All',
    description: 'Supply chain management, inventory control, procurement',
    transferableSkills: [
      'Inventory Management',
      'Supply Chain Coordination',
      'Data Entry & Analysis',
      'Warehousing',
      'Procurement',
      'Logistics Planning',
      'Quality Control',
      'SAP/ERP Systems'
    ],
    civilianRoles: [
      {
        title: 'Supply Chain Coordinator',
        industry: ['Logistics', 'Manufacturing', 'Retail'],
        matchPercentage: 95,
        description: 'Manage supply chain operations, inventory, procurement',
        typicalSalaryRange: '$50,000 - $75,000',
        inDemand: true
      },
      {
        title: 'Warehouse Manager',
        industry: ['Logistics', 'Retail'],
        matchPercentage: 90,
        description: 'Oversee warehouse operations, inventory management, team leadership',
        typicalSalaryRange: '$55,000 - $80,000',
        inDemand: true
      },
      {
        title: 'Procurement Specialist',
        industry: ['Government', 'Manufacturing'],
        matchPercentage: 85,
        description: 'Source materials, negotiate contracts, manage vendors',
        typicalSalaryRange: '$55,000 - $85,000',
        inDemand: true
      },
      {
        title: 'Inventory Analyst',
        industry: ['Retail', 'Manufacturing'],
        matchPercentage: 80,
        description: 'Analyze inventory data, optimize stock levels, reporting',
        typicalSalaryRange: '$50,000 - $70,000',
        inDemand: true
      }
    ]
  },
  {
    id: 'transport',
    name: 'Mobile Support Equipment Operator',
    branch: 'All',
    description: 'Heavy truck operation, logistics, vehicle maintenance',
    transferableSkills: [
      'Commercial Driving',
      'Route Planning',
      'Vehicle Maintenance',
      'Load Securing',
      'Safety Compliance',
      'Log Book Management',
      'Customer Service',
      'Time Management'
    ],
    civilianRoles: [
      {
        title: 'Commercial Truck Driver',
        industry: ['Logistics', 'Transportation'],
        matchPercentage: 95,
        description: 'Long-haul or regional trucking, freight delivery',
        typicalSalaryRange: '$55,000 - $85,000',
        inDemand: true
      },
      {
        title: 'Logistics Coordinator',
        industry: ['Logistics'],
        matchPercentage: 80,
        description: 'Coordinate shipments, manage routes, track deliveries',
        typicalSalaryRange: '$50,000 - $70,000',
        inDemand: true
      },
      {
        title: 'Fleet Operations Supervisor',
        industry: ['Transportation', 'Logistics'],
        matchPercentage: 85,
        description: 'Manage driver teams, route optimization, safety compliance',
        typicalSalaryRange: '$60,000 - $85,000',
        inDemand: true
      }
    ],
    certifications: ['Class 1 or 3 Commercial Driver\'s License']
  },

  // TECHNICAL TRADES
  {
    id: 'vehicle-tech',
    name: 'Vehicle Technician',
    branch: 'All',
    description: 'Vehicle maintenance, diagnostics, repairs',
    transferableSkills: [
      'Automotive Repair',
      'Diagnostics',
      'Electrical Systems',
      'Preventive Maintenance',
      'Parts Management',
      'Technical Documentation',
      'Safety Inspection',
      'Tool Operation'
    ],
    civilianRoles: [
      {
        title: 'Automotive Service Technician',
        industry: ['Automotive'],
        matchPercentage: 95,
        description: 'Diagnose and repair vehicles, maintenance services',
        typicalSalaryRange: '$50,000 - $75,000',
        inDemand: true
      },
      {
        title: 'Heavy Duty Mechanic',
        industry: ['Transportation', 'Construction'],
        matchPercentage: 90,
        description: 'Maintain and repair heavy equipment and trucks',
        typicalSalaryRange: '$60,000 - $90,000',
        inDemand: true
      },
      {
        title: 'Fleet Maintenance Supervisor',
        industry: ['Logistics', 'Transportation'],
        matchPercentage: 85,
        description: 'Oversee vehicle maintenance operations, manage technicians',
        typicalSalaryRange: '$65,000 - $90,000',
        inDemand: true
      }
    ],
    certifications: ['Red Seal Automotive Service Technician', '310T Truck & Coach Technician']
  },
  {
    id: 'aviation-tech',
    name: 'Aviation Technician',
    branch: 'Air Force',
    description: 'Aircraft maintenance, systems repair, quality control',
    transferableSkills: [
      'Aircraft Maintenance',
      'Technical Troubleshooting',
      'Quality Assurance',
      'Technical Documentation',
      'Safety Protocols',
      'Systems Testing',
      'Precision Work',
      'Regulatory Compliance'
    ],
    civilianRoles: [
      {
        title: 'Aircraft Maintenance Engineer (AME)',
        industry: ['Aviation'],
        matchPercentage: 98,
        description: 'Maintain commercial aircraft, inspections, repairs',
        typicalSalaryRange: '$70,000 - $110,000',
        inDemand: true
      },
      {
        title: 'Aerospace Quality Inspector',
        industry: ['Manufacturing', 'Aviation'],
        matchPercentage: 85,
        description: 'Inspect aerospace components, quality assurance',
        typicalSalaryRange: '$60,000 - $85,000',
        inDemand: true
      },
      {
        title: 'Manufacturing Technician',
        industry: ['Manufacturing'],
        matchPercentage: 75,
        description: 'Precision manufacturing, quality control, technical work',
        typicalSalaryRange: '$55,000 - $80,000',
        inDemand: true
      }
    ],
    certifications: ['Aircraft Maintenance Engineer (AME) License - Transport Canada']
  },
  {
    id: 'electrician',
    name: 'Electrical Distribution Technician',
    branch: 'All',
    description: 'Electrical systems installation, maintenance, troubleshooting',
    transferableSkills: [
      'Electrical Wiring',
      'System Troubleshooting',
      'Blueprint Reading',
      'Safety Compliance',
      'Power Distribution',
      'Testing & Diagnostics',
      'Project Planning',
      'Code Compliance'
    ],
    civilianRoles: [
      {
        title: 'Industrial Electrician',
        industry: ['Manufacturing', 'Construction'],
        matchPercentage: 95,
        description: 'Install and maintain industrial electrical systems',
        typicalSalaryRange: '$65,000 - $95,000',
        inDemand: true
      },
      {
        title: 'Utility Line Technician',
        industry: ['Utilities'],
        matchPercentage: 90,
        description: 'Maintain power distribution systems, line work',
        typicalSalaryRange: '$70,000 - $100,000',
        inDemand: true
      },
      {
        title: 'Electrical Project Supervisor',
        industry: ['Construction'],
        matchPercentage: 85,
        description: 'Oversee electrical installations, manage teams',
        typicalSalaryRange: '$75,000 - $105,000',
        inDemand: true
      }
    ],
    certifications: ['Red Seal Electrician (Construction or Industrial)']
  },
  {
    id: 'plumber',
    name: 'Plumber',
    branch: 'All',
    description: 'Plumbing installation, maintenance, and repair',
    transferableSkills: [
      'Pipe Fitting',
      'Blueprint Reading',
      'Problem Diagnosis',
      'System Installation',
      'Welding & Soldering',
      'Code Compliance',
      'Customer Service',
      'Project Estimation'
    ],
    civilianRoles: [
      {
        title: 'Journeyman Plumber',
        industry: ['Construction', 'Utilities'],
        matchPercentage: 95,
        description: 'Commercial and residential plumbing installation and repair',
        typicalSalaryRange: '$60,000 - $90,000',
        inDemand: true
      },
      {
        title: 'Pipefitter',
        industry: ['Manufacturing', 'Utilities'],
        matchPercentage: 90,
        description: 'Install industrial piping systems',
        typicalSalaryRange: '$65,000 - $95,000',
        inDemand: true
      },
      {
        title: 'Facilities Maintenance Supervisor',
        industry: ['Government', 'Utilities'],
        matchPercentage: 80,
        description: 'Oversee building maintenance operations',
        typicalSalaryRange: '$65,000 - $90,000',
        inDemand: true
      }
    ],
    certifications: ['Red Seal Plumber', 'Gas Fitter Certificate']
  },

  // COMMUNICATIONS & IT
  {
    id: 'signals',
    name: 'Information Systems Technician',
    branch: 'All',
    description: 'IT systems, networks, communications, cybersecurity',
    transferableSkills: [
      'Network Administration',
      'System Troubleshooting',
      'Cybersecurity',
      'Help Desk Support',
      'Hardware Maintenance',
      'Radio Communications',
      'Technical Documentation',
      'Security Protocols'
    ],
    civilianRoles: [
      {
        title: 'Network Administrator',
        industry: ['Tech', 'Government'],
        matchPercentage: 90,
        description: 'Manage network infrastructure, troubleshooting, security',
        typicalSalaryRange: '$60,000 - $90,000',
        inDemand: true
      },
      {
        title: 'IT Support Specialist',
        industry: ['Tech', 'All Industries'],
        matchPercentage: 85,
        description: 'Technical support, system maintenance, user assistance',
        typicalSalaryRange: '$50,000 - $70,000',
        inDemand: true
      },
      {
        title: 'Cybersecurity Analyst',
        industry: ['Tech', 'Defense', 'Government'],
        matchPercentage: 85,
        description: 'Monitor security threats, incident response, risk assessment',
        typicalSalaryRange: '$70,000 - $110,000',
        inDemand: true
      },
      {
        title: 'Systems Administrator',
        industry: ['Tech', 'Government'],
        matchPercentage: 80,
        description: 'Manage servers, maintain systems, ensure uptime',
        typicalSalaryRange: '$65,000 - $95,000',
        inDemand: true
      }
    ],
    certifications: ['CompTIA Network+', 'CompTIA Security+', 'CISSP', 'Cisco CCNA']
  },

  // INTELLIGENCE & SECURITY
  {
    id: 'intelligence',
    name: 'Intelligence Operator',
    branch: 'All',
    description: 'Intelligence gathering, analysis, reporting, security',
    transferableSkills: [
      'Data Analysis',
      'Report Writing',
      'Research Skills',
      'Critical Thinking',
      'Briefing Delivery',
      'Security Clearance',
      'Information Management',
      'Threat Assessment'
    ],
    civilianRoles: [
      {
        title: 'Intelligence Analyst',
        industry: ['Government', 'Defense'],
        matchPercentage: 95,
        description: 'Analyze intelligence, produce reports, brief stakeholders',
        typicalSalaryRange: '$65,000 - $100,000',
        inDemand: true
      },
      {
        title: 'Security Analyst',
        industry: ['Cybersecurity', 'Defense'],
        matchPercentage: 85,
        description: 'Threat analysis, security monitoring, incident response',
        typicalSalaryRange: '$70,000 - $105,000',
        inDemand: true
      },
      {
        title: 'Business Intelligence Analyst',
        industry: ['Tech', 'Finance'],
        matchPercentage: 75,
        description: 'Analyze business data, create reports, support decisions',
        typicalSalaryRange: '$60,000 - $90,000',
        inDemand: true
      },
      {
        title: 'Risk Analyst',
        industry: ['Finance', 'Insurance'],
        matchPercentage: 70,
        description: 'Assess risks, analyze data, develop mitigation strategies',
        typicalSalaryRange: '$65,000 - $95,000',
        inDemand: true
      }
    ]
  },

  // MEDICAL
  {
    id: 'medical-tech',
    name: 'Medical Technician',
    branch: 'All',
    description: 'Emergency medical care, patient assessment, treatment',
    transferableSkills: [
      'Emergency Medicine',
      'Patient Assessment',
      'Trauma Care',
      'Medical Documentation',
      'Triage',
      'Pharmacology',
      'Vital Signs Monitoring',
      'Crisis Response'
    ],
    civilianRoles: [
      {
        title: 'Paramedic',
        industry: ['Healthcare', 'Public Safety'],
        matchPercentage: 90,
        description: 'Emergency medical response, patient care, ambulance operations',
        typicalSalaryRange: '$55,000 - $85,000',
        inDemand: true
      },
      {
        title: 'Emergency Room Technician',
        industry: ['Healthcare'],
        matchPercentage: 85,
        description: 'Support ER operations, patient care, equipment management',
        typicalSalaryRange: '$50,000 - $70,000',
        inDemand: true
      },
      {
        title: 'Occupational Health & Safety Coordinator',
        industry: ['All Industries'],
        matchPercentage: 75,
        description: 'Workplace safety, first aid training, incident response',
        typicalSalaryRange: '$55,000 - $80,000',
        inDemand: true
      }
    ],
    certifications: ['Primary Care Paramedic (PCP)', 'Advanced Care Paramedic (ACP)']
  },

  // AVIATION - AIRCREW
  {
    id: 'pilot',
    name: 'Pilot',
    branch: 'Air Force',
    description: 'Aircraft operation, flight planning, crew leadership',
    transferableSkills: [
      'Aviation Operations',
      'Risk Management',
      'Decision Making',
      'Team Leadership',
      'Multi-tasking',
      'Emergency Response',
      'Navigation',
      'Communication'
    ],
    civilianRoles: [
      {
        title: 'Commercial Airline Pilot',
        industry: ['Aviation'],
        matchPercentage: 95,
        description: 'Fly commercial aircraft, passenger and cargo operations',
        typicalSalaryRange: '$80,000 - $200,000+',
        inDemand: true
      },
      {
        title: 'Corporate Pilot',
        industry: ['Aviation'],
        matchPercentage: 90,
        description: 'Fly private aircraft for corporations and executives',
        typicalSalaryRange: '$70,000 - $150,000',
        inDemand: true
      },
      {
        title: 'Aviation Safety Manager',
        industry: ['Aviation'],
        matchPercentage: 75,
        description: 'Oversee safety programs, regulatory compliance, training',
        typicalSalaryRange: '$75,000 - $110,000',
        inDemand: true
      },
      {
        title: 'Flight Operations Manager',
        industry: ['Aviation'],
        matchPercentage: 80,
        description: 'Manage flight operations, scheduling, crew coordination',
        typicalSalaryRange: '$85,000 - $120,000',
        inDemand: true
      }
    ],
    certifications: ['Commercial Pilot License (CPL)', 'Airline Transport Pilot License (ATPL)']
  },

  // NAVAL TRADES
  {
    id: 'marine-engineer',
    name: 'Marine Engineering Technician',
    branch: 'Navy',
    description: 'Ship systems maintenance, propulsion, mechanical systems',
    transferableSkills: [
      'Mechanical Systems',
      'Engine Maintenance',
      'Electrical Systems',
      'Hydraulics',
      'Troubleshooting',
      'Preventive Maintenance',
      'Technical Documentation',
      'Safety Compliance'
    ],
    civilianRoles: [
      {
        title: 'Marine Engineer',
        industry: ['Maritime', 'Utilities'],
        matchPercentage: 95,
        description: 'Maintain ship systems, marine propulsion, operations',
        typicalSalaryRange: '$70,000 - $110,000',
        inDemand: true
      },
      {
        title: 'Power Plant Operator',
        industry: ['Utilities', 'Energy'],
        matchPercentage: 80,
        description: 'Operate power generation equipment, monitor systems',
        typicalSalaryRange: '$75,000 - $105,000',
        inDemand: true
      },
      {
        title: 'Industrial Maintenance Supervisor',
        industry: ['Manufacturing'],
        matchPercentage: 75,
        description: 'Oversee equipment maintenance, manage technicians',
        typicalSalaryRange: '$70,000 - $95,000',
        inDemand: true
      }
    ],
    certifications: ['Fourth Class Power Engineering Certificate', 'Marine Engineering Certificate']
  },

  // ADMINISTRATION
  {
    id: 'hr-admin',
    name: 'Human Resources Administrator',
    branch: 'All',
    description: 'Personnel management, payroll, benefits, recruitment',
    transferableSkills: [
      'HR Administration',
      'Payroll Processing',
      'Benefits Management',
      'Recruitment',
      'Record Keeping',
      'Policy Implementation',
      'Confidentiality',
      'Customer Service'
    ],
    civilianRoles: [
      {
        title: 'HR Coordinator',
        industry: ['All Industries'],
        matchPercentage: 90,
        description: 'Manage HR processes, recruitment, employee records',
        typicalSalaryRange: '$50,000 - $70,000',
        inDemand: true
      },
      {
        title: 'Payroll Administrator',
        industry: ['All Industries'],
        matchPercentage: 85,
        description: 'Process payroll, benefits administration, compliance',
        typicalSalaryRange: '$50,000 - $70,000',
        inDemand: true
      },
      {
        title: 'Office Manager',
        industry: ['All Industries'],
        matchPercentage: 80,
        description: 'Oversee office operations, administration, staff coordination',
        typicalSalaryRange: '$50,000 - $75,000',
        inDemand: true
      }
    ],
    certifications: ['CPHR (Chartered Professional in Human Resources)']
  },

  // COOK/FOOD SERVICES
  {
    id: 'cook',
    name: 'Cook',
    branch: 'All',
    description: 'Food preparation, menu planning, kitchen management',
    transferableSkills: [
      'Food Preparation',
      'Kitchen Management',
      'Inventory Control',
      'Food Safety',
      'Menu Planning',
      'Team Leadership',
      'High-Volume Cooking',
      'Budget Management'
    ],
    civilianRoles: [
      {
        title: 'Executive Chef',
        industry: ['Hospitality'],
        matchPercentage: 85,
        description: 'Lead kitchen operations, menu development, staff management',
        typicalSalaryRange: '$55,000 - $85,000',
        inDemand: true
      },
      {
        title: 'Food Service Manager',
        industry: ['Hospitality', 'Healthcare'],
        matchPercentage: 80,
        description: 'Manage food service operations, catering, institutional kitchens',
        typicalSalaryRange: '$50,000 - $75,000',
        inDemand: true
      },
      {
        title: 'Catering Manager',
        industry: ['Hospitality'],
        matchPercentage: 75,
        description: 'Plan and execute catering events, manage kitchen teams',
        typicalSalaryRange: '$45,000 - $70,000',
        inDemand: true
      }
    ],
    certifications: ['Red Seal Cook', 'Food Safety Certification']
  }
];

// Helper function to search trades
export const searchTrades = (query: string): MilitaryTrade[] => {
  const lowerQuery = query.toLowerCase();
  return militaryTrades.filter(trade =>
    trade.name.toLowerCase().includes(lowerQuery) ||
    trade.description.toLowerCase().includes(lowerQuery) ||
    trade.transferableSkills.some(skill => skill.toLowerCase().includes(lowerQuery))
  );
};

// Get top civilian roles across all trades
export const getTopCivilianRoles = (): { role: string; count: number; avgMatch: number }[] => {
  const roleMap = new Map<string, { count: number; totalMatch: number }>();

  militaryTrades.forEach(trade => {
    trade.civilianRoles.forEach(role => {
      const existing = roleMap.get(role.title);
      if (existing) {
        existing.count++;
        existing.totalMatch += role.matchPercentage;
      } else {
        roleMap.set(role.title, { count: 1, totalMatch: role.matchPercentage });
      }
    });
  });

  return Array.from(roleMap.entries())
    .map(([role, data]) => ({
      role,
      count: data.count,
      avgMatch: Math.round(data.totalMatch / data.count)
    }))
    .sort((a, b) => b.count - a.count);
};
