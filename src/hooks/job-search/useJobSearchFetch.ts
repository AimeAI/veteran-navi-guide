
import { useCallback } from 'react';
import { searchJobBankJobs, getNOCCodesForSkill } from '@/utils/jobBankApi';
import { measurePerformance } from '@/utils/performanceUtils';
import { JobSearchParams } from './types';
import { Job } from '@/context/JobContext';
import { getJobsFromSupabase } from '@/utils/supabaseClient';
import { toast } from 'sonner';

export const useJobSearchFetch = () => {
  const convertMilitarySkillsToKeywords = useCallback((militarySkills?: string[]): string => {
    if (!militarySkills || militarySkills.length === 0) return '';
    
    const nocCodes: string[] = [];
    militarySkills.forEach(skill => {
      const codes = getNOCCodesForSkill(skill);
      nocCodes.push(...codes);
    });
    
    return nocCodes.join(',');
  }, []);

  const processKeywords = useCallback((keywords: string | undefined): { 
    cleanKeywords: string, 
    skills: string[] 
  } => {
    if (!keywords) return { cleanKeywords: '', skills: [] };
    
    const skillMatches = keywords.match(/skill:([a-z]+)/g) || [];
    const skills = skillMatches.map(s => s.replace('skill:', ''));
    
    const cleanKeywords = keywords.replace(/skill:[a-z]+,?/g, '').trim();
    
    return { cleanKeywords, skills };
  }, []);

  const fetchJobs = useCallback(async (params: JobSearchParams): Promise<{
    jobs: Job[],
    totalPages: number,
    totalJobs: number
  }> => {
    console.log("Searching for jobs with params:", params);
    
    try {
      // First try to get jobs directly from Supabase
      const supabaseParams = {
        keywords: params.keywords,
        location: params.location,
        remote: params.remote,
        category: params.industry,
        jobType: params.jobType,
        limit: 50,
        offset: ((params.page || 1) - 1) * 50
      };
      
      const { jobs: supabaseJobs, count: supabaseCount } = await getJobsFromSupabase(supabaseParams);
      
      if (supabaseJobs && supabaseJobs.length > 0) {
        console.log(`Found ${supabaseJobs.length} jobs in Supabase`);
        
        // Process skills matching if needed
        if (params.skills && params.skills.length > 0) {
          const jobsWithScores = supabaseJobs.map(job => {
            const searchSkills = params.skills || [];
            const matchingSkills = job.requiredSkills.filter(jobSkill =>
              searchSkills.some(searchSkill => 
                jobSkill.toLowerCase().includes(searchSkill.toLowerCase()) ||
                searchSkill.toLowerCase().includes(jobSkill.toLowerCase())
              )
            );
            
            if (matchingSkills.length > 0) {
              return {
                ...job,
                matchingSkills,
                matchScore: Math.round((matchingSkills.length / Math.max(job.requiredSkills.length, 1)) * 100)
              };
            }
            return job;
          });
          
          return {
            jobs: jobsWithScores,
            totalPages: Math.ceil(supabaseCount / 50),
            totalJobs: supabaseCount
          };
        }
        
        return {
          jobs: supabaseJobs,
          totalPages: Math.ceil(supabaseCount / 50),
          totalJobs: supabaseCount
        };
      }
      
      // If no Supabase jobs, try Job Bank for Canada
      if (params.country === 'canada') {
        const { keywords, skills } = params;
        let effectiveKeywords = keywords;
        
        if (keywords && keywords.includes("skill:")) {
          const { cleanKeywords, skills: extractedSkills } = processKeywords(keywords);
          const skillKeywords = convertMilitarySkillsToKeywords(extractedSkills);
          
          effectiveKeywords = cleanKeywords ? 
            `${cleanKeywords} ${skillKeywords}` : skillKeywords;
        }
        
        const jobBankParams = {
          keywords: effectiveKeywords,
          location: params.location,
          distance: params.radius,
          page: params.page || 1,
          skills: params.skills,
        };
        
        // Measure the performance of the job search API call
        const jobBankResults = await measurePerformance(
          'Job Bank API Search',
          searchJobBankJobs,
          jobBankParams
        );
        
        if (jobBankResults.jobs && jobBankResults.jobs.length > 0) {
          console.log(`Found ${jobBankResults.jobs.length} Job Bank jobs`);
          
          if (params.skills && params.skills.length > 0) {
            jobBankResults.jobs = jobBankResults.jobs.map(job => {
              const searchSkills = params.skills || [];
              const matchingSkills = job.requiredSkills.filter(jobSkill =>
                searchSkills.some(searchSkill => 
                  jobSkill.toLowerCase().includes(searchSkill.toLowerCase()) ||
                  searchSkill.toLowerCase().includes(jobSkill.toLowerCase())
                )
              );
              
              if (matchingSkills.length > 0) {
                return {
                  ...job,
                  matchingSkills,
                  matchScore: Math.round((matchingSkills.length / Math.max(job.requiredSkills.length, 1)) * 100)
                };
              }
              return job;
            });
          }
          
          return {
            jobs: jobBankResults.jobs,
            totalPages: jobBankResults.totalPages,
            totalJobs: jobBankResults.totalJobs
          };
        }
      }
      
      // If we got here, no jobs were found from any source
      throw new Error('No jobs found matching your criteria');
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error(`Job search error: ${error.message}`);
      throw error;
    }
  }, [convertMilitarySkillsToKeywords, processKeywords]);

  return {
    fetchJobs,
    convertMilitarySkillsToKeywords,
    processKeywords
  };
};
