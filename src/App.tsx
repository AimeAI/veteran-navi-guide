
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
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
// Add new vetted jobs page
const VettedJobsPage = lazy(() => import("./pages/VettedJobsPage"));

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
                    <Route path="/saved" element={<SavedJobs />} />
                    <Route path="/job/:id" element={<JobDetailsPage />} />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/history" element={<ApplicationsPage />} />
                    <Route path="/recommendations" element={<RecommendedJobs />} />
                    <Route path="/messages" element={<MessagesPage />} />
                    <Route path="/resources/career-counseling" element={<CareerCounseling />} />
                    <Route path="/resources/resume-assistance" element={<ResumeAssistance />} />
                    <Route path="/resources/interview-prep" element={<InterviewPreparation />} />
                    <Route path="/resources/military-transition" element={<MilitaryTransitionResources />} />
                    <Route path="/events" element={<JobFairsEventsPage />} />
                    <Route path="/employer/post-job" element={<PostJobPage />} />
                    <Route path="/employer/manage-applications" element={<EmployerDashboardPage />} />
                    <Route path="/employer/profile" element={<EmployerProfilePage />} />
                    <Route path="/employer/search-veterans" element={<EmployerSearchVeteransPage />} />
                    <Route path="/resources/forums" element={<CommunityForums />} />
                    <Route path="/topic/:topicId" element={<TopicDetail />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/verify-email" element={<VerifyEmailPage />} />
                    <Route path="/dashboard" element={<VeteranDashboardPage />} />
                    <Route path="/admin" element={<AdminDashboardPage />} />
                    <Route path="/admin/content" element={
                      <RequireAuth>
                        <AdminContentPage />
                      </RequireAuth>
                    } />
                    <Route path="/employer-profile" element={
                      <RequireAuth>
                        <EmployerProfilePage />
                      </RequireAuth>
                    } />
                    <Route path="/ab-testing" element={<AbTestingPage />} />
                    <Route path="/profile/settings" element={<UserProfile />} />
                    <Route path="/profile/resume" element={<UserProfile />} />
                    <Route path="/job-alerts" element={<UserProfile />} />
                    <Route path="/recommended" element={<RecommendedJobs />} />
                    {/* Add the new vetted jobs route */}
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
