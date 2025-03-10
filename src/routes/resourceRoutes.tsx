
import React from 'react';
import { Route } from 'react-router-dom';

// Page imports
const CareerCounseling = React.lazy(() => import("@/pages/CareerCounseling"));
const ResumeAssistance = React.lazy(() => import("@/pages/ResumeAssistance"));
const InterviewPreparation = React.lazy(() => import("@/pages/InterviewPreparation"));
const MilitaryTransitionResources = React.lazy(() => import("@/pages/MilitaryTransitionResources"));
const JobFairsEventsPage = React.lazy(() => import("@/pages/JobFairsEventsPage"));
const CommunityForums = React.lazy(() => import("@/pages/CommunityForums"));
const TopicDetail = React.lazy(() => import("@/pages/TopicDetail"));
const AbTestingPage = React.lazy(() => import("@/pages/AbTestingPage"));

export const ResourceRoutes = () => {
  return (
    <>
      <Route path="/resources/career-counseling" element={<CareerCounseling />} />
      <Route path="/resources/resume-assistance" element={<ResumeAssistance />} />
      <Route path="/resources/interview-prep" element={<InterviewPreparation />} />
      <Route path="/resources/military-transition" element={<MilitaryTransitionResources />} />
      <Route path="/events" element={<JobFairsEventsPage />} />
      <Route path="/resources/forums" element={<CommunityForums />} />
      <Route path="/topic/:topicId" element={<TopicDetail />} />
      <Route path="/ab-testing" element={<AbTestingPage />} />
    </>
  );
};
