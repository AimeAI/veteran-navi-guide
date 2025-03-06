
import { Job } from "@/context/JobContext";
import * as cheerio from 'cheerio';

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

// Function to transform Job Bank URL based on search parameters
const buildJobBankUrl = (params: JobBankSearchParams): string => {
  const baseUrl = "https://www.jobbank.gc.ca/jobsearch/";
  
  const queryParams = new URLSearchParams();
  
  // Add keywords
  if (params.keywords) {
    queryParams.append("searchstring", params.keywords);
  }
  
  // Add location
  if (params.location) {
    queryParams.append("location", params.location);
  }
  
  // Add distance (in km)
  if (params.distance) {
    queryParams.append("distance", params.distance.toString());
  }
  
  // Add sort parameter
  if (params.sort) {
    queryParams.append("sort", params.sort);
  }
  
  // Add page number (1-based)
  if (params.page && params.page > 1) {
    queryParams.append("page", params.page.toString());
  }
  
  // Always add format=html
  queryParams.append("sort", "D"); // D = Date posted (newest first)
  
  // Return the full URL
  return `${baseUrl}?${queryParams.toString()}`;
};

// Function to search Job Bank jobs with proxy service to avoid CORS
export const searchJobBankJobs = async (params: JobBankSearchParams): Promise<{
  jobs: Job[];
  totalJobs: number;
  currentPage: number;
  totalPages: number;
}> => {
  try {
    console.log("Searching for jobs with Job Bank API");
    
    // Build the Job Bank URL
    const jobBankUrl = buildJobBankUrl(params);
    console.log("Job Bank URL:", jobBankUrl);
    
    // Use a proxy service to avoid CORS issues
    const corsProxyUrl = "https://corsproxy.io/?";
    const url = `${corsProxyUrl}${encodeURIComponent(jobBankUrl)}`;
    
    // Fetch the HTML from Job Bank
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'text/html',
        'User-Agent': 'Mozilla/5.0 (compatible; VeteranJobBoard/1.0; +https://veteranjobboard.example.com)'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Job Bank API returned status: ${response.status}`);
    }
    
    // Get HTML content
    const html = await response.text();
    console.log("Received HTML response from Job Bank");
    
    // Parse HTML with cheerio
    const $ = cheerio.load(html);
    
    // Extract job listings
    const jobListings = $('.results-jobs article');
    console.log(`Found ${jobListings.length} job listings in HTML`);
    
    // Parse jobs from the HTML
    const jobs: Job[] = [];
    jobListings.each((i, el) => {
      const jobElement = $(el);
      
      // Extract job ID (from data attribute or URL)
      const jobId = jobElement.attr('id') || `jobbank-${Math.random().toString(36).substring(2, 15)}`;
      
      // Extract job title
      const titleElement = jobElement.find('.title a');
      const title = titleElement.text().trim();
      
      // Extract job URL
      const relativeUrl = titleElement.attr('href') || '';
      const jobUrl = relativeUrl.startsWith('/') 
        ? `https://www.jobbank.gc.ca${relativeUrl}` 
        : relativeUrl;
      
      // Extract company name
      const company = jobElement.find('.business').text().trim();
      
      // Extract location
      const location = jobElement.find('.location').text().trim();
      
      // Extract salary if available
      const salaryText = jobElement.find('.salary').text().trim();
      
      // Determine salary range based on text
      let salaryRange = 'range1'; // Default
      if (salaryText) {
        const salaryValue = parseFloat(salaryText.replace(/[^0-9.]/g, ''));
        if (salaryValue > 125000) salaryRange = 'range5';
        else if (salaryValue > 100000) salaryRange = 'range4';
        else if (salaryValue > 75000) salaryRange = 'range3';
        else if (salaryValue > 50000) salaryRange = 'range2';
      }
      
      // Extract posting date
      const dateText = jobElement.find('.date').text().trim();
      const date = dateText ? new Date(dateText).toISOString() : new Date().toISOString();
      
      // Extract job type (full-time, part-time, etc.)
      const termText = jobElement.find('.terms').text().toLowerCase().trim();
      let jobType = 'fulltime'; // Default
      if (termText.includes('part-time') || termText.includes('part time')) {
        jobType = 'parttime';
      } else if (termText.includes('contract') || termText.includes('temporary')) {
        jobType = 'contract';
      }
      
      // Check if remote
      const remote = termText.includes('remote') || location.toLowerCase().includes('remote');
      
      // Extract description snippet
      const description = jobElement.find('.summary').text().trim();
      
      // Create a job object
      jobs.push({
        id: jobId,
        title,
        company,
        location,
        description,
        category: 'other', // Default category
        salaryRange,
        remote,
        clearanceLevel: 'none', // Default clearance level
        mosCode: '', // Default MOS code
        requiredSkills: [], // Job Bank doesn't provide skills in search results
        preferredSkills: [],
        date,
        jobType,
        industry: '', // Not provided in search results
        experienceLevel: '', // Not provided in search results
        educationLevel: '', // Not provided in search results
        source: 'jobbank',
        url: jobUrl,
      });
    });
    
    // Extract pagination information
    const currentPageText = $('.pagination-current-page').text().trim();
    const currentPage = currentPageText ? parseInt(currentPageText) : 1;
    
    // Get total number of pages by finding the last page button
    let totalPages = 1;
    $('.pagination-show-more').each((i, el) => {
      const pageNumText = $(el).text().trim();
      const pageNum = parseInt(pageNumText);
      if (!isNaN(pageNum) && pageNum > totalPages) {
        totalPages = pageNum;
      }
    });
    
    // Extract total jobs count if available
    const totalJobsText = $('.results-matching strong').text().trim();
    const totalJobsMatch = totalJobsText.match(/\d+/);
    const totalJobs = totalJobsMatch ? parseInt(totalJobsMatch[0]) : jobs.length;
    
    console.log(`Parsed ${jobs.length} jobs from Job Bank HTML`);
    
    return {
      jobs,
      totalJobs,
      currentPage,
      totalPages,
    };
  } catch (error) {
    console.error("Job Bank API search failed:", error);
    throw error;
  }
};

// Function to get detailed job information from a job page
export const getJobBankJobDetails = async (jobUrl: string): Promise<Partial<Job>> => {
  try {
    console.log(`Fetching job details from: ${jobUrl}`);
    
    // Use a proxy to avoid CORS
    const corsProxyUrl = "https://corsproxy.io/?";
    const url = `${corsProxyUrl}${encodeURIComponent(jobUrl)}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'text/html',
        'User-Agent': 'Mozilla/5.0 (compatible; VeteranJobBoard/1.0; +https://veteranjobboard.example.com)'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch job details, status: ${response.status}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Extract detailed information
    const description = $('.job-posting-detail').text().trim();
    
    // Extract skills from the job description
    const skills: string[] = [];
    $('.skill-list li').each((i, el) => {
      skills.push($(el).text().trim());
    });
    
    // Extract education requirements
    const educationLevel = $('.education-requirements').text().trim();
    
    // Extract experience requirements
    const experienceLevel = $('.experience-requirements').text().trim();
    
    // Return the extra details
    return {
      description,
      requiredSkills: skills,
      educationLevel,
      experienceLevel,
    };
  } catch (error) {
    console.error("Error fetching job details:", error);
    return {};
  }
};
