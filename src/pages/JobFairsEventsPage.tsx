
import React from 'react';
import { Helmet } from 'react-helmet';
import JobFairEventsList from '@/components/JobFairEventsList';

const JobFairsEventsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Job Fairs & Events | VeteranJobBoard</title>
        <meta name="description" content="Browse and register for upcoming job fairs and career events for veterans" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <JobFairEventsList />
      </div>
    </>
  );
};

export default JobFairsEventsPage;
