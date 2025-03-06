
import React from 'react';
import JobListing from '@/components/JobListing';
import { Bookmark, X, AlertCircle } from 'lucide-react';
import { useJobs } from '@/context/JobContext';

const SavedJobs = () => {
  const { savedJobs, unsaveJob: removeSavedJob } = useJobs();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <main className="flex-grow container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-8">
            <Bookmark className="h-6 w-6 text-primary mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Saved Jobs</h1>
          </div>
          
          {savedJobs.length > 0 ? (
            <div className="space-y-6">
              {savedJobs.map((job) => (
                <div key={job.id} className="relative">
                  <JobListing
                    jobId={job.id}
                    title={job.title}
                    company={job.company}
                    location={job.location}
                    description={job.description}
                  />
                  <button
                    onClick={() => removeSavedJob(job.id)}
                    className="absolute top-4 right-4 p-1.5 bg-white rounded-full border border-gray-200 shadow-sm hover:bg-red-50 hover:border-red-200 transition-colors duration-200"
                    aria-label={`Remove ${job.title} from saved jobs`}
                  >
                    <X className="h-4 w-4 text-gray-500 hover:text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-10 text-center">
              <div className="flex justify-center mb-4">
                <AlertCircle className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No saved jobs yet</h3>
              <p className="text-gray-600 mb-6">
                Jobs you save will appear here for easy access. Start browsing jobs and save ones that interest you.
              </p>
              <a
                href="/jobs/search"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-primary rounded-md shadow-sm hover:bg-primary/90 transition-colors duration-200"
              >
                Browse Jobs
              </a>
            </div>
          )}
        </div>
      </main>
      
      <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2023 VeteranJobBoard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SavedJobs;
