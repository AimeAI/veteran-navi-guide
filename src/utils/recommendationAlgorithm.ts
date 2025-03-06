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
}

export function calculateMatchScore(user: UserProfile, job: Job): number {
  let score = 0;

  // Weight for each factor
  const skillWeight = 0.3;
  const experienceWeight = 0.25;
  const locationWeight = 0.15;
  const jobTypeWeight = 0.15;
  const salaryWeight = 0.15;

  // Skill matching
  const commonSkills = user.skills.filter(skill => job.skills.includes(skill));
  score += skillWeight * (commonSkills.length / Math.max(user.skills.length, job.skills.length));

  // Experience matching
  if (user.experience >= 0) {
    // Normalize experience to a 0-1 scale based on job's experience level
    let experienceScore = 0;
    if (job.experienceLevel === "Entry-level" && user.experience <= 2) {
      experienceScore = 1;
    } else if (job.experienceLevel === "Mid-level" && user.experience >= 3 && user.experience <= 7) {
      experienceScore = 1;
    } else if (job.experienceLevel === "Senior-level" && user.experience > 7) {
      experienceScore = 1;
    } else {
      experienceScore = Math.max(0, 1 - Math.abs(user.experience - 5) / 10); // Adjust 5 and 10 as needed
    }
    score += experienceWeight * experienceScore;
  }

  // Location matching
  if (user.location && job.location) {
    const locationMatch = user.location.toLowerCase().includes(job.location.toLowerCase()) || job.location.toLowerCase().includes(user.location.toLowerCase());
    if (locationMatch) {
      score += locationWeight;
    }
  }

  // Job type matching
  if (user.jobPreferences.roles.length > 0) {
    const jobTypeMatch = user.jobPreferences.roles.some(role => job.jobType.toLowerCase().includes(role.toLowerCase()));
    if (jobTypeMatch) {
      score += jobTypeWeight;
    }
  }

  // Salary matching
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

  // Regular expression to find @[name] mentions
  const mentionRegex = /@\[([^\]]+)\]/g;
  let match;

  while ((match = mentionRegex.exec(text)) !== null) {
    // Text before the mention
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
      // If user not found, treat as regular text
      segments.push({
        type: 'text',
        content: match[0],
      });
    }

    lastIndex = mentionRegex.lastIndex;
  }

  // Remaining text after last mention
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
