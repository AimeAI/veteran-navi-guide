
import { lazy } from 'react';
import VeteranDashboardPage from '@/pages/VeteranDashboardPage';
import JobAlertsPage from '@/pages/JobAlertsPage';
import SavedJobs from '@/pages/SavedJobs';
import ApplicationsPage from '@/pages/ApplicationsPage';
import JobFairsEventsPage from '@/pages/JobFairsEventsPage';
import ReferralProgramPage from '@/pages/ReferralProgramPage';
import VeteranGamificationPage from '@/pages/VeteranGamificationPage';
import MentorshipDashboardPage from '@/pages/MentorshipDashboardPage';
import FindMentorsPage from '@/pages/FindMentorsPage';

// Routes specific to Veterans (logged in)
export const veteranRoutes = [
  {
    path: 'dashboard',
    element: <VeteranDashboardPage />,
  },
  {
    path: 'job-alerts',
    element: <JobAlertsPage />,
  },
  {
    path: 'saved-jobs',
    element: <SavedJobs />,
  },
  {
    path: 'applications',
    element: <ApplicationsPage />,
  },
  {
    path: 'events',
    element: <JobFairsEventsPage />,
  },
  {
    path: 'referrals',
    element: <ReferralProgramPage />,
  },
  {
    path: 'gamification',
    element: <VeteranGamificationPage />,
  },
  {
    path: 'mentorship',
    element: <MentorshipDashboardPage />,
  },
  {
    path: 'mentorship/find',
    element: <FindMentorsPage />,
  }
];
