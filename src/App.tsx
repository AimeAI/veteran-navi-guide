
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
import EmployerSearchVeteransPage from "./pages/EmployerSearchVeteransPage";
import CommunityForums from "./pages/CommunityForums";
import RecommendedJobs from "./pages/RecommendedJobs";
import CareerCounseling from "./pages/CareerCounseling";
import ResumeAssistance from "./pages/ResumeAssistance";
import InterviewPreparation from "./pages/InterviewPreparation";
import MilitaryTransitionResources from "./pages/MilitaryTransitionResources";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";
import { Toaster } from "./components/ui/sonner";
import { AppProvider } from "./context/AppContext";
import "./App.css";

function App() {
  return (
    <AppProvider>
      <Router>
        <Navbar />
        <main className="min-h-screen pt-16">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/job-search" element={<JobSearch />} />
            <Route path="/saved" element={<SavedJobs />} />
            <Route path="/job/:id" element={<JobDetailsPage />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/history" element={<ApplicationsPage />} />
            <Route path="/recommendations" element={<RecommendedJobs />} />
            <Route path="/resources/career-counseling" element={<CareerCounseling />} />
            <Route path="/resources/resume-assistance" element={<ResumeAssistance />} />
            <Route path="/resources/interview-prep" element={<InterviewPreparation />} />
            <Route path="/resources/military-transition" element={<MilitaryTransitionResources />} />
            <Route path="/employer/post-job" element={<PostJobPage />} />
            <Route path="/employer/manage-applications" element={<EmployerDashboardPage />} />
            <Route path="/employer/search-veterans" element={<EmployerSearchVeteransPage />} />
            <Route path="/resources/forums" element={<CommunityForums />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Toaster position="top-right" />
      </Router>
    </AppProvider>
  );
}

export default App;
