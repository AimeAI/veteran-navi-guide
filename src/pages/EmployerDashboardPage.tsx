
import React from 'react';
import EmployerDashboard from '@/components/EmployerDashboard';
import { Building, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const EmployerDashboardPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <main className="flex-grow container mx-auto px-4 py-12 sm:px-6 lg:px-8" id="main-content">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Building className="h-6 w-6 text-primary mr-3" aria-hidden="true" />
              <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
            </div>
            
            <Button asChild className="whitespace-nowrap">
              <Link to="/employer/post-job">
                <PlusCircle className="mr-2 h-4 w-4" />
                Post New Job
              </Link>
            </Button>
          </div>
          
          <section 
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8"
            aria-labelledby="dashboard-heading"
          >
            <h2 id="dashboard-heading" className="sr-only">Employer Dashboard Content</h2>
            <EmployerDashboard />
          </section>
        </div>
      </main>
      
      <footer className="bg-gray-50 border-t border-gray-200 mt-auto" role="contentinfo">
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
