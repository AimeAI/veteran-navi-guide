
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import { Toaster } from "./components/ui/sonner";
import { AppProvider } from "./context/AppContext";
import "./App.css";
import EmailVerificationBanner from "./components/EmailVerificationBanner";
import { MessageProvider } from "./context/MessageContext";
import { RequireAuth } from "./components/RequireAuth";
import { LanguageProvider } from "./context/LanguageContext";
import "./i18n";
import SecurityMonitor from "./components/security/SecurityMonitor";
import JobBoardPage from "./pages/JobBoardPage";
import JobSearch from "./pages/JobSearch";

// Performance optimization: Lazy load pages to reduce initial bundle size
const Index = lazy(() => import("./pages/Index"));
const SavedJobs = lazy(() => import("./pages/SavedJobs"));
const JobDetailsPage = lazy(() => import("./pages/JobDetailsPage"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const ApplicationsPage = lazy(() => import("./pages/ApplicationsPage"));
const RecommendedJobs = lazy(() => import("./pages/RecommendedJobs"));
const MessagesPage = lazy(() => import("./pages/MessagesPage"));
const CareerCounseling = lazy(() => import("./pages/CareerCounseling"));
const ResumeAssistance = lazy(() => import("./pages/ResumeAssistance"));
const InterviewPreparation = lazy(() => import("./pages/InterviewPreparation"));
const MilitaryTransitionResources = lazy(() => import("./pages/MilitaryTransitionResources"));
const JobFairsEventsPage = lazy(() => import("./pages/JobFairsEventsPage"));
const PostJobPage = lazy(() => import("./pages/PostJobPage"));
const EmployerDashboardPage = lazy(() => import("./pages/EmployerDashboardPage"));
const EmployerProfilePage = lazy(() => import("./pages/EmployerProfilePage"));
const EmployerSearchVeteransPage = lazy(() => import("./pages/EmployerSearchVeteransPage"));
const CommunityForums = lazy(() => import("./pages/CommunityForums"));
const TopicDetail = lazy(() => import("./pages/TopicDetail"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const VerifyEmailPage = lazy(() => import("./pages/VerifyEmailPage"));
const VeteranDashboardPage = lazy(() => import("./pages/VeteranDashboardPage"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));
const AdminContentPage = lazy(() => import("./pages/AdminContentPage"));
const AbTestingPage = lazy(() => import("./pages/AbTestingPage"));
const NotificationPreferences = lazy(() => import("./components/NotificationPreferences"));
const FeedbackSupportPage = lazy(() => import("./pages/FeedbackSupportPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ReferralProgramPage = lazy(() => import("./pages/ReferralProgramPage"));
const VettedJobsPage = lazy(() => import("./pages/VettedJobsPage"));
const AuthCallbackPage = lazy(() => import("./pages/AuthCallbackPage"));
const AllRoutes = lazy(() => import("./pages/AllRoutes"));

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
                    <Route path="/routes" element={<AllRoutes />} />
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
