
// If this file doesn't exist yet, we'll create it with the JobListing interface

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
  // Add the missing properties
  salary?: string | number;
  salaryRange?: string;
  postedDate?: string;
}

// Add a simple job matching algorithm for skills-based matching
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
