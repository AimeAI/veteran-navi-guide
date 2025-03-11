
import React, { lazy } from "react";
import { Route } from "react-router-dom";
import JobSearch from "../pages/JobSearch";
import JobBoardPage from "../pages/JobBoardPage";

// Lazy-loaded components
const Index = lazy(() => import("../pages/Index"));
const JobDetailsPage = lazy(() => import("../pages/JobDetailsPage"));
const VettedJobsPage = lazy(() => import("../pages/VettedJobsPage"));
const JobFairsEventsPage = lazy(() => import("../pages/JobFairsEventsPage"));
const CommunityForums = lazy(() => import("../pages/CommunityForums"));
const TopicDetail = lazy(() => import("../pages/TopicDetail"));
const AbTestingPage = lazy(() => import("../pages/AbTestingPage"));
const NotFound = lazy(() => import("../pages/NotFound"));
const AllRoutes = lazy(() => import("../pages/AllRoutes"));

export const GeneralRoutes = () => {
  return (
    <>
      <Route path="/" element={<Index />} />
      <Route path="/job-search" element={<JobSearch />} />
      <Route path="/jobs/search" element={<JobSearch />} />
      <Route path="/job/:id" element={<JobDetailsPage />} />
      <Route path="/vetted-jobs" element={<VettedJobsPage />} />
      <Route path="/events" element={<JobFairsEventsPage />} />
      <Route path="/resources/forums" element={<CommunityForums />} />
      <Route path="/topic/:topicId" element={<TopicDetail />} />
      <Route path="/ab-testing" element={<AbTestingPage />} />
      <Route path="/routes" element={<AllRoutes />} />
      <Route path="*" element={<NotFound />} />
    </>
  );
};
