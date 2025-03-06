// Types for our data
export interface UserProfile {
  id: string;
  name: string;
  skills: string[];
  militaryBackground: {
    branch: string;
    rank: string;
    yearsOfService: number;
    mosCodes: string[];
  };
  securityClearance?: string;
  preferredLocations?: string[];
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requiredSkills?: string[];
  preferredSkills?: string[];
  requiredMosCodes?: string[];
  securityClearanceRequired?: string;
  remote?: boolean;
  jobType?: string;
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

// Mock user profile data
export const currentUserProfile: UserProfile = {
  id: "user1",
  name: "John Doe",
  skills: ["leadership", "communication", "project management", "security", "logistics"],
  militaryBackground: {
    branch: "Canadian Army",
    rank: "Sergeant",
    yearsOfService: 8,
    mosCodes: ["00161", "00168"],
  },
  securityClearance: "Secret",
  preferredLocations: ["Ottawa, ON", "Toronto, ON", "Remote - Canada"]
};

// Basic recommendation algorithm
export function getRecommendedJobs(
  userProfile: UserProfile,
  jobListings: JobListing[]
): RecommendationResult[] {
  // Calculate match scores for each job
  const recommendedJobs = jobListings.map(job => {
    // Initialize match details
    const matchDetails = {
      skillMatches: [] as string[],
      mosCodeMatches: [] as string[],
      locationMatch: false,
      clearanceMatch: false
    };
    
    // Check skill matches
    const skillMatches = userProfile.skills.filter(skill => 
      job.requiredSkills.includes(skill) || 
      (job.preferredSkills && job.preferredSkills.includes(skill))
    );
    matchDetails.skillMatches = skillMatches;
    
    // Check MOS code matches
    const mosCodeMatches = userProfile.militaryBackground.mosCodes.filter(mosCode => 
      job.requiredMosCodes ? job.requiredMosCodes.includes(mosCode) : false
    );
    matchDetails.mosCodeMatches = mosCodeMatches;
    
    // Check location match
    const locationMatch = !userProfile.preferredLocations 
      ? false 
      : userProfile.preferredLocations.some(loc => 
          job.location.includes(loc) || 
          (job.remote && userProfile.preferredLocations.some(loc => loc.includes("Remote")))
        );
    matchDetails.locationMatch = locationMatch;
    
    // Check security clearance match
    const clearanceMatch = !job.securityClearanceRequired 
      ? true 
      : userProfile.securityClearance === job.securityClearanceRequired;
    matchDetails.clearanceMatch = clearanceMatch;
    
    // Calculate overall match score (weighted)
    const skillScore = (skillMatches.length / Math.max(job.requiredSkills.length, 1)) * 50;
    const mosScore = mosCodeMatches.length > 0 ? 20 : 0;
    const locationScore = locationMatch ? 15 : 0;
    const clearanceScore = clearanceMatch ? 15 : 0;
    
    const matchScore = skillScore + mosScore + locationScore + clearanceScore;
    
    return {
      job,
      matchScore,
      matchDetails
    };
  });
  
  // Sort by match score (descending)
  return recommendedJobs.sort((a, b) => b.matchScore - a.matchScore);
}
