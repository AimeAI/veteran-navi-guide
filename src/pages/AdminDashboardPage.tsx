
import React from 'react';
import AdminDashboard from '@/components/AdminDashboard';
import { Shield } from 'lucide-react';

const AdminDashboardPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8" id="main-content">
        <div className="flex items-center mb-8">
          <Shield className="h-6 w-6 text-primary mr-3" aria-hidden="true" />
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
        
        <AdminDashboard />
      </main>
    </div>
  );
};

export default AdminDashboardPage;
