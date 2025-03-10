import { mockJobs } from "./mockJobs";
import { Job } from "@/context/JobContext";
import { JobListing } from "@/utils/recommendationAlgorithm";
import { getJobsFromSupabase } from "@/utils/supabaseClient";
import { searchJobBankJobs } from "@/utils/jobBankApi";

interface SearchParams {
  keywords?: string[];
  locations?: string[];
  jobType?: string;
  mosCodes?: string[];
  clearanceLevel?: string[];
  remote?: boolean;
  militarySkills?: string[];
  radius?: number;
  industry?: string;
  experienceLevel?: string;
  educationLevel?: string;
  companySize?: string;
  companyRating?: number;
  benefits?: string[];
  useLightcastApi?: boolean;
  country?: "us" | "canada";
  useJobicy?: boolean;
  skills?: string[];
}

export const searchJobs = async (params: SearchParams): Promise<Job[]> => {
  let allJobs: Job[] = [];
  
  if (params.useJobicy) {
    try {
      const supabaseParams = {
        source: 'jobicy',
        keywords: params.keywords?.join(' '),
        location: params.locations?.[0],
        remote: params.remote,
        category: params.industry,
        jobType: params.jobType,
        limit: 50,
      };
      
      const { jobs: jobicyJobs } = await getJobsFromSupabase(supabaseParams);
      
      if (jobicyJobs.length > 0) {
        console.log(`Retrieved ${jobicyJobs.length} Jobicy jobs from Supabase`);
        allJobs = [...allJobs, ...jobicyJobs];
      }
    } catch (error) {
      console.error('Error fetching Jobicy jobs from Supabase:', error);
    }
  }
  
  if (params.country === 'canada') {
    try {
      const jobBankParams = {
        keywords: params.keywords?.join(' ') || '',
        location: params.locations?.[0] || '',
        distance: params.radius,
        page: 1,
        skills: params.skills,
      };
      
      const jobBankResult = await searchJobBankJobs(jobBankParams);
      
      if (jobBankResult.jobs.length > 0) {
        console.log(`Retrieved ${jobBankResult.jobs.length} Job Bank jobs`);
        allJobs = [...allJobs, ...jobBankResult.jobs];
      }
    } catch (error) {
      console.error('Error fetching Job Bank jobs:', error);
    }
  }
  
  if (allJobs.length === 0) {
    console.log('Using mock job data as fallback');
    allJobs = filterMockJobs(params) as Job[];
  }
  
  const uniqueJobs = Array.from(
    new Map(allJobs.map(job => [job.id, job])).values()
  );
  
  console.log(`Returning ${uniqueJobs.length} jobs after deduplication`);
  return uniqueJobs;
};

