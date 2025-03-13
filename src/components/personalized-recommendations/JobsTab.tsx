
import React from 'react';
import { Briefcase } from 'lucide-react';
import JobItem from './JobItem';
import EmptyState from './EmptyState';
import SeeAllLink from './SeeAllLink';
import JobRecommendationsLoading from '@/components/JobRecommendationsLoading';

interface RecommendedJob {
  id: string;
  title: string;
  company: string;
  matchScore: number;
  location: string;
  remote?: boolean;
}

interface JobsTabProps {
  isLoading: boolean;
  jobs?: RecommendedJob[];
}

const JobsTab: React.FC<JobsTabProps> = ({ isLoading, jobs }) => {
  if (isLoading) {
    return <JobRecommendationsLoading />;
  }

  if (!jobs || jobs.length === 0) {
    return (
      <EmptyState
        icon={<Briefcase className="h-12 w-12" />}
        title="No job recommendations yet"
        description="Complete your profile to get personalized job matches"
        actionLink="/profile"
        actionText="Update Profile"
      />
    );
  }

  return (
    <>
      {jobs.map((job) => (
        <JobItem
          key={job.id}
          id={job.id}
          title={job.title}
          company={job.company}
          matchScore={job.matchScore}
          location={job.location}
          remote={job.remote}
        />
      ))}
      <SeeAllLink url="/recommendations" text="See all recommendations" />
    </>
  );
};

export default JobsTab;
