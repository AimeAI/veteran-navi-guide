
import React from 'react';
import { Job } from '@/context/JobContext';
import JobListing from '@/components/JobListing';

interface JobWithScore extends Job {
  matchScore?: number;
}

interface JobListContentProps {
  jobs: Job[];
}

const JobListContent: React.FC<JobListContentProps> = ({ jobs }) => {
  if (jobs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {jobs.map(job => {
        const jobWithScore = job as JobWithScore;
        return (
          <JobListing
            key={job.id}
            jobId={job.id}
            title={job.title}
            company={job.company}
            location={job.location}
            description={job.description}
            source={job.source}
            url={job.url}
            date={job.date}
            matchScore={jobWithScore.matchScore}
          />
        );
      })}
    </div>
  );
};

export default JobListContent;
