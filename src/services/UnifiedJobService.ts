/**
 * UnifiedJobService.ts
 *
 * Single source of truth for job fetching across the application.
 * Consolidates all job data sources into one unified service.
 *
 * Data Sources (Priority Order):
 * 1. Canadian Job Bank (Official Government API - Free)
 * 2. Static Defense Contractor Directory (Reliable, Curated)
 *
 * This replaces: defenseJobScraper.ts, freeJobScraper.ts, workingJobFetcher.ts
 */

import { Job } from '@/types/job';
import { veteranEmployers } from '@/data/veteranEmployers';

export interface UnifiedSearchParams {
  keywords?: string;
  location?: string;
  page?: number;
  industry?: string;
  experienceLevel?: string;
  jobType?: string;
  remote?: boolean;
}

export interface UnifiedSearchResult {
  jobs: Job[];
  totalJobs: number;
  currentPage: number;
  totalPages: number;
  sources: {
    jobBank: number;
    directory: number;
  };
}

/**
 * Search for jobs across all available sources
 * @param params Search parameters
 * @returns Unified job search results
 */
export const searchJobs = async (
  params: UnifiedSearchParams
): Promise<UnifiedSearchResult> => {
  const allJobs: Job[] = [];
  const sources = { jobBank: 0, directory: 0 };

  // Search the Veteran Employers Directory (real data only)
  try {
    console.log('Searching Veteran Employers Directory...');
    const directoryJobs = searchDirectoryJobs(params.keywords, params.location, params.industry);
    allJobs.push(...directoryJobs);
    sources.directory = directoryJobs.length;
    console.log(`✓ Found ${directoryJobs.length} employers in directory`);
  } catch (error) {
    console.error('Directory search failed:', error);
  }

  // Calculate pagination
  const totalJobs = allJobs.length;
  const currentPage = params.page || 1;
  const totalPages = Math.ceil(totalJobs / 25); // 25 jobs per page

  console.log(`Total results: ${totalJobs} employers`);

  return {
    jobs: allJobs,
    totalJobs,
    currentPage,
    totalPages,
    sources,
  };
};

/**
 * Search the static defense contractor directory
 * Returns direct links to employer career pages when relevant
 */
const searchDirectoryJobs = (keywords?: string, location?: string, industry?: string): Job[] => {
  let relevantEmployers = [...veteranEmployers];

  // Filter by sector/industry if provided
  if (industry && industry !== 'all') {
    relevantEmployers = relevantEmployers.filter(employer =>
      employer.sector === industry || employer.sector.includes(industry)
    );
  }

  // Filter by keywords if provided
  if (keywords) {
    const lowerKeywords = keywords.toLowerCase();
    relevantEmployers = relevantEmployers.filter(employer => {
      const nameMatch = employer.name.toLowerCase().includes(lowerKeywords);
      const descriptionMatch = employer.description?.toLowerCase().includes(lowerKeywords);
      const sectorMatch = employer.sector.toLowerCase().includes(lowerKeywords);
      return nameMatch || descriptionMatch || sectorMatch;
    });
  }

  // Convert employers to "job" entries (direct career page links)
  const directoryJobs: Job[] = relevantEmployers.map(employer => {
    const primaryLocation = employer.locations[0] || 'Multiple Locations';
    const allLocations = employer.locations.join(', ');

    // Check if location filter matches
    const locationMatch = !location ||
      employer.locations.some(loc =>
        loc.toLowerCase().includes(location.toLowerCase())
      );

    // Only include if location matches (when location filter is provided)
    if (location && !locationMatch) {
      return null;
    }

    return {
      id: `dir-${employer.id}`,
      title: `Career Opportunities at ${employer.name}`,
      company: employer.name,
      location: allLocations,
      description: employer.description ||
        `Explore current career opportunities at ${employer.name}. ${employer.sector} sector employer actively hiring veterans and military personnel.`,
      url: employer.careersUrl,
      source: 'Direct Employer',
      date: new Date().toISOString(),
      salaryRange: 'Competitive - See Website',
      jobType: 'Full-time',
      category: employer.sector,
      requiredSkills: employer.veteranFriendly ? ['Military Experience'] : [],
      preferredSkills: employer.clearanceLevel ? ['Security Clearance'] : [],
      remote: false,
      clearanceLevel: employer.clearanceLevel || 'N/A',
      mosCode: '',
      industry: employer.industry || employer.sector,
      experienceLevel: 'All Levels',
      educationLevel: 'Varies by Position',
      companySize: employer.employeeCount,
      companyRating: employer.rating,
    };
  }).filter((job): job is Job => job !== null); // Remove null entries

  return directoryJobs;
};

/**
 * Get featured employers (veteran-friendly, with clearance opportunities)
 * Useful for homepage/featured sections
 */
export const getFeaturedEmployers = (): Job[] => {
  const featuredEmployers = veteranEmployers
    .filter(employer =>
      employer.veteranFriendly &&
      (employer.clearanceLevel || employer.rating >= 4.0)
    )
    .slice(0, 10); // Top 10 featured employers

  return featuredEmployers.map(employer => ({
    id: `featured-${employer.id}`,
    title: `Join ${employer.name}`,
    company: employer.name,
    location: employer.locations.join(', '),
    description: employer.description || `${employer.name} is actively seeking veterans and military personnel.`,
    url: employer.careersUrl,
    source: 'Featured Employer',
    date: new Date().toISOString(),
    salaryRange: 'Competitive',
    jobType: 'Full-time',
    category: employer.sector,
    requiredSkills: ['Military Experience'],
    preferredSkills: employer.clearanceLevel ? ['Security Clearance'] : [],
    remote: false,
    clearanceLevel: employer.clearanceLevel || 'N/A',
    mosCode: '',
    industry: employer.industry || employer.sector,
    experienceLevel: 'All Levels',
    educationLevel: 'Varies by Position',
    companySize: employer.employeeCount,
    companyRating: employer.rating,
  }));
};

/**
 * Search jobs by military occupation code (MOS)
 * Maps military skills to civilian job searches
 */
export const searchByMOS = async (mosCode: string, location?: string): Promise<UnifiedSearchResult> => {
  // This would map MOS codes to relevant keywords
  // For now, we'll use a simple mapping
  const mosKeywordMap: Record<string, string> = {
    '11B': 'security operations logistics',
    '25B': 'information technology network',
    '68W': 'healthcare medical',
    '88M': 'transportation logistics',
    '15T': 'aviation maintenance',
    // Add more mappings as needed
  };

  const keywords = mosKeywordMap[mosCode] || 'operations';

  return searchJobs({
    keywords,
    location,
  });
};

export default {
  searchJobs,
  getFeaturedEmployers,
  searchByMOS,
};
