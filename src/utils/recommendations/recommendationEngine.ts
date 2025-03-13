
import { JobListing, UserProfile, RecommendationResult } from './types';
import { calculateMatchScore, calculateJobMatch } from './matchScoring';

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
