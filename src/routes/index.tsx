
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { AuthRoutes } from './authRoutes';
import { ResourceRoutes } from './resourceRoutes';
import { EmployerRoutes } from './employerRoutes';
import { VeteranRoutes } from './veteranRoutes';
import { AdminRoutes } from './adminRoutes';
import { RequireAuth } from '@/components/RequireAuth';
import NotFound from '@/pages/NotFound';
import Index from '@/pages/Index';
import JobSearch from '@/pages/JobSearch';
import JobDetailsPage from '@/pages/JobDetailsPage';
import PostJobPage from '@/pages/PostJobPage';
import MessagesPage from '@/pages/MessagesPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Index />} />
        <Route path="job-search" element={<JobSearch />} />
        <Route path="job/:id" element={<JobDetailsPage />} />
        <Route path="post-job" element={<PostJobPage />} />
        <Route path="messages" element={<MessagesPage />} />
        
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
            <VeteranRoutes />
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
