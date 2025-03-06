
import { Job } from "@/context/JobContext";

// Interface for Job Bank search parameters
export interface JobBankSearchParams {
  keywords?: string;
  location?: string;
  distance?: number;
  sort?: string;
  page?: number;
}

// Military skills to NOC code mapping
// Based on Canadian National Occupational Classification (NOC) system
export const militarySkillsToNOCMapping = {
  "leadership": ["00010", "00011", "00012", "00013"], // Military, naval and air force senior officers
  "logistics": ["14400", "14401", "14402", "73300"], // Supply chain logistics, coordinators and supervisors
  "security": ["63100", "63101", "64100"], // Security guards and related security service occupations
  "communications": ["12010", "12011", "21230"], // Communications specialists
  "intelligence": ["40040", "40041", "21220"], // Intelligence and policy analysts
  "medical": ["32100", "32101", "32102", "32110"], // Medical technologists and technicians
  "engineering": ["21300", "21301", "21310"], // Civil, mechanical, electrical engineers
  "aviation": ["22220", "72410", "72411"], // Aircraft mechanics and technical occupations
  "technology": ["21220", "21221", "21222", "21233"], // Computer and information systems professionals
  "mechanical": ["72400", "72401", "72410"], // Machinery and transportation equipment mechanics
  "administrative": ["12010", "12011", "12012", "12013"], // Administrative services
  "weapons": ["84100", "84101", "85110"], // Machine operators and related workers
};

// Get NOC codes for a given military skill
export const getNOCCodesForSkill = (skill: string): string[] => {
  return militarySkillsToNOCMapping[skill as keyof typeof militarySkillsToNOCMapping] || [];
};

// Function to search Job Bank jobs with our Supabase Edge Function
export const searchJobBankJobs = async (params: {
  keywords?: string;
  location?: string;
  distance?: number;
  page?: number;
  sort?: string;
}): Promise<{
  jobs: Job[];
  totalJobs: number;
  currentPage: number;
  totalPages: number;
}> => {
  try {
    console.log('Searching jobs with Job Bank API proxy');
    
    // Build query parameters for our serverless function
    const queryParams = new URLSearchParams();
    if (params.keywords) queryParams.append('keywords', params.keywords);
    if (params.location) queryParams.append('location', params.location);
    if (params.distance) queryParams.append('distance', params.distance.toString());
    if (params.page) queryParams.append('page', params.page.toString());
    queryParams.append('source', 'jobbank');
    
    // Use our Supabase function instead of direct API calls
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
    const proxyUrl = `${supabaseUrl}/functions/v1/job-search-proxy?${queryParams.toString()}`;
    
    console.log('Job Bank API proxy URL:', proxyUrl);
    
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error(`Job Bank API proxy returned status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      jobs: data.jobs,
      totalJobs: data.totalJobs,
      currentPage: data.currentPage,
      totalPages: data.totalPages,
    };
  } catch (error) {
    console.error('Error searching Job Bank via proxy:', error);
    throw error;
  }
};
