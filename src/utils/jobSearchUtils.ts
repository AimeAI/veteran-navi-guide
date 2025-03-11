
import { getNOCCodesForSkill } from './jobBankApi';

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
}, page: number): string => {
  const skillsKey = params.skills && params.skills.length > 0 
    ? params.skills.sort().join(',') 
    : '';
  
  return `${params.country || 'canada'}:${params.keywords || ''}:${params.location || ''}:${params.radius || 50}:${params.jobType || ''}:${params.industry || ''}:${skillsKey}:${page}`;
};

export const convertMilitarySkillsToKeywords = (militarySkills?: string[]): string => {
  if (!militarySkills || militarySkills.length === 0) return '';
  
  const nocCodes: string[] = [];
  militarySkills.forEach(skill => {
    const codes = getNOCCodesForSkill(skill);
    nocCodes.push(...codes);
  });
  
  return nocCodes.join(',');
};

export const matchSkillsWithJobRequirements = (job: any, skills?: string[]) => {
  if (!skills || skills.length === 0 || !job.requiredSkills) return job;
  
  const matchingSkills = job.requiredSkills.filter((jobSkill: string) =>
    skills.some(searchSkill => 
      jobSkill.toLowerCase().includes(searchSkill.toLowerCase()) ||
      searchSkill.toLowerCase().includes(jobSkill.toLowerCase())
    )
  );
  
  if (matchingSkills.length > 0) {
    return {
      ...job,
      matchingSkills
    };
  }
  
  return job;
};
