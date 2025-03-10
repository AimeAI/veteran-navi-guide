
import React, { Suspense } from 'react';
import { Routes, Route, useLocation, BrowserRouter as Router } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from 'sonner';
import { useTranslation } from 'react-i18next';

// Layout components
import Navbar from '@/components/layout/Navbar';
import PageFooter from '@/components/layout/PageFooter';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmailVerificationBanner from '@/components/EmailVerificationBanner';
import SecurityMonitor from '@/components/security/SecurityMonitor';
import { RequireAuth } from '@/components/RequireAuth';
import { MessageProvider } from '@/context/MessageContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { AppProvider } from '@/context/AppContext';

// Dynamic imports
const Index = React.lazy(() => import("@/pages/Index"));
const SavedJobs = React.lazy(() => import("@/pages/SavedJobs"));
const JobSearch = React.lazy(() => import("@/pages/JobSearch"));
const JobDetailsPage = React.lazy(() => import("@/pages/JobDetailsPage"));
const UserProfile = React.lazy(() => import("@/pages/UserProfile"));
const ApplicationsPage = React.lazy(() => import("@/pages/ApplicationsPage"));
const RecommendedJobs = React.lazy(() => import("@/pages/RecommendedJobs"));
const MessagesPage = React.lazy(() => import("@/pages/MessagesPage"));
const CareerCounseling = React.lazy(() => import("@/pages/CareerCounseling"));
const ResumeAssistance = React.lazy(() => import("@/pages/ResumeAssistance"));
const InterviewPreparation = React.lazy(() => import("@/pages/InterviewPreparation"));
const MilitaryTransitionResources = React.lazy(() => import("@/pages/MilitaryTransitionResources"));
const JobFairsEventsPage = React.lazy(() => import("@/pages/JobFairsEventsPage"));
const PostJobPage = React.lazy(() => import("@/pages/PostJobPage"));
const EmployerDashboardPage = React.lazy(() => import("@/pages/EmployerDashboardPage"));
const EmployerProfilePage = React.lazy(() => import("@/pages/EmployerProfilePage"));
const EmployerSearchVeteransPage = React.lazy(() => import("@/pages/EmployerSearchVeteransPage"));
const CommunityForums = React.lazy(() => import("@/pages/CommunityForums"));
const TopicDetail = React.lazy(() => import("@/pages/TopicDetail"));
const AuthPage = React.lazy(() => import("@/pages/AuthPage"));
const ForgotPasswordPage = React.lazy(() => import("@/pages/ForgotPasswordPage"));
const VerifyEmailPage = React.lazy(() => import("@/pages/VerifyEmailPage"));
const VeteranDashboardPage = React.lazy(() => import("@/pages/VeteranDashboardPage"));
const AdminDashboardPage = React.lazy(() => import("@/pages/AdminDashboardPage"));
const AdminContentPage = React.lazy(() => import("@/pages/AdminContentPage"));
const AbTestingPage = React.lazy(() => import("@/pages/AbTestingPage"));
const NotificationPreferences = React.lazy(() => import("@/components/NotificationPreferences"));
const FeedbackSupportPage = React.lazy(() => import("@/pages/FeedbackSupportPage"));
const NotFound = React.lazy(() => import("@/pages/NotFound"));
const ReferralProgramPage = React.lazy(() => import("@/pages/ReferralProgramPage"));
const VettedJobsPage = React.lazy(() => import("@/pages/VettedJobsPage"));
const AuthCallbackPage = React.lazy(() => import("@/pages/AuthCallbackPage"));

// Loading component for suspense fallback
const PageLoading = () => (
  <div className="flex justify-center items-center h-[70vh]">
    <LoadingSpinner size="lg" />
  </div>
);

