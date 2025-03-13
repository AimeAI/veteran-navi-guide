import React from 'react';
import { lazyWithPerf, withSuspense } from '@/utils/codeSplitting';

// Main pages - lazy load them to reduce initial bundle size
export const Index = withSuspense(
  lazyWithPerf(() => import('@/pages/Index'), 'IndexPage')
);

export const JobBoardPage = withSuspense(
  lazyWithPerf(() => import('@/pages/JobBoardPage'), 'JobBoardPage')
);

export const JobSearch = withSuspense(
  lazyWithPerf(() => import('@/pages/JobSearch'), 'JobSearch')
);

export const JobDetailsPage = withSuspense(
  lazyWithPerf(() => import('@/pages/JobDetailsPage'), 'JobDetailsPage')
);

export const RecommendedJobs = withSuspense(
  lazyWithPerf(() => import('@/pages/RecommendedJobs'), 'RecommendedJobs')
);

export const SavedJobs = withSuspense(
  lazyWithPerf(() => import('@/pages/SavedJobs'), 'SavedJobs')
);

export const UserProfile = withSuspense(
  lazyWithPerf(() => import('@/pages/UserProfile'), 'UserProfile')
);

export const MessagesPage = withSuspense(
  lazyWithPerf(() => import('@/pages/MessagesPage'), 'MessagesPage')
);

export const VeteranDashboardPage = withSuspense(
  lazyWithPerf(() => import('@/pages/VeteranDashboardPage'), 'VeteranDashboardPage')
);

export const EmployerDashboardPage = withSuspense(
  lazyWithPerf(() => import('@/pages/EmployerDashboardPage'), 'EmployerDashboardPage')
);

export const EmployerProfilePage = withSuspense(
  lazyWithPerf(() => import('@/pages/EmployerProfilePage'), 'EmployerProfilePage')
);

export const PostJobPage = withSuspense(
  lazyWithPerf(() => import('@/pages/PostJobPage'), 'PostJobPage')
);

export const EmployerApplicationsPage = withSuspense(
  lazyWithPerf(() => import('@/pages/EmployerApplicationsPage'), 'EmployerApplicationsPage')
);

export const AdminDashboardPage = withSuspense(
  lazyWithPerf(() => import('@/pages/AdminDashboardPage'), 'AdminDashboardPage')
);

export const JobAlertsPage = withSuspense(
  lazyWithPerf(() => import('@/pages/JobAlertsPage'), 'JobAlertsPage')
);

export const AuthPage = withSuspense(
  lazyWithPerf(() => import('@/pages/AuthPage'), 'AuthPage')
);

// Resources pages
export const InterviewPreparation = withSuspense(
  lazyWithPerf(() => import('@/pages/InterviewPreparation'), 'InterviewPreparation')
);

export const ResumeAssistance = withSuspense(
  lazyWithPerf(() => import('@/pages/ResumeAssistance'), 'ResumeAssistance')
);

export const CareerCounseling = withSuspense(
  lazyWithPerf(() => import('@/pages/CareerCounseling'), 'CareerCounseling')
);

export const MilitaryTransitionResources = withSuspense(
  lazyWithPerf(() => import('@/pages/MilitaryTransitionResources'), 'MilitaryTransitionResources')
);

// Other pages
export const CommunityForums = withSuspense(
  lazyWithPerf(() => import('@/pages/CommunityForums'), 'CommunityForums')
);

export const JobFairsEventsPage = withSuspense(
  lazyWithPerf(() => import('@/pages/JobFairsEventsPage'), 'JobFairsEventsPage')
);

export const ReferralProgramPage = withSuspense(
  lazyWithPerf(() => import('@/pages/ReferralProgramPage'), 'ReferralProgramPage')
);

export const NotFound = withSuspense(
  lazyWithPerf(() => import('@/pages/NotFound'), 'NotFound')
);
