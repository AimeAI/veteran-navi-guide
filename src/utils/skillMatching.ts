
import { Job } from '@/context/JobContext';
import { supabase } from '@/integrations/supabase/client';

export interface SkillMatch {
  job: Job;
  matchScore: number;
  matchingSkills: string[];
}

/**
 * Calculates the match score between user skills and job skills
 * @param userSkills Array of user skills
 * @param jobSkills Array of job required skills
 * @returns Match score percentage (0-100)
 */
export const calculateSkillMatchScore = (
  userSkills: string[],
  jobSkills: string[]
): { score: number; matchingSkills: string[] } => {
  if (!userSkills.length || !jobSkills.length) {
    return { score: 0, matchingSkills: [] };
  }

  const matchingSkills: string[] = [];
  const normalizedUserSkills = userSkills.map(skill => skill.toLowerCase());
  const normalizedJobSkills = jobSkills.map(skill => skill.toLowerCase());
  
  // Find direct matches
  for (const userSkill of normalizedUserSkills) {
    for (const jobSkill of normalizedJobSkills) {
      if (jobSkill.includes(userSkill) || userSkill.includes(jobSkill)) {
        // Use the original job skill name for display
        const originalJobSkill = jobSkills[normalizedJobSkills.indexOf(jobSkill)];
        if (!matchingSkills.includes(originalJobSkill)) {
          matchingSkills.push(originalJobSkill);
        }
      }
    }
  }
  
  // Calculate score based on matched skills
  const matchPercentage = Math.min(
    100,
    Math.round((matchingSkills.length / jobSkills.length) * 100)
  );
  
  return { score: matchPercentage, matchingSkills };
};

/**
 * Fetches user skills from Supabase
 * @param userId User ID
 * @returns Array of skill names
 */
export const getUserSkills = async (userId: string): Promise<string[]> => {
  if (!userId) return [];
  
  try {
    const { data, error } = await supabase
      .from('user_skills')
      .select('skill_id')
      .eq('user_id', userId);
    
    if (error || !data?.length) {
      return [];
    }
    
    // Fetch the actual skill names
    const skillIds = data.map(item => item.skill_id);
    const { data: skillsData, error: skillsError } = await supabase
      .from('skills')
      .select('skill_name')
      .in('skill_id', skillIds);
    
    if (skillsError || !skillsData?.length) {
      return [];
    }
    
    return skillsData.map(skill => skill.skill_name);
  } catch (error) {
    console.error('Error fetching user skills:', error);
    return [];
  }
};

/**
 * Matches jobs with user skills
 * @param jobs Array of jobs
 * @param userSkills Array of user skills
 * @returns Array of jobs with match scores
 */
export const matchJobsWithSkills = (
  jobs: Job[],
  userSkills: string[]
): SkillMatch[] => {
  if (!jobs.length || !userSkills.length) {
    return [];
  }
  
  return jobs.map(job => {
    const jobSkills = [...(job.requiredSkills || []), ...(job.preferredSkills || [])];
    const { score, matchingSkills } = calculateSkillMatchScore(userSkills, jobSkills);
    
    return {
      job,
      matchScore: score,
      matchingSkills
    };
  })
  .filter(match => match.matchScore > 0)
  .sort((a, b) => b.matchScore - a.matchScore);
};
