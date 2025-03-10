
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { authRoutes } from './authRoutes';
import { resourceRoutes } from './resourceRoutes';
import { employerRoutes } from './employerRoutes';
import { veteranRoutes } from './veteranRoutes';
import { adminRoutes } from './adminRoutes';
import RequireAuth from '@/components/RequireAuth';
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
        {authRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
        
        {/* Resource routes */}
        {resourceRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
        
        {/* Employer routes */}
        <Route path="employer-dashboard/*" element={<RequireAuth allowedRoles={['employer']} />}>
          {employerRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
        
        {/* Veteran routes */}
        <Route path="dashboard/*" element={<RequireAuth allowedRoles={['veteran']} />}>
          {veteranRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
        
        {/* Admin routes */}
        <Route path="admin/*" element={<RequireAuth allowedRoles={['admin']} />}>
          {adminRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
        
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
