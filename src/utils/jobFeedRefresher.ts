
/**
 * Utilities for refreshing job feeds from external sources
 */
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
