
import { getNOCCodesForSkill } from './jobBankApi';
import { Job } from '@/types/job';

/**
 * Generate a unique cache key for job search parameters
 * @param params - Search parameters
 * @param page - Current page
 * @returns Cache key string
 */
export const getCacheKey = (params: {
  keywords?: string;
  location?: string;
  radius?: number;
  jobType?: string;
  industry?: string;
  experienceLevel?: string;
  educationLevel?: string;
  remote?: boolean;
  country?: "us" | "canada";
  skills?: string[];
  salaryRange?: string;
  sortBy?: string;
}, page: number): string => {
  // Sort skills alphabetically for consistent keys regardless of order
  const skillsKey = params.skills && params.skills.length > 0 
    ? params.skills.sort().join(',') 
    : '';
  
  // Include all parameters in the cache key
  return [
    params.country || 'canada',
    params.keywords || '',
    params.location || '',
    params.radius || 50,
    params.jobType || '',
    params.industry || '',
    params.experienceLevel || '',
    params.educationLevel || '',
    params.remote ? 'remote' : '',
    params.salaryRange || '',
    params.sortBy || 'relevant',
    skillsKey,
    `page${page}`
  ].join(':');
};

/**
 * Convert military skills to keyword search terms
 * @param militarySkills - Array of military skills
 * @returns Formatted keyword string
 */
export const convertMilitarySkillsToKeywords = (militarySkills?: string[]): string => {
  if (!militarySkills || militarySkills.length === 0) return '';
  
  const nocCodes: string[] = [];
  militarySkills.forEach(skill => {
    const codes = getNOCCodesForSkill(skill);
    nocCodes.push(...codes);
  });
  
  return nocCodes.join(',');
};

/**
 * Match job requirements with user skills
 * @param job - Job to check
 * @param skills - Skills to match
 * @returns Job with matching skills or null if no match
 */
export const matchSkillsWithJobRequirements = (job: Job, skills?: string[]): Job | null => {
  if (!skills || skills.length === 0 || !job.requiredSkills) return job;
  
  const jobRequiredSkills = job.requiredSkills || [];
  const jobPreferredSkills = job.preferredSkills || [];
  const allJobSkills = [...jobRequiredSkills, ...jobPreferredSkills].map(skill => skill.toLowerCase());
  
  const matchingSkills: string[] = [];
  const skillScores: Record<string, number> = {};
  
  // Process each skill in the search terms
  skills.forEach(searchSkill => {
    const searchSkillLower = searchSkill.toLowerCase();
    
    // Check for exact matches
    const exactMatch = allJobSkills.find(jobSkill => 
      jobSkill === searchSkillLower ||
      jobSkill.includes(searchSkillLower) || 
      searchSkillLower.includes(jobSkill)
    );
    
    if (exactMatch) {
      const originalSkill = [...jobRequiredSkills, ...jobPreferredSkills].find(
        s => s.toLowerCase() === exactMatch
      ) || exactMatch;
      
      if (!matchingSkills.includes(originalSkill)) {
        matchingSkills.push(originalSkill);
        // Higher score for required skills
        skillScores[originalSkill] = jobRequiredSkills.includes(originalSkill) ? 2 : 1;
      }
      return;
    }
    
    // Check for partial matches using more sophisticated algorithm
    allJobSkills.forEach(jobSkill => {
      // Calculate match score between search skill and job skill
      const searchWords = searchSkillLower.split(/\s+/);
      const jobWords = jobSkill.split(/\s+/);
      
      let matchScore = 0;
      searchWords.forEach(searchWord => {
        jobWords.forEach(jobWord => {
          // Exact word match
          if (searchWord === jobWord) {
            matchScore += 1;
            return;
          }
          
          // Contains or substring match
          if (searchWord.length > 3 && jobWord.length > 3) {
            if (searchWord.includes(jobWord) || jobWord.includes(searchWord)) {
              matchScore += 0.8;
              return;
            }
            
            // Beginning of word match (good for matching prefixes)
            if (searchWord.slice(0, 4) === jobWord.slice(0, 4)) {
              matchScore += 0.6;
              return;
            }
          }
        });
      });
      
      // Only consider it a match if score is significant
      if (matchScore > 0.5) {
        const originalSkill = [...jobRequiredSkills, ...jobPreferredSkills].find(
          s => s.toLowerCase() === jobSkill
        ) || jobSkill;
        
        if (!matchingSkills.includes(originalSkill)) {
          matchingSkills.push(originalSkill);
          // Factor score quality and whether it's required or preferred
          skillScores[originalSkill] = jobRequiredSkills.includes(originalSkill) 
            ? matchScore * 2 
            : matchScore;
        }
      }
    });
  });
  
  if (matchingSkills.length > 0) {
    // Sort matching skills by score (highest first)
    matchingSkills.sort((a, b) => skillScores[b] - skillScores[a]);
    
    // Calculate a match score based on the number and quality of matches
    const totalScore = Object.values(skillScores).reduce((sum, score) => sum + score, 0);
    
    return {
      ...job,
      matchingSkills,
      matchScore: Math.min(100, Math.round(totalScore * 10)), // Scale to a 0-100 score
    };
  }
  
  return null;
};

/**
 * Format a standard salary range for display
 * @param salaryRange - Salary range code
 * @returns Formatted salary range string
 */
export const formatSalaryRange = (salaryRange?: string): string => {
  switch (salaryRange) {
    case 'range1': return 'Under $30,000';
    case 'range2': return '$30,000 - $50,000';
    case 'range3': return '$50,000 - $75,000';
    case 'range4': return '$75,000 - $100,000';
    case 'range5': return 'Over $100,000';
    default: return 'Salary not specified';
  }
};
