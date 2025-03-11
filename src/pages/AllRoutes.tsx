
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Briefcase, 
  User, 
  BookOpen, 
  Building, 
  Home, 
  Shield, 
  Users, 
  Calendar, 
  MessageSquare,
  Settings,
  LineChart
} from 'lucide-react';

const AllRoutes: React.FC = () => {
  const { t } = useTranslation();

  const routeCategories = [
    {
      title: "General",
      icon: <Home className="h-5 w-5" />,
      routes: [
        { path: "/", label: "Home" },
        { path: "/job-search", label: "Job Search" },
        { path: "/vetted-jobs", label: "Vetted Jobs" },
        { path: "/events", label: "Job Fairs & Events" },
      ]
    },
    {
      title: "User Profile",
      icon: <User className="h-5 w-5" />,
      routes: [
        { path: "/user/profile", label: "User Profile", requiresAuth: true },
        { path: "/user/profile/settings", label: "Profile Settings", requiresAuth: true },
        { path: "/user/profile/resume", label: "Resume", requiresAuth: true },
        { path: "/user/history", label: "Application History", requiresAuth: true },
        { path: "/user/job-alerts", label: "Job Alerts", requiresAuth: true },
        { path: "/user/saved", label: "Saved Jobs", requiresAuth: true },
        { path: "/user/recommended", label: "Recommended Jobs", requiresAuth: true },
      ]
    },
    {
      title: "Resources",
      icon: <BookOpen className="h-5 w-5" />,
      routes: [
        { path: "/resources/career-counseling", label: "Career Counseling" },
        { path: "/resources/resume-assistance", label: "Resume Writing Assistance" },
        { path: "/resources/interview-prep", label: "Interview Preparation" },
        { path: "/resources/military-transition", label: "Military Transition Resources" },
        { path: "/resources/forums", label: "Community Forums" },
      ]
    },
    {
      title: "Employer",
      icon: <Building className="h-5 w-5" />,
      routes: [
        { path: "/employer/post-job", label: "Post a Job", requiresAuth: true },
        { path: "/employer/manage-applications", label: "Manage Applications", requiresAuth: true },
        { path: "/employer/profile", label: "Employer Profile", requiresAuth: true },
        { path: "/employer/search-veterans", label: "Search Veterans", requiresAuth: true },
      ]
    },
    {
      title: "Authentication & Communication",
      icon: <Shield className="h-5 w-5" />,
      routes: [
        { path: "/auth", label: "Login/Signup" },
        { path: "/auth/callback", label: "Auth Callback" },
        { path: "/auth/forgot-password", label: "Forgot Password" },
        { path: "/auth/verify-email", label: "Verify Email" },
        { path: "/user/messages", label: "Messages", requiresAuth: true },
        { path: "/user/feedback", label: "Feedback & Support", requiresAuth: true },
        { path: "/user/settings/notifications", label: "Notification Settings", requiresAuth: true },
      ]
    },
    {
      title: "Dashboard & Admin",
      icon: <LineChart className="h-5 w-5" />,
      routes: [
        { path: "/user/dashboard", label: "Veteran Dashboard", requiresAuth: true },
        { path: "/admin", label: "Admin Dashboard", requiresAuth: true },
        { path: "/admin/content", label: "Admin Content", requiresAuth: true },
        { path: "/ab-testing", label: "A/B Testing" },
        { path: "/user/referral-program", label: "Referral Program", requiresAuth: true },
      ]
    }
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">All Application Routes</h1>
      <p className="mb-6 text-muted-foreground">
        This page lists all available routes in the application for easy navigation during development and testing.
      </p>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {routeCategories.map((category, index) => (
          <Card key={index} className="h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                {category.icon}
                <CardTitle>{category.title}</CardTitle>
              </div>
              <CardDescription>
                {category.routes.length} routes available
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                {category.routes.map((route, routeIndex) => (
                  <Link key={routeIndex} to={route.path} className="w-full">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-left" 
                      size="sm"
                    >
                      {route.label}
                      {route.requiresAuth && (
                        <span className="ml-auto opacity-70 text-xs">
                          Auth
                        </span>
                      )}
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AllRoutes;
