import { mockJobs } from "./mockJobs";

// Define the search parameters interface
interface SearchParams {
  keywords?: string[];
  locations?: string[];
  jobType?: string;
  mosCodes?: string[];
  clearanceLevel?: string[];
  remote?: boolean;
  militarySkills?: string[]; // Added military skills parameter
}

// Search function to filter jobs based on criteria
export const searchJobs = (params: SearchParams) => {
  let filteredJobs = [...mockJobs];

  // Filter by keywords
  if (params.keywords && params.keywords.length > 0) {
    const keywordsLower = params.keywords.map(k => k.toLowerCase());
    filteredJobs = filteredJobs.filter(job => {
      // Check if any keyword matches the job title, company, description, or required skills
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

  // Filter by locations
  if (params.locations && params.locations.length > 0) {
    const locationsLower = params.locations.map(l => l.toLowerCase());
    filteredJobs = filteredJobs.filter(job => {
      // Check if the job location matches any of the provided locations
      // Also match "Remote" jobs if "Remote" is in the locations
      const isRemoteSearch = locationsLower.some(loc => loc.toLowerCase().includes('remote'));
      return locationsLower.some(location => 
        job.location.toLowerCase().includes(location)
      ) || (isRemoteSearch && job.remote);
    });
  }

  // Filter by job type
  if (params.jobType && params.jobType.trim() !== '') {
    filteredJobs = filteredJobs.filter(job => 
      job.jobType && job.jobType.toLowerCase() === params.jobType?.toLowerCase()
    );
  }

  // Filter by MOS codes
  if (params.mosCodes && params.mosCodes.length > 0) {
    filteredJobs = filteredJobs.filter(job => 
      job.requiredMosCodes && job.requiredMosCodes.some(mos => 
        params.mosCodes?.includes(mos)
      )
    );
  }

  // Filter by clearance level
  if (params.clearanceLevel && params.clearanceLevel.length > 0) {
    filteredJobs = filteredJobs.filter(job => 
      job.securityClearanceRequired && 
      params.clearanceLevel?.includes(job.securityClearanceRequired)
    );
  }

  // Filter by military skills
  if (params.militarySkills && params.militarySkills.length > 0) {
    filteredJobs = filteredJobs.filter(job => {
      // If job has no required skills, don't match it
      if (!job.requiredSkills || job.requiredSkills.length === 0) return false;
      
      // Check if any of the job's skills match the selected military skills
      return params.militarySkills!.some(skill => 
        job.requiredSkills!.some(jobSkill => 
          jobSkill.toLowerCase().includes(skill.toLowerCase())
        )
      );
    });
  }

  // Filter by remote option
  if (params.remote !== undefined) {
    filteredJobs = filteredJobs.filter(job => job.remote === params.remote);
  }

  return filteredJobs;
};
