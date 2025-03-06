import React from 'react';
import JobListing from '@/components/JobListing';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Sample job data with Canadian locations
const featuredJobs = [
  {
    id: '1',
    title: 'Security Operations Manager',
    company: 'TechDefense Solutions',
    location: 'Ottawa, ON',
    description: 'Seeking a veteran with security background to lead our operations team. Must have experience in risk assessment and team leadership. Secret clearance preferred.',
  },
  {
    id: '2',
    title: 'Logistics Coordinator',
    company: 'Canadian Supply Chain Inc.',
    location: 'Halifax, NS',
    description: 'Perfect for veterans with logistics MOSID. Coordinate shipments, manage inventory, and optimize supply chain processes. Competitive salary with benefits package.',
  },
  {
    id: '3',
    title: 'Healthcare Administrator',
    company: 'Veterans Medical Centre',
    location: 'Remote - Canada',
    description: 'Join our team dedicated to improving healthcare for veterans. Looking for organized professionals with healthcare experience from military settings.',
  }
];

// Recommended jobs data with Canadian locations
const recommendedJobs = [
  {
    id: '4',
    title: 'Cybersecurity Analyst',
    company: 'DefenceNet Systems',
    location: 'Toronto, ON',
    description: 'Ideal for veterans with intelligence or cybersecurity background. Monitor network security and respond to incidents. Secret clearance required.',
  },
  {
    id: '5',
    title: 'Project Manager',
    company: 'Veterans Construction Group',
    location: 'Edmonton, AB',
    description: 'Looking for veterans with leadership experience to manage construction projects from planning to completion. Strong organizational skills required.',
  },
  {
    id: '6',
    title: 'Emergency Medical Technician',
    company: 'First Responders Alliance',
    location: 'Calgary, AB',
    description: 'Former military medics encouraged to apply. Provide emergency medical care in civilian settings. Training assistance available.',
  },
  {
    id: '7',
    title: 'Aviation Maintenance Technician',
    company: 'SkyWorks Aerospace',
    location: 'Vancouver, BC',
    description: 'Perfect transition for military aircraft technicians. Maintain and repair commercial aircraft. Transport Canada certification assistance provided.',
  }
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <main className="flex-grow container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <section className="max-w-4xl mx-auto text-center">
          <div className="mb-10">
            <span className="inline-block px-3 py-1 text-sm font-medium text-primary bg-primary/10 rounded-full mb-4">
              Career Opportunities for Canadian Armed Forces Veterans
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              Connect with employers who value your military experience
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Our platform bridges the gap between military service and civilian careers across Canada. Find opportunities that recognize your skills, discipline, and leadership.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/job-search" 
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-primary rounded-md shadow-sm hover:bg-primary/90 transition-colors duration-200"
              >
                Find Jobs
              </Link>
              <Link 
                to="/resources/military-transition" 
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-primary bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 transition-colors duration-200"
              >
                View Resources
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Jobs Section */}
        <section className="mt-20 max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold">Featured Opportunities</h2>
            <p className="mt-3 text-gray-600">Discover jobs from Canadian employers who value your military experience</p>
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
            <Link 
              to="/job-search" 
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 transition-colors duration-200"
            >
              View More Jobs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Recommended Jobs Section */}
        <section className="mt-20 py-10 px-6 bg-blue-50 rounded-2xl max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <span className="inline-block px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full mb-3">
              Personalized For You
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Recommended Jobs</h2>
            <p className="mt-3 text-gray-600">Based on your Canadian Armed Forces background and skills</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {recommendedJobs.map(job => (
              <JobListing
                key={job.id}
                jobId={job.id}
                title={job.title}
                company={job.company}
                location={job.location}
                description={job.description}
                className="h-full"
              />
            ))}
          </div>
          
          <div className="mt-10 text-center">
            <Link 
              to="/recommendations" 
              className="inline-flex items-center justify-center px-6 py-3 text-sm md:text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-colors duration-200"
            >
              View All Recommendations
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="mt-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-12">Trusted by leading Canadian employers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center items-center">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-12 w-32 bg-gray-200 rounded-md animate-pulse"></div>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'CAF to Civilian Transition',
                description: 'Resources designed specifically for Canadian Armed Forces members transitioning to civilian careers.'
              },
              {
                title: 'Canadian Resume Builder',
                description: 'Tools to help translate your military experience into civilian terminology that Canadian employers understand.'
              },
              {
                title: 'Interview Preparation',
                description: 'Practice answering common interview questions and learn how to effectively communicate your military experience.'
              }
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <div className="w-6 h-6 bg-primary rounded"></div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2023 VeteranJobBoard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
