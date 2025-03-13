import { Job } from "@/context/JobContext";
import * as xml2js from 'xml2js';

// Interface for Jobicy RSS item
export interface JobicyRssItem {
  title: string;
  link: string;
  pubDate: string;
  'dc:creator': string;
  'content:encoded': string;
  description: string;
  category: string[];
  guid: string;
}

// Interface for Jobicy RSS feed
export interface JobicyRssFeed {
  rss: {
    channel: {
      item: JobicyRssItem[];
    }
  }
}

/**
 * Parse job location from description or content
 * Some Jobicy jobs have location embedded in different ways
 */
export const parseJobLocation = (description: string): string => {
  // Try to extract location from common patterns like "Location: New York" or "Location - Remote"
  const locationMatch = description.match(/Location:?\s*([^<\n]+)/i) || 
                        description.match(/Location\s*-\s*([^<\n]+)/i) ||
                        description.match(/based in\s*([^<\n\.]+)/i);
  
  if (locationMatch && locationMatch[1]) {
    return locationMatch[1].trim();
  }
  
  // Check if it's a remote job
  if (description.toLowerCase().includes('remote')) {
    return 'Remote';
  }
  
  return 'Not specified';
};

/**
 * Extract company name from various patterns
 */
export const extractCompanyName = (item: JobicyRssItem): string => {
  // If dc:creator exists, use it
  if (item['dc:creator']) {
    return item['dc:creator'];
  }
  
  // Try to extract from title (common pattern: "Job Title at Company Name")
  const titleMatch = item.title.match(/at\s+(.+)$/i);
  if (titleMatch && titleMatch[1]) {
    return titleMatch[1].trim();
  }
  
  return 'Unknown Company';
};

/**
 * Clean HTML from description
 */
export const cleanHtmlContent = (html: string): string => {
  return html
    .replace(/<[^>]*>?/gm, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ')   // Replace non-breaking spaces
    .replace(/&amp;/g, '&')    // Replace ampersands
    .replace(/&lt;/g, '<')     // Replace less than
    .replace(/&gt;/g, '>')     // Replace greater than
    .replace(/&quot;/g, '"')   // Replace quotes
    .replace(/&#39;/g, "'")    // Replace apostrophes
    .trim();                   // Trim whitespace
};

/**
 * Determine if a job is remote based on description
 */
export const isRemoteJob = (description: string): boolean => {
  const remoteIndicators = [
    'remote',
    'work from home',
    'work from anywhere',
    'telecommute',
    'virtual position'
  ];
  
  const lowerDesc = description.toLowerCase();
  return remoteIndicators.some(indicator => lowerDesc.includes(indicator));
};

/**
 * Parse RSS XML string into Job objects
 */
export const parseJobicyRss = async (rssXml: string): Promise<Job[]> => {
  try {
    const parser = new xml2js.Parser({ 
      explicitArray: false,
      mergeAttrs: true 
    });
    
    const result = await parser.parseStringPromise(rssXml) as JobicyRssFeed;
    
    if (!result.rss?.channel?.item) {
      console.error('Invalid RSS feed structure:', result);
      return [];
    }
    
    // Ensure item is always an array
    const items = Array.isArray(result.rss.channel.item) 
      ? result.rss.channel.item 
      : [result.rss.channel.item];
    
    return items.map(item => {
      const company = extractCompanyName(item);
      const description = item.description ? cleanHtmlContent(item.description) : '';
      const fullContent = item['content:encoded'] ? cleanHtmlContent(item['content:encoded']) : description;
      const location = parseJobLocation(fullContent || description);
      const remote = isRemoteJob(fullContent || description);
      
      // Generate a unique ID based on guid or link
      const id = `jobicy-${item.guid || item.link.split('/').pop() || Math.random().toString(36).substring(2, 15)}`;
      
      // Parse categories
      const categories = Array.isArray(item.category) ? item.category : item.category ? [item.category] : [];
      
      // Extract publication date
      const date = item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString();
      
      // Map job type based on categories or description
      let jobType = 'fulltime';
      if (categories.some(cat => cat.toLowerCase().includes('part-time') || cat.toLowerCase().includes('part time'))) {
        jobType = 'parttime';
      } else if (categories.some(cat => cat.toLowerCase().includes('contract') || cat.toLowerCase().includes('freelance'))) {
        jobType = 'contract';
      }
      
      // Map to our Job interface
      return {
        id,
        title: item.title,
        company,
        location,
        description: fullContent || description,
        category: categories[0]?.toLowerCase() || 'other',
        salaryRange: 'range1', // Default, as RSS usually doesn't include salary
        remote,
        clearanceLevel: 'none', // Default
        mosCode: '', // Not provided in RSS
        requiredSkills: categories, // Use categories as skills
        preferredSkills: [],
        date,
        jobType,
        industry: categories[1] || '', // Use second category as industry if available
        experienceLevel: '', // Not provided
        educationLevel: '', // Not provided
        source: 'jobicy',
        url: item.link
      };
    });
  } catch (error) {
    console.error('Error parsing Jobicy RSS feed:', error);
    return [];
  }
};

/**
 * Fetch and parse the Jobicy RSS feed
 */
export const fetchAndParseJobicyFeed = async (): Promise<Job[]> => {
  try {
    const response = await fetch('https://jobicy.com/jobs-rss-feed', {
      headers: {
        'Accept': 'application/rss+xml',
        'User-Agent': 'VeteranJobBoard/1.0 (https://veteranjobboard.example.com)'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Jobicy RSS feed: ${response.status}`);
    }
    
    const rssXml = await response.text();
    return parseJobicyRss(rssXml);
  } catch (error) {
    console.error('Error fetching Jobicy RSS feed:', error);
    return [];
  }
};

/**
 * Main function to fetch and filter Jobicy jobs with pagination
 */
export const fetchJobicyJobs = async (keywords?: string, location?: string, params?: any): Promise<{
  jobs: Job[];
  totalJobs: number;
  totalPages: number;
}> => {
  try {
    let jobs = await fetchAndParseJobicyFeed();
    
    // Filter by keywords if provided
    if (keywords) {
      const keywordsLower = keywords.toLowerCase();
      jobs = jobs.filter(job => 
        job.title.toLowerCase().includes(keywordsLower) || 
        job.description.toLowerCase().includes(keywordsLower)
      );
    }
    
    // Filter by location if provided
    if (location) {
      const locationLower = location.toLowerCase();
      jobs = jobs.filter(job => 
        job.location.toLowerCase().includes(locationLower)
      );
    }
    
    // Apply pagination
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 20;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedJobs = jobs.slice(start, end);
    
    return {
      jobs: paginatedJobs,
      totalJobs: jobs.length,
      totalPages: Math.ceil(jobs.length / pageSize)
    };
  } catch (error) {
    console.error('Error fetching and filtering Jobicy jobs:', error);
    return {
      jobs: [],
      totalJobs: 0,
      totalPages: 0
    };
  }
};

/**
 * Generate a deduplication key for a job
 */
export const generateJobDeduplicationKey = (job: Job): string => {
  return `${job.title.toLowerCase()}-${job.company.toLowerCase()}`;
};