function App() {
  return (
    <AppProvider>
      <LanguageProvider>
        <MessageProvider>
          <Router>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow pt-16">
                <div className="container mx-auto px-4 pt-4">
                  <EmailVerificationBanner />
                </div>
                <Suspense fallback={<PageLoading />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/job-search" element={<JobSearch />} />
                    <Route path="/jobs/search" element={<JobSearch />} />
                    <Route path="/saved" element={
                      <RequireAuth>
                        <SavedJobs />
                      </RequireAuth>
                    } />
                    <Route path="/job/:id" element={<JobDetailsPage />} />
                    <Route path="/profile" element={
                      <RequireAuth>
                        <UserProfile />
                      </RequireAuth>
                    } />
                    <Route path="/history" element={
                      <RequireAuth>
                        <ApplicationsPage />
                      </RequireAuth>
                    } />
                    <Route path="/recommendations" element={
                      <RequireAuth>
                        <RecommendedJobs />
                      </RequireAuth>
                    } />
                    <Route path="/messages" element={
                      <RequireAuth>
                        <MessagesPage />
                      </RequireAuth>
                    } />
                    <Route path="/resources/career-counseling" element={<CareerCounseling />} />
                    <Route path="/resources/resume-assistance" element={<ResumeAssistance />} />
                    <Route path="/resources/interview-prep" element={<InterviewPreparation />} />
                    <Route path="/resources/military-transition" element={<MilitaryTransitionResources />} />
                    <Route path="/events" element={<JobFairsEventsPage />} />
                    <Route path="/employer/post-job" element={
                      <RequireAuth roles={["employer", "admin"]}>
                        <PostJobPage />
                      </RequireAuth>
                    } />
                    <Route path="/employer/manage-applications" element={
                      <RequireAuth roles={["employer", "admin"]}>
                        <EmployerDashboardPage />
                      </RequireAuth>
                    } />
                    <Route path="/employer/profile" element={
                      <RequireAuth roles={["employer", "admin"]}>
                        <EmployerProfilePage />
                      </RequireAuth>
                    } />
                    <Route path="/employer/search-veterans" element={
                      <RequireAuth roles={["employer", "admin"]}>
                        <EmployerSearchVeteransPage />
                      </RequireAuth>
                    } />
                    <Route path="/resources/forums" element={<CommunityForums />} />
                    <Route path="/topic/:topicId" element={<TopicDetail />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/auth/callback" element={<AuthCallbackPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/verify-email" element={<VerifyEmailPage />} />
                    <Route path="/dashboard" element={
                      <RequireAuth>
                        <VeteranDashboardPage />
                      </RequireAuth>
                    } />
                    <Route path="/admin" element={
                      <RequireAuth roles={["admin"]}>
                        <AdminDashboardPage />
                      </RequireAuth>
                    } />
                    <Route path="/admin/content" element={
                      <RequireAuth roles={["admin"]}>
                        <AdminContentPage />
                      </RequireAuth>
                    } />
                    <Route path="/employer-profile" element={
                      <RequireAuth roles={["employer", "admin"]}>
                        <EmployerProfilePage />
                      </RequireAuth>
                    } />
                    <Route path="/ab-testing" element={<AbTestingPage />} />
                    <Route path="/profile/settings" element={
                      <RequireAuth>
                        <UserProfile />
                      </RequireAuth>
                    } />
                    <Route path="/profile/resume" element={
                      <RequireAuth>
                        <UserProfile />
                      </RequireAuth>
                    } />
                    <Route path="/job-alerts" element={
                      <RequireAuth>
                        <UserProfile />
                      </RequireAuth>
                    } />
                    <Route path="/recommended" element={
                      <RequireAuth>
                        <RecommendedJobs />
                      </RequireAuth>
                    } />
                    <Route path="/vetted-jobs" element={<VettedJobsPage />} />
                    <Route
                      path="/settings/notifications"
                      element={
                        <RequireAuth>
                          <NotificationPreferences />
                        </RequireAuth>
                      }
                    />
                    <Route
                      path="/feedback"
                      element={
                        <RequireAuth>
                          <FeedbackSupportPage />
                        </RequireAuth>
                      }
                    />
                    <Route
                      path="/referral-program"
                      element={
                        <RequireAuth>
                          <ReferralProgramPage />
                        </RequireAuth>
                      }
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </main>
              <Toaster position="top-right" />
              <SecurityMonitor />
            </div>
          </Router>
        </MessageProvider>
      </LanguageProvider>
    </AppProvider>
  );
}

export default App;
