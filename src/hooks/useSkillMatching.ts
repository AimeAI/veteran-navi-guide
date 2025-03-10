
import { useState, useEffect, useCallback } from 'react';
import { Job } from '@/context/JobContext';
import { useAuth } from '@/hooks/useAuth';
import { getUserSkills, matchJobsWithSkills, SkillMatch } from '@/utils/skillMatching';

export const useSkillMatching = (jobs: Job[]) => {
  const { user } = useAuth();
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [matchedJobs, setMatchedJobs] = useState<SkillMatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch user skills
  useEffect(() => {
    const fetchSkills = async () => {
      if (user?.id) {
        setIsLoading(true);
        try {
          const skills = await getUserSkills(user.id);
          setUserSkills(skills);
        } catch (error) {
          console.error('Error fetching user skills:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchSkills();
  }, [user]);
  
  // Match jobs with skills
  useEffect(() => {
    if (jobs.length > 0 && userSkills.length > 0) {
      const matches = matchJobsWithSkills(jobs, userSkills);
      setMatchedJobs(matches);
    } else {
      setMatchedJobs([]);
    }
  }, [jobs, userSkills]);
  
  // Function to manually match with provided skills
  const matchWithSkills = useCallback((customSkills: string[]) => {
    if (jobs.length > 0 && customSkills.length > 0) {
      return matchJobsWithSkills(jobs, customSkills);
    }
    return [];
  }, [jobs]);
  
  return {
    userSkills,
    matchedJobs,
    isLoading,
    matchWithSkills
  };
};
