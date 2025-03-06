
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";
import JobSearch from "./pages/JobSearch";
import SavedJobs from "./pages/SavedJobs";
import JobDetailsPage from "./pages/JobDetailsPage";
import UserProfile from "./pages/UserProfile";
import ApplicationsPage from "./pages/ApplicationsPage";
import PostJobPage from "./pages/PostJobPage";
import EmployerDashboardPage from "./pages/EmployerDashboardPage";
import EmployerProfilePage from "./pages/EmployerProfilePage";
import VeteranDashboardPage from "./pages/VeteranDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminContentPage from "./pages/AdminContentPage";
import EmployerSearchVeteransPage from "./pages/EmployerSearchVeteransPage";
import CommunityForums from "./pages/CommunityForums";
import RecommendedJobs from "./pages/RecommendedJobs";
import CareerCounseling from "./pages/CareerCounseling";
import ResumeAssistance from "./pages/ResumeAssistance";
import InterviewPreparation from "./pages/InterviewPreparation";
import MilitaryTransitionResources from "./pages/MilitaryTransitionResources";
import AuthPage from "./pages/AuthPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import NotFound from "./pages/NotFound";
import { Toaster } from "./components/ui/sonner";
import { AppProvider } from "./context/AppContext";
import "./App.css";
import TopicDetail from "./pages/TopicDetail";
import EmailVerificationBanner from "./components/EmailVerificationBanner";
import JobFairsEventsPage from "./pages/JobFairsEventsPage";
import MessagesPage from "./pages/MessagesPage";
import { MessageProvider } from "./context/MessageContext";
import { RequireAuth } from "./components/RequireAuth";
import AbTestingPage from "./pages/AbTestingPage";
import { LanguageProvider } from "./context/LanguageContext";
import "./i18n";
import NotificationPreferences from "./components/NotificationPreferences";
import FeedbackSupportPage from "./pages/FeedbackSupportPage";
import SecurityMonitor from "./components/security/SecurityMonitor";

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
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/job-search" element={<JobSearch />} />
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
                  <Route path="*" element={<NotFound />} />
                </Routes>
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
