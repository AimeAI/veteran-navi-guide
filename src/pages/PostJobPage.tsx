
import React from 'react';
import Navbar from '@/components/Navbar';
import PostJobForm from '@/components/PostJobForm';
import { Briefcase } from 'lucide-react';

const PostJobPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center mb-8">
            <Briefcase className="h-6 w-6 text-primary mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Post a Job</h1>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Connect with Veteran Talent</h2>
              <p className="text-gray-600">
                Create a job listing that showcases your opportunity to our community of skilled veterans. 
                Be specific about how military experience relates to the role.
              </p>
            </div>
            
            <PostJobForm />
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

export default PostJobPage;
