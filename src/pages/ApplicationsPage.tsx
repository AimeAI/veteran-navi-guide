
import React from 'react';
import Navbar from '@/components/Navbar';
import ApplicationHistory from '@/components/ApplicationHistory';
import { FileText } from 'lucide-react';

// Sample application data
const applicationData = [
  {
    id: '1',
    jobTitle: 'Cybersecurity Analyst',
    company: 'Defense Systems Inc.',
    appliedDate: new Date(2023, 8, 15), // September 15, 2023
    status: 'interview' as const,
    notes: 'Second interview scheduled for next week. Prepare technical demonstration.',
  },
  {
    id: '2',
    jobTitle: 'Logistics Coordinator',
    company: 'Global Supply Solutions',
    appliedDate: new Date(2023, 9, 3), // October 3, 2023
    status: 'reviewing' as const,
  },
  {
    id: '3',
    jobTitle: 'Project Manager',
    company: 'Veterans Construction Group',
    appliedDate: new Date(2023, 7, 28), // August 28, 2023
    status: 'offered' as const,
    notes: 'Offer received! Review compensation package and benefits by Friday.',
  },
  {
    id: '4',
    jobTitle: 'Network Administrator',
    company: 'TechCorp Systems',
    appliedDate: new Date(2023, 9, 10), // October 10, 2023
    status: 'pending' as const,
  },
  {
    id: '5',
    jobTitle: 'Security Consultant',
    company: 'Shield Protection Services',
    appliedDate: new Date(2023, 6, 12), // July 12, 2023
    status: 'rejected' as const,
    notes: 'Position filled internally. Recruiter suggested applying for upcoming senior position in November.',
  }
];

const ApplicationsPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-8">
            <FileText className="h-6 w-6 text-primary mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          </div>
          
          <div className="mb-8">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-blue-800 text-sm flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p>
                Track all your job applications in one place. We'll update the status as recruiters review your application.
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Application History</h2>
              <div className="flex gap-2">
                <button className="text-sm text-gray-600 hover:text-gray-900">
                  All
                </button>
                <span className="text-gray-300">|</span>
                <button className="text-sm text-gray-600 hover:text-gray-900">
                  Active
                </button>
                <span className="text-gray-300">|</span>
                <button className="text-sm text-gray-600 hover:text-gray-900">
                  Completed
                </button>
              </div>
            </div>
            <ApplicationHistory applications={applicationData} />
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

export default ApplicationsPage;
