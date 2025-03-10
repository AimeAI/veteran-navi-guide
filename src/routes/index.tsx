
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { AuthRoutes } from './authRoutes';
import { ResourceRoutes } from './resourceRoutes';
import { EmployerRoutes } from './employerRoutes';
import { veteranRoutes } from './veteranRoutes';
import { AdminRoutes } from './adminRoutes';
import { RequireAuth } from '@/components/RequireAuth';
import NotFound from '@/pages/NotFound';
import Index from '@/pages/Index';
import JobSearch from '@/pages/JobSearch';
import JobDetailsPage from '@/pages/JobDetailsPage';
import PostJobPage from '@/pages/PostJobPage';
import MessagesPage from '@/pages/MessagesPage';
import FindMentorsPage from '@/pages/FindMentorsPage';
import MentorshipDashboardPage from '@/pages/MentorshipDashboardPage';
import SavedJobs from '@/pages/SavedJobs';
import UserProfile from '@/pages/UserProfile';
import JobAlertsPage from '@/pages/JobAlertsPage';
import LmsIntegrationPage from '@/pages/LmsIntegrationPage';
import VettedJobsPage from '@/pages/VettedJobsPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Index />} />
        
        {/* Public routes */}
        <Route path="job-search" element={<JobSearch />} />
        <Route path="job/:id" element={<JobDetailsPage />} />
        <Route path="vetted-jobs" element={<VettedJobsPage />} />
        <Route path="mentorship" element={<FindMentorsPage />} />
        
        {/* Protected routes */}
        <Route path="messages" element={
          <RequireAuth roles={['veteran', 'employer']}>
            <MessagesPage />
          </RequireAuth>
        } />
        
        <Route path="mentorship-dashboard" element={
          <RequireAuth roles={['veteran', 'employer']}>
            <MentorshipDashboardPage />
          </RequireAuth>
        } />
        
        <Route path="saved-jobs" element={
          <RequireAuth roles={['veteran']}>
            <SavedJobs />
          </RequireAuth>
        } />
        
        <Route path="job-alerts" element={
          <RequireAuth roles={['veteran']}>
            <JobAlertsPage />
          </RequireAuth>
        } />
        
        <Route path="learning" element={
          <RequireAuth roles={['veteran']}>
            <LmsIntegrationPage />
          </RequireAuth>
        } />
        
        <Route path="profile" element={
          <RequireAuth roles={['veteran', 'employer']}>
            <UserProfile />
          </RequireAuth>
        } />
        
        <Route path="post-job" element={
          <RequireAuth roles={['employer']}>
            <PostJobPage />
          </RequireAuth>
        } />
        
        {/* Auth routes */}
        <Route path="auth/*" element={<AuthRoutes />} />
        
        {/* Resource routes */}
        <Route path="resources/*" element={<ResourceRoutes />} />
        
        {/* Employer routes */}
        <Route path="employer-dashboard/*" element={
          <RequireAuth roles={['employer']}>
            <EmployerRoutes />
          </RequireAuth>
        } />
        
        {/* Veteran routes */}
        <Route path="dashboard/*" element={
          <RequireAuth roles={['veteran']}>
            {veteranRoutes.map((route) => (
              <Route 
                key={route.path} 
                path={route.path} 
                element={route.element} 
              />
            ))}
          </RequireAuth>
        } />
        
        {/* Admin routes */}
        <Route path="admin/*" element={
          <RequireAuth roles={['admin']}>
            <AdminRoutes />
          </RequireAuth>
        } />
        
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
