
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  benefits: string[];
  salary: [number, number];
  industry: string;
  experienceLevel: string;
  jobType: string;
  postedDate: string;
  applicationDeadline: string;
  contactEmail: string;
  contactPhone: string;
  companyLogo?: string;
  remote: boolean;
  skills: string[];
  education: string;
  certifications: string[];
  militaryExperienceRequired: boolean;
  securityClearanceRequired: boolean;
  veteranFriendly: boolean;
  hiringManager: string;
  team: string;
  responsibilities: string[];
  culture: string;
  perks: string[];
  diversityAndInclusion: string;
  employeeTestimonials: string[];
  applicationProcess: string;
  companyValues: string[];
  interviewProcess: string;
  disabilityAccommodations: string;
  equalOpportunityStatement: string;
  relocationAssistance: boolean;
  travelRequirements: string;
  sponsorshipAvailable: boolean;
  companyOverview: string;
  companyMission: string;
  companyVision: string;
  companyHistory: string;
  employeeBenefits: string[];
  ptoPolicy: string;
  professionalDevelopment: string;
  careerPath: string;
  workLifeBalance: string;
  employeeRecognition: string;
  healthAndWellness: string;
  financialBenefits: string[];
  communityInvolvement: string;
  innovation: string;
  customerFocus: string;
  environmentalSustainability: string;
  ethicalPractices: string;
  globalPresence: string;
  marketPosition: string;
  awardsAndRecognition: string[];
  futureGrowth: string;
  tags: string[];
}

export interface UserProfile {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  location?: string;
  militaryBranch?: string;
  yearsOfService?: string;
  mosId?: string; // Military Occupational Specialty ID
  rank?: string;
  skills: string[];
  experience: number;
  jobPreferences: {
    roles: string[];
    locations: string[];
    remote: boolean;
    salary: [number, number];
    industries: string[];
  };
  education: {
    level: string;
    field?: string;
    institution?: string;
  };
  certifications: string[];
  availability: string;
  jobHistory?: {
    title: string;
    company: string;
    duration: string;
    description: string;
  }[];
  photo?: string;
  serviceYears?: number;
  clearanceLevel?: string;
  securityClearance?: string;
  militaryBackground?: {
    branch: string;
    rank: string;
    mosCodes: string[];
  };
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  requiredMosCodes?: string[];
  securityClearanceRequired?: string;
  clearanceLevel?: string; // Add this property to fix the TypeScript error
  remote: boolean;
  jobType: string;
  industry?: string;
  experienceLevel?: string;
  educationLevel?: string;
  companySize?: string;
  companyRating?: number;
  benefits?: string[];
}

export interface RecommendationResult {
  job: JobListing;
  matchScore: number;
  matchDetails: {
    skillMatches: string[];
    mosCodeMatches: string[];
    locationMatch: boolean;
    clearanceMatch: boolean;
  };
}

export const currentUserProfile: UserProfile = {
  id: "veteran-001",
  name: "James Wilson",
  email: "james.wilson@example.com",
  skills: ["leadership", "communication", "technology", "logistics", "problem solving"],
  experience: 5,
  militaryBranch: "Canadian Armed Forces",
  rank: "Master Corporal",
  mosId: "00168", // Supply Technician
  location: "Ottawa, ON",
  jobPreferences: {
    roles: ["logistics", "management", "technology"],
    locations: ["Ottawa", "Toronto", "Remote"],
    remote: true,
    salary: [60000, 90000],
    industries: ["technology", "defense", "logistics"]
  },
  education: {
    level: "Bachelor's Degree",
    field: "Business Administration",
    institution: "Royal Military College"
  },
  certifications: ["Project Management Professional", "Supply Chain Management"],
  availability: "immediate",
  securityClearance: "Secret"
};