const filterMockJobs = (params: SearchParams): JobListing[] => {
  const jobsWithRequiredProps: JobListing[] = mockJobs.map((job: JobListing) => ({
    ...job,
    category: job.industry?.toLowerCase() || 'other',
    salaryRange: getSalaryRange(job),
    clearanceLevel: job.clearanceLevel || job.securityClearanceRequired || 'none',
    mosCode: job.requiredMosCodes?.[0] || '',
    industry: job.industry || '',
    experienceLevel: job.experienceLevel || '',
    educationLevel: job.educationLevel || '',
    date: job.postedDate || new Date().toISOString(),
    remote: job.remote !== undefined ? job.remote : false,
  }));

  let filteredJobs = [...jobsWithRequiredProps];

  if (params.country) {
    const canadianLocations = ['toronto', 'vancouver', 'montreal', 'calgary', 'ottawa', 'edmonton', 'winnipeg', 'canada'];
    const usLocations = ['new york', 'los angeles', 'chicago', 'houston', 'phoenix', 'usa', 'united states'];
    
    filteredJobs = filteredJobs.filter(job => {
      const jobLocationLower = job.location.toLowerCase();
      if (params.country === 'canada') {
        return canadianLocations.some(loc => jobLocationLower.includes(loc));
      } else if (params.country === 'us') {
        return usLocations.some(loc => jobLocationLower.includes(loc));
      }
      return true;
    });
  }

  if (params.keywords && params.keywords.length > 0) {
    const keywordsLower = params.keywords.map(k => k.toLowerCase());
    filteredJobs = filteredJobs.filter(job => {
      return keywordsLower.some(keyword => 
        job.title.toLowerCase().includes(keyword) ||
        job.company.toLowerCase().includes(keyword) ||
        job.description.toLowerCase().includes(keyword) ||
        (job.requiredSkills && job.requiredSkills.some(skill => 
          skill.toLowerCase().includes(keyword)
        )) ||
        (job.preferredSkills && job.preferredSkills.some(skill => 
          skill.toLowerCase().includes(keyword)
        ))
      );
    });
  }

  if (params.locations && params.locations.length > 0) {
    const locationsLower = params.locations.map(l => l.toLowerCase());
    filteredJobs = filteredJobs.filter(job => {
      const isRemoteSearch = locationsLower.some(loc => loc.toLowerCase().includes('remote'));
      return locationsLower.some(location => 
        job.location.toLowerCase().includes(location)
      ) || (isRemoteSearch && job.remote);
    });
  }

  if (params.country) {
    const canadianLocations = ['toronto', 'vancouver', 'montreal', 'calgary', 'ottawa', 'edmonton', 'winnipeg', 'canada'];
    const usLocations = ['new york', 'los angeles', 'chicago', 'houston', 'phoenix', 'usa', 'united states'];
    
    filteredJobs = filteredJobs.filter(job => {
      const jobLocationLower = job.location.toLowerCase();
      if (params.country === 'canada') {
        return canadianLocations.some(loc => jobLocationLower.includes(loc));
      } else if (params.country === 'us') {
        return usLocations.some(loc => jobLocationLower.includes(loc)) || 
               !canadianLocations.some(loc => jobLocationLower.includes(loc));
      }
      return true;
    });
  }

  if (params.radius && params.radius > 0 && params.locations && params.locations.length > 0) {
    console.log(`Searching within ${params.radius} km of ${params.locations[0]}`);
  }

  if (params.jobType && params.jobType.trim() !== '') {
    filteredJobs = filteredJobs.filter(job => 
      job.jobType && job.jobType.toLowerCase() === params.jobType?.toLowerCase()
    );
  }

  if (params.industry && params.industry.trim() !== '') {
    filteredJobs = filteredJobs.filter(job => 
      job.industry && job.industry.toLowerCase().includes(params.industry.toLowerCase())
    );
  }

  if (params.experienceLevel && params.experienceLevel.trim() !== '') {
    filteredJobs = filteredJobs.filter(job => 
      job.experienceLevel && job.experienceLevel === params.experienceLevel
    );
  }

  if (params.educationLevel && params.educationLevel.trim() !== '') {
    filteredJobs = filteredJobs.filter(job => 
      job.educationLevel && job.educationLevel === params.educationLevel
    );
  }

  if (params.companySize && params.companySize.trim() !== '') {
    filteredJobs = filteredJobs.filter(job => 
      job.companySize && job.companySize === params.companySize
    );
  }

  if (params.companyRating) {
    filteredJobs = filteredJobs.filter(job => 
      job.companyRating && job.companyRating >= params.companyRating
    );
  }

  if (params.benefits && params.benefits.length > 0) {
    filteredJobs = filteredJobs.filter(job => 
      job.benefits && params.benefits.some(benefit => 
        job.benefits.includes(benefit)
      )
    );
  }

  if (params.mosCodes && params.mosCodes.length > 0) {
    filteredJobs = filteredJobs.filter(job => 
      job.requiredMosCodes && job.requiredMosCodes.some(mos => 
        params.mosCodes?.includes(mos)
      )
    );
  }

  if (params.clearanceLevel && params.clearanceLevel.length > 0) {
    filteredJobs = filteredJobs.filter(job => 
      job.clearanceLevel && 
      params.clearanceLevel?.includes(job.clearanceLevel)
    );
  }

  if (params.militarySkills && params.militarySkills.length > 0) {
    filteredJobs = filteredJobs.filter(job => {
      if (!job.requiredSkills || job.requiredSkills.length === 0) return false;
      
      return params.militarySkills!.some(skill => 
        job.requiredSkills!.some(jobSkill => 
          jobSkill.toLowerCase().includes(skill.toLowerCase())
        )
      );
    });
  }

  if (params.remote !== undefined) {
    filteredJobs = filteredJobs.filter(job => job.remote === params.remote);
  }

  if (params.skills && params.skills.length > 0) {
    const skillsLower = params.skills.map(skill => skill.toLowerCase());
    
    filteredJobs = filteredJobs.map(job => {
      const jobRequiredSkills = job.requiredSkills || [];
      const jobPreferredSkills = job.preferredSkills || [];
      const allJobSkills = [...jobRequiredSkills, ...jobPreferredSkills].map(skill => skill.toLowerCase());
      
      const matchingSkills: string[] = [];
      
      skillsLower.forEach(searchSkill => {
        const exactMatch = allJobSkills.find(jobSkill => 
          jobSkill === searchSkill || 
          jobSkill.includes(searchSkill) || 
          searchSkill.includes(jobSkill)
        );
        
        if (exactMatch) {
          const originalSkill = [...jobRequiredSkills, ...jobPreferredSkills].find(
            s => s.toLowerCase() === exactMatch
          );
          if (originalSkill && !matchingSkills.includes(originalSkill)) {
            matchingSkills.push(originalSkill);
          }
          return;
        }
        
        const fuzzyMatch = allJobSkills.find(jobSkill => {
          const jobSkillWords = jobSkill.split(/\s+/);
          const searchSkillWords = searchSkill.split(/\s+/);
          
          return jobSkillWords.some(jsw => 
            searchSkillWords.some(ssw => 
              jsw.includes(ssw) || ssw.includes(jsw) || 
              (jsw.length > 3 && ssw.length > 3 && 
               (jsw.slice(0, 4) === ssw.slice(0, 4)))
            )
          );
        });
        
        if (fuzzyMatch) {
          const originalSkill = [...jobRequiredSkills, ...jobPreferredSkills].find(
            s => s.toLowerCase() === fuzzyMatch
          );
          if (originalSkill && !matchingSkills.includes(originalSkill)) {
            matchingSkills.push(originalSkill);
          }
        }
      });
      
      if (matchingSkills.length > 0) {
        return {
          ...job,
          matchingSkills
        };
      }
      return null;
    }).filter(job => job !== null) as JobListing[];
  }

  return filteredJobs;
};

