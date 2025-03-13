
import { JobListing, UserProfile } from './types';

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