export function getRecommendedJobs(user: UserProfile, jobs: JobListing[]): RecommendationResult[] {
  return jobs.map(job => {
    let matchScore = 0;
    const skillMatches: string[] = [];
    const mosCodeMatches: string[] = [];
    
    user.skills.forEach(skill => {
      const requiredMatch = job.requiredSkills.some(
        reqSkill => reqSkill.toLowerCase() === skill.toLowerCase()
      );
      const preferredMatch = job.preferredSkills.some(
        prefSkill => prefSkill.toLowerCase() === skill.toLowerCase()
      );
      
      if (requiredMatch) {
        skillMatches.push(skill);
        matchScore += 15;
      } else if (preferredMatch) {
        skillMatches.push(skill);
        matchScore += 8;
      }
    });
    
    const hasMosMatch = job.requiredMosCodes?.some(
      code => code === user.mosId
    );
    
    if (hasMosMatch) {
      mosCodeMatches.push(user.mosId || "");
      matchScore += 25;
    }
    
    const locationMatch = user.location?.includes(job.location) || 
                        job.location.includes(user.location || "") ||
                        job.remote && user.jobPreferences.remote;
    
    if (locationMatch) {
      matchScore += 20;
    }
    
    const clearanceMatch = !job.securityClearanceRequired || 
                         (user.securityClearance === job.securityClearanceRequired);
    
    if (clearanceMatch) {
      matchScore += 15;
    }
    
    matchScore = Math.min(100, matchScore);
    
    return {
      job,
      matchScore,
      matchDetails: {
        skillMatches,
        mosCodeMatches,
        locationMatch,
        clearanceMatch
      }
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
}

export function calculateMatchScore(user: UserProfile, job: Job): number {
  let score = 0;

  const skillWeight = 0.3;
  const experienceWeight = 0.25;
  const locationWeight = 0.15;
  const jobTypeWeight = 0.15;
  const salaryWeight = 0.15;

  const commonSkills = user.skills.filter(skill => job.skills.includes(skill));
  score += skillWeight * (commonSkills.length / Math.max(user.skills.length, job.skills.length));

  if (user.experience >= 0) {
    let experienceScore = 0;
    if (job.experienceLevel === "Entry-level" && user.experience <= 2) {
      experienceScore = 1;
    } else if (job.experienceLevel === "Mid-level" && user.experience >= 3 && user.experience <= 7) {
      experienceScore = 1;
    } else if (job.experienceLevel === "Senior-level" && user.experience > 7) {
      experienceScore = 1;
    } else {
      experienceScore = Math.max(0, 1 - Math.abs(user.experience - 5) / 10);
    }
    score += experienceWeight * experienceScore;
  }

  if (user.location && job.location) {
    const locationMatch = user.location.toLowerCase().includes(job.location.toLowerCase()) || job.location.toLowerCase().includes(user.location.toLowerCase());
    if (locationMatch) {
      score += locationWeight;
    }
  }

  if (user.jobPreferences.roles.length > 0) {
    const jobTypeMatch = user.jobPreferences.roles.some(role => job.jobType.toLowerCase().includes(role.toLowerCase()));
    if (jobTypeMatch) {
      score += jobTypeWeight;
    }
  }

  if (user.jobPreferences.salary) {
    const [minSalary, maxSalary] = user.jobPreferences.salary;
    if (job.salary[0] >= minSalary && job.salary[1] <= maxSalary) {
      score += salaryWeight;
    }
  }

  return score;
}

export const parseTextForMentions = (text: string, users: { id: string; name: string }[]) => {
  const segments: TextSegment[] = [];
  let lastIndex = 0;

  const mentionRegex = /@\[([^\]]+)\]/g;
  let match;

  while ((match = mentionRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: 'text',
        content: text.substring(lastIndex, match.index),
      });
    }

    const userId = match[1];
    const user = users.find((u) => u.id === userId);

    if (user) {
      segments.push({
        type: 'mention',
        content: match[0],
        mentionData: user,
      });
    } else {
      segments.push({
        type: 'text',
        content: match[0],
      });
    }

    lastIndex = mentionRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push({
      type: 'text',
      content: text.substring(lastIndex),
    });
  }

  return segments;
};

export type TextSegment =
  | {
      type: 'text';
      content: string;
    }
  | {
      type: 'mention';
      content: string;
      mentionData: MentionedUser;
    };

export interface MentionedUser {
  id: string;
  name: string;
}