function getSalaryRange(job: JobListing): string {
  if (!job.salary && !job.salaryRange) {
    return 'range2';
  }
  
  if (job.salaryRange) {
    return job.salaryRange;
  }
  
  const salaryValue = typeof job.salary === 'string' ? parseInt(job.salary, 10) : job.salary as number;
  
  if (!salaryValue || isNaN(salaryValue)) {
    return 'range2';
  }
  
  if (salaryValue > 100000) return 'range5';
  if (salaryValue > 75000) return 'range4';
  if (salaryValue > 50000) return 'range3';
  if (salaryValue > 30000) return 'range2';
  return 'range1';
}

export const refreshJobicyFeed = async (): Promise<void> => {
  try {
    const { fetchAndParseJobicyFeed } = await import('@/utils/jobicyRssParser');
    const { storeJobsInSupabase } = await import('@/utils/supabaseClient');
    
    console.log('Fetching Jobicy RSS feed...');
    const jobs = await fetchAndParseJobicyFeed();
    
    if (jobs.length === 0) {
      console.warn('No jobs found in Jobicy RSS feed');
      return;
    }
    
    console.log(`Parsed ${jobs.length} jobs from Jobicy RSS feed`);
    
    const insertedCount = await storeJobsInSupabase(jobs);
    console.log(`Stored ${insertedCount} new Jobicy jobs in Supabase`);
  } catch (error) {
    console.error('Error refreshing Jobicy feed:', error);
  }
};
