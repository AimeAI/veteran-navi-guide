
import { useState, useEffect, useCallback } from 'react';
import { Job } from '@/context/JobContext';
import { useUser } from '@/context/UserContext';
import { getUserSkills, matchJobsWithSkills, SkillMatch } from '@/utils/skillMatching';

export const useSkillMatching = (jobs: Job[]) => {
  const { user, supabaseUser } = useUser(); // Get both user profile and supabaseUser which has the ID
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [matchedJobs, setMatchedJobs] = useState<SkillMatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchUserSkills = useCallback(async () => {
    if (!supabaseUser) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const skills = await getUserSkills(supabaseUser.id);
      setUserSkills(skills);
    } catch (err) {
      console.error('Error fetching user skills:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch user skills'));
    } finally {
      setIsLoading(false);
    }
  }, [supabaseUser]);
  
  useEffect(() => {
    fetchUserSkills();
  }, [fetchUserSkills]);
  
  useEffect(() => {
    if (userSkills.length && jobs.length) {
      const matches = matchJobsWithSkills(jobs, userSkills);
      setMatchedJobs(matches);
    } else {
      setMatchedJobs([]);
    }
  }, [jobs, userSkills]);
  
  return {
    userSkills,
    matchedJobs,
    isLoading,
    error,
    refetchSkills: fetchUserSkills
  };
};
