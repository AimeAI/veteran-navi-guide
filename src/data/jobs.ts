
import { Job } from "@/context/JobContext";

interface JobSearchParams {
  keywords: string[];
  locations: string[];
  jobType: string;
  mosCodes: string[];
  clearanceLevel: string[];
  remote: boolean;
}

const searchKeywords = [
  "Software Developer", 
  "Security Analyst", 
  "Project Manager", 
  "Logistics Coordinator",
  "Healthcare Administrator",
  "Cybersecurity Specialist",
  "Operations Manager",
  "Administrative Assistant",
  "Engineering",
  "Information Technology",
  "Supply Chain",
  "Leadership",
  "Military Experience",
  "Veteran",
  "Security Clearance",
  "Remote Work"
];

const searchLocations = [
  "Ottawa, ON",
  "Toronto, ON",
  "Vancouver, BC",
  "Halifax, NS",
  "Edmonton, AB",
  "Calgary, AB",
  "Montreal, QC",
  "Winnipeg, MB",
  "Saskatoon, SK",
  "Victoria, BC",
  "Regina, SK",
  "Quebec City, QC",
  "Fredericton, NB",
  "St. John's, NL",
  "Charlottetown, PE"
];

export const searchJobs = (params: JobSearchParams): Job[] => {
  // For now, return empty array as this is just for TypeScript satisfaction
  // The actual implementation would filter jobs based on the params
  return [];
};

export const getSearchSuggestions = (query: string, type: 'keywords' | 'locations'): string[] => {
  if (!query || query.length < 2) return [];
  
  const lowerQuery = query.toLowerCase();
  const sourceArray = type === 'keywords' ? searchKeywords : searchLocations;
  
  return sourceArray
    .filter(item => item.toLowerCase().includes(lowerQuery))
    .slice(0, 5); // Return only top 5 results
};

export const getGeneralSearchSuggestions = (query: string): string[] => {
  if (!query || query.length < 2) return [];
  
  const lowerQuery = query.toLowerCase();
  
  // Combine keywords and locations, but don't duplicate them
  const keywordResults = searchKeywords
    .filter(item => item.toLowerCase().includes(lowerQuery));
    
  const locationResults = searchLocations
    .filter(item => item.toLowerCase().includes(lowerQuery))
    .filter(item => !keywordResults.includes(item)); // Remove duplicates
    
  return [...keywordResults, ...locationResults].slice(0, 7); // Return only top 7 results
};
