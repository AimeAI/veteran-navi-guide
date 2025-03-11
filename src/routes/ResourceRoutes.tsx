
import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// Lazy-loaded components
const CareerCounseling = lazy(() => import("../pages/CareerCounseling"));
const ResumeAssistance = lazy(() => import("../pages/ResumeAssistance"));
const InterviewPreparation = lazy(() => import("../pages/InterviewPreparation"));
const MilitaryTransitionResources = lazy(() => import("../pages/MilitaryTransitionResources"));
const CommunityForums = lazy(() => import("../pages/CommunityForums"));
const TopicDetail = lazy(() => import("../pages/TopicDetail"));

export const ResourceRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <Routes>
        <Route path="/career-counseling" element={<CareerCounseling />} />
        <Route path="/resume-assistance" element={<ResumeAssistance />} />
        <Route path="/interview-prep" element={<InterviewPreparation />} />
        <Route path="/military-transition" element={<MilitaryTransitionResources />} />
        <Route path="/forums" element={<CommunityForums />} />
        <Route path="/forums/topic/:topicId" element={<TopicDetail />} />
      </Routes>
    </Suspense>
  );
};
