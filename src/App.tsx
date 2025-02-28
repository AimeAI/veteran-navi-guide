
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import JobSearch from "./pages/JobSearch";
import UserProfile from "./pages/UserProfile";
import SavedJobs from "./pages/SavedJobs";
import ApplicationsPage from "./pages/ApplicationsPage";
import PostJobPage from "./pages/PostJobPage";
import EmployerDashboardPage from "./pages/EmployerDashboardPage";
import EmployerSearchVeteransPage from "./pages/EmployerSearchVeteransPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/job-search" element={<JobSearch />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/recommended" element={<JobSearch />} /> {/* Using JobSearch as placeholder */}
          <Route path="/saved" element={<SavedJobs />} />
          <Route path="/history" element={<ApplicationsPage />} />
          <Route path="/employer/post-job" element={<PostJobPage />} />
          <Route path="/employer/manage-applications" element={<EmployerDashboardPage />} />
          <Route path="/employer/search-veterans" element={<EmployerSearchVeteransPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
