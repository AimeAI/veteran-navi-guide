
// Define the JobListing interface
export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requiredSkills?: string[];
  preferredSkills?: string[];
  securityClearanceRequired?: string;
  remote?: boolean;
  jobType?: string;
  industry?: string;
  experienceLevel?: string;
  educationLevel?: string;
  companySize?: string;
  companyRating?: number;
  benefits?: string[];
  requiredMosCodes?: string[];
  clearanceLevel?: string;
  salary?: string | number;
  salaryRange?: string;
  postedDate?: string;
}

// Export alias Job for compatibility
export type Job = JobListing;

// Define UserProfile interface
export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  militaryBranch?: string;
  rank?: string;
  mosId?: string;
  securityClearance?: string;
  skills: string[];
  jobPreferences?: {
    locations?: string[];
    remote?: boolean;
    industry?: string[];
    jobType?: string[];
  };
  photo?: string;
  serviceYears?: number;
}

// Mock current user profile for testing
export const currentUserProfile: UserProfile = {
  id: 'usr-123',
  email: 'veteran@example.com',
  firstName: 'John',
  lastName: 'Doe',
  militaryBranch: 'Army',
  rank: 'E-5 Sergeant',
  mosId: '11B',
  securityClearance: 'Secret',
  skills: [
    'Leadership',
    'Project Management',
    'Logistics',
    'Security Operations',
    'Communication',
    'Team Building',
    'Problem Solving'
  ],
  jobPreferences: {
    locations: ['Toronto, ON', 'Remote'],
    remote: true,
    industry: ['Technology', 'Defense', 'Security'],
    jobType: ['Full-time', 'Contract']
  }
};

// Result of a recommendation calculation
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

// Match score calculation algorithm
export const calculateMatchScore = (job: JobListing, profile: UserProfile): { score: number; details: any } => {
  let score = 0;
  const skillMatches: string[] = [];
  const mosCodeMatches: string[] = [];
  let locationMatch = false;
  let clearanceMatch = false;

  // Match skills
  const userSkills = profile.skills.map(s => s.toLowerCase());
  if (job.requiredSkills) {
    const jobSkills = job.requiredSkills.map(s => s.toLowerCase());
    for (const skill of userSkills) {
      for (const jobSkill of jobSkills) {
        if (jobSkill.includes(skill) || skill.includes(jobSkill)) {
          skillMatches.push(skill);
          score += 10;
          break;
        }
      }
    }
  }

  // Match MOS codes
  if (job.requiredMosCodes && profile.mosId) {
    for (const mosCode of job.requiredMosCodes) {
      if (mosCode === profile.mosId) {
        mosCodeMatches.push(mosCode);
        score += 20;
      }
    }
  }

  // Match location
  if (profile.jobPreferences?.locations) {
    for (const location of profile.jobPreferences.locations) {
      if (job.location.toLowerCase().includes(location.toLowerCase()) || 
          (location.toLowerCase() === 'remote' && job.remote)) {
        locationMatch = true;
        score += 15;
        break;
      }
    }
  }

  // Match security clearance
  if (job.clearanceLevel && profile.securityClearance) {
    if (job.clearanceLevel.toLowerCase() === profile.securityClearance.toLowerCase()) {
      clearanceMatch = true;
      score += 15;
    }
  }

  // Add small bonus for job type match
  if (job.jobType && profile.jobPreferences?.jobType) {
    for (const type of profile.jobPreferences.jobType) {
      if (job.jobType.toLowerCase().includes(type.toLowerCase())) {
        score += 5;
        break;
      }
    }
  }

  // Add small bonus for industry match
  if (job.industry && profile.jobPreferences?.industry) {
    for (const industry of profile.jobPreferences.industry) {
      if (job.industry.toLowerCase().includes(industry.toLowerCase())) {
        score += 5;
        break;
      }
    }
  }

  // Normalize to 100
  score = Math.min(100, score);

  return {
    score,
    details: {
      skillMatches,
      mosCodeMatches,
      locationMatch,
      clearanceMatch
    }
  };
};

// Add simple job matching algorithm for skills-based matching
export const calculateJobMatch = (
  job: JobListing,
  userSkills: string[],
  userPreferences: {
    location?: string;
    remote?: boolean;
    industry?: string;
    jobType?: string;
  }
): number => {
  let score = 0;
  const normalizedUserSkills = userSkills.map(skill => skill.toLowerCase());
  
  // Match required skills
  if (job.requiredSkills) {
    const normalizedJobSkills = job.requiredSkills.map(skill => skill.toLowerCase());
    const matchingSkills = normalizedUserSkills.filter(skill => 
      normalizedJobSkills.some(jobSkill => jobSkill.includes(skill))
    );
    
    score += (matchingSkills.length / job.requiredSkills.length) * 50;
  }
  
  // Match preferred skills
  if (job.preferredSkills) {
    const normalizedJobSkills = job.preferredSkills.map(skill => skill.toLowerCase());
    const matchingSkills = normalizedUserSkills.filter(skill => 
      normalizedJobSkills.some(jobSkill => jobSkill.includes(skill))
    );
    
    score += (matchingSkills.length / job.preferredSkills.length) * 25;
  }
  
  // Match location preference
  if (userPreferences.location && job.location.toLowerCase().includes(userPreferences.location.toLowerCase())) {
    score += 10;
  }
  
  // Match remote preference
  if (userPreferences.remote !== undefined && job.remote === userPreferences.remote) {
    score += 10;
  }
  
  // Match industry preference
  if (userPreferences.industry && job.industry && 
      job.industry.toLowerCase().includes(userPreferences.industry.toLowerCase())) {
    score += 5;
  }
  
  // Match job type preference
  if (userPreferences.jobType && job.jobType && 
      job.jobType.toLowerCase() === userPreferences.jobType.toLowerCase()) {
    score += 5;
  }
  
  return Math.min(100, score);
};

// Function to get job recommendations based on user profile
export const getJobRecommendations = (
  profile: UserProfile,
  jobs: JobListing[]
): RecommendationResult[] => {
  const recommendations: RecommendationResult[] = [];
  
  for (const job of jobs) {
    const { score, details } = calculateMatchScore(job, profile);
    
    if (score > 0) {
      recommendations.push({
        job,
        matchScore: score,
        matchDetails: details
      });
    }
  }
  
  // Sort by score (highest first)
  return recommendations.sort((a, b) => b.matchScore - a.matchScore);
};

// Function to get job recommendations based on user skills (backward compatibility)
export const getJobRecommendationsForSkills = (
  jobs: JobListing[],
  userSkills: string[],
  userPreferences: {
    location?: string;
    remote?: boolean;
    industry?: string;
    jobType?: string;
  }
): { job: JobListing; score: number }[] => {
  const scoredJobs = jobs.map(job => ({
    job,
    score: calculateJobMatch(job, userSkills, userPreferences)
  }));
  
  // Sort by score (highest first)
  return scoredJobs.sort((a, b) => b.score - a.score);
};
