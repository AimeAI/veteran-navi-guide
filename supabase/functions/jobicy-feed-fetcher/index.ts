
// Follow the Supabase Edge Function deployment instructions:
// https://supabase.com/docs/guides/functions

import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import * as xml2js from 'https://esm.sh/xml2js@0.4.23';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Clean HTML from description
const cleanHtmlContent = (html: string): string => {
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

// Extract company name from various patterns
const extractCompanyName = (item: any): string => {
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

// Parse job location from description or content
const parseJobLocation = (description: string): string => {
  // Try to extract location from common patterns
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

// Determine if a job is remote based on description
const isRemoteJob = (description: string): boolean => {
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

serve(async (req) => {
  try {
    // Check if this is a scheduled invocation or manual
    const { scheduled } = await req.json().catch(() => ({ scheduled: false }));
    
    console.log(`Jobicy feed fetcher ${scheduled ? 'scheduled run' : 'manual run'}`);
    
    // Fetch the RSS feed
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
    
    // Parse the RSS feed
    const parser = new xml2js.Parser({ 
      explicitArray: false,
      mergeAttrs: true 
    });
    
    const result = await parser.parseStringPromise(rssXml);
    
    if (!result.rss?.channel?.item) {
      throw new Error('Invalid RSS feed structure');
    }
    
    // Ensure item is always an array
    const items = Array.isArray(result.rss.channel.item) 
      ? result.rss.channel.item 
      : [result.rss.channel.item];
    
    console.log(`Parsed ${items.length} jobs from Jobicy RSS feed`);
    
    // Transform RSS items to job objects
    const jobs = items.map(item => {
      const company = extractCompanyName(item);
      const description = item.description ? cleanHtmlContent(item.description) : '';
      const fullContent = item['content:encoded'] ? cleanHtmlContent(item['content:encoded']) : description;
      const location = parseJobLocation(fullContent || description);
      const remote = isRemoteJob(fullContent || description);
      
      // Generate a unique ID based on guid or link
      const sourceId = `jobicy-${item.guid || item.link.split('/').pop() || Math.random().toString(36).substring(2, 15)}`;
      
      // Parse categories
      const categories = Array.isArray(item.category) ? item.category : item.category ? [item.category] : [];
      
      // Extract publication date
      const datePosted = item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString();
      
      // Map job type based on categories or description
      let jobType = 'fulltime';
      if (categories.some(cat => cat.toLowerCase().includes('part-time') || cat.toLowerCase().includes('part time'))) {
        jobType = 'parttime';
      } else if (categories.some(cat => cat.toLowerCase().includes('contract') || cat.toLowerCase().includes('freelance'))) {
        jobType = 'contract';
      }
      
      return {
        source_id: sourceId,
        title: item.title,
        company,
        location,
        description: fullContent || description,
        category: categories[0]?.toLowerCase() || 'other',
        salary_range: 'range1', // Default, as RSS usually doesn't include salary
        remote,
        clearance_level: 'none', // Default
        mos_code: '', // Not provided in RSS
        required_skills: categories, // Use categories as skills
        preferred_skills: [],
        date_posted: datePosted,
        job_type: jobType,
        industry: categories[1] || '', // Use second category as industry if available
        experience_level: '', // Not provided
        education_level: '', // Not provided
        source: 'jobicy',
        url: item.link
      };
    });
    
    // Check for existing jobs to avoid duplicates
    const { data: existingJobs, error: fetchError } = await supabase
      .from('jobs')
      .select('source_id')
      .eq('source', 'jobicy');
    
    if (fetchError) {
      throw new Error(`Error fetching existing jobs: ${fetchError.message}`);
    }
    
    // Create a Set of existing job IDs for efficient lookup
    const existingJobIds = new Set(existingJobs?.map(job => job.source_id) || []);
    
    // Filter out jobs that already exist
    const newJobs = jobs.filter(job => !existingJobIds.has(job.source_id));
    
    if (newJobs.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        message: 'No new jobs to insert',
        inserted: 0,
        total_parsed: items.length
      }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      });
    }
    
    // Insert new jobs
    const { error: insertError, count } = await supabase
      .from('jobs')
      .insert(newJobs)
      .select('count');
    
    if (insertError) {
      throw new Error(`Error inserting jobs: ${insertError.message}`);
    }
    
    return new Response(JSON.stringify({
      success: true,
      message: `Successfully inserted ${count} new jobs`,
      inserted: count,
      total_parsed: items.length
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    console.error('Error in Jobicy feed fetcher:', error);
    
    return new Response(JSON.stringify({
      success: false,
      message: error.message
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
