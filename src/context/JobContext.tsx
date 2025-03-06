
// Update the SearchParams interface to include the correct country type
export interface SearchParams {
  keywords: string[];
  locations: string[];
  radius: number;
  jobType: string;
  mosCodes: string[];
  clearanceLevel: string[];
  remote: boolean;
  militarySkills: string[];
  industry: string;
  experienceLevel: string;
  educationLevel: string;
  companySize: string;
  companyRating: number;
  benefits: string[];
  skills: string[];
  country: "us" | "canada"; // Make sure this is the correct type
  useJobicy: boolean;
}

// Fix the country type in the performSearch function
const performSearch = async (filters: JobFilterState) => {
  setIsLoading(true);
  setError(null);
  
  try {
    // Convert filters to search params
    const searchParams: SearchParams = {
      keywords: filters.keywords ? [filters.keywords] : [],
      locations: filters.location ? [filters.location] : [],
      radius: filters.radius || 25,
      jobType: filters.jobType || '',
      mosCodes: filters.mosCodes || [],
      clearanceLevel: filters.clearanceLevel || [],
      remote: filters.remote || false,
      militarySkills: filters.militarySkills || [],
      industry: filters.industry || '',
      experienceLevel: filters.experienceLevel || '',
      educationLevel: filters.educationLevel || '',
      companySize: filters.companySize || '',
      companyRating: filters.companyRating || 0,
      benefits: filters.benefits || [],
      skills: filters.skills || [],
      country: "canada", // Set to "canada" as a valid value
      useJobicy: filters.useJobicy || false
    };
    
    // Replace 'results' with 'jobResults' in the code
    const jobResults = await fetchJobs(searchParams);
    setJobs(jobResults);
  } catch (err) {
    setError('Failed to search jobs. Please try again.');
    console.error('Search error:', err);
  } finally {
    setIsLoading(false);
  }
};
