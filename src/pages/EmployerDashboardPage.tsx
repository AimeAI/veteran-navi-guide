
import React from 'react';
import Navbar from '@/components/Navbar';
import EmployerDashboard from '@/components/EmployerDashboard';
import { Building } from 'lucide-react';

const EmployerDashboardPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-8">
            <Building className="h-6 w-6 text-primary mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
            <EmployerDashboard />
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2023 VeteranJobBoard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EmployerDashboardPage;
