
import React from 'react';
import JobListing from '@/components/JobListing';
import { X } from 'lucide-react';
import { Job } from '@/context/JobContext';
import { useTranslation } from 'react-i18next';

interface SavedJobsListProps {
  jobs: Job[];
  onRemoveJob: (jobId: string) => void;
}

const SavedJobsList: React.FC<SavedJobsListProps> = ({ jobs, onRemoveJob }) => {
  const { t } = useTranslation();

  if (jobs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {jobs.map((job) => (
        <div key={job.id} className="relative">
          <JobListing
            jobId={job.id}
            title={job.title}
            company={job.company}
            location={job.location}
            description={job.description}
            date={job.date}
            source={job.source}
          />
          <button
            onClick={() => onRemoveJob(job.id)}
            className="absolute top-4 right-4 p-1.5 bg-white rounded-full border border-gray-200 shadow-sm hover:bg-red-50 hover:border-red-200 transition-colors duration-200"
            aria-label={t("Remove {{title}} from saved jobs", { title: job.title })}
          >
            <X className="h-4 w-4 text-gray-500 hover:text-red-500" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default SavedJobsList;
