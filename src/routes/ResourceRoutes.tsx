
import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// Lazy-loaded components
const CareerCounseling = lazy(() => import("../pages/CareerCounseling"));
const ResumeAssistance = lazy(() => import("../pages/ResumeAssistance"));
const InterviewPreparation = lazy(() => import("../pages/InterviewPreparation"));
const MilitaryTransitionResources = lazy(() => import("../pages/MilitaryTransitionResources"));
const UnderConstruction = lazy(() => import("../pages/UnderConstruction"));

export const ResourceRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <Routes>
        {/* Working resource pages */}
        <Route path="/career-counseling" element={<CareerCounseling />} />
        <Route path="/resume-assistance" element={<ResumeAssistance />} />
        <Route path="/interview-prep" element={<InterviewPreparation />} />
        <Route path="/military-transition" element={<MilitaryTransitionResources />} />

        {/* Forums under construction */}
        <Route path="/forums" element={<UnderConstruction />} />
        <Route path="/forums/topic/:topicId" element={<UnderConstruction />} />

        {/* Catch-all for other resource routes */}
        <Route path="/*" element={<UnderConstruction />} />
      </Routes>
    </Suspense>
  );
};
