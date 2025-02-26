
import React from 'react';
import Navbar from '@/components/Navbar';
import JobListing from '@/components/JobListing';

// Sample job data
const featuredJobs = [
  {
    id: '1',
    title: 'Security Operations Manager',
    company: 'TechDefense Solutions',
    location: 'San Diego, CA',
    description: 'Seeking a veteran with security background to lead our operations team. Must have experience in risk assessment and team leadership. TS/SCI clearance preferred.',
  },
  {
    id: '2',
    title: 'Logistics Coordinator',
    company: 'Global Supply Chain Inc.',
    location: 'Norfolk, VA',
    description: 'Perfect for veterans with logistics MOS. Coordinate shipments, manage inventory, and optimize supply chain processes. Competitive salary with benefits package.',
  },
  {
    id: '3',
    title: 'Healthcare Administrator',
    company: 'Veterans Medical Center',
    location: 'Remote',
    description: 'Join our team dedicated to improving healthcare for veterans. Looking for organized professionals with healthcare experience from military settings.',
  }
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <section className="max-w-4xl mx-auto text-center">
          <div className="mb-10">
            <span className="inline-block px-3 py-1 text-sm font-medium text-primary bg-primary/10 rounded-full mb-4">
              Career Opportunities for Veterans
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              Connect with employers who value your military experience
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Our platform bridges the gap between military service and civilian careers. Find opportunities that recognize your skills, discipline, and leadership.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="/jobs/search" 
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-primary rounded-md shadow-sm hover:bg-primary/90 transition-colors duration-200"
              >
                Find Jobs
              </a>
              <a 
                href="/resources/military-transition" 
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-primary bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 transition-colors duration-200"
              >
                View Resources
              </a>
            </div>
          </div>
        </section>

        {/* Featured Jobs Section */}
        <section className="mt-20 max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold">Featured Opportunities</h2>
            <p className="mt-3 text-gray-600">Discover jobs from employers who value your military experience</p>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {featuredJobs.map(job => (
              <JobListing
                key={job.id}
                jobId={job.id}
                title={job.title}
                company={job.company}
                location={job.location}
                description={job.description}
              />
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <a 
              href="/jobs/search" 
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 transition-colors duration-200"
            >
              View More Jobs
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </section>

        <section className="mt-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-12">Trusted by leading employers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center items-center">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-12 w-32 bg-gray-200 rounded-md animate-pulse"></div>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <div className="grid md:grid-cols-3 gap-8">
            {['Career Transition', 'Resume Builder', 'Interview Prep'].map((title) => (
              <div key={title} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <div className="w-6 h-6 bg-primary rounded"></div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-gray-600">
                  Tools and resources designed specifically for veterans transitioning to civilian careers.
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-50 border-t border-gray-200 mt-20">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2023 VeteranJobBoard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
