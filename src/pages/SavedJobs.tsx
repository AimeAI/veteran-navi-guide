
import React from 'react';
import { useJobs } from '@/context/JobContext';
import SavedJobsHeader from '@/components/saved-jobs/SavedJobsHeader';
import SavedJobsList from '@/components/saved-jobs/SavedJobsList';
import EmptySavedJobsState from '@/components/saved-jobs/EmptySavedJobsState';
import PageFooter from '@/components/layout/PageFooter';

const SavedJobs = () => {
  const { savedJobs, unsaveJob: removeSavedJob } = useJobs();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <main className="flex-grow container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <SavedJobsHeader />
          
          {savedJobs.length > 0 ? (
            <SavedJobsList 
              jobs={savedJobs} 
              onRemoveJob={removeSavedJob} 
            />
          ) : (
            <EmptySavedJobsState />
          )}
        </div>
      </main>
      
      <PageFooter />
    </div>
  );
};

export default SavedJobs;
