import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "./context/UserContext";
import { useJobs as JobContextProvider } from "./context/JobContext";
import { JobAlertProvider } from "./context/JobAlertContext";
import { MessageProvider } from "./context/MessageContext";
import { LanguageProvider } from "./context/LanguageContext";
import Navbar from "./components/Navbar";
import { RequireAuth } from "./components/RequireAuth";
import RequireVerifiedEmail from "./components/RequireVerifiedEmail";

// Pages
import Index from "./pages/Index";
import JobSearch from "./pages/JobSearch";
import JobDetailsPage from "./pages/JobDetailsPage";
import AuthPage from "./pages/AuthPage";
import VeteranDashboardPage from "./pages/VeteranDashboardPage";
import EmployerDashboardPage from "./pages/EmployerDashboardPage";
import SavedJobs from "./pages/SavedJobs";
import JobAlertsPage from "./pages/JobAlertsPage";
import RecommendedJobs from "./pages/RecommendedJobs";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import UserProfile from "./pages/UserProfile";
import PostJobPage from "./pages/PostJobPage";
import EmployerProfilePage from "./pages/EmployerProfilePage";
import EmployerApplicationsPage from "./pages/EmployerApplicationsPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import MessagesPage from "./pages/MessagesPage";
import EmployerSearchVeteransPage from "./pages/EmployerSearchVeteransPage";
import JobFairsEventsPage from "./pages/JobFairsEventsPage";
import ReferralProgramPage from "./pages/ReferralProgramPage";
import CareerCounseling from "./pages/CareerCounseling";
import ResumeAssistance from "./pages/ResumeAssistance";
import InterviewPreparation from "./pages/InterviewPreparation";
import MilitaryTransitionResources from "./pages/MilitaryTransitionResources";
import CommunityForums from "./pages/CommunityForums";
import TopicDetail from "./pages/TopicDetail";
import AbTestingPage from "./pages/AbTestingPage";
import AdminContentPage from "./pages/AdminContentPage";
import NotFound from "./pages/NotFound";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import FeedbackSupportPage from "./pages/FeedbackSupportPage";
import VettedJobsPage from "./pages/VettedJobsPage";

// New employer profile pages
import EmployerProfileManagementPage from "./pages/EmployerProfileManagementPage";
import PublicEmployerProfilePage from "./pages/PublicEmployerProfilePage";
import EmployerDirectoryPage from "./pages/EmployerDirectoryPage";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <JobContextProvider>
            <JobAlertProvider>
              <MessageProvider>
                <LanguageProvider>
                  <div className="min-h-screen bg-background">
                    <Navbar />
                    <div className="pb-12">
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/job-search" element={<JobSearch />} />
                        <Route path="/jobs/:id" element={<JobDetailsPage />} />
                        <Route path="/login" element={<AuthPage />} />
                        <Route path="/signup" element={<AuthPage mode="signup" as="signup" />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/verify-email" element={<VerifyEmailPage />} />
                        
                        {/* Protected veteran routes */}
                        <Route path="/dashboard" element={<RequireAuth><VeteranDashboardPage /></RequireAuth>} />
                        <Route path="/saved-jobs" element={<RequireAuth><SavedJobs /></RequireAuth>} />
                        <Route path="/job-alerts" element={<RequireAuth><JobAlertsPage /></RequireAuth>} />
                        <Route path="/recommended-jobs" element={<RequireAuth><RecommendedJobs /></RequireAuth>} />
                        <Route path="/profile" element={<RequireAuth><UserProfile /></RequireAuth>} />
                        <Route path="/applications" element={<RequireAuth><ApplicationsPage /></RequireAuth>} />
                        
                        {/* Protected employer routes */}
                        <Route path="/employer-dashboard" element={<RequireAuth><EmployerDashboardPage /></RequireAuth>} />
                        <Route path="/post-job" element={<RequireAuth><PostJobPage /></RequireAuth>} />
                        <Route path="/employer-profile" element={<RequireAuth><EmployerProfilePage /></RequireAuth>} />
                        <Route path="/employer-profile/:action" element={<RequireAuth><EmployerProfileManagementPage /></RequireAuth>} />
                        <Route path="/employer-applications" element={<RequireAuth><EmployerApplicationsPage /></RequireAuth>} />
                        <Route path="/search-veterans" element={<RequireAuth><EmployerSearchVeteransPage /></RequireAuth>} />
                        
                        {/* Public employer pages */}
                        <Route path="/employers" element={<EmployerDirectoryPage />} />
                        <Route path="/employers/:id" element={<PublicEmployerProfilePage />} />
                        <Route path="/vetted-jobs" element={<VettedJobsPage />} />
                        
                        {/* Messaging */}
                        <Route path="/messages" element={<RequireAuth><MessagesPage /></RequireAuth>} />
                        <Route path="/messages/:conversationId" element={<RequireAuth><MessagesPage /></RequireAuth>} />
                        
                        {/* Job Fairs & Events */}
                        <Route path="/job-fairs-events" element={<JobFairsEventsPage />} />
                        
                        {/* Referral Program */}
                        <Route path="/referral-program" element={<RequireAuth><ReferralProgramPage /></RequireAuth>} />
                        
                        {/* Resources */}
                        <Route path="/resources/career-counseling" element={<CareerCounseling />} />
                        <Route path="/resources/resume-assistance" element={<ResumeAssistance />} />
                        <Route path="/resources/interview-preparation" element={<InterviewPreparation />} />
                        <Route path="/resources/military-transition" element={<MilitaryTransitionResources />} />
                        
                        {/* Community */}
                        <Route path="/community" element={<CommunityForums />} />
                        <Route path="/community/topic/:id" element={<TopicDetail />} />
                        
                        {/* Admin */}
                        <Route path="/admin" element={<RequireAuth><AdminDashboardPage /></RequireAuth>} />
                        <Route path="/admin/content" element={<RequireAuth><AdminContentPage /></RequireAuth>} />
                        <Route path="/admin/ab-testing" element={<RequireAuth><AbTestingPage /></RequireAuth>} />
                        
                        {/* Feedback & Support */}
                        <Route path="/feedback" element={<FeedbackSupportPage />} />
                        
                        {/* 404 Not Found */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </div>
                    <Toaster />
                    <SonnerToaster richColors position="top-right" />
                  </div>
                </LanguageProvider>
              </MessageProvider>
            </JobAlertProvider>
          </JobContextProvider>
        </UserProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
